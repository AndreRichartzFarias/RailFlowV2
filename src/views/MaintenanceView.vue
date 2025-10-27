<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '@/stores/auth'
import MaintenanceCard from '@/components/MaintenanceCard.vue'

const allMaintenances = ref<any[]>([])
const visibleCount = ref(10)
const loading = ref(false)
const error = ref('')
const noMore = ref(false)

async function fetchMaintenances() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://localhost:8000/api/maintenances/', { withCredentials: true })
    allMaintenances.value = (res.data.results || res.data).slice().reverse()
  } catch (e) {
    error.value = 'Erro ao carregar manutenções.'
  } finally {
    loading.value = false
  }
}

async function handleDelete(maintenanceId: number) {
  try {
    await axios.delete(`http://localhost:8000/api/maintenances/${maintenanceId}/`, {
      withCredentials: true,
      headers: { 'X-CSRFToken': getCSRFToken() }
    })
    allMaintenances.value = allMaintenances.value.filter(m => m.id !== maintenanceId)
  } catch (e) {
    error.value = 'Erro ao excluir manutenção.'
  }
}

function loadMore() {
  if (visibleCount.value >= allMaintenances.value.length) {
    noMore.value = true
    setTimeout(() => { noMore.value = false }, 2000)
    return
  }
  visibleCount.value += 20
}

function onCardUpdated(updated: any) {
  allMaintenances.value = allMaintenances.value.map(m => m.id === updated.id ? { ...m, ...updated } : m)
}

onMounted(fetchMaintenances)
</script>

<template>
  <div class="maintenances-board">
    <h1>Manutenções</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="allMaintenances.length === 0 && !loading">Nenhuma manutenção encontrada.</div>
    <div>
      <MaintenanceCard
        v-for="(maintenance, idx) in allMaintenances.slice(0, visibleCount)"
        :key="maintenance.id || idx"
        :card-id="maintenance.id"
        :train="maintenance.train_number || maintenance.train?.number || maintenance.train"
        :reason="maintenance.reason || maintenance.reason_id"
        :reason_description="maintenance.reason_description || maintenance.reason?.description || maintenance.reason"
        :date="maintenance.date"
        :notes="maintenance.notes"
        :onDelete="() => handleDelete(maintenance.id)"
        @updated="onCardUpdated"
        @error="msg => error = msg"
      />
    </div>

    <button class="load-more" @click="loadMore" v-if="allMaintenances.length > visibleCount">
      Ver mais
    </button>
  </div>
</template>

<style scoped>
.maintenances-board {
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
.load-more:hover { background: #cccccc; }

.error {
  color: #b00020;
  background: #fbeaec;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  text-align: center;
}
</style>