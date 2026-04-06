<template>
<client-only>
 <div class="px-4">
    <Logo class=""/>
    <div class="max-w-lg m-auto">
        <div class="text-2xl my-10">重置密码</div>
        <el-form
            ref="formRef"
            :model="submitForm"
            :rules="rules"
            status-icon
            class="w-full">
                <el-form-item prop="email"
                    class="w-full">
                    <el-input placeholder="注册的邮箱" v-model="submitForm.email" style="height:44px;"/>
                </el-form-item>
                <div class="dialog-footer flex justify-center mt-4">
                    <el-button @click="forgetUser" type="primary" class="w-full text-2xl transition-light" style="height:44px;font-size: 16px;">确认</el-button>
                </div>
                <div class="text-sm text-gray-400 mt-4">会发送重置密码链接至你注册时的邮箱</div>
        </el-form>
        <div class="my-4 text-gray-600 text-base text-center flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <div>
                返回<span class="underline text-cus-active text-base cursor-pointer ml-1 font-bold" @click="signin">登录</span>
            </div>
        </div>
    </div>
 </div>
</client-only>
</template>

<script setup lang="ts">
import {
  ElIcon,
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElMessage,
} from "element-plus";
import type { FormRules } from "element-plus";
import axios from 'axios'

const loadingFlag = ref(false)
const submitForm = reactive({email: ""})

const rules = reactive<FormRules>({
    email: [
        {
            required: true,
            message: '请填写邮箱地址',
            trigger: 'blur',
        }, {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
        },
    ]
})

const forgetUser = () => {
    if (submitForm.email == '') {
        return false
    }
    if (loadingFlag.value) {
        return false
    }
    let data = {
        email: submitForm.email
    }
    loadingFlag.value = true
    axios.post(`/api/user/forget`, data).then(async (response) => {
        console.log("--", response)
        if (response && response.data && response.data.code) {
            ElMessage({
                message: response.data.message,
                type: 'error',
            })
        } else if (response && response.data) {
            ElMessage({
                message: '重置密码链接已经发送至邮箱，请及时查收！',
                type: 'success',
            })
        }
    }).catch(error => {
        ElMessage({message: "出错了！", type: 'error'})
    }).finally(() => {
        loadingFlag.value = false
    })
}
const signin = () => {
    window.location.href = "/sign-in"
}

</script>
