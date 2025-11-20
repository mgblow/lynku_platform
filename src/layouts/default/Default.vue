<template>
  <!-- Splash Screen -->
  <SplashScreen v-if="showSplash" @login="handleLogin" @register="handleRegister" />

  <!-- Main App -->
  <div v-else class="col default-page-wrapper">
    <Drawer></Drawer>
    <default-nav />
    <slot />

    <!-- Snackbar -->
    <transition name="slide-up">
      <div v-if="showSnackbar" class="snackbar" :class="snackbarType">
        {{ snackbarMessage }}
      </div>
    </transition>
  </div>
</template>

<script>
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import DefaultNav from './DefaultNav.vue'
import SplashScreen from './SplashScreen.vue'
import mqtt from 'mqtt'
import { post } from '@/api'
import { getCookie } from '@/cookie'
import { emitter } from '@/utils/event-bus'
import Drawer from '@/components/Drawer.vue'

export default {
  name: 'LayoutDefault',
  components: { Drawer, DefaultNav, SplashScreen },
  setup() {
    const emitter = inject('emitter') // inject mitt instance
    const showSnackbar = ref(false)
    const snackbarMessage = ref('')
    const snackbarType = ref('') // success or error
    const showSplash = ref(true)
    const mqttClient = ref(null)

    const checkAuthStatus = () => {
      const token = getCookie('app-token')
      if (token) {
        showSplash.value = false
        return true
      }
      return false
    }

    const handleLogin = () => {
      console.log('Navigate to login')
      showSplash.value = false
    }

    const handleRegister = () => {
      console.log('Navigate to register')
      showSplash.value = false
    }

    const getCookie = (name) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
      return null
    }

    const handleBrokerConnection = () => {
      console.log('handle broker connection...')
      if (mqttClient) {
        try {
          mqttClient.value.end()
        } catch {}
      }

      const url = process.env.VUE_APP_EMQX_APP_URL || '/'
      mqttClient.value = mqtt.connect(url, {
        clientId: getCookie('app-id'),
        username: getCookie('app-id'),
        password: getCookie('app-token'),
        clean: true,
        reconnectPeriod: 2000
      })

      mqttClient.value.on('connect', () => {
        console.log('MQTT connected!')
        emitter.emit('success-message', 'آنلاین شدی!')

        // SUBSCRIBE TO TOPIC
        mqttClient.value.subscribe(getCookie('app-id') + '/client/#', (err) => {
          if (err) console.error('Subscribe error:', err)
          else console.log('subscribed to ' + (getCookie('app-id') + '/#'))
        })
      })

      mqttClient.value.on('message', (topic, payload) => {
        const msg = payload.toString()
        console.log('broker message:', topic, msg)
        // Emit through mitt
        if (emitter) {
          emitter.emit('mqtt:' + topic.split('client/')[1], msg)
        }
      })

      mqttClient.value.on('error', (err) => {
        if (emitter) emitter.emit('error-message', 'Broker connection failed')
      })

      mqttClient.value.on('reconnect', () => {})
    }

    const showMessage = (message, type = 'success') => {
      console.log('show message', message, type)
      snackbarMessage.value = message
      snackbarType.value = type
      showSnackbar.value = true
      setTimeout(() => (showSnackbar.value = false), 3000)
    }

    const getMe = async () => {
      try {
        const response = await post(
          '/api/v1',
          {
            topic: 'getMe',
            data: {}
          },
          {
            token: getCookie('app-token')
          }
        )
        if (response && response.data.success) {
          const person = {
            ...response.data.body, // existing fields from API
            type: 'person'
          }
          localStorage.setItem('me', JSON.stringify(person))
          localStorage.setItem('userAvatarConfig', JSON.stringify(response.data.body.avatarConfig))
        } else {
          emitter.emit('error-message', response.data)
        }
      } catch (error) {
        console.error('Error posting tweet:', error)
        // this.showError('خطا در ارسال توییت. لطفاً دوباره تلاش کنید.')
      } finally {
      }
    }

    onMounted(() => {
      if (getCookie('app-token') && mqttClient === null) {
        handleBrokerConnection()
      }
      if (checkAuthStatus() && !localStorage.getItem('me')) {
        getMe()
      }
      setInterval(() => (showSplash.value = false), 3000)

      // Listen for mitt events
      if (emitter) {
        emitter.on('success-message', (msg) => showMessage(msg, 'success'))
        emitter.on('error-message', (msg) => showMessage(msg, 'error'))
        emitter.on('brokerCredentials', () => handleBrokerConnection())
        emitter.on('mqtt:notification', (msg) => showMessage(msg))
        emitter.on('reload-me', () => getMe()())
      }
    })

    onBeforeUnmount(() => {
      if (emitter) {
        emitter.off('success-message')
        emitter.off('error-message')
      }
    })

    return {
      showSnackbar,
      snackbarMessage,
      snackbarType,
      showSplash,
      handleLogin,
      handleRegister
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@700&display=swap');
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

/* Snackbar */
.snackbar {
  position: fixed;
  bottom: 20px;
  color: #000;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  animation: fadeIn 0.3s ease;
  width: 100%;
}

.snackbar.success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.snackbar.error {
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
}

/* Animation */
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
