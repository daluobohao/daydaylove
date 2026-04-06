<script setup lang="ts">
import {
  ElDialog,
  ElMessage,
} from "element-plus";
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import QrcodeVue from 'qrcode.vue'
import eventBus from '~/assets/js/lib/eventBus'
import { uuid, synchronizationUserState, getLocalEncrpt } from "~/assets/js/utils/tools"
import { USER_MEMBER } from '~/constants/memberTiers'
import type { SessionUser } from '~/types/sessionUser'

import axios from 'axios'

type MemberDialogParams = {
  flag?: boolean
  member?: string
  verify?: boolean
}

const props = defineProps<{
  memberParams?: MemberDialogParams
}>()
const emit = defineEmits(["memberListen"]);
const user = useState<SessionUser>("user")

const memberDialogShowFlag = ref(false)
const active = ref(1)
const vipPayQrcode = ref(1)
const intervalNum = ref(100)
const codeDataStr = ref("")
const lastPaidProduct = ref<number | null>(null)
const isMobile = ref(false)
let qrcodeObjTmp: Record<number, { r: string; code: string }> = {}
let intervalTimer: ReturnType<typeof setInterval> | null = null
let mediaQuery: MediaQueryList | null = null

const visiblePlanIds = computed(() => {
    const p = props.memberParams
    if (!p) return [1, 12, 666]
    const v = !!p.verify
    const m = p.member
    if (!v) return [1, 12, 666]
    if (m === USER_MEMBER.basic) return [12, 666]
    if (m === USER_MEMBER.v1 || m === USER_MEMBER.v2) return [666]
    if (m === USER_MEMBER.v3) return []
    return [12, 666]
})

const dialogTitle = computed(() =>
    props.memberParams?.verify ? '升级会员' : '加入会员'
)
const dialogWidth = computed(() => (isMobile.value ? '94%' : '60%'))
const qrcodeSize = computed(() => (isMobile.value ? 220 : 120))

const successTitle = computed(() => {
    const t = lastPaidProduct.value
    if (t === 1) return '🎉 你已是普通会员'
    if (t === 12) return '🎉 恭喜成功办理 VIP 会员'
    if (t === 666) return '🎉 你已成功办理 SVIP 会员'
    return '🎉 支付成功'
})

const cancelDialog = () => {
    clearOrderInterval()
    emit('memberListen', {type: "cancel"});
}
const refreshState = async () => {
    // 先通知编辑器进入「资料加载中」，避免会员态已更新而列表仍是旧数据造成 tip / 列表不同步
    eventBus.emit('editor-profiles-reloading')
    await synchronizationUserState(true)
    const raw = getLocalEncrpt("__r")
    if (raw) {
        const obj = JSON.parse(decodeURIComponent(raw))
        eventBus.emit('member', obj)
    }
}
const paySuccess = () => {
    lastPaidProduct.value = vipPayQrcode.value
    active.value = 3
    setTimeout(() => {
        refreshState()
    }, 3000)
}
const orderState= () => {
    if (user.value.userId) {
        let qrId = getUuidFrom('r')
        axios.post(`/api/pay/state`, {
            user_id: user.value.userId,
            qr_id: qrId
        }, {headers: {
            'x-ui': user.value.userId,
            'x-ut': user.value.token
        }}).then((response) => {
            let res = response.data
            if (res && res.member) {
                paySuccess()
                clearOrderInterval()
            }
        }).catch((error) => {
            ElMessage({
                message: error,
                type: 'error',
            })
            clearOrderInterval()
        })
    }
}
const orderInterval = () => {
    clearOrderInterval()
    intervalNum.value = 100
    intervalTimer = setInterval(() => {
        if (intervalNum.value < 1) {
            clearOrderInterval()
        } else {
            intervalNum.value--
        }
        if (intervalNum.value%3 == 0) {
            orderState()
        }
    }, 1000)
}
const clearOrderInterval = () => {
    if (intervalTimer) {
        clearInterval(intervalTimer)
    }
    intervalNum.value = 0
}
const generateCodeStr = async () => {
    const type = vipPayQrcode.value
    if (qrcodeObjTmp[type]) {
        codeDataStr.value = qrcodeObjTmp[type].code
        return
    }
    const payProduct: Record<number, string> = { 1: '普通会员', 12: 'VIP会员', 666: 'SVIP会员' }
    const fees: Record<number, number> = { 1: 15.8, 12: 60, 666: 298 }
    let r = uuid()
    let d = type
    let userId = user.value && user.value.userId

    let name = payProduct[type]
    let fee = fees[type]
    let submitURL = `/api/pay/qrcode`
    let attach = `${userId},${r},${d}`
    let submitParams = {
        attach,
        name,
        fee
    }
    const result = await axios.post(submitURL, submitParams);
    if (result && result.data && result.data) {
        codeDataStr.value = result.data.data
        qrcodeObjTmp[type] = {
            r,
            code: codeDataStr.value
        }
    }
}

const getUuidFrom = (name: 'r') => {
    const type = vipPayQrcode.value
    const entry = qrcodeObjTmp[type]
    if (!entry || name !== 'r') return ''
    return entry.r || ''
}
const beginInterval = () => {
    generateCodeStr()
    orderInterval()
}

const priceSelect = (mon: number) => {
    vipPayQrcode.value = mon
    beginInterval()
}

watch(
    () => props.memberParams?.flag,
    async (open) => {
        if (open) {
            active.value = 1
            lastPaidProduct.value = null
            qrcodeObjTmp = {}
            clearOrderInterval()
            const ids = visiblePlanIds.value
            if (!ids.length) {
                memberDialogShowFlag.value = false
                return
            }
            vipPayQrcode.value = ids[0]!
            memberDialogShowFlag.value = true
            await nextTick()
            beginInterval()
        } else {
            memberDialogShowFlag.value = false
            clearOrderInterval()
        }
    }
)

const syncMobileState = () => {
    if (!import.meta.client) return
    isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
    if (!import.meta.client) return
    mediaQuery = window.matchMedia('(max-width: 768px)')
    syncMobileState()
    mediaQuery.addEventListener('change', syncMobileState)
    window.addEventListener('resize', syncMobileState)
})

onBeforeUnmount(() => {
    if (!import.meta.client) return
    mediaQuery?.removeEventListener('change', syncMobileState)
    window.removeEventListener('resize', syncMobileState)
})

</script>

<template>
    <div>
        <el-dialog
            :title="dialogTitle"
            v-model="memberDialogShowFlag"
            :width="dialogWidth"
            :fullscreen="isMobile"
            v-on:close="cancelDialog"
            center>
            <div class="flex flex-wrap">
                <div class="w-full" v-if="active == 1">
                    <div class="vip-dialog-layout">
                        <div class="vip-fuc w-full lg:w-1/3">
                            <ul class="vip-fuc-ul">
                                <li class="vip-fuc-li">
                                    <s></s>
                                    <span>限时优惠(如下信息性别不限，女性较多)</span>
                                </li>
                                <li class="vip-fuc-li">
                                    <s></s>
                                    <span>普通会员: 2条信息</span>
                                </li>
                                <li class="vip-fuc-li">
                                    <s></s>
                                    <span>vip会员: 8条信息</span>
                                </li>
                                <li class="vip-fuc-li">
                                    <s></s>
                                    <span>SVIP会员: 40条信息</span>
                                </li>
                            </ul>
                        </div>
                        <div class="w-full lg:w-2/3 px-0 lg:px-8">
                            <div
                                class="vip-pay-time flex flex-wrap w-full mt-4 gap-4 lg:gap-4"
                                :class="visiblePlanIds.length < 3 ? 'justify-center' : 'justify-between'">
                                <div
                                    v-if="visiblePlanIds.includes(1)"
                                    class="vip-pay-time-item" v-bind:class="{ 'vip-pay-time-item-active': vipPayQrcode === 1 }" @click="priceSelect(1)">
                                    <div>普通会员</div>
                                    <div>15.8元 <span class="vip-pay-time-item-old">19.8元</span></div>
                                    <div class="absolute right-0 bottom-0" v-if="vipPayQrcode === 1">
                                        <svg t="1676781023946" class="icon" viewBox="0 0 1321 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6720" width="16" height="16"><path d="M15.240657 514.844738L401.455434 1002.752502c20.335644 20.335644 60.977394 30.496081 81.313038 10.160437l10.160438-10.160437L1306.000217 87.988209c20.335644-20.335644 20.335644-50.816957 0-71.1526-10.160438-20.320875-40.641751-20.320875-60.977395-10.160438l-802.910869 680.95608L116.87457 413.210825a92.344792 92.344792 0 0 0-101.633913 0c-20.320875 40.656519-20.320875 71.182136 0 101.633913z" fill="#EB455F" p-id="6721"></path></svg>
                                    </div>
                                </div>
                                <div
                                    v-if="visiblePlanIds.includes(12)"
                                    class="vip-pay-time-item" v-bind:class="{ 'vip-pay-time-item-active': vipPayQrcode === 12 }" @click="priceSelect(12)">
                                    <div>VIP会员</div>
                                    <div>60元 <span class="vip-pay-time-item-old">120元</span></div>
                                    <div class="vip-pay-time-best">最多人选择</div>
                                    <div class="absolute right-0 bottom-0" v-if="vipPayQrcode === 12">
                                        <svg t="1676781023946" class="icon" viewBox="0 0 1321 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6720" width="16" height="16"><path d="M15.240657 514.844738L401.455434 1002.752502c20.335644 20.335644 60.977394 30.496081 81.313038 10.160437l10.160438-10.160437L1306.000217 87.988209c20.335644-20.335644 20.335644-50.816957 0-71.1526-10.160438-20.320875-40.641751-20.320875-60.977395-10.160438l-802.910869 680.95608L116.87457 413.210825a92.344792 92.344792 0 0 0-101.633913 0c-20.320875 40.656519-20.320875 71.182136 0 101.633913z" fill="#EB455F" p-id="6721"></path></svg>
                                    </div>
                                </div>
                                <div
                                    v-if="visiblePlanIds.includes(666)"
                                    class="vip-pay-time-item" v-bind:class="{ 'vip-pay-time-item-active': vipPayQrcode === 666 }" @click="priceSelect(666)">
                                    <div>SVIP会员</div>
                                    <div>298元 <span class="vip-pay-time-item-old">999元</span></div>
                                    <div class="vip-pay-time-best">限量</div>
                                    <div class="absolute right-0 bottom-0" v-if="vipPayQrcode === 666">
                                        <svg t="1676781023946" class="icon" viewBox="0 0 1321 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6720" width="16" height="16"><path d="M15.240657 514.844738L401.455434 1002.752502c20.335644 20.335644 60.977394 30.496081 81.313038 10.160437l10.160438-10.160437L1306.000217 87.988209c20.335644-20.335644 20.335644-50.816957 0-71.1526-10.160438-20.320875-40.641751-20.320875-60.977395-10.160438l-802.910869 680.95608L116.87457 413.210825a92.344792 92.344792 0 0 0-101.633913 0c-20.320875 40.656519-20.320875 71.182136 0 101.633913z" fill="#EB455F" p-id="6721"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div class="vip-pay-qrcode w-full flex flex-col justify-center">
                                <div class="vip-pay-qrcode-item relative">
                                    <div class="m-auto relative vip-qrcode-box">
                                        <qrcode-vue :value="codeDataStr" :size="qrcodeSize" level="H" />
                                         <!-- <img src="/shoukuan.jpeg" width="120" height="120" alt=""> -->
                                        <div class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center cursor-pointer" v-if="intervalNum < 1" @click="beginInterval">
                                            <svg t="1629213204626" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2590" width="32" height="32"><path d="M981.448462 133.180788a35.367512 35.367512 0 0 0-35.367512 35.367512v85.103076a505.092283 505.092283 0 0 0-939.449541 221.046951 35.367512 35.367512 0 0 0 32.604425 38.130599 35.367512 35.367512 0 0 0 35.367512-32.604425 434.357258 434.357258 0 0 1 819.53157-165.785213h-93.944954a35.367512 35.367512 0 1 0 0 71.287641h181.2585a35.367512 35.367512 0 0 0 35.367512-35.367512V168.5483a35.367512 35.367512 0 0 0-35.367512-35.367512z m0 379.095521a35.367512 35.367512 0 0 0-38.130599 32.604425 434.357258 434.357258 0 0 1-819.531571 165.785213h100.023746a35.367512 35.367512 0 1 0 0-71.287642H42.551538a35.367512 35.367512 0 0 0-35.367512 35.367513v181.258499a35.367512 35.367512 0 1 0 71.287642 0v-85.655693a505.092283 505.092283 0 0 0 939.449541-221.046951 35.367512 35.367512 0 0 0-34.814895-37.025364z" fill="#ffffff" p-id="2591"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="isMobile" class="text-center mt-3 text-sm text-gray-600">
                                    请先截图保存二维码，再发送到微信中长按识别完成支付
                                </div>
                                <div class="text-center mt-6">
                                    <span v-if="intervalNum > 0 && !isMobile">微信直接扫码付款，付款倒计时：<span class="font-bold">{{intervalNum}}</span> 秒</span>
                                    <span v-if="intervalNum > 0 && isMobile">请截图后发送到微信中长按识别，付款倒计时：<span class="font-bold">{{intervalNum}}</span> 秒</span>
                                    <span v-else>点击可重新生成付款二维码</span>
                                </div>
                            </div>
                            <div class="w-full text-center mt-2 text-gray-400">
                                付款如有问题，请联系客服微信 tiankongfei12345
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full" v-if="active == 3">
                    <div class="w-full flex flex-col justify-center">
                        <div class="m-auto">
                            <lottie-player
                            autoplay
                            style="width:400px"
                            src="/lottie/success.json"
                            speed="1"
                            />
                        </div>
                        <div class="vip-service-con-title text-center text-xl mt-4 mb-6">{{ successTitle }}</div>
                        <div class="vip-service-con text-center">使用中如果有问题，可以加微信: tiankongfei12345 处理，请备注【DayDayLove会员】，再次感谢信任和支持！</div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<style>
.vip-dialog-layout {
    display: flex;
}
.vip-fuc {
    width: 40%;
    border-right: 1px #cacaca solid;
}
.vip-fuc-ul {
    padding-left: 10px;
}
.vip-fuc-li {
    list-style: none;
    text-align: left;
    font-size: 14px;
    line-height: 32px;
    letter-spacing: 1px;
    color: black;
}
.vip-fuc-li s {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #EB455F;
    border-radius: 50%;
    margin-right: 10px;
}
.vip-pay {
    padding-left: 15px;
}
.vip-pay-time {
    display: flex;
    justify-content: center;
}
.vip-pay-time-item {
    width: 160px;
    border-radius: 4px;
    border: 1px solid #cacaca;
    line-height: 22px;
    text-align: center;
    color: #999999;
    padding: 4px 10px;
    cursor: pointer;
    position: relative;
}
.vip-pay-time-item:hover {
    color: gray;
    border: 1px gray solid;
}
.vip-pay-time-item-active {
    border: 1px solid #EB455F;
    color: black;
    font-weight: normal;
}
.vip-pay-time-item-active:hover {
    color: black;
    border: 1px solid #EB455F;
}
.vip-pay-qrcode-item {
    margin-top:30px;
    display: flex;
    text-align: center;
    justify-content: center;
}
.vip-pay-time-item-old {
    color: #9A9A9A;
    text-decoration: line-through;
    font-size: 10px;

}
.vip-pay-time-best {
    position: absolute;
    top: -30px;
    right: 14px;
    background-color: #EB455F;
    color: white;
    font-size: 12px;
    border-radius: 4px;
    padding: 0px 5px;
}
.vip-pay-time-tip {
    position: absolute;
    top: 103%;
    width: 100%;
    text-align: center;
    left: -5px;
    font-size: 12px;
    border-radius: 4px;
    padding: 0px 5px;

}
.vip-pay-qrcode {
    margin-top: 20px;
}
.vip-qrcode-box {
    width: 120px;
}
.vip-pay-qrcode-money {
    margin-bottom: 6px;
}
.vip-pay-qrcode-money-time {
    color: darkgray;
    font-size: 12px;
}
.vip-pay-qrcode-money-number {
    color: #24be48;
    font-size: 16px;
    font-weight: bold;
}
.vip-pay-qrcode-img {
    width: 210px;
}
.vip-pay-qrcode-sub {
    font-size: 12px;
    margin-bottom:6px;
}
.vip-pay-notice {
    margin-bottom: 10px;
    text-align: center;
}
.vip-pay-ok {
    width: 100%;
    height: 40px;
    background: #1fc05c;
    border-radius: 4px;
    line-height: 40px;
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;
}

@media (max-width: 768px) {
    .vip-dialog-layout {
        display: block;
    }
    .vip-fuc {
        width: 100%;
        border-right: none;
        border-bottom: 1px #eaeaea solid;
        padding-bottom: 8px;
    }
    .vip-pay-time {
        margin-top: 10px;
        gap: 10px;
    }
    .vip-pay-time-item {
        width: calc(50% - 6px);
        min-width: 132px;
    }
    .vip-pay-time-best {
        top: -22px;
        right: 8px;
        font-size: 10px;
    }
    .vip-qrcode-box {
        width: 220px;
    }
    .vip-pay-qrcode-item {
        margin-top: 18px;
    }
}
</style>
