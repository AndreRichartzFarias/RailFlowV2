<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'

const props = defineProps<{
  cardId?: number
  name?: string
  cnpj?: string
  phone?: string | null
  email?: string | null
  created_at?: string | null
  onDelete?: () => void
}>()

const emit = defineEmits<{
  (e: 'updated', payload: any): void
  (e: 'error', message: string): void
}>()

const editing = ref(false)
const saving = ref(false)

const editName = ref(props.name ?? '')
const editCnpj = ref(props.cnpj ?? '')
const editPhone = ref(props.phone ?? '')
const editEmail = ref(props.email ?? '')

const createdAt = computed(() =>
  props.created_at ? new Date(props.created_at).toLocaleString() : '—'
)

function startEdit() {
  editName.value = props.name ?? ''
  editCnpj.value = props.cnpj ?? ''
  editPhone.value = props.phone ?? ''
  editEmail.value = props.email ?? ''
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  saving.value = false
}

async function saveEdit() {
  if (!props.cardId) {
    emit('error', 'Missing company id')
    return
  }
  saving.value = true
  try {
    const payload: any = {
      name: editName.value,
      cnpj: editCnpj.value,
      phone: editPhone.value,
      email: editEmail.value
    }
    const res = await axios.patch(
      `http://localhost:8000/api/companies/${props.cardId}/`,
      payload,
      { withCredentials: true, headers: { 'X-CSRFToken': getCSRFToken() } }
    )
    emit('updated', res.data)
    editing.value = false
  } catch (e: any) {
    console.error('Failed to save company', e)
    emit('error', 'Erro ao salvar empresa.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="company-card" :class="{ editing: editing }">
    <div class="card-actions">
      <button
        v-if="!editing"
        class="icon-btn edit-btn"
        type="button"
        aria-label="Editar empresa"
        @click="startEdit"
      >
        ✎
      </button>

      <button
        v-else
        class="icon-btn save-btn"
        type="button"
        :disabled="saving"
        aria-label="Salvar empresa"
        @click="saveEdit"
      >
        Salvar
      </button>

      <button
        v-if="editing"
        class="icon-btn cancel-btn"
        type="button"
        :disabled="saving"
        aria-label="Cancelar"
        @click="cancelEdit"
      >
        Cancelar
      </button>

      <button
        class="delete-btn"
        type="button"
        aria-label="Excluir empresa"
        @click="props.onDelete && props.onDelete()"
      >&times;</button>
    </div>

    <template v-if="!editing">
      <h2>{{ props.name }}</h2>
      <p><strong>CNPJ:</strong> {{ props.cnpj }}</p>
      <p><strong>Telefone:</strong> {{ props.phone || '—' }}</p>
      <p><strong>Email:</strong> {{ props.email || '—' }}</p>
      <p><strong>Criada em:</strong> {{ createdAt }}</p>
    </template>

    <template v-else>
      <label class="sr-only">Nome</label>
      <input class="inline-input" v-model="editName" />

      <label class="sr-only">CNPJ</label>
      <input class="inline-input" v-model="editCnpj" />

      <label class="sr-only">Telefone</label>
      <input class="inline-input" v-model="editPhone" />

      <label class="sr-only">Email</label>
      <input class="inline-input" v-model="editEmail" type="email" />
    </template>
  </div>
</template>

<style scoped>
.company-card {
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 1px 8px rgba(0,0,0,0.04);
  padding: 1rem 1.2rem;
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

/* reserve top space while editing to avoid overlap */
.company-card.editing { padding-top: 2.2rem; }

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
  .company-card { padding: 1rem; }
  .card-actions { position: static; margin-bottom: 0.45rem; justify-content:flex-end; }
  .icon-btn, .delete-btn { width:36px; height:36px; padding:0; }
}
</style>