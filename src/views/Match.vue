<template>
  <div
    class="globe-wrapper"
    :class="{ 'warp-shake': warpActive }"
  >
    <Globe
      ref="globeRef"
      :autoRotate="true"
      :autoRotateSpeed="rotateSpeed"
      :data="people"
      :hexed="true"
      :palette="globePlatte"
    />

    <!-- Warp / Adventure Overlay -->
    <transition name="warp-fade">
      <div v-if="warpActive" class="warp-overlay">
        <!-- glitchy scanlines -->
        <div class="warp-scanlines"></div>

        <!-- center flash -->
        <div
          v-if="warpFlash"
          class="warp-flash"
        ></div>

        <div class="warp-text">
          <span class="warp-title">ADVENTURE STARTED</span>
          <span class="warp-subtitle">لینک‌هات داره به جهان وصل می‌شه...</span>
        </div>
      </div>
    </transition>

    <!-- Start Button -->
    <transition name="fade">
      <button
        v-if="!started"
        class="start-btn"
        @click="startAdventure"
      >
        <div class="start-btn-inner">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" class="spin-icon" viewBox="0 0 24 24" fill="none" stroke-width="2">
              <defs>
                <!-- Neon Gradient -->
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff00ff" />
                  <stop offset="50%" stop-color="#00ffff" />
                  <stop offset="100%" stop-color="#ff00ff" />
                </linearGradient>

                <!-- Outer Glow -->
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <!-- Circle with dashed orbit -->
              <circle cx="12" cy="12" r="10" stroke-dasharray="3 3" />

              <!-- Adventure swirl -->
              <path d="M8 12a4 4 0 0 1 8 0c0 2-2 4-4 4s-4-2-4-4z" />
              <path d="M12 8a4 4 0 0 1 0 8" />
            </svg>
          </div>

          <div class="btn-text">
            <div class="btn-title">شروع ماجراجویی</div>
            <div class="btn-subtitle">به جهان آدم‌های متصل به لینکو خوش آمدی</div>
          </div>
        </div>
      </button>
    </transition>

    <transition name="fade">
      <button
        v-if="started && canRetry"
        class="retry-btn"
        @click="resetAdventure"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="retry-icon"
        >
          <!-- circular refresh arrow -->
          <path
            d="M4 4v6h6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20 20v-6h-6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 15a7 7 0 0 0 12 2m2-8a7 7 0 0 0-12-2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </transition>



  </div>
</template>

<script setup>
import { ref } from 'vue'
import Globe from '@/components/Globe.vue'

const globeRef = ref(null)
const rotateSpeed = ref(0.0)
const people = ref([])
const started = ref(false)
const globePlatte = ref('futuristic')

// warp FX state
const warpActive = ref(false)
const warpFlash = ref(false)

// 🔁 retry state
const canRetry = ref(false)

/**
 * PERSON STYLE DTO
 */
const samplePeople = ref([
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f101',
    name: 'Luna',
    handle: 'luna',
    city: 'Hanoi',
    country: 'VN',
    lat: 21.0278,
    lng: 105.8342,
    status: 'Designing a new avatar',
    gemsCollected: 4,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairFro',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f102',
    name: 'Tyler',
    handle: 'tyler',
    city: 'Seattle',
    country: 'US',
    lat: 47.6062,
    lng: -122.3321,
    status: 'Refactoring timelines service',
    gemsCollected: 2,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'ShirtCrewNeck'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f103',
    name: 'Aria',
    handle: 'aria',
    city: 'Kuala Lumpur',
    country: 'MY',
    lat: 3.139,
    lng: 101.6869,
    status: 'Night ride in neon city',
    gemsCollected: 1,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairFro',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f104',
    name: 'Leo',
    handle: 'leo',
    city: 'Singapore',
    country: 'SG',
    lat: 1.3521,
    lng: 103.8198,
    status: 'Chilling in a skybar',
    gemsCollected: 3,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'Overall'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f105',
    name: 'Mason',
    handle: 'mason',
    city: 'Denver',
    country: 'US',
    lat: 39.7392,
    lng: -104.9903,
    status: 'Just shipped a feature',
    gemsCollected: 5,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f106',
    name: 'Amelia',
    handle: 'amelia',
    city: 'Zurich',
    country: 'CH',
    lat: 47.3769,
    lng: 8.5417,
    status: 'Coffee + snow + lo-fi',
    gemsCollected: 6,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairStraight',
      clotheType: 'BlazerSweater'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f107',
    name: 'Evan',
    handle: 'evan',
    city: 'Montreal',
    country: 'CA',
    lat: 45.5017,
    lng: -73.5673,
    status: 'Late night debugging',
    gemsCollected: 2,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f108',
    name: 'Clara',
    handle: 'clara',
    city: 'Luxembourg',
    country: 'LU',
    lat: 49.6117,
    lng: 6.1319,
    status: 'Browsing new worlds',
    gemsCollected: 3,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairStraight',
      clotheType: 'Overall'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f109',
    name: 'Omar',
    handle: 'omar',
    city: 'Doha',
    country: 'QA',
    lat: 25.2854,
    lng: 51.531,
    status: 'Hanging out in Lynku plaza',
    gemsCollected: 4,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'BlazerSweater'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f10a',
    name: 'Fatima',
    handle: 'fatima',
    city: 'Muscat',
    country: 'OM',
    lat: 23.588,
    lng: 58.3829,
    status: 'Listening to synthwave',
    gemsCollected: 5,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'Hijab',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f10b',
    name: 'Rami',
    handle: 'rami',
    city: 'Baghdad',
    country: 'IQ',
    lat: 33.3152,
    lng: 44.3661,
    status: 'Chatting with friends',
    gemsCollected: 1,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'ShirtCrewNeck'
    }
  }
])

const addPeople = () => {
  people.value = samplePeople.value
}

const shortUid = (uid) => {
  if (!uid) return ''
  if (uid.length <= 8) return uid
  return uid.slice(0, 4) + '…' + uid.slice(-4)
}

const avatarUrl = (config) => {
  if (!config || typeof config !== 'object') {
    try {
      return require('@/assets/fox.jpg')
    } catch {
      return '/assets/fox.jpg'
    }
  }
  const base = process.env.VUE_APP_AVATAR_APP_URL + '/avatars'
  const params = new URLSearchParams(config)
  return `${base}?${params.toString()}`
}

// 🌀 Smooth spin + warp FX + vibration
const startAdventure = () => {
  started.value = true
  canRetry.value = false // will be enabled after animation completes

  // haptic / vibration if supported
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    // short pattern: buzz-buzz-long
    window.navigator.vibrate([60, 40, 60, 80])
  }

  // enable warp overlay & flash
  warpActive.value = true
  warpFlash.value = true

  // kill flash quickly, keep warp a bit longer
  setTimeout(() => {
    warpFlash.value = false
  }, 400)

  setTimeout(() => {
    warpActive.value = false
  }, 1600)

  // spin animation
  let start = null
  const duration = 6500
  const accelPhase = 0.4

  const animate = (t) => {
    if (!start) start = t
    const elapsed = t - start
    const progress = Math.min(elapsed / duration, 1)

    if (progress < accelPhase) {
      const factor = progress / accelPhase
      rotateSpeed.value = 0.2 + 99.8 * Math.pow(factor, 2.5)
    } else {
      const factor = (progress - accelPhase) / (1 - accelPhase)
      rotateSpeed.value = 0.2 + (100 - 0.2) * (1 - Math.pow(factor, 1.8))
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      rotateSpeed.value = 0.2
      globePlatte.value = 'futuristic'
      addPeople()
      // ✅ allow retry after the first adventure completes
      canRetry.value = true
    }
  }

  requestAnimationFrame(animate)
}

// 🔁 Reset everything to try again
const resetAdventure = () => {
  // clear people from globe
  people.value = []

  // reset animation state
  rotateSpeed.value = 0.0
  warpActive.value = false
  warpFlash.value = false
  globePlatte.value = 'futuristic'

  // UI flags
  started.value = false
  canRetry.value = false
}
</script>

<style scoped>
.globe-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  background: radial-gradient(circle at center, #02010a 0%, #000 90%);
  overflow: hidden;
  transform-origin: center;
}

/* subtle shake while warpActive */
.warp-shake {
  animation: warpShake 0.4s ease-in-out;
}

/* Warp overlay */
.warp-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at center, rgba(244, 114, 182, 0.08), transparent 55%),
    radial-gradient(circle at top, rgba(59, 130, 246, 0.25), transparent 70%),
    rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 20;
  overflow: hidden;
}

/* scanline layer */
.warp-scanlines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.2) 0px,
    rgba(15, 23, 42, 0.2) 1px,
    transparent 1px,
    transparent 3px
  );
  mix-blend-mode: soft-light;
  opacity: 0.6;
  animation: scanMove 1.1s linear infinite;
}

/* center flash pulse */
.warp-flash {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(244, 244, 245, 0.96), rgba(59, 130, 246, 0.0));
  box-shadow:
    0 0 60px rgba(244, 244, 245, 0.85),
    0 0 120px rgba(96, 165, 250, 0.8);
  animation: flashPop 0.4s ease-out forwards;
}

/* text */
.warp-text {
  position: relative;
  text-align: center;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.warp-title {
  font-size: 1.3rem;
  letter-spacing: 0.4em;
  text-indent: 0.4em;
  font-weight: 700;
  color: #e5e7eb;
  text-shadow:
    0 0 8px rgba(236, 72, 153, 0.7),
    0 0 18px rgba(59, 130, 246, 0.7);
}

.warp-subtitle {
  font-size: 0.9rem;
  color: #c4b5fd;
  opacity: 0.92;
}

/* warp overlay transition */
.warp-fade-enter-active,
.warp-fade-leave-active {
  transition: opacity 0.45s ease;
}
.warp-fade-enter-from,
.warp-fade-leave-to {
  opacity: 0;
}

/* button overlay */
.start-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(circle at top left, rgba(255, 0, 255, 0.18), transparent 60%),
    radial-gradient(circle at bottom right, rgba(0, 255, 255, 0.18), transparent 60%),
    rgba(5, 5, 15, 0.96);
  color: #fff;
  font-size: 1rem;
  padding: 14px 24px;
  border-radius: 999px;
  cursor: pointer;
  backdrop-filter: blur(14px);
  transition: all 0.3s ease;
  border: 1px solid rgba(148, 163, 184, 0.5);
  box-shadow:
    0 0 20px rgba(168, 85, 247, 0.45),
    0 0 40px rgba(59, 130, 246, 0.35);
  z-index: 10;
}

.start-btn-inner {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.2));
}

.spin-icon {
  width: 28px;
  height: 28px;
  filter: url(#neonGlow);
  stroke: url(#neonGradient);
  animation: pulse 2.5s infinite ease-in-out;
}

.btn-text {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.btn-title {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.btn-subtitle {
  font-size: 0.8rem;
  opacity: 0.8;
}

.start-btn:hover {
  transform: translate(-50%, -50%) scale(1.04);
  border-color: rgba(244, 114, 182, 0.9);
  box-shadow:
    0 0 24px rgba(236, 72, 153, 0.6),
    0 0 50px rgba(59, 130, 246, 0.6);
}

.start-btn:active {
  transform: translate(-50%, -50%) scale(0.98);
  box-shadow: 0 0 12px rgba(148, 163, 184, 0.4);
}

/*  Retry button *//* 🔁 Center-bottom iconic retry button */
.retry-btn {
  position: absolute;
  bottom: 18%;              /* near bottom of screen */
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 1px solid rgba(129, 140, 248, 0.9);
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 60%),
    radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.2), transparent 60%),
    rgba(15, 23, 42, 0.95);
  box-shadow:
    0 0 18px rgba(129, 140, 248, 0.7),
    0 0 28px rgba(56, 189, 248, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(14px);
  z-index: 12;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.retry-btn:hover {
  transform: translateX(-50%) translateY(-2px) scale(1.05);
  border-color: rgba(56, 189, 248, 1);
  box-shadow:
    0 0 24px rgba(129, 140, 248, 0.9),
    0 0 40px rgba(56, 189, 248, 0.8);
}

.retry-btn:active {
  transform: translateX(-50%) translateY(0) scale(0.96);
  box-shadow: 0 0 14px rgba(30, 64, 175, 0.9);
}

.retry-icon {
  width: 26px;
  height: 26px;
  stroke: #e5e7eb;
  fill: none;
  animation: retrySpin 1.4s ease-in-out infinite;
}

/* subtle breathing spin */
@keyframes retrySpin {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.9;
  }
  40% {
    transform: rotate(90deg) scale(1.08);
    opacity: 1;
  }
  80% {
    transform: rotate(180deg) scale(1);
    opacity: 0.9;
  }
  100% {
    transform: rotate(180deg) scale(1);
    opacity: 0.9;
  }
}


@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  20% { transform: scale(1.15); opacity: 0.95; }
}

/* People overlay at bottom */
.people-overlay {
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: min(720px, 90%);
  padding: 12px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7));
  border: 1px solid rgba(55, 65, 81, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7);
  z-index: 5;
}

.people-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.people-title {
  font-size: 0.9rem;
  color: #e5e7eb;
  font-weight: 600;
}

.people-count {
  font-size: 0.8rem;
  color: #9ca3af;
}

.people-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  overflow-x: auto;
  padding-top: 4px;
}

.people-list::-webkit-scrollbar {
  height: 4px;
}
.people-list::-webkit-scrollbar-track {
  background: transparent;
}
.people-list::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.9);
  border-radius: 999px;
}

.person-chip {
  min-width: 210px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(75, 85, 99, 0.9);
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 70%),
    radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.18), transparent 70%);
  display: flex;
  gap: 8px;
  font-size: 0.78rem;
  color: #e5e7eb;
}

.person-left {
  flex-shrink: 0;
}

.person-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 2px solid rgba(148, 163, 184, 0.7);
  object-fit: cover;
  box-shadow: 0 0 10px rgba(129, 140, 248, 0.8);
}

.person-right {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.person-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.person-name {
  font-weight: 600;
  font-size: 0.84rem;
}

.person-handle {
  font-size: 0.75rem;
  color: #a5b4fc;
}

.person-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.74rem;
  color: #9ca3af;
}

.dot {
  opacity: 0.8;
}

.person-status {
  color: #e5e7eb;
}

.person-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}

.person-uid {
  font-size: 0.72rem;
  color: #9ca3af;
}

.uid-value {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.72rem;
  margin-right: 4px;
  color: #a5b4fc;
}

.person-gems {
  font-size: 0.72rem;
  color: #fbbf24;
}

/* Small fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -46%);
}

/* keyframes */
@keyframes warpShake {
  0%   { transform: translate(0, 0) rotate(0deg); }
  20%  { transform: translate(-3px, 2px) rotate(-0.3deg); }
  40%  { transform: translate(3px, -2px) rotate(0.3deg); }
  60%  { transform: translate(-2px, 3px) rotate(-0.2deg); }
  80%  { transform: translate(2px, -3px) rotate(0.2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes flashPop {
  0%   { opacity: 0; transform: scale(0.7); }
  40%  { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.2); }
}

@keyframes scanMove {
  0%   { transform: translateY(0); }
  100% { transform: translateY(10px); }
}
</style>
