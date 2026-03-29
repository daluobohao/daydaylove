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
</style>

<template>
    <div class="w-full h-full min-h-0 flex flex-col">
        <el-alert type="warning" :closable="false" show-icon class="flex-shrink-0 rounded-none border-b border-amber-200/80">
            <template #title>
                <span class="text-sm font-medium">录入说明</span>
            </template>
            <p class="text-sm text-gray-700 leading-relaxed m-0">
                用户录入个人信息时须填写<strong>真实、准确</strong>的信息；<strong>每位用户仅可录入一次</strong>。
                <strong>审核通过后</strong>，您的信息<strong>方可在本网站展示</strong>。提交前请仔细核对。
            </p>
        </el-alert>
        <div class="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-2.5 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-800">录入我的资料</span>
            <span class="text-xs text-gray-500">左侧可切回「查看」</span>
        </div>
        <div class="board-view flex-1 min-h-0 overflow-auto">
            <div class="entry-card m-auto">
                <el-skeleton v-if="statusLoading" :rows="6" animated class="py-2" />
                <el-form v-else label-position="top">
                    <el-form-item label="性别" required>
                        <el-input v-model="form.sex" placeholder="例如：女" maxlength="32" show-word-limit />
                    </el-form-item>
                    <el-form-item label="出生年月" required>
                        <el-input v-model="form.birth" placeholder="例如：1999 或 1993.5" maxlength="64" show-word-limit />
                    </el-form-item>
                    <el-form-item label="自我介绍" required>
                        <el-input v-model="form.intro" type="textarea" :rows="4" maxlength="4000" show-word-limit />
                    </el-form-item>
                    <el-form-item label="对对方的要求" required>
                        <el-input v-model="form.partnerRequirement" type="textarea" :rows="3" maxlength="4000" show-word-limit />
                    </el-form-item>
                    <el-form-item label="微信" required>
                        <el-input v-model="form.wechat" maxlength="128" show-word-limit />
                    </el-form-item>

                    <el-form-item label="图片链接（选填）">
                        <el-input v-model="form.photosText" type="textarea" :rows="4" placeholder="https://..." />
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
import { ElAlert, ElButton, ElForm, ElFormItem, ElInput, ElMessage, ElSkeleton } from 'element-plus'
import { getCookie } from '~/assets/js/utils/tools'

type StatusRes = { submitted: boolean; auditStatus?: string }

const form = reactive({
    sex: '',
    birth: '',
    intro: '',
    partnerRequirement: '',
    wechat: '',
    photosText: '',
})
const submitting = ref(false)
const statusLoading = ref(true)
const alreadySubmitted = ref(false)

function parsePhotoUrls(text: string): string[] {
    return text
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
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
    const photos = parsePhotoUrls(form.photosText)
    submitting.value = true
    try {
        await $fetch('/api/profiles/my-users', {
            method: 'POST',
            headers: h,
            body: {
                sex: form.sex.trim(),
                birth: form.birth.trim(),
                intro: form.intro.trim(),
                partnerRequirement: form.partnerRequirement.trim(),
                wechat: form.wechat.trim(),
                photos,
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
