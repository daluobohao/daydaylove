<style scoped>
.board-view {
    background-color: #fafafa;
    padding: 24px 32px;
}
.profile-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
    overflow: hidden;
}
.profile-row {
    padding: 16px;
}
.profile-row + .profile-row {
    border-top: 1px solid #f0f0f0;
}
.section-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
}
.section-content {
    font-size: 15px;
    color: #333;
    line-height: 1.6;
}
.photos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
}
.photo-item {
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background: #f0f0f0;
}
.photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.upgrade-tip {
    text-align: center;
    padding: 48px 24px;
    color: #666;
}
</style>

<template>
    <div class="w-full h-full min-h-0 flex flex-col">
        <EditorViewBar class="flex-shrink-0" />
        <div class="board-view flex-1 min-h-0 overflow-auto">
            <!-- 分档提示 -->
            <div v-if="showLimitTip" class="upgrade-tip">
                <p class="text-base mb-2">{{ limitTipTitle }}</p>
                <p class="text-sm text-gray-500">{{ limitTipDesc }}</p>
            </div>
            <div class="space-y-4">
                <div v-for="(item, index) in visibleProfiles" :key="index" class="profile-card">
                    <div v-for="(row, i) in toRows(item)" :key="i" class="profile-row">
                        <div class="section-label">{{ row.label }}</div>
                        <template v-if="'photos' in row">
                            <div v-if="row.photos.length" class="photos-grid mt-2">
                                <div v-for="(url, j) in row.photos" :key="j" class="photo-item">
                                    <img :src="url" alt="照片" />
                                </div>
                            </div>
                            <div v-else class="section-content text-gray-400 mt-1">暂无照片</div>
                        </template>
                        <div
                            v-else
                            class="section-content"
                            :class="{ 'whitespace-pre-wrap': row.multiline }"
                        >
                            {{ row.value || '—' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
type MemberSnapshot = { verify?: boolean; member?: string } | null

const member = useState<MemberSnapshot>('member')

const memberVerify = computed(() => member.value && member.value.verify)
const memberLevel = computed(() => member.value?.member || 'normal')

const visibleCount = computed(() => {
    if (memberLevel.value === 'v3') return profiles.value.length
    if (memberLevel.value === 'v1' || memberLevel.value === 'v2') return 8
    return 3
})

const visibleProfiles = computed(() => profiles.value.slice(0, visibleCount.value))
const showLimitTip = computed(() => memberLevel.value !== 'v3')
const limitTipTitle = computed(() =>
    memberLevel.value === 'normal'
        ? '普通会员可查看前 3 条资料'
        : 'VIP 会员可查看前 8 条资料'
)
const limitTipDesc = computed(() =>
    memberLevel.value === 'normal' ? '升级 VIP/SVIP 查看更多资料' : '升级 SVIP 可查看全部资料'
)

type ProfileTextRow = { label: string; value: string; multiline?: boolean }
type ProfilePhotosRow = { label: string; photos: string[] }
type ProfileRow = ProfileTextRow | ProfilePhotosRow

type ProfileItem = {
    sex: string
    birth: string
    intro: string
    partnerRequirement: string
    wechat: string
    photoLink?: string
    photos: string[]
}

// 个人资料（占位数据，后续可对接 API）
const profiles = ref<ProfileItem[]>([
    {
        sex: '女',
        birth: '1999',
        intro: '个人信息：女，1999年，身高1.72 家庭情况：河北保定人，父母和弟弟都经营生意工作：学的设计专业，目前在北京从事动漫插画师，双休',
        partnerRequirement: '无',
        wechat: 'lmx17303228873',
        photos: ['https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260325231934956.png']
    },
    {
        sex: '女',
        birth: '1993.5',
        intro:
            '【基本信息】\n老家贵州，1993年五月出生，北邮本硕，19年研究生毕业后在微软工作，是软件开发工程师。京户无京房，更希望两个人一起商量着买。\n爱生活，喜欢运动，瑜伽，羽毛球，篮球，台球，滑雪等都可以玩。\n主动积极解决问题。喜欢旅游，拍照，做饭。',
        partnerRequirement:
            '85年及之后，身高170+，本科及以上学历，在哪儿发展可以商量。有组建家庭的想法，有自己的爱好，运动类更好。父母养老无负担。能够坦诚相待，大大方方的。',
        wechat: '18810459433',
        // photoLink: 'https://pan.baidu.com/s/128jw73T0lHDRj3AHKNzTvQ?pwd=5mcf',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260325235119620.png"]
    },
    {
        sex: '女',
        birth: '1995',
        intro: '坐标北京，1995年，身高170cm，籍贯内蒙古，学历硕士，毕业于北京某211，现就职于某IT央企。性格直率开朗，爱好健身跳舞。',
        partnerRequirement: '希望对方年龄90后，身高178+，有运动健身习惯。',
        wechat: 'clmg0427',
        // photoLink: 'https://pan.baidu.com/s/1WW9bwkafO32YWj41zSjefQ?pwd=4mjk',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326231446718.png"]
    },

    {
        sex: '女',
        birth: '1997',
        intro:
            '个人信息：97年/身高172/射手座\n学历：本科211 硕士UCL\n工作：互联网运营\n地点：青岛人 工作现base北京\n爱好：滑雪/网球/旅行\n家庭情况：独女，父母经商多年，有保险，无任何养老压力。',
        partnerRequirement:
            '希望你：90-00年之间，现居北京。身高178以上，喜欢小狗。上进踏实，有自己的事业和爱好。关注家庭，情绪稳定，2年内有结婚意愿。',
        wechat: 'VACATION121',
        // photoLink: 'https://pan.baidu.com/s/1nhM_wxcsEgz9cGvmMMrBSQ?pwd=gfif',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326231628601.png"]
    },
    {
        sex: '男',
        birth: '1994.3',
        intro:
            '【个人情况】\n男生，94年3月，身高175cm，体重66kg，体型匀称。郑州大学本科（获保研资格后经深思熟虑决定留学），爱丁堡大学AI硕士，现就职于北京朝阳区望京某上市房地产国企总部，收入尚可。北京户口，住房两套，通州自住住房（无贷款），房山另有一套200㎡投资跃层（少量贷款，公积金可cover）。\n家庭背景\n父亲为企业高管，已退休；母亲为在职大学教授。三口之家，家庭温馨和睦，养老有保障。\n【生活志趣】\n• 电影：痴迷于光影交织的艺术，沉醉于银幕上的人生百态\n• 旅行：用脚步丈量世界，用心灵感受不同地域的风土人情\n• 烹饪：用味蕾感受世界，用美食传递爱与温暖',
        partnerRequirement:
            '【期待的你】\n✓ 93-99年生，本科及以上学历\n✓ 情绪稳定，善良真诚，有共建家庭的意愿\n✓ 原生家庭和谐，父母有稳定工作/社保\n✓ 愿共同经营生活美学：周末可宅家观影，假期能策划深度旅行；期待与你一起分享美食的快乐，在烟火气中感受生活的美好。',
        wechat: 'ZYSK768819',
        // photoLink: 'https://pan.baidu.com/s/1ypbBK3zivQIdvJT2HQzNcQ?pwd=g5ue',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326231744698.png"]
    },
    {
        sex: '女',
        birth: '1996',
        intro:
            '【出生年月】1996.2\n【身高】168cm\n【学历】本科\n【籍贯】河北邯郸\n【职业】建筑设计师\n【性格】不妨来慢慢探索☝️～\n【兴趣爱好】画画🎨，喜欢鸟类🦜，接触新鲜事物～',
        partnerRequirement: '【征友要求】够自信的来！可以一起进步！',
        wechat: 'wojiaoyuanzhengrui',
        // photoLink: 'https://pan.baidu.com/s/1YVVlEsLlLN-qivkH-9yaqA?pwd=kmqm',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326231834854.png"]
    },
    {
        sex: '女',
        birth: '2000',
        intro:
            '性格超好，善良，活泼\n\n出生年份：2000年\n体型：165/55kg\n学历：大学本科\n职业：央企 电建 HR\n贯籍：贵阳\n工作地点：北京海淀\n🌟关于自己：\n爱看脱口秀，电视剧；\n平时间歇性自律；\n周末跳舞，爱运动（偶尔打篮球、羽毛球，但是🥬）\n宅不住，喜欢外出逛街打卡，约朋友旅游，和熟悉的人在一起活泼话多；\n探索好奇心，情绪稳定，三观正\n养猫；喜欢吃辣、吃火锅',
        partnerRequirement:
            '关于对方：\n身高168+，喜欢运动；外貌干净顺眼，家庭和睦，专一，善良正直，无不良嗜好，责任心强',
        wechat: 'LibraYx1525',
        // photoLink: 'https://pan.baidu.com/s/1BBpDGztg-AZRO4tgYUDtrQ?pwd=4aw5',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326231918384.png"]
    },
    {
        sex: '女',
        birth: '1992.12',
        intro:
            '1992年12 月出生的山西女生，165cm /53kg\n首都师范大学书法硕士现在朝阳区做书法培训工作，工作时间较为自由。\n兴趣爱好：读书、旅行、看展、健身等。\n家庭情况：城市独生女，父亲事业单位教师，母亲央企工程师，暂无京户，京房可同男方一起购置。\n自我评价：本人开朗阳光，乐观积极，善解人意，热爱生活，拥有一份喜欢并有发展前景的工作和一个温馨和谐并充满爱的原生家庭。',
        partnerRequirement: '希望未来的他：具有本科及以上学历，热爱生活，有责任感，性格开朗，无不良嗜好，最好能有京户。',
        wechat: 'Wangyj1205',
        // photoLink: 'https://pan.baidu.com/s/1lIqWOLy5ae5JlWfyh3BkMQ?pwd=q6pm',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326231959936.png"]
    },
    {
        sex: '女',
        birth: '1995',
        intro:
            '年龄：95年\n身高：168\n学历：研究生\n性格：外向乐观\n工作及地点：北京西二旗大厂运营\n【家庭情况】\n父母均已退休\n\n一些补充：\n父母通情达理，都有退休金，没有后顾之忧。家庭氛围和睦快乐，父母恩爱。个人性格温柔可爱，活泼开朗，不爱吵架。',
        partnerRequirement: '【对男生的要求】\n裸高170以上，踏实上进，开明且有保障。',
        wechat: 'Wangdandandan0824',
        // photoLink: 'https://pan.baidu.com/s/1vSVVHht4xTGCoa_HfkZctg?pwd=qzvt',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232050485.png"]
    },
    {
        sex: '女',
        birth: '1985',
        intro:
            '北京找男友~ 关于女生:\n①山西人（京户），女，85年，未婚，身高168cm，体重60公斤\n②本科学历（北理）药企工作\n③性格内向中最活泼的，无不良嗜好。\n④父母均退休，身体健康，有退休金。',
        partnerRequirement:
            '关于你:\n①未婚或离异(无娃)都可以。\n②有自己的事业和稳定收入。③有责任心，能互相理解和尊重对方，遇事可沟通。',
        wechat: 'Anticito',
        // photoLink: 'https://pan.baidu.com/s/1ccfZcBUlA8aDX-l1VBaT0Q?pwd=uecz',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232328608.png"]
    },
    {
        sex: '女',
        birth: '1999.08',
        intro:
            '出生日期：1999年8月\n身高：172cm，体重：59kg\n属性：外向的ENFP/ENFJ，快乐小狗\n籍贯：山东省菏泽市\n研究生学历：中国政法大学\n工作：北京市延庆区人民法院（2024年7月通过公务员考试入职）\n爱好及特长：酷爱体育运动，热爱健身，爱好游泳、拳击、羽毛球、排球、长跑、散步；爱读书，爱做饭，爱旅游，爱交谈，西班牙语熟练',
        partnerRequirement:
            '交友期待：有共同语言，工作上进，情绪稳定，可内向沉稳踏实，也可热情阳光有活力；具备在北京稳定生活、工作的条件。',
        wechat: 'Aeverglow',
        // photoLink: 'https://pan.baidu.com/s/1TPN6dvyzWe0g43LMp7DsBA?pwd=qm2b',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232453851.png"]
    },
    {
        sex: '女',
        birth: '1984',
        intro:
            '关于我:\n①北京人，女，84年，未婚，身高165cm。\n②本科学历，工作稳定，自给自足。\n③性格慢热，对陌生人拘谨，熟悉后会好些。待人善良，无不良嗜好。\n④喜欢看剧、美食和旅游。\n⑤父母均退休，身体健康，有退休金。',
        partnerRequirement:
            '关于你:\n①未婚或离异（无娃）都可以。\n②身高175cm以上，年龄在36-45岁之间。\n③本科及以上学历，有自己的事业和稳定收入。\n④有责任心，能互相理解和尊重对方，遇事可沟通。\n⑤无不良嗜好，对待感情认真，情绪稳定，双方共同成长。',
        wechat: 'hiko-101',
        // photoLink: 'https://pan.baidu.com/s/1KZaFkTuTpMmdpvVF7Kaq3w?pwd=w61z',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232535793.png"]
    },
    {
        sex: '女',
        birth: '1992.06',
        intro:
            '认识五年多的朋友，性格安静沉稳，大方温柔。现为人大附中教育集团小学老师。\n\n1. 基本情况：92年6月生人，身高170，硕士学历。父母在京，父亲从事教育行业未退休，母亲已退休。家有兄长，龙凤胞胎。\n2. 工作：京户在编，“人”系小学英语教师，年收入15-18。朝阳太阳宫上班，朝八晚五。\n3. 性格及爱好：内向友善有耐心。善解人意。爱好逛逛公园看看书骑骑车，生活简单，作息规律。圈子单一，女性居多。',
        partnerRequirement: '1. 理想对象：年龄89年-95年，身高175上下，本科及以上。性格阳光积极上进。在京发展。',
        wechat: '18813002568',
        // photoLink: 'https://pan.baidu.com/s/1j-sYDhDgI-qD-6r7J3oZSQ?pwd=4k6e',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232609935.png"]
    },
    {
        sex: '女',
        birth: '1996.04',
        intro:
            '【出生年月】1996.4\n【身高】165cm\n【学历】本科湖南大学\n【籍贯】苏州\n【职业】银行产品经理\n【🚗🏠】已购\n【 性格】☀️40％有趣＋40％开朗＋20％天真的e人\n【自我介绍】🌞行动力航班头等舱 / ☀️快乐星球原居民 / 😘哈哈哈教教主 / 😆超乐观生活法则持有人\n【兴趣爱好】\n📖爱读书／爱写作／爱健身\n🌈爱人文 / 爱历史 / 爱戏剧',
        partnerRequirement: '【征友要求】性格温和、情绪稳定、三观正的ta❗❗❗',
        wechat: 'gyt733',
        // photoLink: 'https://pan.baidu.com/s/10Z5rGlf0r-LhbIB_9hW9Sw?pwd=m91g',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232643572.png"]
    },
    {
        sex: '女',
        birth: '1989',
        intro: '女生信息：苏蔷薇，89，身高156，体重50，学历博士，北京户口，中国地质大学工作，独生子女，父母已退休，性格好，平时喜欢旅行；',
        partnerRequirement: '对男生要求：人品好，性格好，工作上进',
        wechat: '18811307237',
        // photoLink: 'https://pan.baidu.com/s/1cubfktQWgTsFqc8L0yN4tA?pwd=tw9k',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232720285.png"]
    },
    {
        sex: '女',
        birth: '1998',
        intro:
            '出生年份 1998\n身高155\n住址 北京市丰台区\n学历 大学本科\n职业 地产文职\n河北沧州人，北京生活，爱笑，活泼开朗，喜欢猫猫狗狗（目前没有养）',
        partnerRequirement: '希望身高172以上，不是颜控但不能太丑，阳光，有责任心，能照顾人',
        wechat: 'YikP_0201_',
        // photoLink: 'https://pan.baidu.com/s/1mxGsBirq5zsTb8gzpu0gsw?pwd=de78',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232749250.png"]
    },
    {
        sex: '女',
        birth: '1996',
        intro:
            '基本信息：96年，天津人，悉尼大学金融硕士，170/58kg\n\n个人爱好：旅行，电影，\n室内室外都爱玩，会钢琴 、乒乓球\n家庭情况：独生女，家人体制内\n\n工作：金融行业 二级交易员',
        partnerRequirement: '希望对方：本科及以上学历，北京发展，热爱生活，相对自律',
        wechat: '18722366858',
        // photoLink: 'https://pan.baidu.com/s/1obQBocN2jzVIGLlrWECKtg?pwd=j96b',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232823098.png"]
    },
    {
        sex: '女',
        birth: '1998',
        intro:
            '个人基本情况：女，98年，河北人，狮子座，硕士毕业，工作就职于建研院。\n父母基本情况：父母均有正式工作，暂未退休。\n日常及爱好：偶尔玩单机游戏，不打竞技游戏，喜欢出门，喜欢走路和坐公交',
        partnerRequirement:
            '希望对方情况：喜欢偏瘦且白净的类型，98年-94年，职业不限，工作地点希望稳定在北京。希望是一个有趣的灵魂，阳光开朗，不抽烟，成熟稳重话可以少点，无不良嗜好。',
        wechat: 'weiboluuu',
        // photoLink: 'https://pan.baidu.com/s/1ZzDMPNCr8DK_YRhgCTA5_g?pwd=ii5c',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232911880.png"]
    },
    {
        sex: '女',
        birth: '1997',
        intro:
            '【基本情况】\n生日：1997年8月\n家乡：山东省淄博市\n身高：160cm\n学历：本硕均为中央财经大学\n工作：毕业后就职于北京某大学行政岗，有京户\n家庭：独生女，父母经营一家企业',
        partnerRequirement:
            '【理想的他】\n1.93年后出生\n2.人品端正，有责任心\n3.性格阳光外向，不沉闷\n4.身高不低于175cm\n5.喜欢小动物',
        wechat: 'lyx13335211177',
        // photoLink: 'https://pan.baidu.com/s/11tXgmLQvoCovM2s90zLXrg?pwd=p977',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326232946463.png"]
    },
    {
        sex: '女',
        birth: '1995.03',
        intro:
            '【基本情况】\n女，95年3月，白羊座，165cm\n本科北京邮电大学，研究生墨尔本大学\n已购京房，无京户\n爱好：健身，美食，音乐，户外运动\n父母均体制内工作',
        partnerRequirement:
            '【希望对方】\n90年及以后\n有京户\n身材匀称\n三观端正，有责任心\n热爱生活，有趣味，喜欢探索新事物',
        wechat: 'xuhuijie95xk',
        // photoLink: 'https://pan.baidu.com/s/1J0JTax-c9ROVu3GD9BQm3w?pwd=18bs',
        photos: ["https://cdn.jsdelivr.net/gh/daluobohao/img-bed/imges/20260326233018312.png"]
    }
])

const toRows = (item: ProfileItem): ProfileRow[] => [
    { label: '性别', value: item.sex },
    { label: '出生年月', value: item.birth },
    { label: '自我介绍', value: item.intro, multiline: true },
    { label: '对对方的要求', value: item.partnerRequirement, multiline: true },
    { label: '微信', value: item.wechat, multiline: true },
    ...(item.photoLink ? [{ label: '个人照片(网盘链接)', value: item.photoLink }] : []),
    { label: '照片', photos: item.photos }
]

// TODO: 从接口加载 profile 数据
onMounted(() => {
    // 示例：按结构映射后写入 profiles.value
})
</script>
