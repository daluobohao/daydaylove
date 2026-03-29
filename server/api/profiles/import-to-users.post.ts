import { importProfilesToUsersClass } from '../../service/av'
import { PROFILES_SEED } from '../../../shared/profilesSeed'

/**
 * 一次性将 shared/profilesSeed 中的资料写入 LeanCloud 类 Users。
 * 请求头：x-import-secret 须与环境变量 PROFILES_IMPORT_SECRET 一致。
 *
 * curl -X POST http://localhost:3334/api/profiles/import-to-users \
 *   -H "x-import-secret: YOUR_SECRET"
 */
export default defineEventHandler(async (event) => {
    const expected = process.env.PROFILES_IMPORT_SECRET
    if (!expected) {
        throw createError({
            statusCode: 503,
            statusMessage: 'PROFILES_IMPORT_SECRET 未配置，请在 .env 中设置后再调用',
        })
    }
    if (getHeader(event, 'x-import-secret') !== expected) {
        throw createError({ statusCode: 401, statusMessage: '无效的 x-import-secret' })
    }

    const result = await importProfilesToUsersClass(PROFILES_SEED)
    return result
})
