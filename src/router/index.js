import { createRouter, createWebHistory } from 'vue-router'
import IndexLayout from '../views/IndexLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'IndexLayout',
      component: IndexLayout
    }
  ],
})

export default router
