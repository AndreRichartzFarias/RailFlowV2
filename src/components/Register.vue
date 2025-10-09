<script>
import { getCSRFToken } from '../stores/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      success: '',
      showPopup: false
    }
  },
  methods: {
    async register() {
      this.error = ''
      this.success = ''
      try {
        const response = await fetch('http://localhost:8000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          }),
          credentials: 'include'
        })
        const data = await response.json()
        if (response.ok) {
          this.success = 'Cadastro realizado com sucesso! Faça login.'
          this.showPopup = true
          setTimeout(() => {
            this.showPopup = false
            this.$router.push('/login')
          }, 1500)
        } else {
          this.error = data.error || 'Falha no cadastro'
          this.showPopup = true
          setTimeout(() => {
            this.showPopup = false
          }, 2000)
        }
      } catch (err) {
        this.error = 'Erro ao registrar: ' + err
        this.showPopup = true
        setTimeout(() => {
          this.showPopup = false
        }, 2000)
      }
    }
  }
}
</script>

<template>
  <div class="register">
    <h2>Cadastro</h2>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" id="email" type="email" required>
      </div>
      <div>
        <label for="password">Senha:</label>
        <input v-model="password" id="password" type="password" required>
      </div>
      <button type="submit">Cadastrar</button>
    </form>
    <!-- Popup for error/success -->
    <div v-if="showPopup" class="popup-message" :class="{ error: error, success: success }">
      {{ error || success }}
    </div>
  </div>
</template>

<style scoped>
.register {
  max-width: 350px;
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

input[type="email"],
input[type="password"] {
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

button[type="submit"]:hover {
  background: #cccccc;
}

.popup-message {
  position: fixed;
  left: 50%;
  top: 8vh;
  transform: translateX(-50%);
  min-width: 220px;
  max-width: 90vw;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 500;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10);
  background: #fff;
  color: #222;
  animation: fadeInOut 2s;
}

.popup-message.error {
  background: #fbeaec;
  color: #b00020;
  border: 1px solid #b00020;
}

.popup-message.success {
  background: #eafbf2;
  color: #227d3b;
  border: 1px solid #227d3b;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateX(-50%) translateY(-20px);}
  10% { opacity: 1; transform: translateX(-50%) translateY(0);}
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-20px);}
}

@media (max-width: 500px) {
  .register {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  h2 {
    font-size: 1.2rem;
  }
  .popup-message {
    font-size: 0.98rem;
    padding: 0.7rem 1rem;
  }
}
</style>