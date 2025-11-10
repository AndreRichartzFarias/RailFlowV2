import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AlertView from '../views/AlertsBoardView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import InsertAlertView from '../views/InsertAlertView.vue'
import RouteManagementView from '../views/RouteManagementView.vue'
import InspectionView from '../views/InspectionView.vue'
import InsertInspectionView from '../views/InsertInspectionView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
import InsertMaintenanceView from '../views/InsertMaintenanceView.vue'
import CompaniesView from '../views/CompaniesView.vue'
import InsertComapanyView from '../views/InsertCompanyView.vue'
import InsertOrderView from '../views/InsertOrderView.vue'
import ProfileView from '../views/ProfileView.vue'
import { userInGroups, DEFAULT_ALLOWED_GROUPS } from '@/utils/permissions'
import { useAuthStore } from '@/stores/auth'

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
  {
    path: '/routemanagement',
    name: 'routemanagemnet',
    component: RouteManagementView,

  },
  {
    path: '/inspection',
    name: 'inspection',
    component: InspectionView,

  },
  {
    path: '/insertinspection',
    name: 'insertinspection',
    component: InsertInspectionView,

  },
  {
    path: '/maintenance',
    name: 'maintenance',
    component: MaintenanceView,

  },
  {
    path: '/insertmaintenance',
    name: 'insertmaintenance',
    component: InsertMaintenanceView,

  },
  {
    path:'/companies',
    name: 'companies',
    component: CompaniesView,
  },
   {
    path:'/insertcompany',
    name: 'insertcompany',
    component: InsertComapanyView,
  },
  {
    path:'/insertorder',
    name: 'insertorder',
    component: InsertOrderView,
  },
  {
    path:'/Profile',
    name: 'Profile',
    component: ProfileView,
  },
    
  ],
})

router.beforeEach(async (to) => {
  const publicPaths = ['/', '/login', '/register']
  if (publicPaths.includes(to.path)) return true

  try {
    const auth = useAuthStore()
    // ensure user is loaded
    if (typeof auth.fetchUser === 'function') await auth.fetchUser().catch(()=>{})
    const user = auth.user
    if (!user) return { path: '/login', query: { redirect: to.fullPath } }
    if (!userInGroups(user, DEFAULT_ALLOWED_GROUPS)) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
    return true
  } catch (e) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
