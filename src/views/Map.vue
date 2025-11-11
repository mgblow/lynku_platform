<template>
  <div class="globe-wrapper">
    <div v-if="globeContainer" id="globe-container" ref="globeContainer" class="globe-container"></div>
    <div v-if="!globeReady" class="loading">در حال بارگذاری کره زمین ...</div>

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
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import Globe from 'globe.gl'

const globeContainer = ref(true)
const globe = ref(null)
const globeReady = ref(false)
const selectedUser = ref(null)
let animationFrameId = null

const avatarStyles = [
  'ShortHairShortFlat',
  'LongHairFro',
  'Hat',
  'Hijab',
  'WinterHat1',
  'Turban',
  'LongHairStraight'
]

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
  return `http://localhost:5000/avatars?${params.toString()}`
}

const avatarUsers = users.map(u => ({
  ...u,
  avatarUrl: generateRandomAvatar()
}))

async function initGlobe() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 100))

  const container = document.getElementById('globe-container')
  if (!container) {
    console.error('Container not found')
    return
  }

  try {
    const g = Globe()(container)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .backgroundColor('#000010')
      .showAtmosphere(true)
      .atmosphereColor('#4a90e2')
      .atmosphereAltitude(0.15)
      .width(window.innerWidth)
      .height(window.innerHeight)

    // Configure controls
    const controls = g.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 180
    controls.maxDistance = 800

    // Add points (cities) with labels
    g.pointsData(avatarUsers)
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointColor(() => '#00ff88')
      .pointAltitude(0.01)
      .pointRadius(0.3)
      .pointLabel(d => `<div style="background: rgba(0,0,0,0.9); padding: 8px 12px; border-radius: 8px; color: white; font-family: sans-serif;">
        <b style="color: #00ff88;">${d.city}</b><br/>
        <span style="color: #aaa;">${d.name}</span>
      </div>`)

    // Add HTML elements for avatars
    g.htmlElementsData(avatarUsers)
      .htmlElement(user => {
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
      .htmlLat(d => d.lat)
      .htmlLng(d => d.lng)
      .htmlAltitude(0.01)

    // Set initial view
    g.pointOfView({ lat: 30, lng: 20, altitude: 2.2 }, 0)

    globe.value = g

    setTimeout(() => {
      if (globe.value) {
        globe.value.pointOfView({ lat: 30, lng: 20, altitude: 2.2 }, 0)
      }
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

  } catch (error) {
    console.error('Error initializing globe:', error)
    globeReady.value = false
  }
}

onMounted(() => {
  initGlobe()
})

onBeforeUnmount(() => {
  globeReady.value = false
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
.globe-wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000010;
}

.globe-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  background: rgba(10, 10, 21, 0.9);
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1rem;
  border: 2px solid #4a90e2;
  box-shadow: 0 0 20px rgba(74, 144, 226, 0.5);
  z-index: 1000;
}

.user-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(10, 10, 21, 0.95);
  border: 2px solid #4a90e2;
  border-radius: 16px;
  padding: 20px;
  color: white;
  min-width: 250px;
  box-shadow: 0 8px 32px rgba(74, 144, 226, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.popup-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #4a90e2;
  margin: 0 auto 15px;
  display: block;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
}

.user-popup h3 {
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  text-align: center;
  color: #4a90e2;
}

.city {
  margin: 8px 0;
  font-size: 1rem;
  text-align: center;
  color: #00ff88;
}

.coords {
  margin: 8px 0 0 0;
  font-size: 0.85rem;
  text-align: center;
  color: #888;
  font-family: monospace;
}

:deep(.scene-tooltip) {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
}

:deep(.avatar-marker) {
  pointer-events: auto !important;
}
</style>