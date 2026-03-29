import { getMyUsersSubmissionStatus } from '../../service/av'

/** 当前登录用户是否已在 users 表提交过资料（及 auditStatus） */
export default defineEventHandler(async (event) => {
    const headers = getHeaders(event)
    try {
        return await getMyUsersSubmissionStatus(headers)
    } catch (e) {
        const err = e as Error & { statusCode?: number }
        const code = typeof err.statusCode === 'number' ? err.statusCode : 500
        throw createError({
            statusCode: code,
            statusMessage: err.message || '查询失败',
        })
    }
})
