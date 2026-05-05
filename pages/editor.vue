<template>
    <div class="flex w-full h-screen min-h-0 overflow-hidden pb-14 lg:pb-0">
        <client-only>
            <div class="hidden lg:block w-24 flex-shrink-0 min-h-0 self-stretch">
                <EditorTemplate></EditorTemplate>
            </div>
            <div class="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
                <EditorView v-if="editorMainTab === 'view'" />
                <EditorEntry v-else />
            </div>
            <div class="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-white z-20">
                <div class="grid grid-cols-2">
                    <button
                        type="button"
                        class="py-3 text-sm"
                        :class="editorMainTab === 'entry' ? 'text-cus-active font-medium bg-cus-lightActive' : 'text-gray-600'"
                        @click="editorMainTab = 'entry'"
                    >
                        录入
                    </button>
                    <button
                        type="button"
                        class="py-3 text-sm"
                        :class="editorMainTab === 'view' ? 'text-cus-active font-medium bg-cus-lightActive' : 'text-gray-600'"
                        @click="editorMainTab = 'view'"
                    >
                        查看
                    </button>
                </div>
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
const editorMainTab = useState<'view' | 'entry'>('editorMainTab', () => 'view')
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
    applyMemberFromStorage()
}
eventBus.on('member', (obj) => {
    memberShared.value = obj as MemberSnapshot
})
if (process.client) {
    initLocalUser()
}
</script>
