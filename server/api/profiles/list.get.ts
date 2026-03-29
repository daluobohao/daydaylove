import { listProfilesForEditor } from '../../service/av'

/**
 * 已登录：校验 JWS 与 x-ui 一致，再按 synchronizationUserInfo 会员态从 Users 表仅查询 N 条（未开通微信掩码）
 */
export default defineEventHandler(async (event) => {
    const headers = getHeaders(event)
    try {
        const data = await listProfilesForEditor(headers)
        return { data }
    } catch (e) {
        const err = e as Error & { statusCode?: number }
        const code = typeof err.statusCode === 'number' ? err.statusCode : 500
        throw createError({
            statusCode: code,
            statusMessage: err.message || '服务错误',
        })
    }
})
