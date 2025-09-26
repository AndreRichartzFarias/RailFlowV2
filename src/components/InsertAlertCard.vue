<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'
const title = ref('')
const content = ref('')
const train = ref('')
const alert = ref('')
const trains = ref<any[]>([])
const alerts = ref<any[]>([])
const error = ref('')
const success = ref('')

async function fetchTrainsAndAlerts() {
  try {
    const [trainsRes, alertsRes] = await Promise.all([
      axios.get('http://localhost:8000/trains/'),
      axios.get('http://localhost:8000/alerts/')
    ])
    trains.value = trainsRes.data.results || trainsRes.data
    alerts.value = alertsRes.data.results || alertsRes.data
  } catch (e) {
    error.value = 'Erro ao carregar opções de trem/alerta.'
  }
}

async function submitAlert() {
  error.value = ''
  success.value = ''
  if (!title.value || !content.value || !train.value || !alert.value) {
    error.value = 'Preencha todos os campos.'
    return
  }
  try {
    await axios.post('http://localhost:8000/alertcards/', {
  title: title.value,
  content: content.value,
  train: train.value,
  alert: alert.value
}, {
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCSRFToken()
  },
  withCredentials: true
})
    success.value = 'Alerta inserido com sucesso!'
    title.value = ''
    content.value = ''
    train.value = ''
    alert.value = ''
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Erro ao inserir alerta.'
  }
}

fetchTrainsAndAlerts()
</script>

<template>
  <div class="insert-alert">
    <h2>Inserir Alerta</h2>
    <form @submit.prevent="submitAlert">
      <div>
        <label for="title">Título:</label>
        <input v-model="title" id="title" type="text" maxlength="100" required />
      </div>
      <div>
        <label for="content">Conteúdo:</label>
        <textarea v-model="content" id="content" rows="3" maxlength="500" required></textarea>
      </div>
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
        <label for="alert">Tipo de Alerta:</label>
        <select v-model="alert" id="alert" required>
          <option value="" disabled>Selecione um alerta</option>
          <option v-for="a in alerts" :key="a.id" :value="a.id">
            {{ a.name || a.type || `${a.message}` }}
          </option>
        </select>
      </div>
      <button type="submit">Inserir</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<style scoped>
.insert-alert {
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
  .insert-alert {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}
</style>