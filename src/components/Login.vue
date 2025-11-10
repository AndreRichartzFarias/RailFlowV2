<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value, router)
    // auth.login should fetch user and redirect; otherwise navigate
    if (auth.isAuthenticated) {
      router.push('/')
    }
  } catch (e) {
    console.error('Login error', e)
    if (e?.response?.data) {
      error.value = e.response.data.detail || JSON.stringify(e.response.data)
    } else if (e?.message) {
      error.value = e.message
    } else {
      error.value = 'Erro ao efetuar login.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" id="email" type="text" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <button type="submit" :disabled="loading">{{ loading ? 'Entrando...' : 'Login' }}</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="right">
      <RouterLink to="/register" class="nav-item">REGISTER</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login {
  max-width: 350px;
  margin: 5vh auto 0 auto;
  padding: 2rem 2rem 1.5rem 2rem;
  background: var(--gray-bg, #f7f7f7);
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h1 {
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--neutral-text, #222);
  margin-bottom: 0.5rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

label {
  font-size: 1rem;
  color: var(--neutral-label, #444);
  margin-bottom: 0.3rem;
  display: block;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 1rem;
  color: #222;
  transition: border 0.2s;
}

input:focus {
  border-color: #888;
  outline: none;
}

button[type="submit"] {
  width: 100%;
  padding: 0.8rem 0;
  background: #e0e0e0;
  color: #222;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="submit"]:hover {
  background: #cccccc;
}

button[type="submit"]:disabled {
  background: #f0f0f0;
  color: #888;
  cursor: not-allowed;
}

.error {
  color: #b00020;
  background: #fbeaec;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.right {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.nav-item {
  color: #444;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s;
}

.nav-item:hover {
  color: #111;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 500px) {
  .login {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  h1 {
    font-size: 1.2rem;
  }
}
</style>