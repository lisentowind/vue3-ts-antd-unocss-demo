<script setup lang="ts">
import type { LoginParams } from '@/types/user'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from '@/hooks'
import { useThemeStore } from '@/store'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { msgWarning, msgSuccess, msgError } = useMessage()

const loading = ref(false)
const formState = ref<LoginParams>({
  username: 'admin',
  password: '123456',
})

const accountList = [
  {
    username: 'admin',
    password: '123456',
    role: '超级管理员',
    desc: '可访问所有功能',
  },
  {
    username: 'editor',
    password: '123456',
    role: '编辑人员',
    desc: '可访问内容管理模块',
  },
  {
    username: 'guest',
    password: '123456',
    role: '访客',
    desc: '仅可访问只读模块',
  },
]

async function handleLogin() {
  try {
    loading.value = true

    if (!formState.value.username || !formState.value.password) {
      msgWarning({ content: '请输入用户名和密码' })
      return
    }

    await userStore.login(formState.value)

    msgSuccess({ content: '登录成功！正在跳转...' })

    // 获取重定向路径
    const redirect = route.query.redirect as string
    const path = redirect || userStore.getHomePath

    // 延迟跳转，让用户看到成功提示和过渡动画更自然
    setTimeout(() => {
      router.push(path)
    }, 600)
  }
  catch (error) {
    msgError({ content: '登录失败，请检查用户名和密码' })
    console.error('Login error:', error)
  }
  finally {
    loading.value = false
  }
}

const themeStore = useThemeStore()
function quickLogin(username: string) {
  formState.value.username = username
  formState.value.password = '123456'
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center from-primary-2 to-primary-6 bg-gradient-to-br"
  >
    <div class="mx-4 gap-8 grid max-w-5xl w-full md:grid-cols-2">
      <!-- 左侧：登录表单 -->
      <div class="p-8 rounded-lg bg-white shadow-2xl">
        <div class="mb-8 text-center">
          <div class="mb-4 flex justify-center">
            <CustomIcon
              icon="material-symbols:admin-panel-settings"
              :width="64"
              class="text-primary-8"
            />
          </div>
          <h1 class="text-3xl text-gray-800 font-bold">
            后台管理系统
          </h1>
          <p class="text-gray-500 mt-2">
            基于 Vue3 + TypeScript + Ant Design Vue
          </p>
        </div>

        <AForm :model="formState" @finish="handleLogin">
          <AFormItem>
            <AInput
              v-model:value="formState.username"
              size="large"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <CustomIcon
                  icon="material-symbols:person-outline"
                  :width="20"
                />
              </template>
            </AInput>
          </AFormItem>

          <AFormItem>
            <AInputPassword
              v-model:value="formState.password"
              size="large"
              placeholder="请输入密码"
            >
              <template #prefix>
                <CustomIcon icon="material-symbols:lock-outline" :width="20" />
              </template>
            </AInputPassword>
          </AFormItem>

          <AFormItem>
            <AButton
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </AButton>
          </AFormItem>
        </AForm>
      </div>

      <!-- 右侧：测试账户 -->
      <div
        v-glow-border="{
          color: themeStore.getPrimaryColor,
          radius: '15px',
        }"
        class="text-white p-8 rounded-lg shadow-2xl from-primary-2 to-primary-6 bg-gradient-to-rl backdrop-blur-md"
      >
        <h2 class="text-2xl font-bold mb-6">
          测试账户
        </h2>

        <div class="space-y-4">
          <div
            v-for="account in accountList"
            :key="account.username"
            class="p-4 rounded-lg bg-white/10 cursor-pointer transition-all hover:bg-white/20"
            @click="quickLogin(account.username)"
          >
            <div class="mb-2 flex items-center justify-between">
              <div class="text-lg font-semibold">
                {{ account.role }}
              </div>
              <ATag
                :color="
                  account.username === 'admin'
                    ? 'red'
                    : account.username === 'editor'
                      ? 'blue'
                      : 'green'
                "
              >
                {{ account.username }}
              </ATag>
            </div>
            <div class="text-sm mb-2 opacity-80">
              {{ account.desc }}
            </div>
            <div class="text-xs opacity-60">
              密码：{{ account.password }}
            </div>
          </div>
        </div>

        <div class="mt-8 p-4 rounded-lg bg-yellow-500/20">
          <div class="flex gap-2 items-start">
            <CustomIcon
              icon="material-symbols:info-outline"
              :width="20"
              class="mt-0.5"
            />
            <div class="text-sm">
              <div class="font-semibold mb-1">
                提示
              </div>
              <div class="opacity-80">
                点击上方账户卡片可快速填充登录信息
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
