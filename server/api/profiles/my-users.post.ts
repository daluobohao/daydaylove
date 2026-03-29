import { saveMyUsersProfile } from '../../service/av'

/** 在 LeanCloud 类 users 中首次录入（每位用户仅一条，auditStatus=pending） */
export default defineEventHandler(async (event) => {
    const headers = getHeaders(event)
    const body = await readBody(event)
    try {
        const result = await saveMyUsersProfile(headers, body)
        return { ok: true, ...result }
    } catch (e) {
        const err = e as Error & { statusCode?: number }
        const code = typeof err.statusCode === 'number' ? err.statusCode : 500
        throw createError({
            statusCode: code,
            statusMessage: err.message || '保存失败',
        })
    }
})
