<template>
  <teleport to="body">
    <div class="rc-backdrop" @click.self="$emit('cancel')" role="presentation">
      <div class="route-creator" role="dialog" aria-label="Criar rota" aria-modal="true">
        <div class="rc-header">
          <strong>Criando Nova Rota</strong>
          <button class="rc-close" @click="$emit('cancel')" aria-label="Fechar">✕</button>
        </div>

        <p class="rc-note">Clique nas estações no mapa para adicioná-las</p>

        <label>Nome da Rota</label>
        <input ref="nameInput" v-model="name" placeholder="Ex: Rota Sul-Norte" />

        <div class="stations-list" role="list">
          <div v-for="(s, idx) in currentRoute" :key="s.id" class="item" role="listitem">
            <span class="item-label">{{ idx + 1 }}. {{ s.nome }}</span>
            <div class="item-actions">
              <button class="btn small" @click="$emit('remove', idx)">Remover</button>
            </div>
          </div>
        </div>

        <div class="controls">
          <button class="btn btn-success" @click="finish">Finalizar Rota</button>
          <button class="btn btn-danger" @click="$emit('cancel')">Cancelar</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{ currentRoute: any[] }>()
const emit = defineEmits<{
  (e:'finish', payload:{name?:string}):void
  (e:'cancel'):void
  (e:'remove', idx:number):void
}>()

const name = ref('')
const nameInput = ref<HTMLInputElement | null>(null)

watch(() => props.currentRoute, () => {
  if (props.currentRoute.length === 0) name.value = ''
}, { immediate: true })

onMounted(() => {
  setTimeout(() => nameInput.value?.focus(), 50)
})

function finish() {
  emit('finish', { name: name.value })
}
</script>



<style scoped>
.rc-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
  box-sizing: border-box;
  z-index: 120000;
  overflow: auto;
}

/* Modal card */
.route-creator {
  width: 360px;
  max-width: calc(100% - 40px);
  margin-top: 60px;
  background: #fff;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.18);
  z-index: 120010;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: calc(100vh - 120px);
  overflow: auto;
  box-sizing: border-box;
}

/* Header */
.rc-header { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.rc-close { background:transparent; border:none; font-size:16px; cursor:pointer; padding:6px; border-radius:6px; }
.rc-close:hover { background:#f0f0f0 }
.rc-note { margin:0; color:#666; font-size:0.95rem }

/* Station list */
.stations-list { max-height: 220px; overflow:auto; margin:0.5rem 0; display:flex; flex-direction:column; gap:0.4rem; }
.item { display:flex; justify-content:space-between; align-items:center; background:#fafafa; padding:0.45rem; border-radius:6px; }
.item-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 220px; display: inline-block; vertical-align: middle; }
.item-actions { display:flex; gap:8px; align-items:center; }

/* Controls */
.controls { display:flex; gap:0.5rem; justify-content:flex-end; flex-wrap:wrap; }
.btn { padding:0.4rem 0.6rem; border-radius:6px; border:none; cursor:pointer; background:#e0e0e0; }
.btn-danger { background:#b00020; color:#fff; }
.btn-success { background:#2d8a3a; color:#fff; }
.small { font-size:0.85rem; padding:0.25rem 0.4rem; }

/* Responsive: center-bottom on small screens (modal behavior) */
@media (max-width: 700px) {
  .rc-backdrop { align-items: flex-end; justify-content: center; padding: 12px; }
  .route-creator {
    width: calc(100% - 24px);
    margin: 0 0 12px;
    max-height: 50vh;
    border-radius: 12px;
  }
  .controls { justify-content: space-between; }
  .item-label { max-width: 60%; }
}

/* Ensure inputs don't overflow (if reused inside) */
input { min-width: 0; width: 100%; box-sizing: border-box; padding: 8px; border-radius: 6px; border: 1px solid #ddd; }
</style>