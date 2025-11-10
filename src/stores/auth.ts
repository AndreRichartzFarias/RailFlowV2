import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any | null>(null)
  const isAuthenticated = ref(false)

  function getCookie(name: string) {
    const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
    return match ? decodeURIComponent(match[2]) : null
  }

  function getCSRFToken() {
    return getCookie('csrftoken')
  }

  async function ensureCSRFCookie() {
    try {
      // call backend endpoint that sets csrftoken cookie
      await fetch('http://localhost:8000/api/csrf/', { method: 'GET', credentials: 'include' })
      return true
    } catch (e) {
      console.warn('ensureCSRFCookie failed', e)
      return false
    }
  }

  async function fetchUser() {
    try {
      await ensureCSRFCookie()
      const res = await axios.get('http://localhost:8000/api/me/', { withCredentials: true })
      user.value = res.data || null
      isAuthenticated.value = !!res.data
      return user.value
    } catch (e) {
      user.value = null
      isAuthenticated.value = false
      throw e
    }
  }

  async function login(email: string, password: string, router?: any) {
    try {
      await ensureCSRFCookie()
      const csrf = getCSRFToken() || ''
      await axios.post('http://localhost:8000/api/login/', { email, password }, {
        withCredentials: true,
        headers: { 'X-CSRFToken': csrf }
      })
      await fetchUser()
      if (router) router.push('/')
      return true
    } catch (e) {
      throw e
    }
  }

  async function logout() {
    try {
      const csrf = getCSRFToken() || ''
      await axios.post('http://localhost:8000/api/logout/', {}, { withCredentials: true, headers: { 'X-CSRFToken': csrf } })
    } catch (e) {
      console.warn('logout request failed', e)
    }
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, getCSRFToken, ensureCSRFCookie, fetchUser, login, logout }
})

// Named helpers (for modules that import them directly)
export function getCSRFToken() {
  const match = document.cookie.match('(^|;)\\s*' + 'csrftoken' + '\\s*=\\s*([^;]+)')
  return match ? decodeURIComponent(match[2]) : null
}

export async function ensureCSRFCookie() {
  try {
    await fetch('http://localhost:8000/api/csrf/', { method: 'GET', credentials: 'include' })
    return true
  } catch (e) {
    console.warn('ensureCSRFCookie failed', e)
    return false
  }
}