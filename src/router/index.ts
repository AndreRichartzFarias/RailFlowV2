import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AlertView from '../views/AlertsBoardView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/alert',
      name: 'alert',
      component: AlertView,
    },
    {
      path:'/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

export default router
