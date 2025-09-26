import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AlertView from '../views/AlertsBoardView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import InsertAlertView from '../views/InsertAlertView.vue'


const router = createRouter({
  history: createWebHistory(),
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
    {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
path: '/insertalert',
name: 'insertalert',
component: InsertAlertView,
  },
  ],
})

export default router
