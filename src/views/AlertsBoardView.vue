<script setup lang="ts">
// filepath: c:\Users\andre_r_farias\Documents\Trabalhos\RailFlowV2\src\views\AlertsBoardView.vue
import { ref, onMounted } from 'vue'
import axios from 'axios'

const alertMessage = ref('Carregando alerta...')

onMounted(async () => {
  try {
    const [trainRes, alertRes] = await Promise.all([
      axios.get('http://localhost:8000/trains/1/'),
      axios.get('http://localhost:8000/alerts/1/')
    ])
    const train = trainRes.data
    const alert = alertRes.data

    if (train && alert) {
      alertMessage.value = `Trem ${train.number} está atrasado devido a ${alert.message}`
    } else {
      alertMessage.value = 'Dados do alerta ou trem não encontrados.'
    }
  } catch (error) {
    alertMessage.value = 'Erro ao carregar alerta.'
  }
})
</script>

<template>
  <div>
    <h1>Alertas</h1>
    <p>{{ alertMessage }}</p>
  </div>
</template>