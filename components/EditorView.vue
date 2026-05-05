<style scoped>
.board-view {
    background-color: #fafafa;
    padding: 24px 32px;
}
.toolbar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}
.sort-group {
    display: flex;
    align-items: center;
    gap: 4px;
}
.sort-btn {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    background: #fff;
    color: #666;
    transition: all 0.2s;
}
.sort-btn:hover {
    border-color: #EB455F;
    color: #EB455F;
}
.sort-btn-active {
    background: rgba(235, 69, 95, 0.1);
    border-color: #EB455F;
    color: #EB455F;
}
.filter-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    background: #fff;
    color: #666;
    transition: all 0.2s;
}
.filter-trigger:hover {
    border-color: #EB455F;
    color: #EB455F;
}
.filter-trigger-active {
    background: rgba(235, 69, 95, 0.1);
    border-color: #EB455F;
    color: #EB455F;
}
.profiles-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}
@media (min-width: 768px) {
    .profiles-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
.load-more-area {
    text-align: center;
    padding: 24px 0;
}
.pull-indicator {
    text-align: center;
    padding: 12px;
    font-size: 13px;
    color: #999;
}
.completeness-tip {
    background: linear-gradient(135deg, #fff8f4, #fff0e8);
    border: 1px solid rgba(235, 69, 95, 0.15);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}
.completeness-tip-icon {
    font-size: 20px;
    flex-shrink: 0;
}
.completeness-tip-text {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
}
.completeness-tip-text strong {
    color: #EB455F;
}
.upgrade-tip {
    text-align: center;
    padding: 48px 24px;
    color: #666;
}
.filter-overlay {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 60px;
}
@media (max-width: 1023px) {
    .board-view {
        padding: 12px 16px;
    }
    .filter-overlay {
        padding-top: 20px;
        align-items: flex-start;
    }
}
</style>

<template>
    <div class="w-full h-full min-h-0 flex flex-col">
        <EditorViewBar class="flex-shrink-0" />
        <div
            class="board-view flex-1 min-h-0 overflow-auto"
            ref="scrollContainer"
            @scroll="onScroll"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
        >
            <div v-if="isPulling" class="pull-indicator">
                {{ pullDistance > 60 ? '松开刷新' : '下拉刷新' }}
            </div>

            <div v-if="profilesLoading" class="upgrade-tip text-gray-500">资料加载中…</div>
            <div v-else-if="profilesError" class="upgrade-tip text-amber-700">{{ profilesError }}</div>
            <template v-else>
                <div v-if="showLimitTip" class="upgrade-tip">
                    <p class="text-base mb-2">{{ limitTipTitle }}</p>
                    <p v-if="limitTipDesc" class="text-sm text-gray-500">{{ limitTipDesc }}</p>
                </div>

                <div v-if="completenessTip" class="completeness-tip">
                    <span class="completeness-tip-icon">💡</span>
                    <span class="completeness-tip-text" v-html="completenessTip"></span>
                </div>

                <div class="toolbar-row">
                    <div class="sort-group">
                        <span
                            v-for="s in sortOptions"
                            :key="s.key"
                            class="sort-btn"
                            :class="{ 'sort-btn-active': currentSort === s.key }"
                            @click="currentSort = s.key"
                        >{{ s.label }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-500">共 {{ filteredProfiles.length }} 条</span>
                        <span
                            class="filter-trigger"
                            :class="{ 'filter-trigger-active': filterVisible }"
                            @click="filterVisible = !filterVisible"
                        >
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M874.24 128H149.76c-33.6 0-51.04 40.32-27.52 64l282.88 282.88V784c0 12.16 6.08 23.52 16.16 30.24l128 85.28c24.96 16.64 57.76-1.92 57.76-30.24V474.88L901.76 192c23.52-23.68 6.08-64-27.52-64z" fill="currentColor"/></svg>
                            筛选
                        </span>
                    </div>
                </div>

                <div class="profiles-grid">
                    <ProfileCard
                        v-for="(item, index) in pagedProfiles"
                        :key="(item as any).objectId || index"
                        :profile="item"
                        :show-wechat="!!memberVerify"
                    />
                </div>

                <div class="load-more-area">
                    <template v-if="hasMorePages">
                        <el-button text type="primary" @click="loadMore" :loading="loadingMore">
                            加载更多
                        </el-button>
                    </template>
                    <template v-else-if="filteredProfiles.length > 0">
                        <span class="text-sm text-gray-400">没有更多了</span>
                    </template>
                    <template v-else>
                        <span class="text-sm text-gray-400">暂无符合条件的资料</span>
                    </template>
                </div>
            </template>
        </div>

        <div v-if="filterVisible" class="filter-overlay" @click.self="filterVisible = false">
            <ProfileFilter
                :profiles="visibleProfiles"
                @filter="onFilterResult"
                @close="filterVisible = false"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { ElButton } from 'element-plus'
import eventBus from '~/assets/js/lib/eventBus'
import { getCookie } from '~/assets/js/utils/tools'
import { USER_MEMBER } from '~/constants/memberTiers'
import type { ProfileSeedItem } from '~/shared/profilesSeed'
import ProfileCard from '~/components/ProfileCard.vue'
import ProfileFilter from '~/components/ProfileFilter.vue'

type MemberSnapshot = { verify?: boolean; member?: string } | null

function tierSig(m: MemberSnapshot): string {
    if (m == null) return 'none'
    return `${m.verify ? 1 : 0}:${m.member ?? ''}`
}

const PAGE_SIZE = 10

const profiles = ref<ProfileSeedItem[]>([])
const profilesLoading = ref(true)
const profilesError = ref('')
const member = useState<MemberSnapshot>('member')
const memberVerify = computed(() => member.value && member.value.verify)
const memberCode = computed(() => member.value?.member)

const currentSort = ref<'newest' | 'attractiveness'>('newest')
const currentPage = ref(1)
const loadingMore = ref(false)
const filterVisible = ref(false)
const filteredResult = ref<ProfileSeedItem[] | null>(null)

const scrollContainer = ref<HTMLElement | null>(null)

const sortOptions = [
    { key: 'newest' as const, label: '最新注册' },
    { key: 'attractiveness' as const, label: '颜值优先' },
]

const visibleCount = computed(() => {
    const code = memberCode.value
    if (!memberVerify.value) return 1
    if (code === USER_MEMBER.v3) return 40
    if (code === USER_MEMBER.v1 || code === USER_MEMBER.v2) return 8
    if (code === USER_MEMBER.basic) return 2
    if (memberVerify.value && code === USER_MEMBER.normal) return 2
    return 2
})

const visibleProfiles = computed(() => profiles.value.slice(0, visibleCount.value))

const sortedProfiles = computed(() => {
    const source = filteredResult.value ?? visibleProfiles.value
    const arr = [...source]
    if (currentSort.value === 'newest') {
        arr.sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return tb - ta
        })
    } else if (currentSort.value === 'attractiveness') {
        arr.sort((a, b) => {
            const sa = (a.avatar ? 2 : 0) + (a.photos?.length ?? 0)
            const sb = (b.avatar ? 2 : 0) + (b.photos?.length ?? 0)
            return sb - sa
        })
    }
    return arr
})

const filteredProfiles = computed(() => sortedProfiles.value)

const pagedProfiles = computed(() => {
    return filteredProfiles.value.slice(0, currentPage.value * PAGE_SIZE)
})

const hasMorePages = computed(() => {
    return pagedProfiles.value.length < filteredProfiles.value.length
})

const showLimitTip = computed(() => memberCode.value !== USER_MEMBER.v3)
const isNormalPaidTier = computed(
    () =>
        memberCode.value === USER_MEMBER.basic ||
        (memberVerify.value && memberCode.value === USER_MEMBER.normal)
)

const limitTipTitle = computed(() => {
    if (!memberVerify.value) return '未开通会员可查看前 1 条资料（微信号已隐藏）'
    if (isNormalPaidTier.value) {
        return '普通会员可查看前 2 条资料；点击右上角「升级会员」升级为 VIP 或 SVIP 获取更多'
    }
    if (memberCode.value === USER_MEMBER.v1 || memberCode.value === USER_MEMBER.v2) {
        return 'VIP 会员可查看前 8 条资料'
    }
    return ''
})
const limitTipDesc = computed(() => {
    if (!memberVerify.value) return '开通普通会员或升级 VIP / SVIP 查看更多'
    if (isNormalPaidTier.value) return '升级 VIP 或者 SVIP 查看更多信息'
    if (memberCode.value === USER_MEMBER.v1 || memberCode.value === USER_MEMBER.v2) {
        return '升级 SVIP 可查看 40 条资料'
    }
    return ''
})

const completenessTip = computed(() => {
    if (!profiles.value.length) return ''
    const myProfile = profiles.value.find((p) => {
        const raw = getCookie('__user')
        if (!raw) return false
        try {
            const u = JSON.parse(decodeURIComponent(raw)) as { userId?: string }
            return (p as any).userObjectId === u.userId
        } catch { return false }
    })
    if (!myProfile) return ''
    let total = 10
    let filled = 0
    if (myProfile.avatar) filled++
    if (myProfile.sex) filled++
    if (myProfile.birth) filled++
    if (myProfile.height) filled++
    if (myProfile.education) filled++
    if (myProfile.city) filled++
    if (myProfile.maritalStatus) filled++
    if (myProfile.intro) filled++
    if (myProfile.partnerRequirement) filled++
    if (myProfile.wechat) filled++
    const pct = Math.round((filled / total) * 100)
    if (pct >= 100) return ''
    return `资料完善度 <strong>${pct}%</strong>，完善后可增加曝光，让更多人看到你`
})

function onFilterResult(filtered: ProfileSeedItem[]) {
    filteredResult.value = filtered
    currentPage.value = 1
}

function loadMore() {
    loadingMore.value = true
    setTimeout(() => {
        currentPage.value++
        loadingMore.value = false
    }, 300)
}

function onScroll() {
    if (!scrollContainer.value) return
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
    if (scrollHeight - scrollTop - clientHeight < 100 && hasMorePages.value && !loadingMore.value) {
        loadMore()
    }
}

const isPulling = ref(false)
const pullDistance = ref(0)
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
    if (!scrollContainer.value) return
    if (scrollContainer.value.scrollTop <= 0) {
        touchStartY = e.touches[0]?.clientY ?? 0
    }
}

function onTouchMove(e: TouchEvent) {
    if (!scrollContainer.value || scrollContainer.value.scrollTop > 0) return
    const diff = (e.touches[0]?.clientY ?? 0) - touchStartY
    if (diff > 0 && diff < 120) {
        isPulling.value = true
        pullDistance.value = diff
    }
}

function onTouchEnd() {
    if (isPulling.value && pullDistance.value > 60) {
        loadProfilesFromServer()
    }
    isPulling.value = false
    pullDistance.value = 0
}

watch(currentSort, () => {
    currentPage.value = 1
})

let profilesLoadSeq = 0
const profilesBootstrapped = ref(false)
const tierAfterLastFetch = ref<string | null>(null)

function onEditorProfilesReloading() {
    profilesLoading.value = true
    profilesError.value = ''
}

async function loadProfilesFromServer() {
    const seq = ++profilesLoadSeq
    profilesLoading.value = true
    profilesError.value = ''
    try {
        const raw = getCookie('__user')
        if (!raw) {
            if (seq === profilesLoadSeq) {
                profilesError.value = '未登录，无法加载资料'
                profiles.value = []
            }
            return
        }
        const u = JSON.parse(decodeURIComponent(raw)) as { userId?: string; token?: string }
        if (!u.userId || !u.token) {
            if (seq === profilesLoadSeq) {
                profilesError.value = '登录信息无效'
                profiles.value = []
            }
            return
        }
        const res = await $fetch<{ data: ProfileSeedItem[] }>('/api/profiles/list', {
            headers: { 'x-ui': u.userId, 'x-ut': u.token },
        })
        if (seq !== profilesLoadSeq) return
        profiles.value = Array.isArray(res.data) ? res.data : []
        filteredResult.value = null
        currentPage.value = 1
    } catch (e: unknown) {
        if (seq !== profilesLoadSeq) return
        const msg = e && typeof e === 'object' && 'data' in e && (e as { data?: { message?: string } }).data?.message
        profilesError.value = typeof msg === 'string' ? msg : '资料加载失败，请稍后重试'
        profiles.value = []
    } finally {
        if (seq === profilesLoadSeq) {
            profilesLoading.value = false
        }
    }
}

onMounted(async () => {
    if (import.meta.client) {
        eventBus.on('editor-profiles-reloading', onEditorProfilesReloading)
    }
    await loadProfilesFromServer()
    tierAfterLastFetch.value = tierSig(member.value)
    profilesBootstrapped.value = true
})

onBeforeUnmount(() => {
    if (import.meta.client) {
        eventBus.off('editor-profiles-reloading', onEditorProfilesReloading)
    }
})

watch(
    () => tierSig(member.value),
    async (sig) => {
        if (!profilesBootstrapped.value) return
        if (sig === tierAfterLastFetch.value) return
        await loadProfilesFromServer()
        tierAfterLastFetch.value = tierSig(member.value)
    },
    { flush: 'sync' }
)
</script>
