import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore, ensureCSRFCookie } from '@/stores/auth'
import './assets/main.css'
import './assets/tailwind.css'


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

// initialize auth in background (do not block mount)
try {
  const auth = useAuthStore()
  // ensure CSRF and fetch current user (best-effort)
  ensureCSRFCookie().then(() => auth.fetchUser().catch(() => {})).catch(() => auth.fetchUser().catch(() => {}))
} catch (e) {
  // ignore initialization errors
  console.warn('Auth initialization failed', e)
}

