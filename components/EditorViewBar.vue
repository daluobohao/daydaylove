<style scoped>
.view-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-bottom: 1px solid #f0f0f0;
    background: white;
}
.bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
}
.bar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>

<template>
    <div class="view-bar">
        <div class="bar-left">
            <span class="text-sm font-medium text-gray-800">好友专区</span>
            <div class="hidden lg:flex items-center rounded border border-gray-200 overflow-hidden">
                <button
                    type="button"
                    class="px-3 py-1.5 text-xs"
                    :class="editorMainTab === 'view' ? 'bg-cus-lightActive text-cus-active font-medium' : 'text-gray-600'"
                    @click="editorMainTab = 'view'"
                >
                    查看
                </button>
                <button
                    type="button"
                    class="px-3 py-1.5 text-xs border-l border-gray-200"
                    :class="editorMainTab === 'entry' ? 'bg-cus-lightActive text-cus-active font-medium' : 'text-gray-600'"
                    @click="editorMainTab = 'entry'"
                >
                    录入
                </button>
            </div>
        </div>
        <div class="bar-right">
            <el-button v-if="!memberVerify" type="danger" size="small" @click="upgradeMembership">
                会员
            </el-button>
            <el-button v-if="memberVerify && !isSvip" type="danger" size="small" plain @click="upgradeMembership">
                升级会员
            </el-button>
            <el-dropdown @command="handleCommand">
                <span class="flex items-center text-sm cursor-pointer">
                    <span>{{ filterName(user?.email) }}</span>
                    <span v-if="memberVerify" class="ml-1">
                        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M493.2 958.1c-6 0-11.7-2.8-15.4-7.6L32.6 370.4c-5.4-7-5.4-16.7 0-23.7L255.2 58.4c3.7-4.8 9.4-7.6 15.4-7.6h445.2c6 0 11.7 2.8 15.4 7.6l222.6 288.2c5.4 7 5.4 16.7 0 23.7L508.6 950.5c-3.6 4.8-9.3 7.6-15.4 7.6zM72.6 358.6l420.6 548.1 420.6-548.1L706.2 89.8h-426L72.6 358.6z" fill="#EB455F"/><path d="M919.6 382H66.8c-10.7 0-19.5-8.7-19.5-19.4 0-10.8 8.7-19.5 19.5-19.5h852.9c10.8 0 19.5 8.7 19.5 19.5-0.1 10.7-8.8 19.4-19.6 19.4z" fill="#EB455F"/><path d="M492.5 382c-0.1 0-0.1 0 0 0-6.1 0-11.8-2.9-15.5-7.7L255.1 82.1c-6.5-8.6-4.8-20.8 3.7-27.3 8.6-6.5 20.8-4.8 27.3 3.7l206.4 271.9L700.3 58.5c6.5-8.5 18.8-10.1 27.3-3.6 8.6 6.5 10.2 18.7 3.6 27.3L507.9 374.3c-3.7 4.9-9.4 7.7-15.4 7.7z" fill="#EB455F"/></svg>
                    </span>
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="quit" :icon="SwitchButton">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <Membership :memberParams="membershipPayload" v-on:memberListen="memberListen"></Membership>
</template>

<script setup lang="ts">
import {
    ElButton, ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem,
} from 'element-plus'
import { ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import { clearLocal } from '~/assets/js/utils/tools'
import { USER_MEMBER } from '~/constants/memberTiers'
import type { SessionUser } from '~/types/sessionUser'
import eventBus from '~/assets/js/lib/eventBus'

type EditorMainTab = 'view' | 'entry'

const user = useState<SessionUser>('user')
const editorMainTab = useState<EditorMainTab>('editorMainTab', () => 'view')

const memberDialogParams = ref({ flag: false })
const member = useState<{ member?: string; verify?: boolean } | null>('member', () => null)
const membershipPayload = computed(() => ({
    flag: memberDialogParams.value.flag,
    member: member.value?.member,
    verify: !!(member.value && member.value.verify),
}))
const isSvip = computed(() => member.value?.member === USER_MEMBER.v3)

const memberVerify = computed(() => member.value && member.value.verify)
const upgradeMembership = () => {
    memberDialogParams.value.flag = true
}
const memberListen = (params: { type: string }) => {
    if (params.type === 'login' || params.type === 'cancel') {
        memberDialogParams.value.flag = false
    }
}

const filterName = (name: string | undefined) => {
    if (!name) return ''
    return name.split('@')[0] ?? ''
}

const handleCommand = (command: string | number | object) => {
    if (command === 'quit') {
        clearLocal()
        window.location.href = '/'
    }
}

const openMembershipDialog = () => {
    memberDialogParams.value.flag = true
}

onMounted(() => {
    eventBus.on('open-membership', openMembershipDialog)
})

onBeforeUnmount(() => {
    eventBus.off('open-membership', openMembershipDialog)
})
</script>
