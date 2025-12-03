import type { LoginParams, UserInfo } from '@/types/user'
import { defineStore } from 'pinia'

interface UserState {
  token: string
  userInfo: UserInfo | null
  roles: string[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: '',
    userInfo: null,
    roles: [],
  }),

  getters: {
    isLoggedIn: state => !!state.token,
    getUserRoles: state => state.roles,
    getHomePath: state => state.userInfo?.homePath || '/dashboard',
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.roles = userInfo.roles
    },

    async login(params: LoginParams) {
      try {
        // 这里调用实际的登录 API
        // const response = await loginApi(params)

        // Mock 登录逻辑
        const mockResponse = this.getMockLoginResponse(params.username)

        this.setToken(mockResponse.token)
        this.setUserInfo(mockResponse.userInfo)

        return mockResponse
      }
      catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      this.roles = []
    },

    // Mock 登录响应
    getMockLoginResponse(username: string) {
      const mockUsers = {
        admin: {
          token: 'mock-token-admin-12345',
          userInfo: {
            id: '1',
            username: 'admin',
            nickname: '超级管理员',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            email: 'admin@example.com',
            roles: ['admin'],
            homePath: '/dashboard',
          },
        },
        editor: {
          token: 'mock-token-editor-67890',
          userInfo: {
            id: '2',
            username: 'editor',
            nickname: '编辑人员',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
            email: 'editor@example.com',
            roles: ['editor'],
            homePath: '/content/list',
          },
        },
        guest: {
          token: 'mock-token-guest-11111',
          userInfo: {
            id: '3',
            username: 'guest',
            nickname: '访客',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
            email: 'guest@example.com',
            roles: ['guest'],
            homePath: '/readonly/home',
          },
        },
      }

      return mockUsers[username as keyof typeof mockUsers] || mockUsers.guest
    },
  },

  persist: true,
})
