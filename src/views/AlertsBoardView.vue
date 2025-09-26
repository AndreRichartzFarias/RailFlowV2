<script setup lang="ts">
// filepath: c:\Users\andre_r_farias\Documents\Trabalhos\RailFlowV2\src\views\AlertsBoardView.vue
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AlertCard from '../components/AlertCard.vue'

const allAlerts = ref<any[]>([])
const visibleCount = ref(10)
const loading = ref(false)
const error = ref('')
const noMore = ref(false)

async function fetchAlerts() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get(`http://localhost:8000/alertcards/`)
    allAlerts.value = res.data.results || res.data
  } catch (e) {
    error.value = 'Erro ao carregar alertas.'
  }
  loading.value = false
}

function loadMore() {
  if (visibleCount.value >= allAlerts.value.length) {
    noMore.value = true
    setTimeout(() => {
      noMore.value = false
    }, 2000)
    return
  }
  visibleCount.value += 20
}

onMounted(fetchAlerts)
</script>

<template>
  <div class="alerts-board">
    <h1>Alertas</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="allAlerts.length === 0 && !loading">Nenhum alerta encontrado.</div>
    <div>
      <AlertCard
        v-for="(alert, idx) in allAlerts.slice(0, visibleCount)"
        :key="alert.id || idx"
        :title="alert.title"
        :content="alert.content"
        :created_at="alert.created_at"
        :train="alert.train_number"
      />
    </div>
    <button
      class="load-more"
      @click="loadMore"
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

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-text, #222);
  margin-bottom: 0.5rem;
  text-align: center;
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
</style>