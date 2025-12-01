<template>
  <div class="globe-wrapper">
    <Globe
      ref="globeRef"
      :autoRotate="true"
      :autoRotateSpeed="rotateSpeed"
      :data="people"
      :hexed="true"
      :palette="globePlatte"
    />

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

    <!-- People Overlay -->
    <div class="people-overlay">
      <div class="people-header">
        <span class="people-title">نمونه‌ی آدم‌های آنلاین</span>
        <span class="people-count">{{ samplePeople.length }} نفر</span>
      </div>

      <div class="people-list">
        <div
          v-for="p in samplePeople"
          :key="p.id"
          class="person-chip"
        >
          <div class="person-main">
            <span class="person-name">{{ p.name }}</span>
            <span class="person-city">· {{ p.city }}</span>
          </div>
          <div class="person-uid">
            UID:
            <span class="uid-value">{{ shortUid(p.id) }}</span>
          </div>
        </div>
      </div>
    </div>
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

/**
 * Sample people (used both for Globe data and for the overlay list)
 * Each person has the data Globe needs: type, name, city, lat, lng, id.
 */
const samplePeople = ref([
  { type: 'person', name: 'Luna',   city: 'Hanoi',        lat: 21.0278, lng: 105.8342,  id: '671fa3c2b19e4d12c831f201' },
  { type: 'person', name: 'Tyler',  city: 'Seattle',      lat: 47.6062, lng: -122.3321, id: '671fa3c2b19e4d12c831f202' },
  { type: 'person', name: 'Aria',   city: 'Kuala Lumpur', lat: 3.139,   lng: 101.6869,  id: '671fa3c2b19e4d12c831f203' },
  { type: 'person', name: 'Leo',    city: 'Singapore',    lat: 1.3521,  lng: 103.8198,  id: '671fa3c2b19e4d12c831f204' },
  { type: 'person', name: 'Mason',  city: 'Denver',       lat: 39.7392, lng: -104.9903, id: '671fa3c2b19e4d12c831f205' },
  { type: 'person', name: 'Amelia', city: 'Zurich',       lat: 47.3769, lng: 8.5417,    id: '671fa3c2b19e4d12c831f206' },
  { type: 'person', name: 'Evan',   city: 'Montreal',     lat: 45.5017, lng: -73.5673,  id: '671fa3c2b19e4d12c831f207' },
  { type: 'person', name: 'Clara',  city: 'Luxembourg',   lat: 49.6117, lng: 6.1319,    id: '671fa3c2b19e4d12c831f208' },
  { type: 'person', name: 'Omar',   city: 'Doha',         lat: 25.2854, lng: 51.531,    id: '671fa3c2b19e4d12c831f209' },
  { type: 'person', name: 'Fatima', city: 'Muscat',       lat: 23.588,  lng: 58.3829,   id: '671fa3c2b19e4d12c831f20a' },
  { type: 'person', name: 'Rami',   city: 'Baghdad',      lat: 33.3152, lng: 44.3661,   id: '671fa3c2b19e4d12c831f20b' }
])

const addPeople = () => {
  // Use the sample data as the globe data
  people.value = samplePeople.value
}

// UID shortener for UI
const shortUid = (uid) => {
  if (!uid) return ''
  if (uid.length <= 8) return uid
  return uid.slice(0, 4) + '…' + uid.slice(-4)
}

// 🌀 Smooth spin ramp-up and slowdown animation
const startAdventure = () => {
  started.value = true
  let start = null
  const duration = 6500 // total 6.5s
  const accelPhase = 0.4 // 40% accelerate, 60% decelerate

  const animate = (t) => {
    if (!start) start = t
    const elapsed = t - start
    const progress = Math.min(elapsed / duration, 1)

    if (progress < accelPhase) {
      // accelerate exponentially to max speed 100
      const factor = progress / accelPhase
      rotateSpeed.value = 0.2 + 99.8 * Math.pow(factor, 2.5)
    } else {
      // decelerate smoothly back to 0.2
      const factor = (progress - accelPhase) / (1 - accelPhase)
      rotateSpeed.value = 0.2 + (100 - 0.2) * (1 - Math.pow(factor, 1.8))
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      rotateSpeed.value = 0.2
      globePlatte.value = 'futuristic'
      addPeople()
    }
  }

  requestAnimationFrame(animate)
}
</script>

<style scoped>
.globe-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  background: radial-gradient(circle at center, #02010a 0%, #000 90%);
  overflow: hidden;
}

/* button overlay */
.start-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at top left, rgba(255, 0, 255, 0.18), transparent 60%),
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
  min-width: 150px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(75, 85, 99, 0.9);
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 70%),
  radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.18), transparent 70%);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.78rem;
  color: #e5e7eb;
}

.person-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.person-name {
  font-weight: 600;
  font-size: 0.82rem;
}

.person-city {
  font-size: 0.75rem;
  color: #9ca3af;
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

/* Small fade transition (if you already have .fade-enter etc in global, you can remove this) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -46%);
}
</style>
