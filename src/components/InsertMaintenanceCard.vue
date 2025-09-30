<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'

const train = ref('')
const reason = ref('')
const date = ref('')
const notes = ref('')
const trains = ref<any[]>([])
const reasons = ref<any[]>([])
const error = ref('')
const success = ref('')

async function fetchTrainsAndReasons() {
  try {
    const [trainsRes, reasonsRes] = await Promise.all([
      axios.get('http://localhost:8000/trains/'),
      axios.get('http://localhost:8000/reasonmaintenances/')
    ])
    trains.value = trainsRes.data.results || trainsRes.data
    reasons.value = reasonsRes.data.results || reasonsRes.data
  } catch (e) {
    error.value = 'Erro ao carregar opções de trem/motivo.'
  }
}

async function submitMaintenance() {
  error.value = ''
  success.value = ''
  if (!train.value || !reason.value || !date.value) {
    error.value = 'Preencha todos os campos obrigatórios.'
    return
  }
  try {
    await axios.post('http://localhost:8000/maintenances/', {
      train: train.value,
      reason: reason.value,
      date: date.value,
      notes: notes.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      withCredentials: true
    })
    success.value = 'Manutenção inserida com sucesso!'
    train.value = ''
    reason.value = ''
    date.value = ''
    notes.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Erro ao inserir manutenção.'
  }
}

fetchTrainsAndReasons()
</script>

<template>
  <div class="insert-maintenance">
    <h2>Inserir Manutenção</h2>
    <form @submit.prevent="submitMaintenance">
      <div>
        <label for="train">Trem:</label>
        <select v-model="train" id="train" required>
          <option value="" disabled>Selecione um trem</option>
          <option v-for="t in trains" :key="t.id" :value="t.id">
            {{ t.number || t.name || `Trem ${t.id}` }}
          </option>
        </select>
      </div>
      <div>
        <label for="reason">Motivo:</label>
        <select v-model="reason" id="reason" required>
          <option value="" disabled>Selecione um motivo</option>
          <option v-for="r in reasons" :key="r.id" :value="r.id">
            {{ r.description }}
          </option>
        </select>
      </div>
      <div>
        <label for="date">Data:</label>
        <input v-model="date" id="date" type="date" required />
      </div>
      <div>
        <label for="notes">Notas (opcional):</label>
        <textarea v-model="notes" id="notes" rows="3" maxlength="500"></textarea>
      </div>
      <button type="submit">Inserir</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<style scoped>
.insert-maintenance {
  max-width: 400px;
  margin: 5vh auto 0 auto;
  padding: 2rem 2rem 1.5rem 2rem;
  background: var(--gray-bg, #f7f7f7);
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-text, #222);
  margin-bottom: 0.5rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

label {
  font-size: 1rem;
  color: var(--neutral-label, #444);
  margin-bottom: 0.3rem;
  display: block;
}

input[type="text"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 1rem;
  color: #222;
  transition: border 0.2s;
  resize: vertical;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #888;
  outline: none;
}

button[type="submit"] {
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
}

button[type="submit"]:hover {
  background: #cccccc;
}

.error {
  color: #b00020;
  background: #fbeaec;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.success {
  color: #227d3b;
  background: #eafbf2;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

@media (max-width: 500px) {
  .insert-maintenance {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}
</style>