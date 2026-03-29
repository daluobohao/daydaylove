<template>
    <div class="flex w-full h-screen min-h-0 overflow-hidden">
        <client-only>
            <div class="w-24 flex-shrink-0 min-h-0 self-stretch">
                <EditorTemplate></EditorTemplate>
            </div>
            <div class="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
                <EditorView v-if="editorMainTab === 'view'" />
                <EditorEntry v-else />
            </div>
        </client-only>
    </div>
</template>
<script setup lang="ts">
import eventBus from '~/assets/js/lib/eventBus'
import { getCookie, synchronizationUserState, getLocalEncrpt } from "~/assets/js/utils/tools"

type MemberSnapshot = {
    verify?: boolean
    expirationAt?: string | number
    token?: string
    timeAt?: string | Date
    member?: string
} | null

const user = ref({"email": ""})
/** 与 `EditorTemplate` 共用：右侧主区显示「查看」或「录入」 */
const editorMainTab = useState<'view' | 'entry'>('editorMainTab', () => 'view')
/** 与全站 `useState('member')` 共用；勿用本地 ref，否则子组件读不到同步结果 */
const memberShared = useState<MemberSnapshot>("member", () => null)

const initLocalUser = async () => {
    const res = getCookie("__user")
    if (res) {
        const userObject = JSON.parse(decodeURIComponent(res))
        if (userObject) {
            user.value = userObject
        }
        useState("user", () => {
            return userObject
        })
    }
    refreshState()
}
const applyMemberFromStorage = () => {
    const raw = getLocalEncrpt("__r")
    if (!raw) {
        memberShared.value = null
        return
    }
    try {
        memberShared.value = JSON.parse(decodeURIComponent(raw))
    } catch {
        memberShared.value = null
    }
}
const refreshState = async () => {
    await synchronizationUserState()
    // `useState` 初始化函数只在首次创建时执行；子组件已先 `useState('member')` 时必须写 `.value`
    applyMemberFromStorage()
}
eventBus.on('member', (obj) => {
    memberShared.value = obj as MemberSnapshot
})
if (process.client) {
    initLocalUser()
}
</script>
