<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { getCSRFToken } from '../stores/auth'
const name = ref('')
const cnpj = ref('')
const phone = ref('')
const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function submitCompany() {
  error.value = ''
  success.value = ''
  loading.value = true
  if (!name.value || !cnpj.value) {
    error.value = 'Nome e CNPJ são obrigatórios.'
    loading.value = false
    return
  }
  try {
    await axios.post('http://localhost:8000/api/companies/', {
      name: name.value,
      cnpj: cnpj.value,
      phone: phone.value || null,
      email: email.value || null
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken()
      },
      withCredentials: true
    })
    success.value = 'Empresa cadastrada com sucesso!'
    name.value = ''
    cnpj.value = ''
    phone.value = ''
    email.value = ''
  } catch (e: any) {
    if (e.response?.data?.cnpj) {
      error.value = 'CNPJ já cadastrado.'
    } else if (e.response?.data?.detail) {
      error.value = e.response.data.detail
    } else {
      error.value = 'Erro ao cadastrar empresa.'
    }
  }
  loading.value = false
}
</script>

<template>
  <div class="insert-company">
    <h2>Cadastrar Empresa</h2>
    <form @submit.prevent="submitCompany">
      <div>
        <label for="name">Nome*</label>
        <input v-model="name" id="name" type="text" maxlength="50" required />
      </div>
      <div>
        <label for="cnpj">CNPJ*</label>
        <input v-model="cnpj" id="cnpj" type="text" maxlength="18" required />
      </div>
      <div>
        <label for="phone">Telefone</label>
        <input v-model="phone" id="phone" type="text" maxlength="11" />
      </div>
      <div>
        <label for="email">Email</label>
        <input v-model="email" id="email" type="email" maxlength="254" />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<style scoped>
.insert-company {
  max-width: 400px;
  margin: 5vh auto 0 auto;
  padding: 2rem 2rem 1.5rem 2rem;
  background: var(--gray-bg, #f7f7f7);
  border-radius: 12px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--neutral-text, #222);
  margin-bottom: 0.5rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

label {
  font-size: 1rem;
  color: var(--neutral-label, #444);
  margin-bottom: 0.3rem;
  display: block;
}

input[type="text"],
input[type="email"] {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  font-size: 1rem;
  color: #222;
  transition: border 0.2s;
}

input:focus {
  border-color: #888;
  outline: none;
}

button[type="submit"] {
  width: 100%;
  padding: 0.8rem 0;
  background: #e0e0e0;
  color: #222;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

button[type="submit"]:hover:enabled {
  background: #cccccc;
}

.error {
  color: #b00020;
  background: #fbeaec;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.success {
  color: #227d3b;
  background: #eafbf2;
  border-radius: 4px;
  padding: 0.5rem 0.8rem;
  font-size: 0.98rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

@media (max-width: 500px) {
  .insert-company {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}
</style>