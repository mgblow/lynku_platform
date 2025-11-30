<template>
  <div class="metaverse-nav">
    <!-- Holographic Top Bar -->
    <div class="hologram-header">
      <div v-if="loading.value" class="hologram-effect"></div>
      <div class="nav-brand">
        <div class="logo-hologram">
          <div class="hologram-circle" style="opacity: 0.8" @click="toggleNotifications">
            <svg width="35" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <!-- First bar -->
              <rect x="5" y="15" width="30" height="10" rx="5" ry="5" fill="#0ff" filter="url(#glow)" />
              <!-- Second bar -->
              <rect x="45" y="15" width="30" height="10" rx="5" ry="5" fill="#0ff" filter="url(#glow)" />
              <!-- Third bar -->
              <rect x="85" y="15" width="30" height="10" rx="5" ry="5" fill="#0ff" filter="url(#glow)" />
            </svg>
          </div>
        </div>
        <span class="brand-text" @click="router.push('/')">lynku</span>
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
    <div
      class="nav-orb-container"
      :style="{ top: orbPosition.y + 'px', left: orbPosition.x + 'px' }"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
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
        <div class="ios-grid-item" v-for="action in quickActions" :key="action.id" @click="navigateTo(action)">
          <div class="ios-icon-bg" :style="{ imageUrl: action.gradient }" @click="navigateTo(action)">
            <div class="neon-svg-wrapper" v-html="action.svg"></div>
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
            <div @click="performAction(action)" class="ios-icon-bg" :style="{ imageUrl: action.gradient }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path :d="action.icon" />
              </svg>
            </div>
            <span @click="performAction(action)" class="ios-grid-label">{{ action.name }}</span>
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
<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from './../../utils/event-bus'
import { getCookie } from '@/cookie'
import Viberate from '@/components/Viberate.vue'

const router = useRouter()

// Reactive state
const loading = ref(false)
const orbActive = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const showUniverseMap = ref(false)
const showQuickActions = ref(false)
const showNotifications = ref(false)
const unreadNotifications = ref(3)
const unreadMessages = ref(5)
const quickActions = ref([])
const me = ref({})
const avatarConfig = ref({})

// Floating orb position
const orbPosition = reactive({
  x: window.innerWidth * 0.3,
  y: window.innerHeight - 120
})

let dragging = false
let offset = { x: 0, y: 0 }

const startDrag = (event) => {
  dragging = true
  const e = event.type.includes('touch') ? event.touches[0] : event
  offset.x = e.clientX - orbPosition.x
  offset.y = e.clientY - orbPosition.y

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', endDrag)
}

const onDrag = (event) => {
  if (!dragging) return
  const e = event.type.includes('touch') ? event.touches[0] : event
  orbPosition.x = e.clientX - offset.x
  orbPosition.y = e.clientY - offset.y
}

const endDrag = () => {
  dragging = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', endDrag)
}

// Notifications data
const notifications = ref([
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
])

// Quick actions list
const quickActionsOriginalList = ref([
  // 1) HOME — "Hub Base" (central avatar + orbit + minimal home chevron)
  {
    id: 1,
    name: 'خانه',
    svg: `
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neonGlowHome" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- core avatar -->
  <circle cx="25" cy="25" r="6" fill="#00f0ff" filter="url(#neonGlowHome)">
    <animate attributeName="r" values="6;7;6" dur="1.6s" repeatCount="indefinite"/>
  </circle>

  <!-- orbit -->
  <circle cx="25" cy="25" r="16" stroke="#00f0ff" stroke-width="0.7" fill="none" opacity="0.25">
    <animateTransform attributeName="transform" type="rotate"
                      from="0 25 25" to="360 25 25" dur="10s" repeatCount="indefinite"/>
  </circle>

  <!-- home chevron (flat) -->
  <polyline points="19,29 25,23 31,29" fill="none" stroke="#afffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
            filter="url(#neonGlowHome)">
    <animate attributeName="stroke-width" values="1.6;2.2;1.6" dur="1.8s" repeatCount="indefinite"/>
  </polyline>
  <line x1="22" y1="29" x2="28" y2="29" stroke="#cfffff" stroke-width="1.2" filter="url(#neonGlowHome)" opacity="0.85"/>

  <!-- spokes -->
  <line x1="25" y1="5" x2="25" y2="10" stroke="#00f0ff" stroke-width="0.8" opacity="0.35"/>
  <line x1="25" y1="40" x2="25" y2="45" stroke="#00f0ff" stroke-width="0.8" opacity="0.35"/>
  <line x1="5" y1="25" x2="10" y2="25" stroke="#00f0ff" stroke-width="0.8" opacity="0.35"/>
  <line x1="40" y1="25" x2="45" y2="25" stroke="#00f0ff" stroke-width="0.8" opacity="0.35"/>
</svg>
    `,
    gradient: 'transparent',
    link: '/',
    requireAuth: false
  },

  // 2) RELATIONSHIP — "Dual Lynk" (two avatars + pulsing heart + flowing arc)
  {
    id: 10,
    name: 'ارتباط',
    svg: `
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neonGlowLink" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <path id="linkArc" d="M13 20 C25 10, 25 10, 37 20" />
  </defs>

  <!-- avatars -->
  <circle cx="13" cy="20" r="4" fill="#00ffff" filter="url(#neonGlowLink)">
    <animate attributeName="r" values="4;5;4" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="37" cy="20" r="4" fill="#00ff88" filter="url(#neonGlowLink)">
    <animate attributeName="r" values="4;5;4" dur="2s" repeatCount="indefinite"/>
  </circle>

  <!-- heart -->
  <path d="M22 28 C22 25, 26 25, 26 28 C26 30, 24 31.5, 24 32 C24 31.5, 22 30, 22 28 Z"
        fill="#ff39c8" filter="url(#neonGlowLink)">
    <animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur="1.6s" repeatCount="indefinite" additive="replace"
                      origin="24 29"/>
  </path>

  <!-- glowing connection arc -->
  <use href="#linkArc" fill="none" stroke="#ff79e3" stroke-width="1.2" opacity="0.9" filter="url(#neonGlowLink)"
       stroke-dasharray="4 5">
    <animate attributeName="stroke-dashoffset" values="0;-30" dur="2.2s" repeatCount="indefinite"/>
  </use>

  <!-- traveling spark along arc -->
  <circle r="1.5" fill="#ff00cc" filter="url(#neonGlowLink)">
    <animateMotion dur="2.2s" repeatCount="indefinite" rotate="auto">
      <mpath href="#linkArc"/>
    </animateMotion>
  </circle>
</svg>
    `,
    gradient: 'transparent',
    link: '/match',
    requireAuth: true
  },

  // 3) MY WORLD — "Geosphere" (orbit ring + lat/long + comet)
  {
    id: 9,
    name: 'جهان من',
    svg: `
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neonGlowWorld" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- sphere rim -->
  <circle cx="25" cy="25" r="16" stroke="#00e4c8" stroke-width="0.8" fill="none" filter="url(#neonGlowWorld)"/>

  <!-- latitude / longitude -->
  <ellipse cx="25" cy="25" rx="16" ry="6" stroke="#00ffd6" stroke-width="0.6" fill="none" opacity="0.6">
    <animateTransform attributeName="transform" type="rotate"
                      from="0 25 25" to="360 25 25" dur="8s" repeatCount="indefinite"/>
  </ellipse>
  <circle cx="25" cy="25" r="10" stroke="#00ffd6" stroke-width="0.6" fill="none" opacity="0.6"/>

  <!-- pins -->
  <circle cx="25" cy="9" r="2" fill="#aaffee" filter="url(#neonGlowWorld)">
    <animate attributeName="r" values="2;3;2" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="38" cy="25" r="2" fill="#aaffee" filter="url(#neonGlowWorld)">
    <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite"/>
  </circle>

  <!-- comet -->
  <g filter="url(#neonGlowWorld)">
    <circle cx="12" cy="38" r="1.6" fill="#ffffff">
      <animateTransform attributeName="transform" type="translate"
                        values="0 0; 12 -10; 24 -20" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <line x1="12" y1="38" x2="20" y2="34" stroke="#bfffb8" stroke-width="0.9" opacity="0.85"/>
  </g>
</svg>
    `,
    gradient: 'transparent',
    link: computed(() => '/globes/{me}'),
    requireAuth: true,
    requireMe: true
  },

  // 4) SETTINGS — "Mod Grid Gear" (rotating ticks + pulsing core)
  {
    id: 5,
    name: 'تنظیمات',
    svg: `
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neonGlowSet" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- core -->
  <circle cx="25" cy="25" r="3" fill="#cfff6b" filter="url(#neonGlowSet)">
    <animate attributeName="r" values="3;4;3" dur="1.7s" repeatCount="indefinite"/>
  </circle>

  <!-- grid modules -->
  <rect x="12" y="12" width="8" height="8" rx="2" stroke="#cfff6b" stroke-width="1.2" fill="none" filter="url(#neonGlowSet)"/>
  <rect x="30" y="12" width="8" height="8" rx="2" stroke="#cfff6b" stroke-width="1.2" fill="none" filter="url(#neonGlowSet)"/>
  <rect x="12" y="30" width="8" height="8" rx="2" stroke="#cfff6b" stroke-width="1.2" fill="none" filter="url(#neonGlowSet)"/>
  <rect x="30" y="30" width="8" height="8" rx="2" stroke="#cfff6b" stroke-width="1.2" fill="none" filter="url(#neonGlowSet)"/>

  <!-- rotating ticks -->
  <g stroke="#e9ffad" stroke-width="1.2" filter="url(#neonGlowSet)">
    <g>
      <line x1="25" y1="5" x2="25" y2="9"/>
      <line x1="25" y1="41" x2="25" y2="45"/>
      <line x1="5" y1="25" x2="9" y2="25"/>
      <line x1="41" y1="25" x2="45" y2="25"/>
    </g>
    <g>
      <g transform="rotate(45 25 25)">
        <line x1="25" y1="5" x2="25" y2="9"/>
        <line x1="25" y1="41" x2="25" y2="45"/>
      </g>
      <g transform="rotate(45 25 25)">
        <line x1="5" y1="25" x2="9" y2="25"/>
        <line x1="41" y1="25" x2="45" y2="25"/>
      </g>
    </g>
    <animateTransform attributeName="transform" type="rotate"
                      from="0 25 25" to="360 25 25" dur="6s" repeatCount="indefinite"/>
  </g>
</svg>
    `,
    gradient: 'transparent',
    link: '/settings',
    requireAuth: true
  },

  // 5) LOGIN — "Portal Gate" (gate pillars + oscillating beam + arrow)
  {
    id: 7,
    name: 'ورود',
    svg: `
<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="neonGlowLogin" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- gates -->
  <line x1="18" y1="10" x2="18" y2="40" stroke="#ffb432" stroke-width="1.8" filter="url(#neonGlowLogin)"/>
  <line x1="32" y1="10" x2="32" y2="40" stroke="#ffb432" stroke-width="1.8" filter="url(#neonGlowLogin)"/>

  <!-- portal ellipse -->
  <ellipse cx="25" cy="25" rx="6" ry="14" stroke="#ffd98a" stroke-width="1.2" fill="none" opacity="0.7">
    <animate attributeName="rx" values="6;7;6" dur="2.2s" repeatCount="indefinite"/>
  </ellipse>

  <!-- moving beam -->
  <line x1="18" y1="25" x2="32" y2="25" stroke="#fff2cc" stroke-width="1.4" filter="url(#neonGlowLogin)">
    <animate attributeName="stroke-width" values="1.4;2.2;1.4" dur="1.8s" repeatCount="indefinite"/>
  </line>

  <!-- arrow -->
  <polyline points="22,21 28,25 22,29" fill="none" stroke="#ffcc66" stroke-width="1.8" filter="url(#neonGlowLogin)">
    <animateTransform attributeName="transform" type="translate"
                      values="0 0; 1 0; 0 0" dur="1.8s" repeatCount="indefinite"/>
  </polyline>
</svg>
    `,
    gradient: 'transparent',
    link: '/login',
    requireAuth: false
  }
]);

// Computed properties
const isLoggedIn = () => {
  if (getCookie('app-token') === null) {
    return false
  } else {
    return true
  }
}

const avatarUrl = computed(() => {
  const savedConfig = localStorage.getItem('userAvatarConfig')
  if (savedConfig) {
    avatarConfig.value = Object.assign(JSON.parse(savedConfig), avatarConfig.value)
  }
  const baseUrl = process.env.VUE_APP_AVATAR_APP_URL + '/avatars'
  const params = new URLSearchParams(avatarConfig.value)
  return `${baseUrl}?${params.toString()}`
})

// Methods
const buildQuickActions = () => {
  quickActions.value = quickActionsOriginalList.value.filter((action) => {
    if (action.requireAuth && !isLoggedIn()) return false
    if (!action.requireAuth && isLoggedIn() && action.link === '/login') return false
    return true
  })
}

const toggleOrb = () => {
  if (navigator.vibrate) {
    navigator.vibrate([50, 30, 50])
  }
  orbActive.value = !orbActive.value
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    setTimeout(() => {
      document.querySelector('.search-field input')?.focus()
    }, 100)
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Implement search logic
  }
}

const navigateTo = (action) => {
  orbActive.value = false
  if (action.requireMe) {
    console.log(action.link.replace('{me}', me.value._id))
    router.push(action.link.replace('{me}', me.value._id))
  } else {
    router.push(action.link)
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    unreadNotifications.value = 0
  }
}

const toggleQuickActions = () => {
  showQuickActions.value = !showQuickActions.value
}

// Event handlers
const handleRefreshNavigationState = () => {
  buildQuickActions()
}

const handleLoading = (l) => {
  loading.value = l
}

// Lifecycle
onMounted(() => {
  // Initialize user data
  if (getCookie('app-token') && localStorage.getItem('me') != null) {
    me.value = JSON.parse(localStorage.getItem('me'))
  }

  buildQuickActions()

  // Set up event listeners
  emitter.on('refresh-navigation-state', handleRefreshNavigationState)
  emitter.on('loading', handleLoading)
})
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
  z-index: 10001;
  pointer-events: all;
  opacity: 0.9;
  cursor: grab;
}

.nav-orb-container:active {
  cursor: grabbing;
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