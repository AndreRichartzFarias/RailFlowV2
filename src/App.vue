<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
<Navbar :class="{ 'nav-home': $route.path === '/' }"/>
<RouterView/>
  
</template>

<style>
body {
  background-color: var(--gray-bg);
}

.nav-home {
  background: #263449;
}

.nav-home .nav-item {
  color: #f0f4fa !important;
}

.nav-home .nav-icon svg {
  color:white;
}
</style>
