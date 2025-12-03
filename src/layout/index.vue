<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { computed, h, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomIcon from '@/components/CustomIcon/CustomIcon.vue'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 生成菜单
const menuItems = computed<MenuProps['items']>(() => {
  return permissionStore.routes
    .filter(route => !route.meta?.hidden)
    .map((route) => {
      if (route.children && route.children.length > 0) {
        // 有子菜单
        const visibleChildren = route.children.filter(
          child => !child.meta?.hidden,
        )

        // 如果只有一个子菜单，直接显示子菜单，不显示父级
        if (visibleChildren.length === 1) {
          const child = visibleChildren[0]
          const childPath = child.path?.startsWith('/')
            ? child.path
            : `${route.path === '/' ? '' : route.path}/${child.path}`

          return {
            key: childPath,
            label: child.meta?.title,
            icon: child.meta?.icon
              ? () =>
                  h(CustomIcon, {
                    icon: String(child.meta?.icon) || '',
                    width: 18,
                  })
              : undefined,
          }
        }

        // 多个子菜单，显示父子结构
        return {
          key: route.path,
          label: route.meta?.title,
          icon: route.meta?.icon
            ? () =>
                h(CustomIcon, {
                  icon: String(route.meta?.icon) || '',
                  width: 18,
                })
            : undefined,
          children: visibleChildren.map(child => ({
            key: child.path?.startsWith('/')
              ? child.path
              : `${route.path === '/' ? '' : route.path}/${child.path}`,
            label: child.meta?.title,
            icon: child.meta?.icon
              ? () =>
                  h(CustomIcon, {
                    icon: String(child.meta?.icon) || '',
                    width: 18,
                  })
              : undefined,
          })),
        }
      }
      else {
        // 无子菜单
        return {
          key: route.path,
          label: route.meta?.title,
          icon: route.meta?.icon
            ? () =>
                h(CustomIcon, {
                  icon: String(route.meta?.icon) || '',
                  width: 18,
                })
            : undefined,
        }
      }
    })
})

// 根据当前路由更新选中和展开的菜单
function updateMenuState() {
  const currentPath = route.path
  selectedKeys.value = [currentPath]

  // 找到当前路由所属的顶级菜单，自动展开
  const matchedRoute = permissionStore.routes.find((r) => {
    if (r.path === currentPath)
      return true
    if (r.children) {
      return r.children.some((child) => {
        const childPath = child.path?.startsWith('/')
          ? child.path
          : `${r.path === '/' ? '' : r.path}/${child.path}`
        return childPath === currentPath
      })
    }
    return false
  })

  if (
    matchedRoute
    && matchedRoute.children
    && matchedRoute.children.length > 1
  ) {
    openKeys.value = [matchedRoute.path]
  }
}

// 监听路由变化
watch(() => route.path, updateMenuState, { immediate: true })

// 菜单点击
function handleMenuClick({ key }: MenuInfo) {
  router.push(key as string)
}

// 退出登录
function handleLogout() {
  userStore.logout()
  permissionStore.resetRoutes()
  // 使用强制刷新来清除所有动态路由
  window.location.href = '/login'
}
</script>

<template>
  <ALayout class="min-h-screen" theme="light">
    <ALayoutSider v-model:collapsed="collapsed" collapsible theme="light">
      <div
        class="logo text-xl text-textBaseColor font-bold flex h-16 items-center justify-center"
      >
        <template v-if="!collapsed">
          后台管理系统
        </template>
        <template v-else>
          <CustomIcon icon="material-symbols:dashboard" :width="24" />
        </template>
      </div>
      <AMenu
        v-model:selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </ALayoutSider>

    <ALayout>
      <ALayoutHeader
        theme="light"
        class="px-6 flex shadow items-center justify-between bg-bgPrimary!"
      >
        <div class="text-lg text-textBaseColor font-semibold">
          {{ router.currentRoute.value.meta?.title || '首页' }}
        </div>

        <ADropdown>
          <div class="px-3 py-2 rounded flex gap-3 cursor-pointer items-center">
            <AAvatar :src="userStore.userInfo?.avatar" />
            <span class="text-textBaseColor">{{ userStore.userInfo?.nickname }}</span>
          </div>
          <template #overlay>
            <AMenu
              @click="(info: MenuInfo) => info.key === 'profile' ? router.push('/user/profile') : null"
            >
              <AMenuItem key="profile">
                <div class="flex gap-2 items-center">
                  <CustomIcon icon="material-symbols:person-outline" />
                  <span>个人中心</span>
                </div>
              </AMenuItem>
              <AMenuDivider />
              <AMenuItem key="logout" @click="handleLogout">
                <div class="flex gap-2 items-center">
                  <CustomIcon icon="material-symbols:logout" />
                  <span>退出登录</span>
                </div>
              </AMenuItem>
            </AMenu>
          </template>
        </ADropdown>
      </ALayoutHeader>

      <ALayoutContent>
        <div class="p-6 min-h-[calc(100vh-160px)]">
          <router-view>
            <template #default="{ Component }">
              <transition mode="out-in" name="smooth-fade">
                <component :is="Component" />
              </transition>
            </template>
          </router-view>
        </div>
      </ALayoutContent>

      <ALayoutFooter class="text-center">
        后台管理系统 ©tingfeng-{{ new Date().getFullYear() }}
      </ALayoutFooter>
    </ALayout>
  </ALayout>
</template>

<style scoped>
.logo {
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
  border-radius: 4px;
}
</style>
