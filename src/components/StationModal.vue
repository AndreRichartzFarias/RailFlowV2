<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ station: any | null }>()
const emit = defineEmits<{
  (e: 'save', payload:any): void
  (e: 'delete', id:number): void
  (e: 'close'): void
}>()

const form = ref<any>({ id: null, nome: '', endereco: '', latitude: 0, longitude: 0 })
const error = ref('')

watch(() => props.station, (s) => {
  if (s) form.value = { ...s }
  else form.value = { id: null, nome: '', endereco: '', latitude: 0, longitude: 0 }
}, { immediate: true })

function validate() {
  error.value = ''
  if (!form.value.nome || !String(form.value.nome).trim()) {
    error.value = 'Nome é obrigatório.'
    return false
  }
  const lat = Number(form.value.latitude)
  const lng = Number(form.value.longitude)
  if (Number.isNaN(lat) || lat < -90 || lat > 90) {
    error.value = 'Latitude inválida.'
    return false
  }
  if (Number.isNaN(lng) || lng < -180 || lng > 180) {
    error.value = 'Longitude inválida.'
    return false
  }
  return true
}

function save() {
  if (!validate()) return
  const payload: any = {
    nome: String(form.value.nome).trim(),
    endereco: form.value.endereco ? String(form.value.endereco).trim() : '',
    latitude: Number(form.value.latitude),
    longitude: Number(form.value.longitude)
  }
  if (form.value.id) payload.id = form.value.id
  emit('save', payload)
}

function del() {
  if (!form.value.id) return
  if (!confirm('Excluir estação?')) return
  emit('delete', form.value.id)
}

function close() {
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <div class="modal-backdrop" @click.self="close" role="dialog" aria-modal="true">
      <div class="modal" role="document">
        <header>
          <h3>{{ station?.id ? 'Editar Estação' : 'Adicionar Estação' }}</h3>
          <button class="close" @click="close" aria-label="Fechar">✕</button>
        </header>

        <form @submit.prevent="save">
          <input type="hidden" v-model="form.id" />

          <label>Nome</label>
          <input v-model="form.nome" required />

          <label>Endereço</label>
          <input v-model="form.endereco" />

          <div class="row">
            <div>
              <label>Latitude</label>
              <input type="number" step="0.000001" v-model.number="form.latitude" required />
            </div>
            <div>
              <label>Longitude</label>
              <input type="number" step="0.000001" v-model.number="form.longitude" required />
            </div>
          </div>

          <div v-if="error" class="error">{{ error }}</div>

          <div class="actions">
            <button class="btn" type="submit">Salvar</button>
            <button class="btn btn-danger" type="button" v-if="form.id" @click="del">Excluir</button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  background: rgba(0,0,0,0.35);
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
}

.modal {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
  box-sizing: border-box;
  max-height: 90vh;
  overflow: auto;
}

/* rest of styles... (keeps responsive rules already present) */
header { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; flex-wrap:wrap; }
header h3 { margin:0; font-size:1.05rem; word-break:break-word; }
.close { background:transparent; border:none; font-size:20px; cursor:pointer; color:#333; padding:6px; border-radius:6px; }
form { display:flex; flex-direction:column; gap:10px; }
label { display:block; margin-bottom:6px; font-weight:600; color:#222; word-break:break-word; }
input[type="text"], input[type="number"], textarea { width:100%; min-width:0; box-sizing:border-box; padding:10px; border-radius:6px; border:1px solid #ddd; background:rgba(255,255,255,0.95); font-size:0.95rem; }
.row { display:flex; gap:8px; flex-wrap:wrap; }
.row > div { flex:1 1 160px; min-width:0; }
.actions { display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; }
.btn { padding:0.45rem 0.6rem; border-radius:6px; border:none; cursor:pointer; background:#e0e0e0; font-weight:600; }
.btn-danger { background:#b00020; color:white; }
.error { color:#b00020; margin-top:6px; font-size:0.95rem; }

@media (max-width:520px) {
  .modal { padding:12px; }
  .close { font-size:18px; }
  header h3 { font-size:1rem; }
  .actions { justify-content:stretch; }
  .actions .btn { flex:1 1 auto; }
}
</style>