<template>
  <div class="route-management-page">
    <div class="order-select-container">
      <div>
      <label for="order-select">Selecione o pedido:</label>
      <select
        id="order-select"
        v-model="selectedOrderNumber"
        class="order-select"
        :disabled="loading || orders.length === 0"
      >
        <option value="" disabled>Escolha um número de pedido</option>
        <option
          v-for="order in orders"
          :key="order.id"
          :value="order.order_number"
        >
          {{ order.order_number }}
        </option>
      </select>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="selectedOrder" class="order-card">
      <h2>Pedido {{ selectedOrder.order_number }}</h2>
      <p><strong>Tipo de carga:</strong> {{ selectedOrder.cargo_type?.name || selectedOrder.cargo_type }}</p>
      <p><strong>Peso:</strong> {{ selectedOrder.weight }} kg</p>
      <p><strong>Origem:</strong> {{ selectedOrder.origin?.name || selectedOrder.origin }}</p>
      <p><strong>Destino:</strong> {{ selectedOrder.destination?.name || selectedOrder.destination }}</p>
      <p><strong>Data de saída:</strong> {{ selectedOrder.departure_date }}</p>
      <p><strong>Data de chegada:</strong> {{ selectedOrder.arrival_date }}</p>
      <p><strong>Empresa:</strong> {{ selectedOrder.company?.name || selectedOrder.company }}</p>
    </div>
    </div>
    <div class="map-container">
      <iframe
        src="https://www.google.com/maps?q=Joinville&z=12&output=embed"
        width="100%"
        height="100%"
        style="border:0;"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const orders = ref<any[]>([])
const selectedOrderNumber = ref('')
const loading = ref(false)
const error = ref('')

const selectedOrder = computed(() =>
  orders.value.find(order => order.order_number === selectedOrderNumber.value)
)

async function fetchOrders() {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('http://localhost:8000/orders/')
    orders.value = res.data.results || res.data
  } catch (e) {
    error.value = 'Erro ao carregar pedidos.'
  }
  loading.value = false
}

onMounted(fetchOrders)
</script>

<style scoped>
.route-management-page {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.2rem;
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;

}

.order-select-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-start;
}

.order-select {
  width: 100%;
  padding: 0.5rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  color: #222;
  transition: border 0.2s;
  margin-bottom: 0.5rem;
}

.order-select:focus {
  border-color: #888;
  outline: none;
}

.order-card {
  width: 100%;
  max-width: 400px;
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-card h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--neutral-text, #222);
  margin-bottom: 0.4rem;
}

.order-card p {
  color: var(--neutral-label, #444);
  font-size: 1rem;
  margin: 0;
}

.error {
  color: #b00020;
  background: #fbeaec;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.map-container {
  width: 100vw;
  max-width: 1000px;
  height: 60vh;
  min-height: 200px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

iframe {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 12px;
}
@media (max-width: 1420px) {
  .route-management-page {
   padding-right: 0.5rem;
  }
}
@media (max-width: 700px) {
  .route-management-page {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
     padding-right: 0;
    flex-direction: column;
  }
  .order-card, .order-select-container {
    max-width: 98vw;
    padding: 0.8rem 0.5rem;
  }
  .map-container {
    min-height: 120px;
    max-width: 100vw;
    height: 30vh;
  }
}
</style>