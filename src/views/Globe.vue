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
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import Globe from 'globe.gl'
import countries from '@/utils/countries'
import { emitter } from '@/utils/event-bus'

const globeContainer = ref(true)
const globe = ref(null)
const globeReady = ref(false)
const selectedUser = ref(null)

const avatarStyles = ['ShortHairShortFlat','LongHairFro','Hat','Hijab','WinterHat1','Turban','LongHairStraight']
const clothes = ['Hoodie','ShirtCrewNeck','BlazerSweater','Overall']
const eyes = ['Happy','Close','Surprised','Squint']
const mouths = ['Smile','Default','Serious','Disbelief']
const skins = ['Light','Tanned','Brown','DarkBrown']

const props = defineProps({
  autoRotateSpeed: { type: Number, default: 0.5 },
  imageUrl: { type: String, default: '#000000' },
  people: { type: Array, default: () => [] }
})

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

function addPeopleToGlobe(newPeople = []) {
  if (!globe.value) return

  // Clear existing points if empty
  if (!Array.isArray(newPeople) || newPeople.length === 0) {
    globe.value.pointsData([])
    globe.value.htmlElementsData([])
    return
  }

  // Points
  globe.value.pointsData(newPeople.map(u => ({ ...u, avatarUrl: generateRandomAvatar() })))
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(() => '#c0392b')
    .pointAltitude(0.1)
    .pointRadius(0.2)
    .pointLabel(d => `<div style="background: rgba(0,0,0,0.9); padding: 8px 12px; border-radius: 8px; color: white;">
      <b style="color: #fff;">${d.city}</b><br/><span style="color: #aaa;">${d.name}</span>
    </div>`)

  // Avatars
  globe.value.htmlElementsData(newPeople.map(u => ({ ...u, avatarUrl: generateRandomAvatar() })))
    .htmlElement(user => {
      const el = document.createElement('div')
      el.className = 'avatar-marker'
      el.style.cssText = 'position: relative; cursor: pointer; text-align: center; transition: transform 0.2s; pointer-events: auto;'

      const img = document.createElement('img')
      img.src = user.avatarUrl
      img.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid #00ff88;
        box-shadow: 0 0 15px rgba(0,255,136,0.8);
        background: white;
        transition: all 0.3s;
        display: block;
      `

      const label = document.createElement('div')
      label.textContent = user.name
      label.style.cssText = 'color: #fff; font-size: 10px; margin-top: 4px; text-shadow: 0 0 3px #000,0 0 5px #000; font-weight: 600; white-space: nowrap;'

      el.appendChild(img)
      el.appendChild(label)

      el.onmouseenter = () => {
        el.style.transform = 'scale(1.2)'
        img.style.borderColor = '#ffeb3b'
        img.style.boxShadow = '0 0 20px rgba(255,235,59,1)'
      }
      el.onmouseleave = () => {
        el.style.transform = 'scale(1)'
        img.style.borderColor = '#00ff88'
        img.style.boxShadow = '0 0 15px rgba(0,255,136,0.8)'
      }
      el.onclick = (e) => {
        e.stopPropagation()
        selectedUser.value = user
        globe.value?.pointOfView({ lat: user.lat, lng: user.lng, altitude: 1.5 }, 1500)
      }

      return el
    })
    .htmlLat(d => d.lat)
    .htmlLng(d => d.lng)
    .htmlAltitude(0.5)
}

async function initGlobe() {
  await nextTick()
  emitter.emit('loading', true)
  await new Promise(resolve => setTimeout(resolve, 100))

  const container = document.getElementById('globe-container')
  if (!container) return console.error('Container not found')

  try {
    globe.value = Globe()(container)
      .globeImageUrl(props.imageUrl)
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.3)
      .hexPolygonUseDots(true)
      .hexPolygonColor(() => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,'0')}`)
      .hexPolygonLabel(({ properties: d }) => `<b>${d.ADMIN} (${d.ISO_A2})</b> <br />Population: <i>${d.POP_EST}</i>`)
      .width(window.innerWidth)
      .height(window.innerHeight)

    const controls = globe.value.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = props.autoRotateSpeed
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 180
    controls.maxDistance = 800

    addPeopleToGlobe(props.people)
    globe.value.pointOfView({ lat: 30, lng: 20, altitude: 2.2 }, 0)
    globeReady.value = true

    const handleResize = () => globe.value && (globe.value.width(window.innerWidth), globe.value.height(window.innerHeight))
    window.addEventListener('resize', handleResize)
    globe.value._cleanupResize = () => window.removeEventListener('resize', handleResize)
  } catch (err) {
    console.error('Globe init error:', err)
    globeReady.value = false
  }
}

// Reactive watchers
watch(() => props.people, (newPeople) => addPeopleToGlobe(newPeople), { deep: true })
watch(() => props.autoRotateSpeed, (speed) => { if (globe.value) globe.value.controls().autoRotateSpeed = speed })
watch(() => props.imageUrl, (url) => { if (globe.value) globe.value.globeImageUrl(url) })

onMounted(initGlobe)
onBeforeUnmount(() => {
  selectedUser.value = null
  globeReady.value = false
  if (globe.value?._cleanupResize) globe.value._cleanupResize()
  globe.value?.pointsData([])
  globe.value?.htmlElementsData([])
  globe.value = null
  globeContainer.value = false
})
</script>


<style scoped>
/* Base Globe Styles (Keep them mostly the same) */
.globe-wrapper {
  width: 100vw;
  height: 100vh;
  position: relative;
  direction: ltr;
  overflow: hidden;
  background: #000010;
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
  background: rgba(5, 5, 20, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  padding: 30px 20px;
  color: white;
  width: 280px;
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
  padding: 40px 40px;
  border-radius: 100%;
  border: 1px solid rgba(0, 255, 230, 0.25);
  backdrop-filter: blur(16px) saturate(1.2);

  box-shadow: 0 0 30px rgba(0, 255, 230, 0.15), inset 0 0 20px rgba(0, 255, 230, 0.05);

  z-index: 1000;
  animation: globePulse 3s ease-in-out infinite;
}

.globe-svg {
  width: 70px;
  height: 70px;
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes globePulse {
  0%,
  100% {
    box-shadow: 0 0 25px rgba(0, 255, 230, 0.15), inset 0 0 20px rgba(0, 255, 230, 0.05);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 230, 0.25), inset 0 0 25px rgba(0, 255, 230, 0.1);
  }
}
</style>