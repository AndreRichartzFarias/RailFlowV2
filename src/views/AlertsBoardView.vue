<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AlertCard from '../components/DelayAlertCard.vue'

const allAlerts = ref<any[]>([])
const visibleCount = ref(10)
const loading = ref(false)
const error = ref('')
const noMore = ref(false)
const selectedCategory = ref('')

// Store all unique alert categories (alert.alert.message)
const alertCategories = ref<string[]>([])

async function fetchAlerts() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get(`http://localhost:8000/alertcards/`)
    allAlerts.value = (res.data.results || res.data).slice().reverse()
    // Extract unique alert messages (categories)
    const categories = new Set(
      allAlerts.value
        .map(alert => alert.alert?.message)
        .filter(Boolean)
    )
    alertCategories.value = Array.from(categories)
  } catch (e) {
    error.value = 'Erro ao carregar alertas.'
  }
  loading.value = false
}

async function handleDelete(alertId: number) {
  try {
    await axios.delete(`http://localhost:8000/alertcards/${alertId}/`)
    allAlerts.value = allAlerts.value.filter(a => a.id !== alertId)
    // Update categories after delete
    const categories = new Set(
      allAlerts.value
        .map(alert => alert.alert?.message)
        .filter(Boolean)
    )
    alertCategories.value = Array.from(categories)
  } catch (e) {
    error.value = 'Erro ao excluir alerta.'
  }
}

function loadMore() {
  if (visibleCount.value >= filteredAlerts.value.length) {
    noMore.value = true
    setTimeout(() => {
      noMore.value = false
    }, 2000)
    return
  }
  visibleCount.value += 20
}

// Computed for filtered alerts by alert.message (category)
const filteredAlerts = computed(() =>
  allAlerts.value.filter(alert =>
    !selectedCategory.value ||
    (alert.alert?.message === selectedCategory.value)
  )
)

onMounted(fetchAlerts)
</script>

<template>
  <div class="alerts-board">
    <div class="alerts-header">
      <h1>Alertas</h1>
      <select
        v-model="selectedCategory"
        class="search-select"
        aria-label="Filtrar por categoria"
      >
        <option value="">Todas as categorias</option>
        <option
          v-for="cat in alertCategories"
          :key="cat"
          :value="cat"
        >
          {{ cat }}
        </option>
      </select>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="filteredAlerts.length === 0 && !loading">Nenhum alerta encontrado.</div>
    <div>
      <AlertCard
        v-for="(alert, idx) in filteredAlerts.slice(0, visibleCount)"
        :key="alert.id || idx"
        :title="alert.title"
        :content="alert.content"
        :created_at="alert.created_at"
        :train="alert.train_number"
        :alert="alert.alert"
        :onDelete="() => handleDelete(alert.id)"
      />
    </div>
    <button
      class="load-more"
      @click="loadMore"
      v-if="filteredAlerts.length > visibleCount"
    >
      Ver mais
    </button>
  </div>
</template>

<style scoped>

.alerts-board {
  max-width: 600px;
  margin: 5vh auto 0 auto;
  padding: 2rem 1rem 1.5rem 1rem;
  background: var(--gray-bg, #f7f7f7);
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alerts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-text, #222);
  margin: 0;
  text-align: left;
}

.search-select {
  flex: 1 1 180px;
  max-width: 220px;
  padding: 0.5rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: border 0.2s;
  font-family: 'Poppins';
}

.search-select:focus {
  border-color: #888;
  outline: none;
}
.search-select option {
  font-family: 'Poppins';
}

.load-more {
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
  margin-top: 1rem;
}

.load-more:hover {
  background: #cccccc;
}

.error {
  color: #b00020;
  background: #fbeaec;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  text-align: center;
}

.loading {
  text-align: center;
  color: #888;
  font-size: 1rem;
}

@media (max-width: 500px) {
  .alerts-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  h1 {
    text-align: center;
    font-size: 1.2rem;
  }
  .search-select {
    max-width: 100%;
    font-size: 0.98rem;
  }
  
}
</style>