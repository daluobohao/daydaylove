/**
 * 将 shared/profilesSeed 写入 LeanCloud 类 Users（使用 Master Key）。
 * 用法：在项目根目录执行 npx tsx scripts/import-users.ts
 */
import { importProfilesToUsersClass } from '../server/service/av.js'
import { PROFILES_SEED } from '../shared/profilesSeed'

async function main() {
    console.log(`准备导入 ${PROFILES_SEED.length} 条到 LeanCloud Users …`)
    const result = await importProfilesToUsersClass(PROFILES_SEED)
    console.log('完成:', result)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
