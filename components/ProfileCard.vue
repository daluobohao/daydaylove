<style scoped>
.profile-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgb(0 0 0 / 6%);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}
.profile-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgb(0 0 0 / 10%);
}
.card-header {
    display: flex;
    padding: 16px;
    gap: 14px;
}
.avatar-wrapper {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.avatar-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.avatar-placeholder {
    width: 36px;
    height: 36px;
    color: #ccc;
}
.card-info {
    flex: 1;
    min-width: 0;
}
.card-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}
.card-sex-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 12px;
    color: white;
}
.card-sex-male {
    background: #4A90D9;
}
.card-sex-female {
    background: #EB455F;
}
.card-age {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}
.card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
}
.card-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    background: #f5f5f5;
    color: #666;
}
.card-tag-highlight {
    background: rgba(235, 69, 95, 0.08);
    color: #EB455F;
}
.card-body {
    padding: 0 16px 16px;
}
.card-intro {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.card-hobbies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
}
.hobby-tag {
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 12px;
    background: #f0f7ff;
    color: #4A90D9;
}
.card-photos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-top: 10px;
}
.card-photo-item {
    aspect-ratio: 1;
    border-radius: 6px;
    overflow: hidden;
    background: #f0f0f0;
}
.card-photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.card-footer {
    padding: 12px 16px;
    border-top: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card-wechat {
    font-size: 13px;
    color: #999;
}
.card-expand-btn {
    font-size: 13px;
    color: #EB455F;
    cursor: pointer;
}
.card-expand-btn:hover {
    text-decoration: underline;
}
.card-detail-section {
    padding: 12px 16px;
    border-top: 1px solid #f5f5f5;
}
.card-detail-label {
    font-size: 13px;
    color: #999;
    margin-bottom: 4px;
}
.card-detail-content {
    font-size: 14px;
    color: #555;
    line-height: 1.6;
    white-space: pre-wrap;
}
.partner-expect-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
}
.expect-tag {
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    background: rgba(235, 69, 95, 0.06);
    color: #EB455F;
    border: 1px solid rgba(235, 69, 95, 0.15);
}
</style>

<template>
    <div class="profile-card">
        <div class="card-header">
            <div class="avatar-wrapper">
                <img v-if="profile.avatar" :src="profile.avatar" alt="头像" />
                <svg v-else class="avatar-placeholder" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#e0e0e0"/><path d="M512 576a160 160 0 1 0 0-320 160 160 0 0 0 0 320z m0 64c-106.666667 0-320 53.333333-320 160v64h640v-64c0-106.666667-213.333333-160-320-160z" fill="#bbb"/></svg>
            </div>
            <div class="card-info">
                <div class="card-name-row">
                    <span
                        class="card-sex-badge"
                        :class="profile.sex === '男' ? 'card-sex-male' : 'card-sex-female'"
                    >{{ profile.sex === '男' ? '♂' : '♀' }}</span>
                    <span class="card-age">{{ age }}岁</span>
                </div>
                <div class="card-tags">
                    <span v-if="profile.height" class="card-tag card-tag-highlight">{{ profile.height }}cm</span>
                    <span v-if="profile.city" class="card-tag card-tag-highlight">{{ profile.city }}</span>
                    <span v-if="profile.education" class="card-tag card-tag-highlight">{{ profile.education }}</span>
                    <span v-if="profile.maritalStatus" class="card-tag">{{ profile.maritalStatus }}</span>
                </div>
            </div>
        </div>

        <div class="card-body">
            <div v-if="profile.intro" class="card-intro">{{ profile.intro }}</div>
            <div v-if="profile.hobbies && profile.hobbies.length" class="card-hobbies">
                <span v-for="h in profile.hobbies.slice(0, 6)" :key="h" class="hobby-tag">{{ h }}</span>
                <span v-if="profile.hobbies.length > 6" class="hobby-tag">+{{ profile.hobbies.length - 6 }}</span>
            </div>
            <div v-if="visiblePhotos.length" class="card-photos">
                <div v-for="(url, i) in visiblePhotos" :key="i" class="card-photo-item">
                    <img :src="url" alt="照片" />
                </div>
            </div>
        </div>

        <div v-if="expanded" class="card-detail-section">
            <div v-if="profile.partnerRequirement" class="mb-3">
                <div class="card-detail-label">对对方的要求</div>
                <div class="card-detail-content">{{ profile.partnerRequirement }}</div>
            </div>
            <div v-if="hasPartnerExpect" class="mb-3">
                <div class="card-detail-label">择偶期望</div>
                <div class="partner-expect-tags">
                    <span v-if="pe.ageMin || pe.ageMax" class="expect-tag">{{ pe.ageMin || 18 }}-{{ pe.ageMax || 45 }}岁</span>
                    <span v-if="pe.heightMin || pe.heightMax" class="expect-tag">{{ pe.heightMin || 150 }}-{{ pe.heightMax || 190 }}cm</span>
                    <span v-if="pe.education" class="expect-tag">{{ pe.education }}及以上</span>
                    <span v-if="pe.city" class="expect-tag">{{ pe.city }}</span>
                    <span v-if="pe.maritalStatus" class="expect-tag">{{ pe.maritalStatus }}</span>
                </div>
            </div>
            <div v-if="allPhotos.length > 3" class="card-photos">
                <div v-for="(url, i) in allPhotos.slice(3)" :key="'more-'+i" class="card-photo-item">
                    <img :src="url" alt="照片" />
                </div>
            </div>
        </div>

        <div class="card-footer">
            <span class="card-wechat">{{ showWechat ? `微信: ${profile.wechat}` : '微信: ****' }}</span>
            <span class="card-expand-btn" @click="expanded = !expanded">
                {{ expanded ? '收起' : '查看详情' }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ProfileSeedItem } from '~/shared/profilesSeed'

const props = defineProps<{
    profile: ProfileSeedItem
    showWechat: boolean
}>()

const expanded = ref(false)

const age = computed(() => {
    if (!props.profile.birth) return 0
    const m = props.profile.birth.match(/(\d{4})/)
    if (!m) return 0
    return new Date().getFullYear() - parseInt(m[1], 10)
})

const allPhotos = computed(() => props.profile.photos || [])
const visiblePhotos = computed(() => allPhotos.value.slice(0, 3))

const pe = computed(() => props.profile.partnerExpect || {})
const hasPartnerExpect = computed(() => {
    const p = pe.value
    return p.ageMin || p.ageMax || p.heightMin || p.heightMax || p.education || p.city || p.maritalStatus
})
</script>
