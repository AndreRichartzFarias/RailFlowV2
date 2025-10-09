<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  content: string
  created_at: string
  train: { number?: string | number } | number | null
  onDelete?: () => void // Optional callback for delete
}>()

const trainNumber = computed(() =>
  typeof props.train === 'object' && props.train
    ? props.train.number ?? 'N/A'
    : props.train ?? 'N/A'
)

const formattedDate = computed(() =>
  props.created_at ? new Date(props.created_at).toLocaleString() : ''
)
</script>

<template>
  <div class="alert-card">
    <button
      class="delete-btn"
      type="button"
      aria-label="Excluir alerta"
      @click="props.onDelete && props.onDelete()"
    >
      &times;
    </button>
    <h3 class="alert-title">{{ title }}</h3>
    <p class="alert-content">{{ content }}</p>
    <div class="alert-meta">
      <span class="alert-train">Trem: {{ trainNumber }}</span>
      <span class="alert-date">{{ formattedDate }}</span>
    </div>
  </div>
</template>

<style scoped>
.alert-card {
  background: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  background: transparent;
  border: none;
  color: #b00020;
  font-size: 1.4rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0.1rem 0.5rem;
  border-radius: 50%;
  transition: background 0.15s;
  z-index: 2;
  line-height: 1;
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

.alert-meta {
  display: flex;
  justify-content: space-between;
  color: #888;
  font-size: 0.92rem;
  margin-top: 0.3rem;
}

@media (max-width: 500px) {
  .alert-card {
    padding: 0.8rem 0.7rem;
  }
  .alert-title {
    font-size: 1rem;
  }
  .alert-content {
    font-size: 0.96rem;
  }
  .delete-btn {
    top: 0.4rem;
    right: 0.4rem;
    font-size: 1.2rem;
    padding: 0.1rem 0.35rem;
  }
}
</style>