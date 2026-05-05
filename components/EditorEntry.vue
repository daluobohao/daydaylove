<style scoped>
.board-view {
    background-color: #fafafa;
    padding: 24px 32px;
}
.entry-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
    padding: 24px;
    max-width: 720px;
}
.section-hint {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
}
.avatar-upload-area {
    display: flex;
    align-items: center;
    gap: 16px;
}
.avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.avatar-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.hobby-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
}
.hobby-tag {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid #e0e0e0;
    background: #fff;
    color: #666;
    transition: all 0.2s;
}
.hobby-tag:hover {
    border-color: #EB455F;
    color: #EB455F;
}
.hobby-tag-active {
    background: rgba(235, 69, 95, 0.1);
    border-color: #EB455F;
    color: #EB455F;
}
.form-divider {
    border-top: 1px solid #f0f0f0;
    margin: 20px 0;
    padding-top: 16px;
}
.form-section-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
}
.completeness-bar {
    background: #f0f0f0;
    border-radius: 8px;
    height: 8px;
    overflow: hidden;
    margin-top: 4px;
}
.completeness-fill {
    height: 100%;
    border-radius: 8px;
    transition: width 0.3s;
}
.completeness-text {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
}
@media (max-width: 1023px) {
    .board-view {
        padding: 12px 16px;
    }
}
</style>

<template>
    <div class="w-full h-full min-h-0 flex flex-col">
        <el-alert v-if="alreadySubmitted" type="success" :closable="false" show-icon class="flex-shrink-0 rounded-none border-b border-green-200/80">
            <template #title>
                <span class="text-sm font-medium">资料已提交</span>
            </template>
            <p class="text-sm text-gray-700 leading-relaxed m-0">
                您已提交过资料，每位用户仅可录入一次。审核通过后，您的信息将展示在好友专区。
            </p>
        </el-alert>
        <el-alert v-else type="warning" :closable="false" show-icon class="flex-shrink-0 rounded-none border-b border-amber-200/80">
            <template #title>
                <span class="text-sm font-medium">录入说明</span>
            </template>
            <p class="text-sm text-gray-700 leading-relaxed m-0">
                请填写<strong>真实、准确</strong>的信息；<strong>每位用户仅可录入一次</strong>，提交前请仔细核对。
            </p>
        </el-alert>
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-800">录入我的资料</span>
            <div v-if="!alreadySubmitted" class="flex items-center gap-2">
                <span class="completeness-text">资料完善度 {{ completenessPercent }}%</span>
                <div class="completeness-bar" style="width: 80px;">
                    <div
                        class="completeness-fill"
                        :style="{
                            width: completenessPercent + '%',
                            backgroundColor: completenessPercent >= 80 ? '#52c41a' : completenessPercent >= 50 ? '#faad14' : '#EB455F'
                        }"
                    />
                </div>
            </div>
        </div>
        <div class="board-view flex-1 min-h-0 overflow-auto">
            <div class="entry-card m-auto">
                <el-skeleton v-if="statusLoading" :rows="6" animated class="py-2" />
                <el-form v-else label-position="top">
                    <div class="form-section-title">基本信息</div>

                    <el-form-item label="头像" required>
                        <div class="avatar-upload-area">
                            <div class="avatar-preview">
                                <img v-if="form.avatar" :src="form.avatar" alt="头像" />
                                <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#e0e0e0"/><path d="M512 576a160 160 0 1 0 0-320 160 160 0 0 0 0 320z m0 64c-106.666667 0-320 53.333333-320 160v64h640v-64c0-106.666667-213.333333-160-320-160z" fill="#bbb"/></svg>
                            </div>
                            <div>
                                <el-upload
                                    :show-file-list="false"
                                    :before-upload="beforeAvatarUpload"
                                    :http-request="handleAvatarUpload"
                                    accept="image/*"
                                >
                                    <el-button size="small" :loading="avatarUploading">上传头像</el-button>
                                </el-upload>
                                <div class="section-hint">请上传本人真实照片，非本人照片将被其他用户举报后隐藏</div>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="性别" required>
                        <el-select v-model="form.sex" placeholder="请选择" style="width: 100%">
                            <el-option v-for="s in SEX_OPTIONS" :key="s" :label="s" :value="s" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="出生年月" required>
                        <el-input v-model="form.birth" placeholder="例如：1999 或 1993.5" maxlength="64" show-word-limit />
                    </el-form-item>

                    <el-form-item label="身高">
                        <el-input-number v-model="form.heightNum" :min="150" :max="190" :step="1" controls-position="right" />
                        <span class="ml-2 text-sm text-gray-500">cm</span>
                    </el-form-item>

                    <el-form-item label="学历">
                        <el-select v-model="form.education" placeholder="请选择" clearable style="width: 100%">
                            <el-option v-for="e in EDUCATION_OPTIONS" :key="e" :label="e" :value="e" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="城市">
                        <el-select v-model="form.city" placeholder="选择城市" clearable filterable style="width: 100%">
                            <el-option v-for="c in MAJOR_CITIES" :key="c" :label="c" :value="c" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="婚姻状况">
                        <el-select v-model="form.maritalStatus" placeholder="请选择" clearable style="width: 100%">
                            <el-option v-for="m in MARITAL_STATUS_OPTIONS" :key="m" :label="m" :value="m" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="微信" required>
                        <el-input v-model="form.wechat" maxlength="128" show-word-limit />
                    </el-form-item>

                    <div class="form-divider">
                        <div class="form-section-title">自我介绍</div>
                    </div>

                    <el-form-item label="自我介绍" required>
                        <el-input v-model="form.intro" type="textarea" :rows="4" maxlength="500" show-word-limit placeholder="介绍一下自己，让别人更好地了解你" />
                    </el-form-item>

                    <el-form-item label="兴趣爱好">
                        <div class="hobby-tags">
                            <span
                                v-for="h in HOBBY_PRESETS"
                                :key="h"
                                class="hobby-tag"
                                :class="{ 'hobby-tag-active': form.hobbies.includes(h as string) }"
                                @click="toggleHobby(h as string)"
                            >{{ h }}</span>
                        </div>
                        <el-input
                            v-model="customHobby"
                            placeholder="自定义兴趣，回车添加"
                            size="small"
                            style="margin-top: 8px;"
                            @keyup.enter="addCustomHobby"
                        >
                            <template #append>
                                <el-button @click="addCustomHobby">添加</el-button>
                            </template>
                        </el-input>
                        <div v-if="form.hobbies.filter(h => !(HOBBY_PRESETS as readonly string[]).includes(h)).length" class="hobby-tags" style="margin-top: 8px;">
                            <span
                                v-for="h in form.hobbies.filter(h => !(HOBBY_PRESETS as readonly string[]).includes(h))"
                                :key="h"
                                class="hobby-tag hobby-tag-active"
                                @click="removeHobby(h)"
                            >{{ h }} ×</span>
                        </div>
                    </el-form-item>

                    <div class="form-divider">
                        <div class="form-section-title">择偶期望</div>
                    </div>

                    <el-form-item label="对对方的要求" required>
                        <el-input v-model="form.partnerRequirement" type="textarea" :rows="3" maxlength="4000" show-word-limit />
                    </el-form-item>

                    <el-form-item label="期望年龄范围">
                        <div class="flex items-center gap-2">
                            <el-input-number v-model="form.partnerExpect.ageMin" :min="18" :max="45" size="small" controls-position="right" />
                            <span class="text-gray-400">—</span>
                            <el-input-number v-model="form.partnerExpect.ageMax" :min="18" :max="45" size="small" controls-position="right" />
                            <span class="text-sm text-gray-500">岁</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="期望身高范围">
                        <div class="flex items-center gap-2">
                            <el-input-number v-model="form.partnerExpect.heightMin" :min="150" :max="190" size="small" controls-position="right" />
                            <span class="text-gray-400">—</span>
                            <el-input-number v-model="form.partnerExpect.heightMax" :min="150" :max="190" size="small" controls-position="right" />
                            <span class="text-sm text-gray-500">cm</span>
                        </div>
                    </el-form-item>

                    <el-form-item label="期望学历">
                        <el-select v-model="form.partnerExpect.education" placeholder="不限" clearable style="width: 100%">
                            <el-option v-for="e in EDUCATION_OPTIONS" :key="e" :label="e" :value="e" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="期望城市">
                        <el-select v-model="form.partnerExpect.city" placeholder="不限" clearable filterable style="width: 100%">
                            <el-option v-for="c in MAJOR_CITIES" :key="c" :label="c" :value="c" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="期望婚姻状况">
                        <el-select v-model="form.partnerExpect.maritalStatus" placeholder="不限" clearable style="width: 100%">
                            <el-option v-for="m in MARITAL_STATUS_OPTIONS" :key="m" :label="m" :value="m" />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" :loading="submitting" :disabled="alreadySubmitted" @click="submit">
                            提交资料
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ElAlert, ElButton, ElForm, ElFormItem, ElInput, ElInputNumber,
    ElMessage, ElSelect, ElOption, ElSkeleton, ElUpload,
} from 'element-plus'
import type { UploadRequestOptions } from 'element-plus'
import { getCookie } from '~/assets/js/utils/tools'
import { SEX_OPTIONS, EDUCATION_OPTIONS, MARITAL_STATUS_OPTIONS, MAJOR_CITIES, HOBBY_PRESETS } from '~/shared/profilesSeed'

type StatusRes = { submitted: boolean; auditStatus?: string }

const form = reactive({
    sex: '',
    birth: '',
    heightNum: 165,
    education: '',
    city: '',
    maritalStatus: '',
    avatar: '',
    intro: '',
    partnerRequirement: '',
    wechat: '',
    hobbies: [] as string[],
    partnerExpect: {
        ageMin: undefined as number | undefined,
        ageMax: undefined as number | undefined,
        heightMin: undefined as number | undefined,
        heightMax: undefined as number | undefined,
        education: '',
        city: '',
        maritalStatus: '',
    },
})
const customHobby = ref('')
const submitting = ref(false)
const statusLoading = ref(true)
const alreadySubmitted = ref(false)
const avatarUploading = ref(false)

const completenessPercent = computed(() => {
    let total = 10
    let filled = 0
    if (form.avatar) filled++
    if (form.sex) filled++
    if (form.birth) filled++
    if (form.heightNum) filled++
    if (form.education) filled++
    if (form.city) filled++
    if (form.maritalStatus) filled++
    if (form.intro) filled++
    if (form.partnerRequirement) filled++
    if (form.wechat) filled++
    return Math.round((filled / total) * 100)
})

function toggleHobby(h: string) {
    const idx = form.hobbies.indexOf(h)
    if (idx >= 0) {
        form.hobbies.splice(idx, 1)
    } else {
        form.hobbies.push(h)
    }
}

function removeHobby(h: string) {
    const idx = form.hobbies.indexOf(h)
    if (idx >= 0) form.hobbies.splice(idx, 1)
}

function addCustomHobby() {
    const val = customHobby.value.trim()
    if (!val) return
    if (form.hobbies.includes(val)) {
        ElMessage.warning('该兴趣已添加')
        return
    }
    form.hobbies.push(val)
    customHobby.value = ''
}

function beforeAvatarUpload(file: File) {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
        ElMessage.error('只能上传图片文件')
        return false
    }
    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过 5MB')
        return false
    }
    return true
}

async function handleAvatarUpload(options: UploadRequestOptions) {
    const file = options.file
    avatarUploading.value = true
    try {
        const h = authHeaders()
        if (!h) {
            ElMessage.error('请先登录')
            return
        }
        const formData = new FormData()
        formData.append('file', file)
        const res = await $fetch<{ url: string; key: string }>('/api/upload/avatar', {
            method: 'POST',
            body: formData,
            headers: h,
        })
        if (res.url) {
            form.avatar = res.url
        }
    } catch {
        ElMessage.error('头像上传失败')
    } finally {
        avatarUploading.value = false
    }
}

function authHeaders(): { 'x-ui': string; 'x-ut': string } | null {
    const raw = getCookie('__user')
    if (!raw) return null
    try {
        const u = JSON.parse(decodeURIComponent(raw)) as { userId?: string; token?: string }
        if (!u.userId || !u.token) return null
        return { 'x-ui': u.userId, 'x-ut': u.token }
    } catch {
        return null
    }
}

async function loadSubmissionStatus() {
    const h = authHeaders()
    if (!h) {
        statusLoading.value = false
        alreadySubmitted.value = false
        return
    }
    statusLoading.value = true
    try {
        const s = await $fetch<StatusRes>('/api/profiles/my-users-status', { headers: h })
        alreadySubmitted.value = !!s.submitted
    } catch {
        alreadySubmitted.value = false
    } finally {
        statusLoading.value = false
    }
}

onMounted(() => {
    loadSubmissionStatus()
})

async function submit() {
    if (alreadySubmitted.value) return
    if (!form.sex.trim() || !form.birth.trim() || !form.intro.trim() || !form.partnerRequirement.trim() || !form.wechat.trim()) {
        ElMessage.warning('请填写性别、出生年月、自我介绍、对对方的要求和微信')
        return
    }
    const h = authHeaders()
    if (!h) {
        ElMessage.error('请先登录')
        return
    }
    submitting.value = true
    try {
        const pe: Record<string, unknown> = {}
        if (form.partnerExpect.ageMin) pe.ageMin = form.partnerExpect.ageMin
        if (form.partnerExpect.ageMax) pe.ageMax = form.partnerExpect.ageMax
        if (form.partnerExpect.heightMin) pe.heightMin = form.partnerExpect.heightMin
        if (form.partnerExpect.heightMax) pe.heightMax = form.partnerExpect.heightMax
        if (form.partnerExpect.education) pe.education = form.partnerExpect.education
        if (form.partnerExpect.city) pe.city = form.partnerExpect.city
        if (form.partnerExpect.maritalStatus) pe.maritalStatus = form.partnerExpect.maritalStatus

        await $fetch('/api/profiles/my-users', {
            method: 'POST',
            headers: h,
            body: {
                sex: form.sex.trim(),
                birth: form.birth.trim(),
                height: form.heightNum ? String(form.heightNum) : '',
                education: form.education,
                city: form.city,
                maritalStatus: form.maritalStatus,
                avatar: form.avatar,
                intro: form.intro.trim(),
                partnerRequirement: form.partnerRequirement.trim(),
                partnerExpect: Object.keys(pe).length > 0 ? pe : {},
                wechat: form.wechat.trim(),
                photos: [],
                hobbies: form.hobbies,
            },
        })
        ElMessage.success('提交成功，请等待审核')
        alreadySubmitted.value = true
    } catch (e: unknown) {
        const data =
            e && typeof e === 'object' && 'data' in e
                ? (e as { data?: { message?: string; statusMessage?: string } }).data
                : undefined
        const msg = data?.message || data?.statusMessage
        ElMessage.error(typeof msg === 'string' ? msg : '保存失败，请稍后重试')
    } finally {
        submitting.value = false
    }
}
</script>
