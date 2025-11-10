<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()
const routesCount = ref(null)
const stationsCount = ref(null)

onMounted(async () => {
  // try to fetch user and simple counts (best-effort)
  auth.fetchUser().catch(() => {})
  try {
    const r = await axios.get('http://localhost:8000/api/rotas/', { withCredentials: true })
    const data = r.data.results || r.data
    routesCount.value = Array.isArray(data) ? data.length : null
  } catch (e) {
    routesCount.value = null
  }
  try {
    const s = await axios.get('http://localhost:8000/api/estacoes/', { withCredentials: true })
    const sd = s.data.results || s.data
    stationsCount.value = Array.isArray(sd) ? sd.length : null
  } catch (e) {
    stationsCount.value = null
  }
})

function goTo(path) {
  router.push(path)
}
</script>

<template>
  <main class="home-container">
    <section class="hero">
      <div class="hero-inner">
        <h1>RailFlow — Gestão Ferroviária</h1>
        <p class="lead">Painel simples para visualizar rotas, gerenciar estações e acompanhar manutenções.</p>

        <div class="hero-ctas">
          <button class="btn btn-primary" @click="goTo('/dashboard')">Ver Dashboard</button>
          <button class="btn" @click="goTo('/routemanagement')">Gerenciar Rotas</button>
        </div>

        <div class="stats">
          <div class="stat">
            <div class="num">{{ routesCount ?? '-' }}</div>
            <div class="label">Rotas</div>
          </div>
          <div class="stat">
            <div class="num">{{ stationsCount ?? '-' }}</div>
            <div class="label">Estações</div>
          </div>
        </div>
      </div>
    </section>

    <section class="about">
      <div class="about-inner">
        <h2>Sobre o sistema</h2>
        <p>RailFlow é uma interface leve para gerenciamento de rotas ferroviárias, estações e operações relacionadas. Foi feita para ser simples, responsiva e integrada a um backend Django REST.</p>

        <div class="features">
          <div class="feature">
            <h3>Mapas interativos</h3>
            <p>Visualize e crie rotas sobre um mapa, mova estações e estime distâncias automaticamente.</p>
          </div>

          <div class="feature">
            <h3>Gerenciamento</h3>
            <p>Adicione, edite e remova estações e rotas com permissões adequadas.</p>
          </div>

          <div class="feature">
            <h3>Extensível</h3>
            <p>API REST pronta para integrações com outros serviços e automações.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
:root { --accent: #2d8a3a; --muted: #6b7280; }
.home-container { display:block; color: #0b1220; }
.hero { padding: 48px 20px; background: #263449; color: #fff; }
.hero-inner { max-width: 1100px; margin: 0 auto; display:flex; flex-direction:column; gap:18px; align-items:flex-start; }
.hero h1 { margin:0; font-size: clamp(1.6rem, 3.6vw, 2.4rem); }
.lead { margin:0; color: rgba(255,255,255,0.9); }
.hero-ctas { display:flex; gap:12px; margin-top:12px; }
.btn { background:#fff; color:#0b1220; padding:10px 14px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
.btn-primary { background:var(--accent); color:#fff; }
.stats { display:flex; gap:16px; margin-top:16px; }
.stat { background: rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px; min-width:86px; text-align:center; }
.num { font-weight:700; font-size:1.1rem; }
.label { color: rgba(255,255,255,0.85); font-size:0.85rem; }

.about { padding: 36px 20px; background: #f7f7f7; color:#0b1220; }
.about-inner { max-width:1100px; margin:0 auto; display:flex; flex-direction:column; gap:18px; }
.features { display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-top:8px; }
.feature { background:#fff; padding:16px; border-radius:8px; box-shadow:0 6px 18px rgba(2,6,23,0.04); }
.feature h3 { margin:0 0 8px 0; }
.feature p { margin:0; color:var(--muted); }

@media (max-width: 900px) {
  .features { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .features { grid-template-columns: 1fr; }
  .hero-inner { align-items:stretch; }
  .hero-ctas { flex-direction:column; }
}
</style>