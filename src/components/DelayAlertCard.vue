<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'

const props = defineProps<{
  cardId?: number
  title: string
  content: string
  created_at: string | null
  train?: { number?: string | number } | number | null
  alert?: { id?: number; message?: string } | string | null
  onDelete?: () => void
}>();

const emit = defineEmits<{
  (e: 'updated', payload: any): void
  (e: 'error', message: string): void
}>()

const editing = ref(false)
const saving = ref(false)
const editTitle = ref(props.title)
const editContent = ref(props.content)

const trainNumber = computed(() =>
  typeof props.train === 'object' && props.train
    ? props.train.number ?? 'N/A'
    : props.train ?? 'N/A'
)

const formattedDate = computed(() =>
  props.created_at ? new Date(props.created_at).toLocaleString() : ''
)

const alertMessage = computed(() => {
  if (!props.alert) return ''
  return typeof props.alert === 'string' ? props.alert : (props.alert.message ?? '')
})

function startEdit() {
  editTitle.value = props.title
  editContent.value = props.content
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  saving.value = false
}

// save: PATCH to backend and emit updated payload
async function saveEdit() {
  if (!props.cardId) {
    emit('error', 'Missing card id')
    return
  }
  saving.value = true
  try {
    const payload: any = {
      title: editTitle.value,
      content: editContent.value
    }
    const res = await axios.patch(
      `http://localhost:8000/api/alertcards/${props.cardId}/`,
      payload,
      {
        withCredentials: true,
        headers: { 'X-CSRFToken': getCSRFToken() }
      }
    )
    // emit updated object so parent can sync its list
    emit('updated', res.data)
    editing.value = false
  } catch (e: any) {
    console.error('Failed to save alert card', e)
    emit('error', 'Erro ao salvar alteração.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="alert-card">
    <div class="card-actions">
      <button
        v-if="!editing"
        class="icon-btn edit-btn"
        type="button"
        aria-label="Editar alerta"
        @click="startEdit"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/>
          <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
        </svg>
      </button>

      <button
        v-else
        class="icon-btn save-btn"
        type="button"
        :disabled="saving"
        aria-label="Salvar alerta"
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
        aria-label="Excluir alerta"
        @click="props.onDelete && props.onDelete()"
      >
        &times;
      </button>
    </div>

    <template v-if="!editing">
      <h3 class="alert-title">{{ props.title }}</h3>
      <p class="alert-content">{{ props.content }}</p>
    </template>

    <template v-else>
      <input class="inline-input title-input" v-model="editTitle" />
      <textarea class="inline-textarea" v-model="editContent" rows="3" />
    </template>

    <div class="alert-meta">
      <span class="alert-train">Trem: {{ trainNumber }}</span>
      <span class="alert-alert">Categoria: {{ alertMessage }}</span>
      <span class="alert-date">{{ formattedDate }}</span>
    </div>
  </div>
</template>

// ...existing code...
<style scoped>
.alert-card {
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  /* keep some top padding so absolute actions don't overlap content on desktop */
  padding: 1.8rem 1.5rem 1.2rem 1.5rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

/* actions are positioned at the top-right on larger screens */
.card-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.35rem;
  align-items: center;
  z-index: 3;
  flex-wrap: nowrap;
}

/* ensure inputs start below the reserved header area */
.title-input,
.inline-input,
.inline-textarea {
  margin-top: 0.4rem;
  box-sizing: border-box;
  width: 100%;
}

/* buttons */
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
  box-sizing: border-box;
}

/* edit button style */
.edit-btn {
  color: #0b76ef;
  width: 32px;
  height: 32px;
}
.edit-btn svg { color: #0b76ef; }
.edit-btn:hover,
.edit-btn:focus {
  background: rgba(11,118,239,0.08);
  outline: none;
}

/* delete button style */
.delete-btn {
  color: #b00020;
  font-size: 1.2rem;
  font-weight: bold;
  width: 32px;
  height: 32px;
  padding: 0;
}
.delete-btn:hover,
.delete-btn:focus {
  background: #fbeaec;
  outline: none;
}

.alert-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--neutral-text, #222);
  margin: 0;
}

.alert-content {
  color: var(--neutral-label, #444);
  font-size: 1rem;
  margin: 0;
}

/* allow meta items to wrap on small screens so they don't overflow to the right */
.alert-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 0.92rem;
  margin-top: 0.3rem;
  gap: 0.6rem;
  flex-wrap: wrap;
}

/* inputs inside edit mode */
.inline-textarea {
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  resize: vertical;
  box-sizing: border-box;
}

/* save / cancel */
.save-btn {
  color: #0b7630;
  background: transparent;
  border: none;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.cancel-btn {
  color: #444;
  background: transparent;
  border: none;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.save-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 500px) {
  .alert-card {
    padding: 0.9rem 0.9rem 1rem 0.9rem;
  }

  .card-actions {
    position: static;
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 0.45rem;
    gap: 0.4rem;
    align-self: stretch;
  }

  .icon-btn, .delete-btn, .edit-btn {
    width: 36px;
    height: 36px;
    padding: 0;
  }

  .edit-btn svg {
    width: 16px;
    height: 16px;
  }

  .alert-title {
    font-size: 1rem;
  }

  .alert-content {
    font-size: 0.96rem;
  }

  .alert-meta {
    gap: 0.4rem;
  }
}
</style>
