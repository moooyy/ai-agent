import { createRouter, createWebHistory } from 'vue-router'
import ChatApp from '../components/ChatApp.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/app/:app_key',
    name: 'App',
    component: ChatApp
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 