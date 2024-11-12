import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
      authToken: useLocalStorage('authToken',''),
      user: useLocalStorage('user', {}),
    }),


    actions: {
      setAuthToken (authToken) {
        this.authToken = authToken
      },
      setUser (user) {
        this.user = user
      }
    },


    getters: {
      getAuthToken : (state) => state.authToken,
      getUser : (state) => state.user
    }
  })