<template>
  <div class="globe-wrapper">
    <Globe
      ref="globeRef"
      :autoRotate="true"
      :autoRotateSpeed="rotateSpeed"
      :imageUrl="'//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg'"
      :data="people"
    />

    <transition name="fade">
      <button
        v-if="!started"
        class="start-btn"
        @click="startAdventure"
      >
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
        <div class="mt-2">شروع ماجراجویی</div>
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

const addPeople = () => {
  people.value = [
    { type: 'person', name: 'Luna', city: 'Hanoi', lat: 21.0278, lng: 105.8342 },
    { type: 'person', name: 'Tyler', city: 'Seattle', lat: 47.6062, lng: -122.3321 },
    { type: 'person', name: 'Aria', city: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
    { type: 'person', name: 'Leo', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { type: 'person', name: 'Mason', city: 'Denver', lat: 39.7392, lng: -104.9903 },
    { type: 'person', name: 'Amelia', city: 'Zurich', lat: 47.3769, lng: 8.5417 },
    { type: 'person', name: 'Evan', city: 'Montreal', lat: 45.5017, lng: -73.5673 },
    { type: 'person', name: 'Clara', city: 'Luxembourg', lat: 49.6117, lng: 6.1319 },
    { type: 'person', name: 'Omar', city: 'Doha', lat: 25.2854, lng: 51.531 },
    { type: 'person', name: 'Fatima', city: 'Muscat', lat: 23.588, lng: 58.3829 },
    { type: 'person', name: 'Rami', city: 'Baghdad', lat: 33.3152, lng: 44.3661 }
  ]
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
  background: none;
  color: #fff;
  font-size: 1.2rem;
  padding: 14px 28px;
  border-radius: 50px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.4s ease;
  border:0;
}


.spin-icon {
  filter: url(#neonGlow);
  stroke: url(#neonGradient);
  animation: pulse 2.5s infinite ease-in-out;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  20% { transform: scale(1.15); opacity: 0.95; }
}
</style>
