<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav>
    <div class="left">
      <img src="..\assets\svg\train-icon.svg" alt="Train Icon" />
      <span id="home" class="nav-item"><RouterLink to="/">Home</RouterLink></span>
    </div>
    <div class="center"> 
      
      <RouterLink to="/alert" class="nav-item">ALERT</RouterLink>
      
    </div>
    <div class="right">
        <RouterLink to="/login" class="nav-item">LOGIN</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}


.center {
    display:flex;
    gap:1rem;
}

.left, .right {
  flex: 1;
  
}

.right {
    display: flex;
    justify-content: flex-end;
}

.left {
display: flex;
gap: 1rem;
align-items: center;
}

.nav-item {
  text-decoration: none;
  color: black;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.nav-item:hover {
    font-size: 1.1rem;
}

#home {
  font-weight: bold;
  font-size: 1.2rem;
}
</style>