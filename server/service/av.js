import AV from 'leancloud-storage'
import jws from '../utils/jws'
import { yungouSign } from '../utils/md5'
import { AV_CONFIG } from '../config/vars'

AV.init({
    appId: AV_CONFIG.appId,
    appKey: AV_CONFIG.appKey,
    masterKey: AV_CONFIG.masterKey,
    serverURL: AV_CONFIG.serverURL
});
AV.Cloud.useMasterKey();

const userMember = {
    normal: "0xnab1",
    /** 普通会员（前端支付档位 m=1） */
    basic: "0xb4s1c2",
    v1: "0xn33b2",
    v2: "fdf23f",
    v3: "v62223f",
}
// 是否认证过
const userVerify = {
    verifed: true,
    noverifed: false
}

/**
 * 注册
 * @param {email, password} body
 * @returns
 */

async function signupUser(body) {
    console.log("event:", body)
    let {email, password} = body
    // 创建实例
    const user = new AV.User();

    user.setUsername(email);
    user.setPassword(password);
    // 可选
    user.setEmail(email);
    return user.signUp().then(async (user) => {
        const userObjectId = user.getObjectId()

        const expObject = AV.Object.extend('Membership')
        const exp = new expObject()
        // 修改属性
        exp.set('email', email)
        exp.set('userObjectId', userObjectId)
        exp.set('userObject', user)
        exp.set('member', userMember.normal) //普通用户、月会员、年会员、终身会员

        return exp.save().then(async () => {
            console.log(`注册成功。objectId：${user.id}`);
            const userSign = {userId: userObjectId}
            const token = await jws.sign(userSign, new Date().getTime() / 1000)
            let returnUser = {
                userId: userObjectId,
                email: email,
                token: token
            }
            return returnUser
        })

    }, (error) => {
        // 注册失败（通常是因为用户名已被使用）
        return {code: error.code, message: error.rawMessage}
    });
}

/**
 * 登录
 * @param {email, password} body
 * @returns
 */
async function signinUser(body) {
    let {email, password} = body
    try {
        let user = await AV.User.loginWithEmail(email, password)
        let userId = user.getObjectId()

        const userSign = {userId: userId}
        const token = await jws.sign(userSign, new Date().getTime() / 1000)
        let returnUser = {
            userId: user.getObjectId(),
            email: email,
            token: token,
        }
        return returnUser
    } catch(error) {
        return {code: error.code, message: error.rawMessage}
    }
}


/**
 * 发送重置密码的链接
 * @param {email, password} body
 * @returns
 */
async function forgetUser(body) {
    let {email} = body
    try {
        const query = new AV.Query('_User')
        // 根据用户id做更新操作
        query.equalTo('username', email)
        return query.first().then(async function(results) {
            if (results && results.get("email")) {
                let email = results.get("email")
                let result = await AV.User.requestPasswordReset(email)
                if (result) {
                    return {message: "SUCCESS"}
                }
            } else {
                return {code: "401", message: "此邮箱不存在,请检查或者联系客服人员重置！"}
            }
        }, function(error) {
            return error
        })
    } catch(error) {
        return {code: error.code, message: error.rawMessage}
    }
}

/**
 * 根据标题内容查询
 * @param {email, password} body
 * @returns
 */

async function getItemsByTitle(params) {
    let {table, input, limit, next} = params
    // 创建实例
    const query = new AV.Query(table)
    query.select(['title', 'source', '-createdAt', '-updatedAt']);
    if (input) {
        query.contains('title', input)
    }
    query.limit(limit || 10);
    query.skip(next);

    return query.find().then(function(result) {
        const returnResult = {
            meta: {
                limit,
                next: parseInt(next) + parseInt(limit),
                hasNext: (result.length < limit) ? false : true
            },
            data: result
        }
        return returnResult
    })
}

/**
 * 根据标记Tag查询
 * @param {email, password} body
 * @returns
 */
async function getItemsByTag(params) {
    console.log("event:", params)
    let {table, tag, limit, next} = params
    // 创建查询实例
    const query = new AV.Query(table)
    query.select(['title', 'source', 'tags', '-createdAt', '-updatedAt']);
    query.equalTo('tags', tag)
    query.limit(limit || 10);
    query.skip(next);

    return query.find().then(function(result) {
        console.log("result:", result)
        const returnResult = {
            meta: {
                limit,
                next: parseInt(next) + parseInt(limit),
                hasNext: (result.length < limit) ? false : true
            },
            data: result
        }
        return returnResult
    })
}

/**
 * 验证Token, 看是否是有效期内的会员
 */
async function synchronizationUserInfo(body, headers) {
    const token = headers["x-ut"]
    const flag = body.flag
    const userId = headers["x-ui"]

    if (token && !flag) { // 通过token验证
        const result = await jws.verify(token)
        const payload = result.payload
        if (payload.userId) {
            const date = new Date().getTime()
            const expireTime = payload.expirationAt
            if (payload.expirationAt && (date < expireTime)) { // 会员判断过期时间，未过期则成功返回，过期则返回
                const data = {
                    "verify": userVerify.verifed,
                    expirationAt: payload.expirationAt,
                    token,
                    member: payload.member,
                    userId: payload.userId,
                }
                return data
            }
        }
    }

    const {data} = await _getMembership(userId)
    const userAndExpiration = data

    if (userAndExpiration && userAndExpiration.err) {
        const error = `no data`
        return {data: {err_code: define.NO_DATA,err: error}}
    } else {
        let data = {}
        const date = new Date().getTime()
        const expireTime = userAndExpiration.expirationAt
        const expValid =
            typeof expireTime === 'number' &&
            Number.isFinite(expireTime) &&
            date < expireTime
        if (expValid) { // 如果有效期内，则设定有效期token
            // jws generate token
            const userId = userAndExpiration.userId
            const expirationAt = userAndExpiration.expirationAt
            const member = userAndExpiration.member
            const user = {userId, expirationAt, member}
            const token = await jws.sign(user, new Date().getTime() / 1000)
            data = {"verify": userVerify.verifed, expirationAt, token, member, userId}
        } else { // 非有效期
            data = {"verify":  userVerify.noverifed}
        }
        return data
    }
}
/**
 * 根据用户id获取会员信息
 * @param {*} userId
 * @returns
 */
async function _getMembership(userId) {
    const Membership = new AV.Query('Membership')
    Membership.equalTo('userObjectId', userId)
    return Membership.first().then(function(account) {
        let newItem = {}
        if (account) {
            const expRaw = account.get('expirationAt')
            const expMs = expRaw != null ? new Date(expRaw).getTime() : NaN
            newItem = {
                userId: account.get('userObjectId'),
                expirationAt: Number.isFinite(expMs) ? expMs : undefined,
                member: account.get('member'),
                level: account.get('level')
            }
        }
        // console.log("getMembership:", newItem, account)
        return {data: newItem}
    })
}

/**
 * 用户支付状态的查询
 * @param {*} req
 * @returns
 */
async function queryPayOrder(body) {
    const {user_id, qr_id} = body
    const expiration = new AV.Query('Order')
    expiration.equalTo('user_id', user_id)
    expiration.equalTo('qr_id', qr_id)

    return expiration.first().then(function(obj) {

        let newItem = {}
        if (obj) {
            newItem = {
                order_id: obj.get('order_id'),
                amount: obj.get('amount'),
                payway: obj.get('payway'),
                state: obj.get('state'),
                user_id: obj.get('user_id'),
                qr_id: obj.get('qr_id'),
                limit: obj.get('limit'),
                member: obj.get('member')
            }
        }
        return newItem
    })
}

async function queryPayOrderExist(orderId) {
    const expiration = new AV.Query('Order')
    expiration.equalTo('order_id', orderId)

    return expiration.first().then(function(obj) {
        let newItem = {}
        if (obj) {
            newItem = {
                order_id: obj.get('order_id'),
                charge_id: obj.get('charge_id')
            }
        }
        console.log("order:", newItem)
        return newItem
    })
}

/**
 * 接收第三方平台的回调内容，同步到Order表
 * @param {*} params
 * @returns
 */
async function syncOrderYungouos(params) {
    const expObject = AV.Object.extend('Order')
    const item = new expObject()

    const attach = params.attach.split(",")
    let plusinfo = {uid: attach[0], r: attach[1], m: attach[2]}

    console.log("plusinfo::", plusinfo)
    // 修改属性
    item.set('order_id', params.outTradeNo)
    item.set('charge_id', params.orderNo)
    item.set('description', params.payBank)
    item.set('amount', parseFloat(params.money))
    item.set('state', params.code)
    item.set('create_time', params.time)
    item.set('payway', 1)
    item.set('pay_channel', params.payChannel)
    item.set('user_id', plusinfo.uid)
    item.set('qr_id', plusinfo.r)
    let member = ""
    if (plusinfo.m == 1) {
        member = userMember.basic
    } else if (plusinfo.m == 12) {
        member = userMember.v1
    } else if (plusinfo.m == 666 || plusinfo.m === "666") {
        member = userMember.v3
    }
    item.set('member',  member)
    console.log("syncOrder:", params)
    // 保存到云端
    return item.save().then(async (obj) => {
        let newItem = {}
        if (obj) {
            newItem = {
                order_id: obj.get('order_id'),
                amount: obj.get('amount'),
                payway: obj.get('payway'),
                user_id: obj.get('user_id'),
                qr_id: obj.get('qr_id'),
                member: obj.get('member')
            }
        }
        return {data: newItem}
    }, (error) => {
        console.log(error)
        return {data: {code: error.code}}
    })
}

/**
 * 更新会员时间
 */
async function updatePayUserExp(params) {
    let id = params.user_id //"62a5b0aa133fee7578dc4ff1";//
    let member = params.member //"oxfs1";//
    console.log("updatePayUserExp:", params)

    let type = null
    if (member == userMember.basic) {
        type = 31
    } else if (member == userMember.v1) {
        type = 365
    } else if (member == userMember.v2) {
        type = 365
    } else if (member == userMember.v3) {
        type = 3650
    }

    const days = {
        1: 24 * 60 * 60 * 1000,
        3: 3 * 24 * 60 * 60 * 1000,
        7: 7 * 24 * 60 * 60 * 1000,
        30: 30 * 24 * 60 * 60 * 1000,
        31: 31 * 24 * 60 * 60 * 1000,
        91: 91 * 24 * 60 * 60 * 1000,
        183: 183 * 24 * 60 * 60 * 1000,
        365: 365 * 24 * 60 * 60 * 1000,
        3650: 3650 * 24 * 60 * 60 * 1000,
    }
    const updateTime = type != null ? days[type] : null
    console.log("updatePayUserExp:11:", type, updateTime)
    if (updateTime == null) {
        console.warn("updatePayUserExp: unknown member tier", member)
        return Promise.resolve({data: {err: `unknown member tier: ${member}`}})
    }
    const expiration = new AV.Query('Membership')
    expiration.equalTo('userObjectId', id)
    return expiration.first().then(function(account) {
        if (!account) {
            const error = `no user ${id}`
            console.error(error)
            return {data: {err: error}}
        }
        let orgExporationAt = account.get('expirationAt')
        console.log("updatePayUserExp:333:", orgExporationAt)
        const objectId = account.id
        console.log('==objectId===', objectId)
        const exp = AV.Object.createWithoutData('Membership', objectId)
        const date = new Date()
        let baseTime = date.getTime()
        if (orgExporationAt) {
            orgExporationAt = new Date(orgExporationAt).getTime()
        }
        console.log('==account===', orgExporationAt, baseTime)

        if (orgExporationAt && (orgExporationAt > baseTime)) {
            baseTime = orgExporationAt
        }
        console.log(orgExporationAt, baseTime)
        date.setTime(baseTime + updateTime)
        exp.set('expirationAt', date)
        exp.set('member', member)
        return exp.save().then((res) => {
            return {data: res}
        })
    })
}

/**
 * yungouos的回调处理
 * @param {*} body
 * @returns
 */
async function onYungouosHook(body) {
    console.log('params:', body)
    let params = Object.fromEntries(new URLSearchParams(body))
    let result = ""

    let tradNo = params.outTradeNo
    console.log('params:', params, params["outTradeNo"])
    if (tradNo) {
        let signValue = params.sign
        let transParams = {
            "code": params.code,
            "orderNo": params.orderNo,
            "payNo": params.payNo,
            "outTradeNo": params.outTradeNo,
            "money": params.money,
            "mchId": params.mchId
        }
        // 验签验证金额
        const sign = await yungouSign(transParams)
        if (sign == signValue) {
            let orderExist = await queryPayOrderExist(tradNo)
            if (orderExist && orderExist.charge_id) { // 如果已经存在则忽略
                result = "SUCCESS"
            } else {
                let order = await syncOrderYungouos(params)
                await updatePayUserExp(order.data)
                result = "SUCCESS"
            }
        }
    }
    return result
}

/**
 * 将资料逐条写入 LeanCloud 自定义类 Users（非登录表 _User）。
 * 需在控制台创建 Class「Users」，建议字段：sex、birth、intro、partnerRequirement、wechat、photoLink（可选）、photos（Array）、sortOrder（Number）。
 */
async function importProfilesToUsersClass(rows) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return {count: 0, objectIds: []}
    }
    const Cls = AV.Object.extend('Users')
    const objectIds = []
    for (let i = 0; i < rows.length; i++) {
        const r = rows[i]
        const o = new Cls()
        o.set('sex', r.sex || '')
        o.set('birth', r.birth || '')
        o.set('intro', r.intro || '')
        o.set('partnerRequirement', r.partnerRequirement || '')
        o.set('wechat', r.wechat || '')
        if (r.photoLink) {
            o.set('photoLink', r.photoLink)
        }
        o.set('photos', Array.isArray(r.photos) ? r.photos : [])
        o.set('sortOrder', i)
        const saved = await o.save()
        objectIds.push(saved.id)
    }
    return {count: objectIds.length, objectIds}
}

/**
 * 与编辑器可见条数一致：未开通 1、普通 2、VIP 8、SVIP 40
 */
function profilesVisibleLimit(verify, member) {
    if (!verify) return 1
    if (member === userMember.v3) return 40
    if (member === userMember.v1 || member === userMember.v2) return 8
    if (member === userMember.basic) return 2
    if (verify && member === userMember.normal) return 2
    return 2
}

/**
 * 校验 x-ut 签名有效且载荷 userId 与 x-ui 一致（再交由 synchronizationUserInfo 解析会员态）
 */
async function assertSessionUserMatchesHeaders(headers) {
    const userId = headers['x-ui']
    const token = headers['x-ut']
    if (!userId || !token) {
        const e = new Error('未登录')
        e.statusCode = 401
        throw e
    }
    let decoded
    try {
        decoded = await jws.verify(token)
    } catch (_) {
        const e = new Error('令牌无效')
        e.statusCode = 401
        throw e
    }
    const payload = decoded.payload
    if (!payload || !payload.userId || String(payload.userId) !== String(userId)) {
        const e = new Error('身份不一致')
        e.statusCode = 403
        throw e
    }
}

/**
 * 读取 LeanCloud 类 Users 资料（按 sortOrder 升序，最多 maxRows 条，上限 1000）
 */
async function listUsersProfiles(maxRows = 1000) {
    const n = Math.min(1000, Math.max(1, parseInt(maxRows, 10) || 1))
    const Q = new AV.Query('Users')
    Q.descending('createdAt')
    Q.limit(n)
    return Q.find().then((results) => {
        return results.map((obj) => {
            const photos = obj.get('photos')
            const hobbies = obj.get('hobbies')
            const partnerExpect = obj.get('partnerExpect')
            const location = obj.get('location')
            return {
                objectId: obj.id,
                sex: obj.get('sex') || '',
                birth: obj.get('birth') || '',
                height: obj.get('height') || '',
                education: obj.get('education') || '',
                city: obj.get('city') || '',
                maritalStatus: obj.get('maritalStatus') || '',
                avatar: obj.get('avatar') || '',
                intro: obj.get('intro') || '',
                partnerRequirement: obj.get('partnerRequirement') || '',
                partnerExpect: (partnerExpect && typeof partnerExpect === 'object') ? partnerExpect : {},
                wechat: obj.get('wechat') || '',
                photoLink: obj.get('photoLink') || undefined,
                photos: Array.isArray(photos) ? photos : [],
                hobbies: Array.isArray(hobbies) ? hobbies : [],
                createdAt: obj.get('createdAt') ? new Date(obj.get('createdAt')).toISOString() : '',
                location: (location && typeof location === 'object') ? location : null,
            }
        })
    })
}

/**
 * 编辑器资料列表：先校验 JWS 与 x-ui 一致，再按 synchronizationUserInfo 会员态限条查询；未开通返回微信掩码
 */
async function listProfilesForEditor(headers) {
    await assertSessionUserMatchesHeaders(headers)
    const info = await synchronizationUserInfo({}, headers)
    const verify = !!info.verify
    const member = info.member
    const limit = profilesVisibleLimit(verify, member)
    let rows = await listUsersProfiles(limit)
    if (!verify && rows.length > 0) {
        rows = rows.map((row, i) => (i === 0 ? {...row, wechat: '****'} : row))
    }
    return rows
}

/**
 * 当前用户是否已在类 users 中录入过（每人仅允许一条）
 */
async function getMyUsersSubmissionStatus(headers) {
    await assertSessionUserMatchesHeaders(headers)
    const userId = headers['x-ui']
    const Q = new AV.Query('users')
    Q.equalTo('userObjectId', userId)
    Q.limit(1)
    const row = await Q.first()
    if (!row) {
        return {submitted: false}
    }
    return {
        submitted: true,
        auditStatus: row.get('auditStatus') || 'pending',
        objectId: row.id,
    }
}

/**
 * 当前用户首次录入资料 → LeanCloud 类 users（小写）；每位 userObjectId 仅允许一条。
 * 写入 auditStatus=pending，供后台审核通过后展示。photos：外链 URL 数组，可空。
 */
async function saveMyUsersProfile(headers, body) {
    await assertSessionUserMatchesHeaders(headers)
    const userId = headers['x-ui']
    const dupQ = new AV.Query('users')
    dupQ.equalTo('userObjectId', userId)
    dupQ.limit(1)
    const duplicate = await dupQ.first()
    if (duplicate) {
        const e = new Error('每位用户仅可录入一次，您已提交过资料')
        e.statusCode = 409
        throw e
    }

    const sex = String(body?.sex ?? '').trim()
    const birth = String(body?.birth ?? '').trim()
    const height = String(body?.height ?? '').trim()
    const education = String(body?.education ?? '').trim()
    const city = String(body?.city ?? '').trim()
    const maritalStatus = String(body?.maritalStatus ?? '').trim()
    const avatar = String(body?.avatar ?? '').trim()
    const intro = String(body?.intro ?? '').trim()
    const partnerRequirement = String(body?.partnerRequirement ?? '').trim()
    const wechat = String(body?.wechat ?? '').trim()
    if (!sex || !birth || !intro || !partnerRequirement || !wechat) {
        const e = new Error('请填写性别、出生年月、自我介绍、对对方的要求和微信')
        e.statusCode = 400
        throw e
    }
    let photos = []
    if (Array.isArray(body?.photos)) {
        photos = body.photos.map((u) => String(u || '').trim()).filter(Boolean)
    }
    let hobbies = []
    if (Array.isArray(body?.hobbies)) {
        hobbies = body.hobbies.map((h) => String(h || '').trim()).filter(Boolean)
    }
    let partnerExpect = {}
    if (body?.partnerExpect && typeof body.partnerExpect === 'object') {
        partnerExpect = body.partnerExpect
    }
    let location = null
    if (body?.location && typeof body.location === 'object' && body.location.lat && body.location.lng) {
        location = { lat: Number(body.location.lat), lng: Number(body.location.lng) }
    }

    const Cls = AV.Object.extend('users')
    const row = new Cls()
    row.set('userObjectId', userId)
    row.set('sex', sex)
    row.set('birth', birth)
    row.set('height', height)
    row.set('education', education)
    row.set('city', city)
    row.set('maritalStatus', maritalStatus)
    row.set('avatar', avatar)
    row.set('intro', intro)
    row.set('partnerRequirement', partnerRequirement)
    row.set('partnerExpect', partnerExpect)
    row.set('wechat', wechat)
    row.set('photos', photos)
    row.set('hobbies', hobbies)
    row.set('location', location)
    row.set('sortOrder', Date.now())
    row.set('auditStatus', 'pending')
    const saved = await row.save()
    return {objectId: saved.id, auditStatus: 'pending'}
}

export {signupUser, signinUser, forgetUser, getItemsByTitle, getItemsByTag, synchronizationUserInfo, queryPayOrder, onYungouosHook, importProfilesToUsersClass, listUsersProfiles, listProfilesForEditor, saveMyUsersProfile, getMyUsersSubmissionStatus, assertSessionUserMatchesHeaders}
