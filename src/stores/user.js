import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({ token: '' })

  function setUserInfo(info) {
    userInfo.value = { ...userInfo.value, ...info }
  }

  function clearUserInfo() {
    userInfo.value = { token: '' }
  }

  return { userInfo, setUserInfo, clearUserInfo }
})
