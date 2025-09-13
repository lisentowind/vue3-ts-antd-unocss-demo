import { defineStore } from 'pinia'

export interface AppState {
  name: string

}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    name: 'app',
  }),
  getters: {
    getAppName(state) {
      return state.name
    },
  },
  actions: {
    setAppName(name: AppState['name']) {
      this.name = name
    },
  },
})
