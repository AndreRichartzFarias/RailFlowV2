<script>
import { getCSRFToken } from '../stores/auth'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      success: ''
    }
  },
  methods: {
    async register() {
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
          this.success = 'Registration successful! Please log in.'
          setTimeout(() => {
            this.$router.push('/login')
          }, 1000)
        } else {
          this.error = data.error || 'Registration failed'
        }
      } catch (err) {
        this.error = 'An error occurred during registration: ' + err
      }
    }
  }
}
</script>


<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" id="email" type="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" id="password" type="password" required>
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <p v-if="success">{{ success }}</p>
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

/* Responsive adjustments */
@media (max-width: 500px) {
  .register {
    max-width: 98vw;
    padding: 1.2rem 0.5rem;
  }
  h2 {
    font-size: 1.2rem;
  }
}
</style>


