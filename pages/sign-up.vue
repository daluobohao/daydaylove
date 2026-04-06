<template>
    <client-only>
       <div class="px-4">
           <Logo class=""/>
           <div class="max-w-lg m-auto">
               <div class="text-2xl my-10">注册账号</div>
               <el-form
                   ref="formRef"
                   :model="submitForm"
                   :rules="rules"
                   status-icon
                   class="w-full">
                       <el-form-item prop="email"
                           class="w-full">
                           <el-input placeholder="邮箱" v-model="submitForm.email" style="height:44px;"/>
                       </el-form-item>
                       <el-form-item prop="password"
                           class="w-full">
                           <el-input placeholder="请输入至少6位密码" v-model="submitForm.password" type="password" style="height:44px;"/>
                       </el-form-item>
                       <el-form-item prop="confirmPassword"
                           class="w-full">
                           <el-input placeholder="确认密码" v-model="submitForm.confirmPassword" type="password" style="height:44px;"/>
                       </el-form-item>
                   <div class="dialog-footer flex justify-center mt-4">
                       <el-button @click="signupUser" type="primary" class="w-full text-2xl" style="height:44px;font-size: 16px;transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);">注册</el-button>
                   </div>
               </el-form>
               <div class="my-4 text-gray-600 text-base text-left">
                   如果已有账号，可以直接<span class="underline text-cus-active text-base cursor-pointer ml-1 font-bold" @click="signin">登录</span>
               </div>
           </div>
       </div>
   </client-only>
   </template>
<script setup lang="ts">
import {
  ElButton,
  ElInput,
  ElForm,
  ElFormItem,
  ElMessage,
  type FormRules,
} from "element-plus";
import axios from 'axios'
import { setCookie, removeLocalEncrpt } from "~/assets/js/utils/tools"

const loadingFlag = ref(false)
const submitForm = reactive({email: "", password: "", confirmPassword: ""})

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入确认密码！'))
  } else if (value !== submitForm.password) {
    callback(new Error("两次密码不一致!"))
  } else {
    callback()
  }
}
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
  ],
  password: [
    {
      required: true,
      min: 6,
      max: 20,
      message: '请输入至少6位的密码',
      trigger: ['blur', 'change'],
    },
  ],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
})

const signupUser = () => {
    if (submitForm.email.trim() == '' || submitForm.password.trim() == '' || submitForm.password.trim() == '') {
        return false
    }
    if (submitForm.password != submitForm.confirmPassword) {
        ElMessage({
            message: '密码不一致！',
            type: 'error',
        })
        return false
    }
    let data = {
        email: submitForm.email.trim(),
        password: submitForm.password.trim()
    }
    loadingFlag.value = true
    axios.post(`/api/user/sign-up`, data).then(async (response) => {
        if (response && response.data) {
            let res = response.data
            if (res.code) {
                ElMessage({
                    message: res.message,
                    type: 'error',
                })
                loadingFlag.value = false
            } else if (res.userId) {
                removeLocalEncrpt('__r')
                setCookie("__user", encodeURIComponent(JSON.stringify(res)), 365)

                loadingFlag.value = false
                ElMessage({
                    message: '恭喜你，注册成功！',
                    type: 'success',
                })
                setTimeout(() => {
                    window.location.href = "/editor"
                }, 2000)
            }
        }
    }).catch((err) => {
        ElMessage({
            message: err,
            type: 'error',
        })
    })
}
const signin = () => {
    window.location.href = "/sign-in"
}

</script>
