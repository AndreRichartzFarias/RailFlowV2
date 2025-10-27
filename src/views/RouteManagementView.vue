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

      <div v-if="selectedOrder">
        <OrderCard
          :card-id="selectedOrder.id"
          :order_number="selectedOrder.order_number"
          :cargo_type="selectedOrder.cargo_type"
          :cargo_type_description="selectedOrder.cargo_type_description"
          :weight="selectedOrder.weight"
          :origin="selectedOrder.origin"
          :origin_name="selectedOrder.origin_name"
          :destination="selectedOrder.destination"
          :destination_name="selectedOrder.destination_name"
          :departure_date="selectedOrder.departure_date"
          :arrival_date="selectedOrder.arrival_date"
          :company="selectedOrder.company"
          :company_name="selectedOrder.company_name"
          :onDelete="() => handleDelete(selectedOrder.id)"
          @updated="onCardUpdated"
          @error="msg => error = msg"
        />
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
import OrderCard from '../components/OrderCard.vue'
import { getCSRFToken } from '../stores/auth'

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
    const res = await axios.get('http://localhost:8000/api/orders/', { withCredentials: true })
    orders.value = res.data.results || res.data
  } catch (e) {
    error.value = 'Erro ao carregar pedidos.'
  } finally {
    loading.value = false
  }
}

async function handleDelete(orderId: number) {
  try {
    await axios.delete(`http://localhost:8000/api/orders/${orderId}/`, {
      withCredentials: true,
      headers: { 'X-CSRFToken': getCSRFToken() }
    })
    orders.value = orders.value.filter(o => o.id !== orderId)
    // clear selection if deleted
    if (selectedOrder?.value?.id === orderId) selectedOrderNumber.value = ''
  } catch (e) {
    error.value = 'Erro ao excluir pedido.'
  }
}

function onCardUpdated(updated: any) {
  orders.value = orders.value.map(o => o.id === updated.id ? { ...o, ...updated } : o)
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
  align-items: flex-start;
  gap: 1.2rem;
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
}

.order-select-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: stretch;
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
}

.order-select:focus {
  border-color: #888;
  outline: none;
}

.map-container {
  width: 100vw;
  max-width: 1000px;
  height: 60vh;
  min-height: 200px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

iframe { width: 100%; height: 100%; border: 0; border-radius: 12px; }

.error {
  color: #b00020;
  background: #fbeaec;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  text-align: center;
}

/* responsive */
@media (max-width: 700px) {
  .route-management-page { flex-direction: column; padding: 0.6rem; }
  .order-select-container { max-width: 98vw; }
  .map-container { height: 30vh; min-height: 120px; max-width: 100vw; }
}
</style>