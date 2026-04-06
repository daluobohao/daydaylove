<template>
    <div class="flex justify-between w-full py-4 px-4 lg:px-10 items-center fixed top-0 z-30">
      <a class="flex h-14 items-center" href="/">
          <img src="/logo.png" class="h-10 lg: lg:h-14"/>
          <span class="ml-2 text-xl font-bold hidden lg:block"></span>
      </a>
      <div class="hidden lg:flex space-x-10 items-center">
          <a href="/" class="hidden lg:block">主页</a>
          <a href="/editor" class="hidden lg:block" v-if="user.email">好友专区</a>
          <div class="flex items-center justify-end" v-if="user.email">
              <el-dropdown>
                  <div class="flex items-center">
                      <div class="ml-2">{{filterName(user.email)}}</div>
                      <el-icon class="el-icon--right">
                          <arrow-down />
                      </el-icon>
                  </div>
                  <template #dropdown class="w-full">
                      <el-dropdown-menu class="text-center">
                          <el-dropdown-item style="width: 140px;" class="justify-center" @click="logout">退出</el-dropdown-item>
                      </el-dropdown-menu>
                  </template>
              </el-dropdown>
          </div>
          <a href="/sign-in" class="hidden lg:block" v-if="!user.email">登录</a>
          <a href="/sign-up" class="hidden lg:block" v-if="!user.email">注册</a>
      </div>
      <button
        class="lg:hidden w-10 h-10 flex items-center justify-center rounded border border-black/10 bg-white/70"
        type="button"
        aria-label="打开菜单"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span class="text-xl leading-none">{{ mobileMenuOpen ? "×" : "☰" }}</span>
      </button>
    </div>
    <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-20 bg-black/25" @click="mobileMenuOpen = false"></div>
    <div v-if="mobileMenuOpen" class="lg:hidden fixed top-[72px] left-4 right-4 z-30 rounded-xl bg-white shadow-lg border border-black/5">
      <div class="py-2 px-3 flex flex-col">
        <a href="/" class="py-3 border-b border-black/5" @click="mobileMenuOpen = false">主页</a>
        <a v-if="user.email" href="/editor" class="py-3 border-b border-black/5" @click="mobileMenuOpen = false">好友专区</a>
        <a v-if="!user.email" href="/sign-in" class="py-3 border-b border-black/5" @click="mobileMenuOpen = false">登录</a>
        <a v-if="!user.email" href="/sign-up" class="py-3 border-b border-black/5" @click="mobileMenuOpen = false">注册</a>
        <button
          v-if="user.email"
          type="button"
          class="py-3 text-left text-cus-active"
          @click="logout"
        >
          退出
        </button>
      </div>
    </div>
  </template>
  <script setup lang="ts">
  import {
      ElDropdown,
      ElDropdownMenu,
      ElDropdownItem,
      ElIcon,
      ElAvatar
  } from "element-plus";
  import { ArrowDown } from '@element-plus/icons-vue'
  import { getCookie, clearLocal } from "~/assets/js/utils/tools"

  const user = ref({"email": ""})
  const mobileMenuOpen = ref(false)
  const initLocalUser = async () => {
      const res = getCookie("__user")
      console.log("res:", res)

      if (res) {
          const userObject = JSON.parse(decodeURIComponent(res))
          if (userObject) {
              user.value = userObject
          }
          // console.log($userObject)
          // $store.commit("user", user)
          useState("user", () => {
              return userObject
          })
      }
  }
  if (process.client) {
      initLocalUser()
  }

  const filterName = (email: string) => {
      return email.length > 8 ? email.substring(0, 8) + "..." : email

  }
  const logout = () => {
      clearLocal()
      mobileMenuOpen.value = false
      window.location.href = "/";
  }
  </script>
