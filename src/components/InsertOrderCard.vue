<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const cargo_type = ref('')
const weight = ref('')
const origin = ref('')
const destination = ref('')
const departure_date = ref('')
const arrival_date = ref('')
const company = ref('')

const cargoTypes = ref<any[]>([])
const stations = ref<any[]>([])
const companies = ref<any[]>([])

const error = ref('')
const success = ref('')
const loading = ref(false)

async function fetchOptions() {
  try {
    const [cargoRes, stationRes, companyRes] = await Promise.all([
      axios.get('http://localhost:8000/cargotypes/'),
      axios.get('http://localhost:8000/stations/'),
      axios.get('http://localhost:8000/companies/')
    ])
    cargoTypes.value = cargoRes.data.results || cargoRes.data
    stations.value = stationRes.data.results || stationRes.data
    companies.value = companyRes.data.results || companyRes.data
  } catch (e) {
    error.value = 'Erro ao carregar opções.'
  }
}

async function submitOrder() {
  error.value = ''
  success.value = ''
  loading.value = true
  if (!order_number.value || !cargo_type.value || !weight.value || !origin.value || !destination.value || !departure_date.value || !arrival_date.value || !company.value) {
    error.value = 'Preencha todos os campos obrigatórios.'
    loading.value = false
    return
  }
  try {
    await axios.post('http://localhost:8000/orders/', {
      order_number: order_number.value,
      cargo_type: cargo_type.value,
      weight: weight.value,
      origin: origin.value,
      destination: destination.value,
      departure_date: departure_date.value,
      arrival_date: arrival_date.value,
      company: company.value
    })
    success.value = 'Pedido cadastrado com sucesso!'
    order_number.value = ''
    cargo_type.value = ''
    weight.value = ''
    origin.value = ''
    destination.value = ''
    departure_date.value = ''
    arrival_date.value = ''
    company.value = ''
  } catch (e: any) {
    if (e.response?.data?.order_number) {
      error.value = 'Número de pedido já cadastrado.'
    } else {
      error.value = 'Erro ao cadastrar pedido.'
    }
  }
  loading.value = false
}

onMounted(fetchOptions)
</script>

<template>
  <div class="insert-order">
    <h2>Cadastrar Pedido</h2>
    <form @submit.prevent="submitOrder">
      <div>
        <label for="cargo_type">Tipo de Carga*</label>
        <select v-model="cargo_type" id="cargo_type" required>
          <option value="" disabled>Selecione</option>
          <option v-for="c in cargoTypes" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <div>
        <label for="weight">Peso (kg)*</label>
        <input v-model="weight" id="weight" type="number" min="0" step="0.01" required />
      </div>
      <div>
        <label for="origin">Origem*</label>
        <select v-model="origin" id="origin" required>
          <option value="" disabled>Selecione</option>
          <option v-for="s in stations" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label for="destination">Destino*</label>
        <select v-model="destination" id="destination" required>
          <option value="" disabled>Selecione</option>
          <option v-for="s in stations" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label for="departure_date">Data de Saída*</label>
        <input v-model="departure_date" id="departure_date" type="date" required />
      </div>
      <div>
        <label for="arrival_date">Data de Chegada*</label>
        <input v-model="arrival_date" id="arrival_date" type="date" required />
      </div>
      <div>
        <label for="company">Empresa*</label>
        <select v-model="company" id="company" required>
          <option value="" disabled>Selecione</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<style scoped>
.insert-order {
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
input[type="number"],
input[type="date"],
select {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 1rem;
  color: #222;
  transition: border 0.2s;
}

input:focus,
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

button[type="submit"]:hover:enabled {
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
  .insert-order {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}
</style>