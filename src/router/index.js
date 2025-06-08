import { createRouter, createWebHistory } from 'vue-router'
import ChatApp from '../components/ChatApp.vue'

const routes = [
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatApp
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 