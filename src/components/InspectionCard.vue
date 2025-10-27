<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'

const props = defineProps<{
  cardId?: number
  train?: { number?: string | number } | number | string | null
  reason_description?: string | null
  reason?: { id?: number; description?: string } | number | string | null
  date?: string | null
  notes?: string | null
  onDelete?: () => void
}>()

const emit = defineEmits<{
  (e: 'updated', payload: any): void
  (e: 'error', message: string): void
}>()

const editing = ref(false)
const saving = ref(false)
const reasons = ref<any[]>([])
const editReasonId = ref<number | string | ''>('')
const editNotes = ref(props.notes ?? '')

// compute train number display (accept string/number/object)
const trainNumber = computed(() =>
  typeof props.train === 'object' && props.train
    ? props.train.number ?? 'N/A'
    : props.train ?? 'N/A'
)

// helper to compute formatted date
const formattedDate = computed(() => props.date ? new Date(props.date).toLocaleString() : '')

// display reason label (fallbacks)
const currentReasonLabel = computed(() => {
  if (props.reason && typeof props.reason === 'object') return props.reason.description ?? String(props.reason.id ?? '')
  if (props.reason && (typeof props.reason === 'number' || typeof props.reason === 'string')) {
    const found = reasons.value.find(r => String(r.id) === String(props.reason))
    if (found) return found.description ?? found.name ?? String(found.id)
    return props.reason_description ?? String(props.reason)
  }
  return props.reason_description ?? ''
})

// fetch available reasons (use correct endpoints for ReasonInspection)
async function fetchReasons() {
  const endpoints = [
    'http://localhost:8000/api/reasoninspections/',    // primary
    'http://localhost:8000/api/reasoninspection/',
    'http://localhost:8000/api/reason_inspections/',
    'http://localhost:8000/api/reason_inspection/',
  ]
  for (const url of endpoints) {
    try {
      const res = await axios.get(url, { withCredentials: true })
      const data = res.data.results || res.data
      if (Array.isArray(data) && data.length > 0) {
        reasons.value = data
        // initialize editReasonId sensibly after we have reason list
        if (!editReasonId.value) {
          if (props.reason && typeof props.reason === 'object' && props.reason.id) editReasonId.value = props.reason.id
          else if (props.reason !== undefined && props.reason !== null) editReasonId.value = props.reason
          else {
            const matched = data.find((r: any) => (r.description ?? r.name) === props.reason_description)
            if (matched) editReasonId.value = matched.id
          }
        }
        return
      }
    } catch (e) {
      // try next endpoint silently
    }
  }
  // leave reasons empty if none found
}

function startEdit() {
  editNotes.value = props.notes ?? ''
  if (props.reason && typeof props.reason === 'object' && props.reason.id) editReasonId.value = props.reason.id
  else if (props.reason !== undefined && props.reason !== null) editReasonId.value = props.reason
  else {
    const matched = reasons.value.find(r => (r.description ?? r.name) === props.reason_description)
    editReasonId.value = matched ? matched.id : ''
  }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  saving.value = false
}

// save: PATCH selected reason id and notes
async function saveEdit() {
  if (!props.cardId) {
    emit('error', 'Missing inspection id')
    return
  }
  saving.value = true
  try {
    const payload: any = { notes: editNotes.value }
    if (editReasonId.value !== '' && editReasonId.value !== null) {
      const parsed = Number(editReasonId.value)
      if (!Number.isNaN(parsed)) payload.reason = parsed
      else payload.reason = editReasonId.value
    }
    const res = await axios.patch(
      `http://localhost:8000/api/inspections/${props.cardId}/`,
      payload,
      {
        withCredentials: true,
        headers: { 'X-CSRFToken': getCSRFToken() }
      }
    )
    emit('updated', res.data)
    editing.value = false
  } catch (e: any) {
    console.error('Failed to save inspection', e)
    emit('error', 'Erro ao salvar inspeção.')
  } finally {
    saving.value = false
  }
}

onMounted(fetchReasons)
</script>

<template>
  <div class="inspection-card" :class="{ editing: editing }">
    <div class="card-actions">
      <button
        v-if="!editing"
        class="icon-btn edit-btn"
        type="button"
        aria-label="Editar inspeção"
        @click="startEdit"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
          <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
        </svg>
      </button>

      <button
        v-else
        class="icon-btn save-btn"
        type="button"
        :disabled="saving"
        aria-label="Salvar inspeção"
        @click="saveEdit"
      >
        Salvar
      </button>

      <button
        v-if="editing"
        class="icon-btn cancel-btn"
        type="button"
        :disabled="saving"
        aria-label="Cancelar edição"
        @click="cancelEdit"
      >
        Cancelar
      </button>

      <button
        class="delete-btn"
        type="button"
        aria-label="Excluir inspeção"
        @click="props.onDelete && props.onDelete()"
      >&times;</button>
    </div>

    <template v-if="!editing">
      <h2>Trem: {{ trainNumber }}</h2>
      <p><strong>Motivo:</strong> {{ currentReasonLabel }}</p>
      <p><strong>Data:</strong> {{ formattedDate }}</p>
      <p v-if="props.notes"><strong>Notas:</strong> {{ props.notes }}</p>
    </template>

    <template v-else>
      <h2>Trem: {{ trainNumber }}</h2>

      <label for="reason-select" class="sr-only">Motivo</label>

      <div v-if="reasons.length">
        <select id="reason-select" class="inline-input" v-model="editReasonId">
          <option value="" disabled>Selecione um motivo</option>
          <option v-for="r in reasons" :key="r.id" :value="r.id">
            {{ r.description ?? r.name ?? r.id }}
          </option>
        </select>
      </div>

      <div v-else>
        <!-- fallback when reasons haven't loaded or endpoint differs -->
        <input readonly class="inline-input" :value="currentReasonLabel" />
      </div>

      <label class="sr-only">Notas</label>
      <textarea class="inline-textarea" v-model="editNotes" rows="3" />
    </template>
  </div>
</template>

<style scoped>
.inspection-card {
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 1px 8px 0 rgba(0,0,0,0.04);
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
  gap: 0.35rem;
  align-items: center;
  z-index: 3;
}

/* when editing reserve extra top padding so buttons don't overlap inputs */
.inspection-card.editing {
  padding-top: 2.2rem;
}

.icon-btn,
.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.12rem 0.45rem;
  border-radius: 6px;
  font-size: 1rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* edit/save/cancel styles */
.edit-btn { color: #0b76ef; width:32px; height:32px; }
.save-btn { color: #0b7630; padding: 0.2rem 0.6rem; }
.cancel-btn { color: #444; padding: 0.2rem 0.6rem; }

.delete-btn {
  color: #b00020;
  font-size: 1.2rem;
  font-weight: bold;
  width: 32px;
  height: 32px;
  padding: 0;
}

/* inputs / select / textarea */
.inline-input,
.inline-textarea,
select.inline-input {
  width: 100%;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  box-sizing: border-box;
  margin-top: 0.35rem;
}

/* accessibility helper */
.sr-only { position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* Responsive: move actions into flow on small screens */
@media (max-width: 500px) {
  .inspection-card { padding: 1rem; }
  .card-actions {
    position: static;
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 0.45rem;
  }
  .icon-btn, .delete-btn { width:36px; height:36px; padding:0; }
}
</style>