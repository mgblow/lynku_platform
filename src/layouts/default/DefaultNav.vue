<template>
  <div class="metaverse-nav">
    <!-- Holographic Top Bar -->
    <div class="hologram-header">
      <div v-if="this.loading" class="hologram-effect"></div>
      <div class="nav-brand">
        <div class="logo-hologram">
          <div class="hologram-circle" @click="toggleNotifications"></div>
        </div>
        <span class="brand-text" @click="this.$router.push('/')">lynku</span>
      </div>

      <div class="universal-search">
        <div class="search-orb" @click="toggleSearch">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </div>
        <div class="search-field" v-if="showSearch">
          <input type="text" placeholder="جستجو در متاورس..." v-model="searchQuery" @keyup.enter="performSearch" />
          <div class="search-aura"></div>
        </div>
      </div>
    </div>

    <!-- Floating Navigation Orb -->
    <div class="nav-orb-container">
      <div class="nav-orb" :class="{ active: orbActive }" @click="toggleOrb">
        <div class="orb-core"></div>
        <div class="orb-rings">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
      </div>

      <!-- Orb Menu Items -->
      <div class="orb-menu" v-if="orbActive">
        <div class="ios-grid-item" v-for="action in quickActions" :key="action.id" @click="performAction(action)">
          <div class="ios-icon-bg" :style="{ imageUrl: action.gradient }">
            <svg viewBox="0 0 24 24" fill="currentColor" @click="navigateTo(action.link)">
              <path :d="action.icon" />
            </svg>
          </div>
          <span class="ios-grid-label">{{ action.name }}</span>
        </div>
      </div>
    </div>

    <!-- Digital Universe Map -->
    <div class="universe-map" v-if="showUniverseMap">
      <div class="ios-glass-panel">
        <div class="panel-header">
          <h2 class="panel-title">نقشه جهان دیجیتال</h2>
          <button class="ios-close-btn" @click="toggleUniverseMap">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div class="map-grid">
          <div class="galaxy" v-for="galaxy in galaxies" :key="galaxy.id" :class="galaxy.type" @click="enterGalaxy(galaxy)">
            <div class="galaxy-core"></div>
            <div class="galaxy-stars"></div>
            <span class="galaxy-name">{{ galaxy.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- iOS Style Quick Actions Panel -->
    <div class="ios-panel" v-if="showQuickActions">
      <div class="ios-glass-panel">
        <div class="panel-header">
          <h2 class="panel-title">اقدامات سریع</h2>
          <button class="ios-close-btn" @click="toggleQuickActions">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div class="ios-grid">
          <div
            class="ios-grid-item"
            @click="performAction(action)"
            v-if="action.link == '/login' && getCookie('app-token') == null"
          >
            <div class="ios-icon-bg" :style="{ imageUrl: action.gradient }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path :d="action.icon" />
              </svg>
            </div>
            <span class="ios-grid-label">{{ action.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- iOS Style Notifications Panel -->
    <div class="ios-panel" v-if="showNotifications">
      <div class="ios-glass-panel">
        <div class="panel-header">
          <h2 class="panel-title">اعلان‌ها</h2>
          <button class="ios-close-btn" @click="toggleNotifications">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div class="ios-list">
          <div class="ios-list-item" v-for="notification in notifications" :key="notification.id">
            <div class="notification-avatar" :style="{ imageUrl: notification.color }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path :d="notification.icon" />
              </svg>
            </div>
            <div class="notification-content">
              <h3>{{ notification.title }}</h3>
              <p>{{ notification.message }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { emitter } from './../../utils/event-bus'
import { getCookie } from '@/cookie'
import { ref } from 'vue'
const me = ref({})

if(getCookie('app-token')){
  me.value = JSON.parse(localStorage.getItem('person'));
}

const quickActionsOriginalList = [
  {
    id: 1,
    name: 'خانه',
    icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', // Home
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/',
    requireAuth: false
  },
  {
    id: 3,
    name: 'پینگ جدید',
    icon: 'M19 13H5v-2h14v2zm-7-8a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V6a1 1 0 0 1 1-1z', // Add Post / Plus
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/publish',
    requireAuth: true
  },
  {
    id: 10,
    name: 'لینک', // Connection-oriented
    icon: 'M10 14a2 2 0 0 1 0-2l4-4a2 2 0 0 1 2.83 2.83l-1.17 1.17M14 10a2 2 0 0 1 0 2l-4 4a2 2 0 0 1-2.83-2.83l1.17-1.17', // Minimal chain / link
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/match',
    requireAuth: true
  }

  ,
  {
    id: 4,
    name: 'پیام‌ها',
    icon: 'M20 2H4c-1.1 0-2 .9-2 2v16l4-4h14a2 2 0 0 0 2-2V4c0-1.1-.9-2-2-2z', // Message bubble
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/mail',
    requireAuth: true
  },
  {
    id: 9,
    name: 'جهان من',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z',
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/globes/' + me.value._id ,
    requireAuth: true
  },
  {
    id: 5,
    name: 'تنظیمات',
    icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm7.43 3.34l2.12-1.23-1.06-1.84-2.12 1.22c-.26-.2-.55-.38-.85-.53l-.32-2.44h-2v2.44c-.3.15-.59.33-.85.53L6.51 4.27l-1.06 1.84 2.12 1.23c-.05.31-.08.63-.08.96s.03.65.08.96l-2.12 1.23 1.06 1.84 2.12-1.22c.26.2.55.38.85.53l.32 2.44h2v-2.44c.3-.15.59-.33.85-.53l2.12 1.22 1.06-1.84-2.12-1.23c.05-.31.08-.63.08-.96s-.03-.65-.08-.96z', // Settings gear
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/settings',
    requireAuth: true
  },
  {
    id: 6,
    name: 'خروج',
    icon: 'M16 13v-2H7V8l-5 4 5 4v-3h9v-2zm4-11h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z', // Logout
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/logout',
    requireAuth: true
  },
  {
    id: 7,
    name: 'ورود',
    icon: 'M10 17l5-5-5-5M15 12H3', // Arrow pointing right into a door-like line
    gradient: 'linear-gradient(135deg, #111111 0%, #222233 50%, #334455 100%)',
    link: '/login',
    requireAuth: false
  },
]

export default {
  name: 'MetaverseNavigation',
  data() {
    return {
      loading: false,
      orbActive: false,
      showSearch: false,
      searchQuery: '',
      showUniverseMap: false,
      showQuickActions: false,
      showNotifications: false,
      unreadNotifications: 3,
      unreadMessages: 5,
      quickActions: [],
      notifications: [
        {
          id: 1,
          title: 'پیام جدید',
          message: 'شما یک پیام جدید دارید',
          time: '5 دقیقه پیش',
          icon: 'M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
          color: '#334455'
        },
        {
          id: 2,
          title: 'دعوت به جهان',
          message: 'شما به جهان جدید دعوت شده‌اید',
          time: '1 ساعت پیش',
          icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
          color: '#334455'
        },
        {
          id: 3,
          title: 'به‌روزرسانی',
          message: 'نسخه جدید متاورس در دسترس است',
          time: '2 ساعت پیش',
          icon: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
          color: '#334455'
        }
      ]
    }
  },
  created() {
    this.buildQuickActions()

    emitter.on('refresh-navigation-state', () => {
      console.log('refresh-navigation-state received, rebuilding quick actions')
      this.buildQuickActions()
    })

    emitter.on('loading', (l) => {
      this.loading = l
    })

  },
  unmounted() {
    emitter.off('refresh-navigation-state') // cleanup
  },
  methods: {
    buildQuickActions() {
      this.$data.quickActions = quickActionsOriginalList.filter((action) => {
        if (action.requireAuth && !this.isLoggedIn()) return false
        if (!action.requireAuth && this.isLoggedIn() && action.link === '/login') return false
        return true
      })
    },
    getCookie(name) {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop().split(';').shift()
      return null
    },
    isLoggedIn() {
      // Checks for existence of the 'app-token' cookie
      // Assuming getCookie is available (either global or imported/defined)
      return !!this.getCookie('app-token')
    },
    toggleOrb() {
      this.orbActive = !this.orbActive
    },

    toggleSearch() {
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        setTimeout(() => {
          document.querySelector('.search-field input')?.focus()
        }, 100)
      }
    },

    performSearch() {
      if (this.searchQuery.trim()) {
        console.log('Searching for:', this.searchQuery)
        // Implement search logic
      }
    },

    navigateTo(route) {
      this.orbActive = false
      this.$router.push(route)
    },

    createPost() {
      this.$router.push('/create')
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      if (this.showNotifications) {
        this.unreadNotifications = 0
      }
    },

    toggleMessages() {
      // Toggle messages panel
      console.log('Toggle messages')
    },

    enterGalaxy(galaxy) {
      if (galaxy.active) {
        this.$router.push(`/galaxy/${galaxy.type}`)
      }
    },

    toggleUniverseMap() {
      this.showUniverseMap = !this.showUniverseMap
    },

    toggleQuickActions() {
      this.showQuickActions = !this.showQuickActions
    },

    performAction(action) {
      console.log('Performing action:', action.name)
      this.showQuickActions = false
      // Implement action logic
    }
  }
}
</script>

<style scoped>
.metaverse-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  pointer-events: none;
  background: none;
}

/* Holographic Header */
.hologram-header {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  pointer-events: all;
  background: none;
}

.hologram-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #1d9bf0, #00ba7c, #f91880, transparent);
  animation: hologramScan 3s linear infinite;
}

@keyframes hologramScan {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-hologram {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-text {
  color: #ffffff;
  font-weight: 700;
  font-size: 28px;
  font-family: 'Honk', system-ui;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings: 'MORF' 15, 'SHLN' 50;
  color: #000;
}

.hologram-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #1d9bf0, #00ba7c, #f91880, #1d9bf0);
  animation: rotate 4s linear infinite;
  position: relative;
}

.hologram-circle::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: #000;
  border-radius: 50%;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.universal-search {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-orb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(29, 155, 240, 0.2);
  border: 1px solid rgba(255, 255, 130, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: all;
}

.search-orb:hover {
  background: rgba(29, 155, 240, 0.4);
  transform: scale(1.1);
}

.search-orb svg {
  width: 20px;
  height: 20px;
  color: rgb(255, 255, 130, 0.4);
}

.search-field {
  position: relative;
  pointer-events: all;
}

.search-field input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(29, 155, 240, 0.5);
  border-radius: 20px;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 14px;
  width: 250px;
  backdrop-filter: blur(10px);
}

.search-field input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-aura {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: linear-gradient(45deg, transparent, rgba(29, 155, 240, 0.2), transparent);
  animation: auraPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes auraPulse {
  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

/* Navigation Orb */
.nav-orb-container {
  position: fixed;
  bottom: 30px;
  padding: 20px;
  text-align: center;
  left: 30%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: all;
  opacity: 0.9;
}

.nav-orb {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #000, #444);
  border: 2px solid #ff44af;
  cursor: pointer;
  position: relative;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 0 20px rgba(29, 155, 240, 0.5), inset 0 0 20px rgba(255, 220, 97, 0.1);
  transform: translateX(-50%) scale(1);
  display: inline-block;
}

.nav-orb:hover {
  transform: scale(1.1) translateX(-50%);
  box-shadow: 0 0 30px #ff44af, inset 0 0 30px rgba(255, 255, 255, 0.2);
}

.nav-orb.active {
  transform: scale(1.2) translateX(-50%);
  background: radial-gradient(circle at 30% 30%, #ff40af, #000);
  border-color: rgba(0, 186, 124, 0.8);
}

.orb-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  animation: corePulse 2s ease-in-out infinite;
}

@keyframes corePulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.orb-rings {
  position: relative;
  transform: translate(50%, 50%);
}

.ring {
  left: 10%;
  top: 70%;
  position: absolute;
  border: 1px solid rgba(29, 155, 240, 0.6);
  border-radius: 50%;
  animation: ringExpand 3s linear infinite;
}

.ring-1 {
  width: 60px;
  height: 60px;
  animation-delay: 0s;
}

.ring-2 {
  width: 80px;
  height: 80px;
  animation-delay: 1s;
}

.ring-3 {
  width: 100px;
  height: 100px;
  animation-delay: 2s;
}

@keyframes ringExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* Orb Menu */
.orb-menu {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(100px);
  border: 1px solid rgba(29, 155, 240, 0.3);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.orb-item {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.orb-item:hover {
  transform: translateY(-5px) scale(1.1);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(29, 155, 240, 0.5);
}

.ios-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.orb-item svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.orb-item .tooltip {
  position: absolute;
  bottom: -30px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.orb-item:hover .tooltip {
  opacity: 1;
}

/* iOS Style Panels */
.ios-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  animation: panelFadeIn 0.3s ease-out;
}

@keyframes panelFadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.ios-glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(40px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  max-height: 80%;
  overflow: hidden;
  animation: panelSlideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes panelSlideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.ios-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ios-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.ios-close-btn svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

/* iOS Grid for Quick Actions */
.ios-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 24px;
}

.ios-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 16px 8px;
  border-radius: 16px;
}

.ios-grid-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
}

.ios-icon-bg {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.ios-icon-bg svg {
  width: 28px;
  height: 28px;
  color: #ffffff;
}

.ios-grid-label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

/* iOS List for Notifications */
.ios-list {
  padding: 0;
  max-height: 400px;
  overflow-y: auto;
}

.ios-list-item {
  display: flex;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.ios-list-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.ios-list-item:last-child {
  border-bottom: none;
}

.notification-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  flex-shrink: 0;
}

.notification-avatar svg {
  width: 20px;
  height: 20px;
  color: #ffffff;
}

.notification-content {
  flex: 1;
}

.notification-content h3 {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.notification-content p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0 0 8px 0;
}

.notification-time {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

/* Quick Actions */
.quick-actions {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  pointer-events: all;
}

.action-pill {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.action-pill:hover {
  background: rgba(29, 155, 240, 0.2);
  transform: translateY(-2px);
  border-color: rgba(29, 155, 240, 0.5);
}

.action-glow {
  position: absolute;
  inset: 0;
  border-radius: 25px;
  background: linear-gradient(45deg, transparent, rgba(29, 155, 240, 0.1), transparent);
  animation: glowPulse 2s ease-in-out infinite;
  pointer-events: none;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f91880;
  color: #ffffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* Universe Map */
.universe-map {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, #0a0a2a 0%, #000000 70%);
  z-index: 9999;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 40px;
}

.galaxy {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease;
}

.galaxy:hover {
  transform: scale(1.2);
}

.galaxy-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #1d9bf0, #00ba7c, #f91880, #1d9bf0);
  animation: rotate 8s linear infinite;
}

.galaxy-stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, transparent 50%, rgba(255, 255, 255, 0.8) 50%);
  animation: twinkle 3s ease-in-out infinite;
}

.galaxy-name {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 12px;
  white-space: nowrap;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .orb-menu {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 20px;
  }

  .quick-actions {
    flex-direction: column;
    bottom: 180px;
  }

  .search-field input {
    width: 200px;
  }

  .map-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .ios-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ios-glass-panel {
    max-width: 95%;
    max-height: 85%;
  }
}
</style>