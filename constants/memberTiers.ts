/**
 * 与 server/service/av.js 中 userMember 字符串保持一致（LeanCloud Membership.member）
 */
export const USER_MEMBER = {
    normal: '0xnab1',
    /** 普通付费（支付 attach m=1） */
    basic: '0xb4s1c2',
    /** VIP（支付 attach m=12）；历史「月费」订单也可能为此值 */
    v1: '0xn33b2',
    /** 历史年费档位；与 VIP 同为 10 条展示 */
    v2: 'fdf23f',
    /** SVIP（支付 attach m=666） */
    v3: 'v62223f',
} as const

export type UserMemberCode = (typeof USER_MEMBER)[keyof typeof USER_MEMBER]
