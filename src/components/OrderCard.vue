<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'

const props = defineProps<{
  cardId?: number
  order_number?: string
  cargo_type?: { id?: number; description?: string } | number | string | null
  cargo_type_description?: string | null
  weight?: number | null
  origin?: { id?: number; name?: string } | number | string | null
  origin_name?: string | null
  destination?: { id?: number; name?: string } | number | string | null
  destination_name?: string | null
  departure_date?: string | null
  arrival_date?: string | null
  company?: { id?: number; name?: string } | number | string | null
  company_name?: string | null
  onDelete?: () => void
}>()

const emit = defineEmits<{
  (e: 'updated', payload: any): void
  (e: 'error', message: string): void
}>()

const editing = ref(false)
const saving = ref(false)

// lists
const cargoTypes = ref<any[]>([])
const stations = ref<any[]>([])
const companies = ref<any[]>([])

// edit fields
const editCargoType = ref<number | string | ''>('')
const editWeight = ref<number | ''>(props.weight ?? '')
const editOrigin = ref<number | string | ''>('')
const editDestination = ref<number | string | ''>('')
const editDeparture = ref<string | ''>(props.departure_date ?? '')
const editArrival = ref<string | ''>(props.arrival_date ?? '')
const editCompany = ref<number | string | ''>('')

// computed labels for display
const cargoTypeLabel = computed(() => {
  if (props.cargo_type && typeof props.cargo_type === 'object') return props.cargo_type.description ?? String(props.cargo_type.id ?? '')
  return props.cargo_type_description ?? String(props.cargo_type ?? '')
})
const originLabel = computed(() => {
  if (props.origin && typeof props.origin === 'object') return props.origin.name ?? String(props.origin.id ?? '')
  return props.origin_name ?? String(props.origin ?? '')
})
const destinationLabel = computed(() => {
  if (props.destination && typeof props.destination === 'object') return props.destination.name ?? String(props.destination.id ?? '')
  return props.destination_name ?? String(props.destination ?? '')
})
const companyLabel = computed(() => {
  if (props.company && typeof props.company === 'object') return props.company.name ?? String(props.company.id ?? '')
  return props.company_name ?? String(props.company ?? '')
})

// fetch helper - try common endpoints
async function fetchList(endpoints: string[]) {
  for (const url of endpoints) {
    try {
      const res = await axios.get(url, { withCredentials: true })
      const data = res.data.results || res.data
      if (Array.isArray(data)) return data
    } catch {
      // try next
    }
  }
  return []
}

async function fetchAuxiliary() {
  // cargo types
  cargoTypes.value = await fetchList([
    'http://localhost:8000/api/cargotypes/',
    'http://localhost:8000/api/cargotype/',
    'http://localhost:8000/api/cargo_types/',
  ])
  // stations
  stations.value = await fetchList([
    'http://localhost:8000/api/stations/',
    'http://localhost:8000/api/station/',
  ])
  // companies
  companies.value = await fetchList([
    'http://localhost:8000/api/companies/',
    'http://localhost:8000/api/company/',
  ])
  // initialize edit fields if not set
  if (!editCargoType.value) {
    if (props.cargo_type && typeof props.cargo_type === 'object' && props.cargo_type.id) editCargoType.value = props.cargo_type.id
    else if (props.cargo_type != null) editCargoType.value = props.cargo_type
  }
  if (!editOrigin.value) {
    if (props.origin && typeof props.origin === 'object' && props.origin.id) editOrigin.value = props.origin.id
    else if (props.origin != null) editOrigin.value = props.origin
  }
  if (!editDestination.value) {
    if (props.destination && typeof props.destination === 'object' && props.destination.id) editDestination.value = props.destination.id
    else if (props.destination != null) editDestination.value = props.destination
  }
  if (!editCompany.value) {
    if (props.company && typeof props.company === 'object' && props.company.id) editCompany.value = props.company.id
    else if (props.company != null) editCompany.value = props.company
  }
}

function startEdit() {
  editCargoType.value = props.cargo_type && typeof props.cargo_type === 'object' ? props.cargo_type.id ?? '' : (props.cargo_type ?? '')
  editWeight.value = props.weight ?? ''
  editOrigin.value = props.origin && typeof props.origin === 'object' ? props.origin.id ?? '' : (props.origin ?? '')
  editDestination.value = props.destination && typeof props.destination === 'object' ? props.destination.id ?? '' : (props.destination ?? '')
  editDeparture.value = props.departure_date ?? ''
  editArrival.value = props.arrival_date ?? ''
  editCompany.value = props.company && typeof props.company === 'object' ? props.company.id ?? '' : (props.company ?? '')
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  saving.value = false
}

// PATCH save
async function saveEdit() {
  if (!props.cardId) {
    emit('error', 'Missing order id')
    return
  }
  saving.value = true
  try {
    const payload: any = {}
    // include only changed/available fields
    if (editCargoType.value !== '' && editCargoType.value !== null) {
      const parsed = Number(editCargoType.value)
      payload.cargo_type = Number.isNaN(parsed) ? editCargoType.value : parsed
    }
    if (editWeight.value !== '') payload.weight = Number(editWeight.value)
    if (editOrigin.value !== '' && editOrigin.value !== null) {
      const parsed = Number(editOrigin.value)
      payload.origin = Number.isNaN(parsed) ? editOrigin.value : parsed
    }
    if (editDestination.value !== '' && editDestination.value !== null) {
      const parsed = Number(editDestination.value)
      payload.destination = Number.isNaN(parsed) ? editDestination.value : parsed
    }
    if (editDeparture.value) payload.departure_date = editDeparture.value
    if (editArrival.value) payload.arrival_date = editArrival.value
    if (editCompany.value !== '' && editCompany.value !== null) {
      const parsed = Number(editCompany.value)
      payload.company = Number.isNaN(parsed) ? editCompany.value : parsed
    }

    const res = await axios.patch(
      `http://localhost:8000/api/orders/${props.cardId}/`,
      payload,
      { withCredentials: true, headers: { 'X-CSRFToken': getCSRFToken() } }
    )
    emit('updated', res.data)
    editing.value = false
  } catch (e: any) {
    console.error('Failed to save order', e)
    emit('error', 'Erro ao salvar pedido.')
  } finally {
    saving.value = false
  }
}

onMounted(fetchAuxiliary)
</script>

<template>
  <div class="order-card">
    <div class="card-actions">
      <button v-if="!editing" class="icon-btn edit-btn" type="button" aria-label="Editar pedido" @click="startEdit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
          <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
        </svg>
      </button>

      <button v-else class="icon-btn save-btn" type="button" :disabled="saving" aria-label="Salvar pedido" @click="saveEdit">Salvar</button>
      <button v-if="editing" class="icon-btn cancel-btn" type="button" :disabled="saving" aria-label="Cancelar" @click="cancelEdit">Cancelar</button>

      <button class="delete-btn" type="button" aria-label="Excluir pedido" @click="props.onDelete && props.onDelete()">&times;</button>
    </div>

    <template v-if="!editing">
      <h2>Pedido {{ props.order_number }}</h2>
      <p><strong>Tipo de carga:</strong> {{ cargoTypeLabel }}</p>
      <p><strong>Peso:</strong> {{ props.weight }} kg</p>
      <p><strong>Origem:</strong> {{ originLabel }}</p>
      <p><strong>Destino:</strong> {{ destinationLabel }}</p>
      <p><strong>Saída:</strong> {{ props.departure_date }}</p>
      <p><strong>Chegada:</strong> {{ props.arrival_date }}</p>
      <p><strong>Empresa:</strong> {{ companyLabel }}</p>
    </template>

    <template v-else>
      <h2>Pedido {{ props.order_number }}</h2>

      <label class="sr-only">Tipo de carga</label>
      <select class="inline-input" v-model="editCargoType">
        <option value="" disabled>Selecione tipo de carga</option>
        <option v-for="c in cargoTypes" :key="c.id" :value="c.id">{{ c.description ?? c.name ?? c.id }}</option>
      </select>

      <label class="sr-only">Peso (kg)</label>
      <input type="number" class="inline-input" v-model.number="editWeight" min="0" step="0.1" />

      <label class="sr-only">Origem</label>
      <select class="inline-input" v-model="editOrigin">
        <option value="" disabled>Selecione origem</option>
        <option v-for="s in stations" :key="s.id" :value="s.id">{{ s.name ?? s.id }}</option>
      </select>

      <label class="sr-only">Destino</label>
      <select class="inline-input" v-model="editDestination">
        <option value="" disabled>Selecione destino</option>
        <option v-for="s in stations" :key="s.id" :value="s.id">{{ s.name ?? s.id }}</option>
      </select>

      <div style="display:flex; gap:0.5rem;">
        <label class="sr-only">Data de saída</label>
        <input type="date" class="inline-input" v-model="editDeparture" />
        <label class="sr-only">Data de chegada</label>
        <input type="date" class="inline-input" v-model="editArrival" />
      </div>

      <label class="sr-only">Empresa</label>
      <select class="inline-input" v-model="editCompany">
        <option value="" disabled>Selecione empresa</option>
        <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name ?? c.id }}</option>
      </select>
    </template>
  </div>
</template>

<style scoped>
.order-card {
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.6rem 1.2rem;
  margin-bottom: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* actions */
.card-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  z-index: 3;
}

/* reserve top space while editing to avoid overlap */
.order-card.editing { padding-top: 2.2rem; }

.icon-btn,
.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.12rem 0.45rem;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.edit-btn { color: #0b76ef; width:32px; height:32px; }
.save-btn { color: #0b7630; padding: 0.2rem 0.6rem; }
.cancel-btn { color: #444; padding: 0.2rem 0.6rem; }

.delete-btn {
  color: #b00020;
  font-size: 1.2rem;
  font-weight: bold;
  width: 32px;
  height: 32px;
}

/* inputs */
.inline-input {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  box-sizing: border-box;
  margin-top: 0.35rem;
}

.sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

@media (max-width: 600px) {
  .order-card { padding: 1rem; }
  .card-actions { position: static; margin-bottom: 0.45rem; justify-content:flex-end; }
  .icon-btn, .delete-btn { width:36px; height:36px; padding:0; }
  .order-card > template { width:100%; }
}
</style>