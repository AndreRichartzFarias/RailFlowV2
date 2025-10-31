
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MapLeaflet from '@/components/MapLeaflet.vue'
import StationModal from '@/components/StationModal.vue'
import RouteCreator from '@/components/RouteCreator.vue'
import { getCSRFToken } from '@/stores/auth'

const stations = ref<any[]>([])
const routes = ref<any[]>([])
const editMode = ref(false)
const modalOpen = ref(false)
const editingStation = ref<any | null>(null)
const creatingRoute = ref(false)
const currentRoute = ref<any[]>([])
const status = ref('Pronto')

async function loadStations() {
  try {
    const res = await axios.get('http://localhost:8000/api/estacoes/', { withCredentials: true })
    stations.value = (res.data.results || res.data).slice()
  } catch (e) {
    status.value = 'Erro ao carregar estações'
    console.error('loadStations error', e)
  }
}

async function loadRoutes() {
  try {
    const res = await axios.get('http://localhost:8000/api/rotas/', { withCredentials: true })
    routes.value = (res.data.results || res.data).slice()
  } catch (e) {
    status.value = 'Erro ao carregar rotas'
    console.error('loadRoutes error', e)
  }
}

onMounted(() => {
  loadStations()
  loadRoutes()
})

function reload() {
  loadStations(); loadRoutes(); status.value = 'Dados atualizados'
}

function toggleEditMode() {
  editMode.value = !editMode.value
  status.value = editMode.value ? 'Modo edição ativado' : 'Modo visualização'
}

function openStationModal(station: any = null) {
  editingStation.value = station ? { ...station } : null
  modalOpen.value = true
}

function closeStationModal() {
  modalOpen.value = false
  editingStation.value = null
}

async function handleSaveStation(payload: any) {
  try {
    const method = payload.id ? 'patch' : 'post'
    const url = payload.id ? `http://localhost:8000/api/estacoes/${payload.id}/` : 'http://localhost:8000/api/estacoes/'
    // For create, remove id field to avoid backend treating it as attempt to set primary key
    const body = payload.id ? payload : { ...payload }
    if (!payload.id && 'id' in body) delete body.id

    await axios[method](url, body, {
      withCredentials: true,
      headers: { 'X-CSRFToken': getCSRFToken() || '' }
    })
    await loadStations()
    modalOpen.value = false
    status.value = 'Estação salva'
  } catch (e) {
    status.value = 'Erro ao salvar estação'
    console.error('handleSaveStation error', e)
  }
}

async function handleDeleteStation(id: number) {
  try {
    await axios.delete(`http://localhost:8000/api/estacoes/${id}/`, {
      withCredentials: true,
      headers: { 'X-CSRFToken': getCSRFToken() || '' }
    })
    await loadStations()
    modalOpen.value = false
    status.value = 'Estação excluída'
  } catch (e) {
    status.value = 'Erro ao excluir estação'
    console.error('handleDeleteStation error', e)
  }
}

function onMapClick(latlng: { lat: number; lng: number }) {
  if (editMode.value && !creatingRoute.value) {
    editingStation.value = { latitude: latlng.lat, longitude: latlng.lng }
    modalOpen.value = true
  }
}

async function onStationDragged(payload: { id: number; lat: number; lng: number }) {
  try {
    await axios.post(`http://localhost:8000/api/estacoes/${payload.id}/update_position/`, {
      latitude: payload.lat,
      longitude: payload.lng
    }, { withCredentials: true, headers: { 'X-CSRFToken': getCSRFToken() || '' } })
    await loadStations()
    status.value = 'Posição atualizada'
  } catch (e) {
    status.value = 'Erro ao atualizar posição'
    console.error('onStationDragged error', e)
  }
}

function onStationClick(station: any) {
  if (creatingRoute.value) {
    addToCurrentRoute(station)
  } else if (editMode.value) {
    openStationModal(station)
  } else {
    status.value = `Focado: ${station.nome}`
  }
}

function focusStation(s: any) {
  window.dispatchEvent(new CustomEvent('focus-station', { detail: s }))
}

function fitRoute(route: any) {
  window.dispatchEvent(new CustomEvent('fit-route', { detail: route }))
}

function startRouteCreation() {
  creatingRoute.value = true
  currentRoute.value = []
  status.value = 'Criando nova rota - selecione estações'
}

function addToCurrentRoute(station: any) {
  if (currentRoute.value.some(s => s.id === station.id)) {
    status.value = 'Esta estação já está na rota'
    return
  }
  currentRoute.value.push(station)
  status.value = `Estação "${station.nome}" adicionada`
}

function removeFromCurrentRoute(index: number) {
  currentRoute.value.splice(index, 1)
}

async function finishRoute(payload: { name?: string }) {
  if (currentRoute.value.length < 2) {
    status.value = 'A rota precisa ter pelo menos duas estações'
    return
  }
  try {
    const data = {
      nome: payload.name || `Rota ${routes.value.length + 1}`,
      estacoes_ids: currentRoute.value.map(s => Number(s.id))
    }
    const csrf = getCSRFToken && typeof getCSRFToken === 'function' ? getCSRFToken() : null
    await axios.post('http://localhost:8000/api/rotas/', data, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrf || '',
        'Content-Type': 'application/json'
      }
    })
    creatingRoute.value = false
    currentRoute.value = []
    await loadRoutes()
    status.value = 'Rota criada'
  } catch (err: any) {
    // improved logging to capture server error body
    console.error('finishRoute error:', err)
    if (err?.response) {
      console.error('Status:', err.response.status)
      console.error('Response data:', err.response.data)
    }
    status.value = 'Erro ao criar rota'
  }
}

function cancelRouteCreation() {
  creatingRoute.value = false
  currentRoute.value = []
  status.value = 'Criação de rota cancelada'
}

function confirmDeleteRoute(id: number) {
  if (!confirm('Tem certeza que deseja excluir esta rota?')) return

  const csrf = getCSRFToken && typeof getCSRFToken === 'function' ? getCSRFToken() : ''

  axios.delete(`http://localhost:8000/api/rotas/${id}/`, {
    withCredentials: true,
    headers: {
      'X-CSRFToken': csrf || ''
    }
  })
    .then(() => {
      loadRoutes()
      status.value = 'Rota excluída'
    })
    .catch(err => {
      console.error('Erro ao excluir rota:', err)
      if (err?.response?.status === 403) {
        status.value = 'Ação proibida (403) — verifique autenticação/CSRF'
      } else {
        status.value = 'Erro ao excluir rota'
      }
    })
}
</script>

<template>
  <div class="route-management-page">
    <div class="order-select-container">
      <div>
        <label for="order-select">Selecione o pedido:</label>
        <select id="order-select" disabled class="order-select">
          <option>--</option>
        </select>
      </div>

      <div class="controls">
        <button @click="openStationModal()">Adicionar Estação</button>
        <button @click="startRouteCreation">Nova Rota</button>
        <button @click="toggleEditMode">{{ editMode ? 'Visualizar' : 'Editar' }}</button>
        <button @click="reload">Atualizar</button>
      </div>

      <div v-if="status" class="status">{{ status }}</div>

      <div class="station-and-routes">
        <div class="station-list">
          <h3>Estações</h3>
          <div v-for="s in stations" :key="s.id" class="station-item" @click="focusStation(s)">
            <strong>{{ s.nome }}</strong>
            <div class="small">{{ s.endereco || '' }}</div>
          </div>
        </div>

        <div class="route-list">
          <h3>Rotas</h3>
          <div v-for="r in routes" :key="r.id" class="route-item">
            <strong @click="fitRoute(r)">{{ r.nome }}</strong>
            <div class="small">Estações: {{ r.estacoes?.length || 0 }}</div>
            <div class="actions"><button @click="confirmDeleteRoute(r.id)">Excluir</button></div>
          </div>
        </div>
      </div>
    </div>

    <MapLeaflet
      :stations="stations"
      :routes="routes"
      :editMode="editMode"
      :creatingRoute="creatingRoute"
      @map-click="onMapClick"
      @station-drag="onStationDragged"
      @station-click="onStationClick"
      @add-to-route="addToCurrentRoute"
    />

    <StationModal
      v-if="modalOpen"
      :station="editingStation"
      @save="handleSaveStation"
      @delete="handleDeleteStation"
      @close="closeStationModal"
    />

    <RouteCreator
      v-if="creatingRoute"
      :currentRoute="currentRoute"
      @finish="finishRoute"
      @cancel="cancelRouteCreation"
      @remove="removeFromCurrentRoute"
    />
  </div>
</template>

<style scoped>
.route-management-page { 
  display:flex; 
  flex-direction:column; 
  gap:1rem; 
  padding:1rem; 
  min-height: calc(100vh - 32px); 
  box-sizing: border-box; }
.order-select-container { max-width: 1200px; 
  margin:0 auto; 
  display:flex; gap:1rem; 
  flex-direction:column; 
  width:100%;  
  align-items: center;
 }
.controls { display:flex; 
  gap:0.6rem; 
  flex-wrap:wrap; 
  justify-content: center;
}
.controls button { 
  padding:0.5rem 0.8rem; 
  border-radius:6px; 
  border:none; 
  background:#2d8a3a; 
  color:#fff; 
  cursor:pointer; }
.station-and-routes { display:flex; gap:1rem; flex-wrap:wrap; align-items:flex-start; }
.station-list, .route-list { background:#fff; padding:0.6rem; border-radius:8px; width:280px; max-height:420px; overflow:auto; box-shadow:0 4px 12px rgba(0,0,0,0.04); }
@media (max-width: 900px) {
  .station-list, .route-list { width: 100%; max-height: 240px; }
  .order-select-container { padding-bottom: 0.5rem; }
}
.station-item, .route-item { padding:0.4rem; border-bottom:1px solid #f0f0f0; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:8px; }
.small { font-size:0.85rem; color:#666; }
.status { margin-top:0.4rem; color:#333; }

/* Map container is inside MapLeaflet component; ensure map does not overlap modals */
.route-management-page > *:not(.order-select-container) { position:relative; z-index:0; }

/* Ensure modals and route creator are above the map (MapLeaflet uses z-index:0) */
.modal-backdrop { z-index: 2200 !important; }
.route-creator { z-index: 2100 !important; position: fixed; right: 16px; top: 88px; width: 320px; max-width: calc(100% - 32px); }

/* Small accessibility tweaks */
.route-creator[role="dialog"] { box-shadow: 0 8px 40px rgba(0,0,0,0.12); background:#fff; padding:12px; border-radius:8px; }
</style>