<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
<Navbar/>
<RouterView/>
  
</template>

<style scoped>
body{
  background-color: var(--gray-bg) 
}
</style>
