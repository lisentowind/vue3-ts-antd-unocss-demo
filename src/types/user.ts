export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  roles: string[]
  homePath: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}
