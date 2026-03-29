// yungouos开发配置
const YUNGOU = {
    mch_id: "1105317738", // 商户ID
    YUNGOUOS_KEY: "627B69BDB3E54120926F49604C01832B", // yungouos开发key
    // notify_url: "https://wang-hao-hao.cn/api/pay/yungou", // 回调通知地址
    notify_url: "https://howard-foster-affect-rock.trycloudflare.com/api/pay/yungou",
    api_url: "https://api.pay.yungouos.com/api/pay/wxpay/nativePay",
    default_name: "DayDayMoment会员"
}

// Leancloud开发配置
const AV_CONFIG = {
    appId: "QMZTwxUhNvjlYQUdgTGX3kYn-gzGzoHsz",
    appKey: "HbxUgVwm5CElQkW2G1UrAg3z",
    masterKey: "0ujVVWchgrRYTnQtu7JTNtMR",
    serverURL: "https://qmztwxuh.lc-cn-n1-shared.com"
}
export { AV_CONFIG, YUNGOU }
