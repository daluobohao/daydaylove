<style scoped>
.board-view {
    background-color: #fafafa;
    padding: 24px 32px;
}
.profile-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
    overflow: hidden;
}
.profile-row {
    padding: 16px;
}
.profile-row + .profile-row {
    border-top: 1px solid #f0f0f0;
}
.section-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}
.section-content {
    font-size: 15px;
    color: #333;
    line-height: 1.6;
}
.photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
}
.photo-item {
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background: #f0f0f0;
}
.photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.upgrade-tip {
    text-align: center;
    padding: 48px 24px;
    color: #666;
}
</style>

<template>
    <div class="w-full h-full min-h-0 flex flex-col">
        <EditorViewBar class="flex-shrink-0" />
        <div class="board-view flex-1 min-h-0 overflow-auto">
            <div v-if="profilesLoading" class="upgrade-tip text-gray-500">资料加载中…</div>
            <div v-else-if="profilesError" class="upgrade-tip text-amber-700">{{ profilesError }}</div>
            <template v-else>
                <!-- 分档提示 -->
                <div v-if="showLimitTip" class="upgrade-tip">
                    <p class="text-base mb-2">{{ limitTipTitle }}</p>
                    <p v-if="limitTipDesc" class="text-sm text-gray-500">{{ limitTipDesc }}</p>
                </div>
                <div class="space-y-4">
                <div v-for="(item, index) in visibleProfiles" :key="index" class="profile-card">
                    <div v-for="(row, i) in displayRowsForItem(item)" :key="i" class="profile-row">
                        <div class="section-label">{{ row.label }}</div>
                        <template v-if="'photos' in row">
                            <div v-if="row.photos.length" class="photos-grid mt-2">
                                <div v-for="(url, j) in row.photos" :key="j" class="photo-item">
                                    <img :src="url" alt="照片" />
                                </div>
                            </div>
                            <div v-else class="section-content text-gray-400 mt-1">暂无照片</div>
                        </template>
                        <div
                            v-else
                            class="section-content"
                            :class="{ 'whitespace-pre-wrap': row.multiline }"
                        >
                            {{ row.value || '—' }}
                        </div>
                    </div>
                </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import eventBus from '~/assets/js/lib/eventBus'
import { getCookie } from '~/assets/js/utils/tools'
import { USER_MEMBER } from '~/constants/memberTiers'
import type { ProfileSeedItem } from '~/shared/profilesSeed'

type MemberSnapshot = { verify?: boolean; member?: string } | null

function tierSig(m: MemberSnapshot): string {
    if (m == null) return 'none'
    return `${m.verify ? 1 : 0}:${m.member ?? ''}`
}

type ProfileItem = ProfileSeedItem
type ProfileTextRow = { label: string; value: string; multiline?: boolean }
type ProfilePhotosRow = { label: string; photos: string[] }
type ProfileRow = ProfileTextRow | ProfilePhotosRow

// 个人资料来自 LeanCloud 类 Users（导入见 POST /api/profiles/import-to-users）
const profiles = ref<ProfileItem[]>([])
const profilesLoading = ref(true)
const profilesError = ref('')

const member = useState<MemberSnapshot>('member')

const memberVerify = computed(() => member.value && member.value.verify)
const memberCode = computed(() => member.value?.member)

const visibleCount = computed(() => {
    const code = memberCode.value
    if (!memberVerify.value) return 1
    if (code === USER_MEMBER.v3) return 40
    if (code === USER_MEMBER.v1 || code === USER_MEMBER.v2) return 8
    if (code === USER_MEMBER.basic) return 2
    // 已开通且在有效期内，但 LeanCloud 仍为 normal（旧数据或回调未写 basic）
    if (memberVerify.value && code === USER_MEMBER.normal) return 2
    return 2
})

/** 服务端已按会员限条返回；此处再 slice 一层防止响应被篡改 */
const visibleProfiles = computed(() => profiles.value.slice(0, visibleCount.value))
const showLimitTip = computed(() => memberCode.value !== USER_MEMBER.v3)
/** 普通档展示（含 basic，以及有效期内仍为 normal 的存量数据） */
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

const toRows = (item: ProfileItem): ProfileRow[] => [
    { label: '性别', value: item.sex },
    { label: '出生年月', value: item.birth },
    { label: '自我介绍', value: item.intro, multiline: true },
    { label: '对对方的要求', value: item.partnerRequirement, multiline: true },
    { label: '微信', value: item.wechat, multiline: true },
    // ...(item.photoLink ? [{ label: '个人照片(网盘链接)', value: item.photoLink }] : []),
    { label: '照片', photos: item.photos }
]

/** 未办理会员：仅预览首条，微信行展示为 **** */
const displayRowsForItem = (item: ProfileItem): ProfileRow[] => {
    const rows = toRows(item)
    if (!memberVerify.value) {
        return rows.map((r) => {
            if ('photos' in r) return r
            if (r.label === '微信') {
                return { ...r, value: '****' }
            }
            return r
        })
    }
    return rows
}

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
        const res = await $fetch<{ data: ProfileItem[] }>('/api/profiles/list', {
            headers: { 'x-ui': u.userId, 'x-ut': u.token },
        })
        if (seq !== profilesLoadSeq) return
        profiles.value = Array.isArray(res.data) ? res.data : []
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
