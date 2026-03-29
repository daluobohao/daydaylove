/** 征友资料种子数据（与编辑器同源；导入 LeanCloud 自定义类 `Users`） */
export type ProfileSeedItem = {
  sex: string
  birth: string
  intro: string
  partnerRequirement: string
  wechat: string
  images?: string
  photos: string[]
}
