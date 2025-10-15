<script>
import { useAuthStore } from '../stores/auth.js'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    return {
      authStore,
      router
    }
  },
  methods: {
    async logout() {
      try {
        await this.authStore.logout(this.$router)
      } catch (error) {
        console.error(error)
      }
    }
  },
  async mounted() {
    await this.authStore.fetchUser()
  }
}
</script>

<template>
  <div class="home-page">
    <div>
      <img src="\src\assets\img\train_mountains_aerial_view_148001_3840x2400.jpg" alt="" class="bgimg">
    </div>
    <h1>Welcome to the home page</h1>
    <div v-if="authStore.isAuthenticated">
      <p>Hi there {{ authStore.user?.email }}!</p>
      <p>You are logged in.</p>
      <button @click="logout">Logout</button>
    </div>
    <p v-else>
      You are not logged in. <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<style scoped>
* {
  color: aliceblue
}

.bgimg {
  position: fixed;
  top: 0vh;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -1;
  opacity: 0.9;
  pointer-events: none;
}
</style>