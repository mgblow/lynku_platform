<template>
  <div class="globe-wrapper" style="padding-top: 170px">
    <div v-if="globeContainer" id="globe-container" ref="globeContainer" class="globe-container"></div>
    <div v-if="!globeReady" class="loading-container">
      <div class="loading">
        <svg class="globe-svg" viewBox="0 0 100 100">
          <circle class="globe-ring" cx="50" cy="50" r="30" />
          <path class="globe-line" d="M20 50a30 30 0 0 0 60 0a30 30 0 0 0-60 0z" />
          <path class="globe-line" d="M50 20a30 30 0 0 1 0 60a30 30 0 0 1 0-60z" />
        </svg>
      </div>
    </div>

    <!-- User Info Popup -->
    <Teleport to="body">
      <div v-if="selectedUser" class="user-popup">
        <button class="close-btn" @click="selectedUser = null">×</button>
        <img :src="selectedUser.avatarUrl" alt="Avatar" class="popup-avatar" />
        <h3>{{ selectedUser.name }}</h3>
        <p class="city">📍 {{ selectedUser.city }}</p>
        <p class="coords">{{ selectedUser.lat.toFixed(4) }}°, {{ selectedUser.lng.toFixed(4) }}°</p>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Globe from 'globe.gl'
import countries from '@/utils/countries'
import { emitter } from '@/utils/event-bus'

const globeContainer = ref(true)
const globe = ref(null)
const globeReady = ref(false)
const selectedUser = ref(null)
let animationFrameId = null

const avatarStyles = ['ShortHairShortFlat', 'LongHairFro', 'Hat', 'Hijab', 'WinterHat1', 'Turban', 'LongHairStraight']

const clothes = ['Hoodie', 'ShirtCrewNeck', 'BlazerSweater', 'Overall']
const eyes = ['Happy', 'Close', 'Surprised', 'Squint']
const mouths = ['Smile', 'Default', 'Serious', 'Disbelief']
const skins = ['Light', 'Tanned', 'Brown', 'DarkBrown']

const users = [
  { name: 'Ali', city: 'Tehran', lat: 35.6892, lng: 51.389 },
  { name: 'Sarah', city: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Yuki', city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'John', city: 'New York', lat: 40.7128, lng: -74.006 },
  { name: 'Pierre', city: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Mohammed', city: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  { name: 'Khaled', city: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Liam', city: 'Toronto', lat: 43.6511, lng: -79.347015 },
  { name: 'Emma', city: 'Berlin', lat: 52.52, lng: 13.405 },
  { name: 'Noah', city: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Olivia', city: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  { name: 'Lucas', city: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { name: 'Sophia', city: 'Rome', lat: 41.9028, lng: 12.4964 },
  { name: 'Ethan', city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Ava', city: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { name: 'Mia', city: 'Oslo', lat: 59.9139, lng: 10.7522 },
  { name: 'Amir', city: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Hana', city: 'Seoul', lat: 37.5665, lng: 126.978 },
  { name: 'Leo', city: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Chloe', city: 'Brussels', lat: 50.8503, lng: 4.3517 },
  { name: 'Daniel', city: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Lily', city: 'Vienna', lat: 48.2082, lng: 16.3738 },
  { name: 'Omar', city: 'Istanbul', lat: 41.0082, lng: 28.9784 },
  { name: 'Zara', city: 'Lisbon', lat: 38.7169, lng: -9.1396 },
  { name: 'Mateo', city: 'Barcelona', lat: 41.3851, lng: 2.1734 },
  { name: 'Isabella', city: 'Melbourne', lat: -37.8136, lng: 144.9631 },
  { name: 'Ryan', city: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Ella', city: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
  { name: 'Adam', city: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  { name: 'Nora', city: 'Helsinki', lat: 60.1699, lng: 24.9384 },
  { name: 'Hassan', city: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
  { name: 'Sophia', city: 'Athens', lat: 37.9838, lng: 23.7275 },
  { name: 'Jackson', city: 'Miami', lat: 25.7617, lng: -80.1918 },
  { name: 'Maya', city: 'Budapest', lat: 47.4979, lng: 19.0402 },
  { name: 'Eli', city: 'Prague', lat: 50.0755, lng: 14.4378 },
  { name: 'Sara', city: 'Dublin', lat: 53.3331, lng: -6.2489 },
  { name: 'Nathan', city: 'Vancouver', lat: 49.2827, lng: -123.1207 },
  { name: 'Leila', city: 'Beirut', lat: 33.8886, lng: 35.4955 },
  { name: 'Owen', city: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
  { name: 'Aiden', city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { name: 'Zoe', city: 'Lisbon', lat: 38.7169, lng: -9.1396 },
  { name: 'Ibrahim', city: 'Amman', lat: 31.9539, lng: 35.9106 },
  { name: 'Luna', city: 'Hanoi', lat: 21.0278, lng: 105.8342 },
  { name: 'Tyler', city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { name: 'Aria', city: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
  { name: 'Leo', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Mason', city: 'Denver', lat: 39.7392, lng: -104.9903 },
  { name: 'Amelia', city: 'Zurich', lat: 47.3769, lng: 8.5417 },
  { name: 'Evan', city: 'Montreal', lat: 45.5017, lng: -73.5673 },
  { name: 'Clara', city: 'Luxembourg', lat: 49.6117, lng: 6.1319 },
  { name: 'Omar', city: 'Doha', lat: 25.2854, lng: 51.531 },
  { name: 'Fatima', city: 'Muscat', lat: 23.588, lng: 58.3829 },
  { name: 'Rami', city: 'Baghdad', lat: 33.3152, lng: 44.3661 }
]

function generateRandomAvatar() {
  const params = new URLSearchParams({
    avatarStyle: 'Circle',
    topType: avatarStyles[Math.floor(Math.random() * avatarStyles.length)],
    accessoriesType: 'Round',
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    clotheType: clothes[Math.floor(Math.random() * clothes.length)],
    eyeType: eyes[Math.floor(Math.random() * eyes.length)],
    eyebrowType: 'Default',
    mouthType: mouths[Math.floor(Math.random() * mouths.length)],
    skinColor: skins[Math.floor(Math.random() * skins.length)]
  })
  return `http://31.57.109.158:5000/avatars?${params.toString()}`
}

const avatarUsers = users.map((u) => ({
  ...u,
  avatarUrl: generateRandomAvatar()
}))

async function initGlobe() {
  await nextTick()
  emitter.emit('loading', true)
  await new Promise((resolve) => setTimeout(resolve, 100))

  const container = document.getElementById('globe-container')
  if (!container) {
    console.error('Container not found')
    return
  }

  try {
    emitter.emit('http-start', true)
    const g = Globe()(container)
      .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg')
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.3)
      .hexPolygonUseDots(true)
      .hexPolygonColor(
        () =>
          `#${Math.round(Math.random() * Math.pow(2, 24))
            .toString(16)
            .padStart(6, '0')}`
      )
      .hexPolygonLabel(
        ({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${d.POP_EST}</i>
        `
      )
      .width(window.innerWidth)
      .height(window.innerHeight)

    // Configure controls
    const controls = g.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 180
    controls.maxDistance = 800

    // Add points (cities) with labels
    g.pointsData(avatarUsers)
      .pointLat((d) => d.lat)
      .pointLng((d) => d.lng)
      .pointColor(() => '#c0392b')
      .pointAltitude(0.08)
      .pointRadius(0.1)
      .pointLabel(
        (d) => `<div style="background: rgba(0,0,0,0.9); padding: 8px 12px; border-radius: 8px; color: white;">
        <b style="color: #00ff88;">${d.city}</b><br/>
        <span style="color: #aaa;">${d.name}</span>
      </div>`
      )

    // Add HTML elements for avatars
    g.htmlElementsData(avatarUsers)
      .htmlElement((user) => {
        const el = document.createElement('div')
        el.className = 'avatar-marker'
        el.style.cssText = `
          position: relative;
          cursor: pointer;
          text-align: center;
          transition: transform 0.2s;
          pointer-events: auto;
        `

        const img = document.createElement('img')
        img.src = user.avatarUrl
        img.style.cssText = `
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid #00ff88;
          box-shadow: 0 0 15px rgba(0, 255, 136, 0.8);
          background: white;
          transition: all 0.3s;
          display: block;
        `

        const label = document.createElement('div')
        label.textContent = user.name
        label.style.cssText = `
          color: #ffffff;
          font-size: 10px;
          margin-top: 4px;
          text-shadow: 0 0 3px #000, 0 0 5px #000;
          font-weight: 600;
          white-space: nowrap;
        `

        el.appendChild(img)
        el.appendChild(label)

        el.onmouseenter = () => {
          el.style.transform = 'scale(1.2)'
          img.style.borderColor = '#ffeb3b'
          img.style.boxShadow = '0 0 20px rgba(255, 235, 59, 1)'
        }

        el.onmouseleave = () => {
          el.style.transform = 'scale(1)'
          img.style.borderColor = '#00ff88'
          img.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.8)'
        }

        el.onclick = (e) => {
          e.stopPropagation()
          selectedUser.value = user
          if (globe.value) {
            globe.value.pointOfView({ lat: user.lat, lng: user.lng, altitude: 1.5 }, 1500)
          }
        }

        return el
      })
      .htmlLat((d) => d.lat)
      .htmlLng((d) => d.lng)
      .htmlAltitude(0.1)

    // Set initial view
    g.pointOfView({ lat: 30, lng: 20, altitude: 2.1 }, 0)

    globe.value = g

    setTimeout(() => {
      if (globe.value) {
        globe.value.pointOfView({ lat: 30, lng: 20, altitude: 2.2 }, 0)
      }
      emitter.emit('loading', false)
      globeReady.value = true
    }, 300)

    // Handle window resize
    const handleResize = () => {
      if (globe.value && container) {
        globe.value.width(window.innerWidth)
        globe.value.height(window.innerHeight)
      }
    }

    window.addEventListener('resize', handleResize)

    globe.value._cleanupResize = () => {
      window.removeEventListener('resize', handleResize)
    }
    emitter.emit('http-stop', true)
  } catch (error) {
    console.error('Error initializing globe:', error)
    emitter.emit('loading', true)
    globeReady.value = false
    emitter.emit('error-message', 'مشکلی تو تشکیل جهان به وجود اومده! دوباره تلاش کن.')
  }
}

onMounted(() => {
  initGlobe()
})

onBeforeUnmount(() => {
  globeReady.value = false
  emitter.emit('loading', true)
  console.log(globeReady.value)
  selectedUser.value = null

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  if (globe.value) {
    try {
      if (globe.value._cleanupResize) {
        globe.value._cleanupResize()
      }

      if (typeof globe.value.htmlElementsData === 'function') {
        globe.value.htmlElementsData([])
      }

      if (typeof globe.value.pointsData === 'function') {
        globe.value.pointsData([])
      }

      if (typeof globe.value._destructor === 'function') {
        globe.value._destructor()
      }
    } catch (e) {
      console.warn('Error during cleanup:', e)
    }

    globe.value = null
  }

  globeContainer.value = false
})
</script>

<style scoped>
/* Base Globe Styles (Keep them mostly the same) */
.globe-wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
  position: relative;
  overflow: hidden;
  background: #000010; /* Dark space background */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.globe-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

@keyframes rotateBorder {
  0% {
    transform: rotate(0deg);
    filter: hue-rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    filter: hue-rotate(360deg);
  }
}

@keyframes dotPulse {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
  100% {
    content: '...';
  }
}

@keyframes pulse {
  from {
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
  }
  to {
    box-shadow: 0 0 25px rgba(74, 144, 226, 0.9);
  }
}

/* 💫 Futuristic User Info Popup (Glass-morphism) */
.user-popup {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: rgba(10, 10, 30, 0.85); /* Darker translucent background */
  border: 1px solid rgba(74, 144, 226, 0.6);
  border-radius: 20px;
  padding: 30px 20px;
  color: white;
  width: 280px;
  box-shadow: 0 10px 40px rgba(74, 144, 226, 0.4);
  backdrop-filter: blur(12px) brightness(1.2); /* Stronger blur and light boost */
  z-index: 10000;
  animation: slideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e0f7fa;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  transition: background 0.3s, transform 0.3s;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.popup-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #00ff88; /* Green accent */
  margin-bottom: 20px;
  display: block;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.7), 0 0 25px rgba(74, 144, 226, 0.4);
  background: #fff;
  object-fit: cover;
}

.user-popup h3 {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
  color: #4a90e2; /* Primary blue */
  text-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

.city {
  margin: 5px 0 10px 0;
  font-size: 1.1rem;
  color: #00ff88; /* Secondary green */
  font-weight: 500;
}

.coords {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: #aaa;
  font-family: 'Roboto Mono', monospace;
}

/* 📱 Mobile Optimization */
@media (max-width: 600px) {
  .user-popup {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    transform: none; /* Override desktop transform */
    border-radius: 20px 20px 0 0;
    padding: 20px;
    animation: slideInMobile 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  @keyframes slideInMobile {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .close-btn {
    top: 10px;
    right: 10px;
  }
}

:deep(.scene-tooltip) {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
}

:deep(.avatar-marker) {
  pointer-events: auto !important;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #e0f9ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;

  background: rgba(18, 24, 38, 0.55);
  padding: 28px 40px;
  border-radius: 100%;
  border: 1px solid rgba(0, 255, 230, 0.25);
  backdrop-filter: blur(16px) saturate(1.2);

  box-shadow:
    0 0 30px rgba(0, 255, 230, 0.15),
    inset 0 0 20px rgba(0, 255, 230, 0.05);

  z-index: 1000;
  animation: globePulse 3s ease-in-out infinite;
}

.globe-svg {
  width: 90px;
  height: 90px;
  display: block;
  margin: 0 auto 12px;
  filter: drop-shadow(0 0 8px rgba(0, 255, 230, 0.4));
  animation: spin 6s linear infinite;
}

.globe-ring {
  fill: none;
  stroke: rgba(0, 255, 230, 0.5);
  stroke-width: 2;
}

.globe-line {
  fill: none;
  stroke: rgba(0, 255, 230, 0.8);
  stroke-width: 5;
  stroke-dasharray: 188;
  stroke-dashoffset: 188;
  animation: draw 3s ease-in-out infinite alternate;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

@keyframes globePulse {
  0%, 100% {
    box-shadow:
      0 0 25px rgba(0, 255, 230, 0.15),
      inset 0 0 20px rgba(0, 255, 230, 0.05);
  }
  50% {
    box-shadow:
      0 0 40px rgba(0, 255, 230, 0.25),
      inset 0 0 25px rgba(0, 255, 230, 0.1);
  }
}

</style>