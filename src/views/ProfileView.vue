<template>
  <main class="profile-page">
    <div class="card">
      <header class="card-header">
        <h2>Meu Perfil</h2>
        <div class="header-actions">
          <button class="btn-logout" @click="doLogout">Sair</button>
        </div>
      </header>

      <div v-if="loading" class="muted">Carregando...</div>

      <form v-else class="profile-form" @submit.prevent>
        <div class="field-row" v-for="field in fields" :key="field.key">
          <label class="field-label">{{ field.label }}</label>

          <div class="field-control">
            <div v-if="!editing[field.key]" class="value-row">
              <span class="value-text">{{ form[field.key] || '-' }}</span>
              <button type="button" class="btn-edit" @click="toggleEdit(field.key)" aria-label="Editar {{ field.label }}">✎</button>
            </div>

            <div v-else class="edit-row">
              <input v-model="temp[field.key]" :type="field.type || 'text'" :placeholder="field.placeholder || ''" />
              <div class="edit-actions">
                <button type="button" class="btn" @click="saveField(field.key)" :disabled="saving[field.key]">Salvar</button>
                <button type="button" class="btn btn-cancel" @click="cancelField(field.key)" :disabled="saving[field.key]">Cancelar</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">{{ success }}</div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const error = ref('')
const success = ref('')

const form = reactive({ id: null, email: '', first_name: '', last_name: '' })
const temp = reactive({ email: '', first_name: '', last_name: '' })
const editing = reactive({ email: false, first_name: false, last_name: false })
const saving = reactive({ email: false, first_name: false, last_name: false })

const fields = [
  { key: 'first_name', label: 'Primeiro nome', placeholder: 'Seu primeiro nome' },
  { key: 'last_name', label: 'Último nome', placeholder: 'Seu último nome' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'seu@exemplo.com' }
]

function getCookie(name) {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return match ? decodeURIComponent(match[2]) : null
}

const API_ME = 'http://localhost:8000/api/me/'

async function load() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const res = await axios.get(API_ME, { withCredentials: true })
    const data = res.data || {}
    form.id = data.id || null
    form.email = data.email || ''
    form.first_name = data.first_name || ''
    form.last_name = data.last_name || ''
    // initialize temp values
    temp.email = form.email
    temp.first_name = form.first_name
    temp.last_name = form.last_name
  } catch (e) {
    console.error('Profile load error', e)
    if (e?.response) {
      error.value = `Erro ao carregar perfil: ${e.response.status} ${JSON.stringify(e.response.data)}`
    } else {
      error.value = 'Não foi possível carregar seus dados.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (auth && typeof auth.fetchUser === 'function') {
    await auth.fetchUser().catch(() => {})
  }
  await load()
})

function toggleEdit(key) {
  editing[key] = true
  temp[key] = form[key]
  error.value = ''
  success.value = ''
}

function cancelField(key) {
  editing[key] = false
  temp[key] = form[key]
}

async function saveField(key) {
  error.value = ''
  success.value = ''
  if (key === 'email' && (!temp.email || !String(temp.email).includes('@'))) {
    error.value = 'Email inválido.'
    return
  }
  saving[key] = true
  try {
    const csrf = getCookie('csrftoken') || ''
    const payload = { [key]: temp[key] }
    const res = await axios.patch(API_ME, payload, { withCredentials: true, headers: { 'X-CSRFToken': csrf } })
    // if backend returns updated object, update form from response
    const updated = res.data || {}
    form[key] = updated[key] !== undefined ? updated[key] : temp[key]
    editing[key] = false
    success.value = 'Alteração salva.'
    if (auth && typeof auth.fetchUser === 'function') await auth.fetchUser().catch(()=>{})
  } catch (e) {
    console.error('Profile save error', e)
    if (e?.response) error.value = `Erro ao salvar: ${e.response.status} ${JSON.stringify(e.response.data)}`
    else error.value = 'Erro ao salvar dados.'
  } finally {
    saving[key] = false
  }
}

async function doLogout() {
  try {
    if (auth && typeof auth.logout === 'function') {
      await auth.logout()
    }
  } catch (e) {
    console.error('Logout error', e)
  }
  router.push('/login')
}
</script>

<style scoped>
.profile-page { display:flex; align-items:center; justify-content:center; padding: 24px; min-height: calc(100vh - 72px); box-sizing:border-box; }
.card { width:100%; max-width:720px; background:#fff; border-radius:10px; padding:20px; box-shadow:0 12px 40px rgba(0,0,0,0.06); }
.card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px }
.header-actions { display:flex; gap:8px }
.profile-form { display:flex; flex-direction:column; gap:14px }
.field-row { display:flex; gap:12px; align-items:center; }
.field-label { width:160px; font-weight:700; color:#333 }
.field-control { flex:1; display:flex; flex-direction:column; }
.value-row { display:flex; align-items:center; gap:8px }
.value-text { padding:10px 12px; background:#f8f9fb; border-radius:8px; min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }
.btn-edit { background:transparent; border:none; cursor:pointer; padding:6px 8px; font-size:14px }
.edit-row { display:flex; gap:8px; align-items:center }
.edit-row input { padding:10px; border-radius:8px; border:1px solid #ddd; min-width:0; flex:1 }
.edit-actions { display:flex; gap:8px }
.btn { padding:8px 12px; border-radius:8px; border:none; cursor:pointer; background:#eee }
.btn-cancel { background:#f3f4f6 }
.btn-primary { background:#2d8a3a; color:#fff }
.btn-logout { background:#b00020; color:#fff; border:none; padding:8px 12px; border-radius:8px }
.muted { color:#666 }
.error { color:#b00020 }
.success { color:#2d8a3a }

@media (max-width:600px) {
  .card { padding:16px }
  .field-row { flex-direction:column; align-items:flex-start }
  .field-label { width:100%; margin-bottom:6px }
  .edit-actions { width:100%; }
}
</style>