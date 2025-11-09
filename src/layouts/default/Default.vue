<template>
  <!-- Splash Screen -->
  <SplashScreen
    v-if="showSplash"
    @login="handleLogin"
    @register="handleRegister"
  />

  <!-- Main App -->
  <div v-else class="col default-page-wrapper">
    <slot />
    <default-nav />

    <!-- Snackbar -->
    <transition name="slide-up">
      <div v-if="showSnackbar" class="snackbar">
        {{ snackbarMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { inject, ref, onMounted } from 'vue'
import DefaultNav from './DefaultNav.vue'
import SplashScreen from './SplashScreen.vue'

export default {
  name: 'LayoutDefault',
  components: { DefaultNav, SplashScreen },
  setup() {
    const mqtt = inject('mqtt')
    const showSnackbar = ref(false)
    const snackbarMessage = ref('')
    const showSplash = ref(true)

    const checkAuthStatus = () => {
      const token = getCookie('app-token')
      if (token) {
        showSplash.value = false
      }
    }

    const handleLogin = () => {
      console.log('Navigate to login')
      showSplash.value = false
      // Add your login navigation logic here
    }

    const handleRegister = () => {
      console.log('Navigate to register')
      showSplash.value = false
      // Add your register navigation logic here
    }

    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
      return null
    }

    onMounted(() => {
      checkAuthStatus()
      setInterval(() => showSplash.value = false, 4000);
      if (mqtt) {
        mqtt.subscribe('notification', (payload) => {
          snackbarMessage.value = payload
          showSnackbar.value = true

          setTimeout(() => (showSnackbar.value = false), 3000)
        })
      }
    })

    return {
      showSnackbar,
      snackbarMessage,
      showSplash,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@700&display=swap');
</style>

<style lang="scss">
html {
  padding: 0;
  margin: 0;
  direction: rtl;
}

* {
  font-family: 'Almarai', sans-serif;
}

body {
  background: #000000;
}

.default-page-wrapper {
  margin: 10px auto;
}

a {
  color: #cf6a87;
}

.page {
  animation: slideUp 0.2s ease-out;
}

button:active {
  box-shadow: 0 0 4px #555555;
}

@keyframes slideUp {
  from {
    transform: scaleX(0.2);
    transition: transform 0.5s ease-in-out;
  }

  to {
    transform: scaleX(1.2);
    transition: transform 0.2s ease-in-out;
  }
}

/* Snackbar */
.snackbar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #000;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

/* Animation for showing/hiding */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(40px);
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>