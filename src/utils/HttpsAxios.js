import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const http = axios.create({
  baseURL: 'https://111.229.161.57',
  timeout: 8000
})

http.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    const token = userStore.userInfo?.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

http.interceptors.response.use(
  response => response.data,
  error => {
    const msg = error?.response?.data?.message || error.message || '网络请求错误'
    ElMessage({ type: 'warning', message: msg })
    if (error?.response?.status === 401) {
      const userStore = useUserStore()
      userStore.clearUserInfo?.()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default http
