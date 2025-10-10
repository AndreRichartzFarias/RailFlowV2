<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const inserirOpen = ref(false)
const gestaoOpen = ref(false)
let closeTimeout: ReturnType<typeof setTimeout> | null = null

function toggleInserir() {
  inserirOpen.value = !inserirOpen.value
}
function toggleGestao() {
  gestaoOpen.value = !gestaoOpen.value
}

function closeDropdownWithDelay(dropdown: 'inserir' | 'gestao') {
  closeTimeout = setTimeout(() => {
    if (dropdown === 'inserir') inserirOpen.value = false
    if (dropdown === 'gestao') gestaoOpen.value = false
  }, 200)
}

function cancelCloseDropdown() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

function closeDropdown(dropdown: 'inserir' | 'gestao') {
  if (dropdown === 'inserir') inserirOpen.value = false
  if (dropdown === 'gestao') gestaoOpen.value = false
}
</script>

<template>
  <nav :class="$attrs.class">
    <div class="left">
      <span class="nav-icon" style="color: white;">
        <!-- SVG ICON -->
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <g>
            <g style="display: none;">
              <rect width="16" height="19" x="4" y="2" fill="none"/>
            </g>
            <g>
              <path d="M0,0L24,0L24,24L0,24Z" fill="none"/>
              <path d="M12,2C8,2,4,2.5,4,6V15.5C4,17.43,5.57,19,7.5,19L6.35,20.15C6.04,20.46,6.26,21,6.71,21H7.8C7.93,21,8.06,20.95,8.15,20.85L10,19H14L15.85,20.85C15.94,20.94,16.07,21,16.2,21H17.29C17.74,21,17.96,20.46,17.64,20.15L16.5,19C18.43,19,20,17.43,20,15.5V6C20,2.5,16,2,12,2ZM7.5,17C6.67,17,6,16.33,6,15.5C6,14.67,6.67,14,7.5,14C8.33,14,9,14.67,9,15.5C9,16.33,8.33,17,7.5,17ZM11,10H6V6H11V10ZM16.5,17C15.67,17,15,16.33,15,15.5C15,14.67,15.67,14,16.5,14C17.33,14,18,14.67,18,15.5C18,16.33,17.33,17,16.5,17ZM18,10H13V6H18V10Z" fill="currentColor"/>
            </g>
          </g>
        </svg>
      </span>
      <span id="home" class="nav-item"><RouterLink to="/">Home</RouterLink></span>
    </div>
    <div class="center">
      <RouterLink to="/alert" class="nav-item">ALERTAS</RouterLink>
      <RouterLink to="/inspection" class="nav-item">INSPEÇÕES</RouterLink>
       
      <!-- Gestão de Rotas Dropdown -->
      <div
        class="dropdown"
        @mouseleave="closeDropdownWithDelay('gestao')"
        @mouseenter="cancelCloseDropdown"
      >
        <button
          class="nav-item dropdown-toggle"
          @click="toggleGestao"
          aria-haspopup="true"
          :aria-expanded="gestaoOpen"
        >
          GESTÃO DE ROTAS
          <span class="dropdown-arrow" :class="{ open: gestaoOpen }">&#9662;</span>
        </button>
        <div
          class="dropdown-menu"
          v-if="gestaoOpen"
          @mouseenter="cancelCloseDropdown"
          @mouseleave="closeDropdownWithDelay('gestao')"
        >
          <RouterLink to="/routemanagement" class="dropdown-item" @click="closeDropdown('gestao')">Rotas</RouterLink>
          <RouterLink to="/companies" class="dropdown-item" @click="closeDropdown('gestao')">Empresas</RouterLink>
        </div>
      </div>
      <RouterLink to="/maintenance" class="nav-item">MANUTENÇÃO</RouterLink>
      <div
        class="dropdown"
        @mouseleave="closeDropdownWithDelay('inserir')"
        @mouseenter="cancelCloseDropdown"
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
          @mouseenter="cancelCloseDropdown"
          @mouseleave="closeDropdownWithDelay('inserir')"
        >
          <RouterLink to="/insertalert" class="dropdown-item" @click="closeDropdown('inserir')">Inserir Alerta</RouterLink>
          <RouterLink to="/insertinspection" class="dropdown-item" @click="closeDropdown('inserir')">Inserir Inspeção</RouterLink>
          <RouterLink to="/insertmaintenance" class="dropdown-item" @click="closeDropdown('inserir')">Inserir Manutenção</RouterLink>
          <RouterLink to="/insertcompany" class="dropdown-item" @click="closeDropdown('inserir')">Inserir Empresa</RouterLink>
          <RouterLink to="/insertorder" class="dropdown-item" @click="closeDropdown('inserir')">Inserir Pedido</RouterLink>
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
.nav-icon {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
}
.nav-icon svg {
  color:black;
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