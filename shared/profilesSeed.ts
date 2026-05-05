export type PartnerExpect = {
  ageMin?: number
  ageMax?: number
  heightMin?: number
  heightMax?: number
  education?: string
  city?: string
  maritalStatus?: string
}

export type ProfileSeedItem = {
  sex: string
  birth: string
  height: string
  education: string
  city: string
  maritalStatus: string
  avatar: string
  intro: string
  partnerRequirement: string
  partnerExpect: PartnerExpect
  wechat: string
  images?: string
  photos: string[]
  hobbies: string[]
  createdAt?: string
  location?: { lat: number; lng: number }
}

export const EDUCATION_OPTIONS = ['高中及以下', '大专', '本科', '硕士及以上'] as const
export const MARITAL_STATUS_OPTIONS = ['未婚', '离异', '丧偶'] as const
export const SEX_OPTIONS = ['男', '女'] as const

export const MAJOR_CITIES = [
  '北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '武汉',
  '南京', '天津', '苏州', '西安', '长沙', '沈阳', '青岛', '郑州',
  '大连', '东莞', '宁波', '厦门', '福州', '无锡', '合肥', '昆明',
  '哈尔滨', '济南', '佛山', '长春', '温州', '石家庄', '南宁', '贵阳',
  '南昌', '太原', '珠海', '中山', '惠州', '常州', '徐州', '烟台',
  '其他',
] as const

export const HOBBY_PRESETS = [
  '旅行', '摄影', '美食', '运动', '健身', '阅读', '电影', '音乐',
  '绘画', '游泳', '跑步', '瑜伽', '篮球', '足球', '羽毛球', '乒乓球',
  '钓鱼', '登山', '骑行', '舞蹈', '烹饪', '手工', '书法', '茶艺',
  '游戏', '动漫', '宠物', '园艺', '滑雪', '潜水',
] as const
