<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const inserirOpen = ref(false)
let closeTimeout: ReturnType<typeof setTimeout> | null = null

function toggleInserir() {
  inserirOpen.value = !inserirOpen.value
}

function closeInserirWithDelay() {
  closeTimeout = setTimeout(() => {
    inserirOpen.value = false
  }, 200)
}

function cancelCloseInserir() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

function closeInserir() {
  inserirOpen.value = false
}
</script>

<template>
  <nav>
    <div class="left">
      <img src="..\assets\svg\train-icon.svg" alt="Train Icon" />
      <span id="home" class="nav-item"><RouterLink to="/">Home</RouterLink></span>
    </div>
    <div class="center">
      <RouterLink to="/alert" class="nav-item">ALERTAS</RouterLink>
      <div
        class="dropdown"
        @mouseleave="closeInserirWithDelay"
        @mouseenter="cancelCloseInserir"
      >
        <button
          class="nav-item dropdown-toggle"
          @click="toggleInserir"
          aria-haspopup="true"
          :aria-expanded="inserirOpen"
        >
          INSERIR
          <span class="dropdown-arrow" :class="{ open: inserirOpen }">&#9662;</span>
        </button>
        <div
          class="dropdown-menu"
          v-if="inserirOpen"
          @mouseenter="cancelCloseInserir"
          @mouseleave="closeInserirWithDelay"
        >
          <RouterLink to="/insertalert" class="dropdown-item" @click="closeInserir">Inserir Alerta</RouterLink>
          <RouterLink to="/insertnotice" class="dropdown-item" @click="closeInserir">Inserir Aviso</RouterLink>
          <RouterLink to="/insertnote" class="dropdown-item" @click="closeInserir">Inserir Nota</RouterLink>
          <!-- Add more items here as needed -->
        </div>
      </div>
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
  display: flex;
  gap: 1rem;
  align-items: center;
  position: relative;
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
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem 0.7rem;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
}

.nav-item:hover,
.dropdown-toggle.open {
  background: #e0e0e0;
}

#home {
  font-weight: bold;
  font-size: 1.2rem;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.dropdown-arrow {
  font-size: 0.8em;
  transition: transform 0.2s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  min-width: 170px;
  background: var(--gray-bg, #f7f7f7);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.08);
  border-radius: 8px;
  padding: 0.5rem 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.dropdown-item {
  color: #222;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s;
  width: 100%;
  display: block;
}

.dropdown-item:hover {
  background: #e0e0e0;
}

@media (max-width: 700px) {
  nav {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.7rem;
  }
  .center {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
  .dropdown-menu {
    min-width: 140px;
    left: 0;
    right: auto;
  }
  .left {
    width: 100%;

  }
  .dropdown-toggle span {
    display:none;
  }
}
</style>