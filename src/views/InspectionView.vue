<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'
const allInspections = ref<any[]>([])
const visibleCount = ref(10)
const loading = ref(false)
const error = ref('')
const noMore = ref(false)

async function fetchInspections() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://localhost:8000/api/inspections/',{ withCredentials: true })
    allInspections.value = (res.data.results || res.data).slice().reverse()
  } catch (e) {
    error.value = 'Erro ao carregar inspeções.'
  }
  loading.value = false
}

async function handleDelete(inspectionId: number) {
  try {
   await axios.delete(`http://localhost:8000/api/inspections/${inspectionId}/`, {
  withCredentials: true,
  headers: {
    'X-CSRFToken': getCSRFToken()
  }
})
    allInspections.value = allInspections.value.filter(i => i.id !== inspectionId)
  } catch (e) {
    error.value = 'Erro ao excluir inspeção.'
  }
}

function loadMore() {
  if (visibleCount.value >= allInspections.value.length) {
    noMore.value = true
    setTimeout(() => {
      noMore.value = false
    }, 2000)
    return
  }
  visibleCount.value += 20
}

onMounted(fetchInspections)
</script>

<template>
  <div class="inspections-board">
    <h1>Inspeções</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="allInspections.length === 0 && !loading">Nenhuma inspeção encontrada.</div>
    <div>
      <div
        v-for="(inspection, idx) in allInspections.slice(0, visibleCount)"
        :key="inspection.id || idx"
        class="inspection-card"
      >
        <button
          class="delete-btn"
          type="button"
          aria-label="Excluir inspeção"
          @click="handleDelete(inspection.id)"
        >
          &times;
        </button>
        <h2>Trem: {{ inspection.train_number || inspection.train?.number || inspection.train }}</h2>
        <p><strong>Motivo:</strong> {{ inspection.reason_description || inspection.reason?.description || inspection.reason }}</p>
        <p><strong>Data:</strong> {{ inspection.date }}</p>
        <p v-if="inspection.notes"><strong>Notas:</strong> {{ inspection.notes }}</p>
      </div>
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
.inspections-board {
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

.inspection-card {
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 1px 8px 0 rgba(0,0,0,0.04);
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  background: transparent;
  border: none;
  color: #b00020;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.1rem 0.5rem;
  border-radius: 50%;
  transition: background 0.15s;
  z-index: 2;
  line-height: 1;
}
.delete-btn:hover,
.delete-btn:focus {
  background: #fbeaec;
  outline: none;
}

.inspection-card h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.inspection-card p {
  font-size: 1rem;
  margin-bottom: 0.2rem;
  color: #222;
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