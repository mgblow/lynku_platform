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
      <div v-if="selectedData" class="user-popup">
        <button class="close-btn" @click="closePanel()">×</button>
        <Ping v-if="selectedData.type === 'ping'"></Ping>
        <Person v-if="selectedData.type === 'person'" :selectedData="selectedData"></Person>
        <Gift v-if="selectedData.type === 'gift'" :selectedData="selectedData"></Gift>
        <Publish v-if="selectedData.type === 'publish'"></Publish>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Globe from 'globe.gl'
import { emitter } from '@/utils/event-bus'
import Person from '@/components/Person.vue'
import Ping from '@/components/Ping.vue'
import wires from '@/data/wire-data'
import countries from '@/data/countries'
import Gift from '@/components/Gift.vue'
import Publish from '@/views/Publish.vue'

const globeContainer = ref(true)
const globe = ref(null)
const globeReady = ref(false)
const selectedData = ref(null)

const avatarStyles = ['ShortHairShortFlat', 'LongHairFro', 'Hat', 'Hijab', 'WinterHat1', 'Turban', 'LongHairStraight']
const clothes = ['Hoodie', 'ShirtCrewNeck', 'BlazerSweater', 'Overall']
const eyes = ['Happy', 'Close', 'Surprised', 'Squint']
const mouths = ['Smile', 'Default', 'Serious', 'Disbelief']
const skins = ['Light', 'Tanned', 'Brown', 'DarkBrown']
const marker = ref(null)
const emit = defineEmits(['select-location'])


const props = defineProps({
  hexed: {
    type: Boolean,
    default: true
  },
  palette: {
    type: String,
    default: 'gray' // default palette
  },
  wired: {
    type: Boolean,
    default: false
  },
  locationPicker: {
    type: Boolean,
    default: false
  },
  autoRotateSpeed: { type: Number, default: 0.5 },
  imageUrl: { type: String, default: '#000000' },
  data: { type: Array, default: () => [] },
  person: { type: Object, default: () => null }
})


const majorCities = [
  { lat: 35.6892, lng: 51.389, name: 'Tehran', color: '#ffcc00' },
  { lat: 40.7128, lng: -74.006, name: 'NewYork', color: '#00aaff' },
  { lat: 51.5074, lng: -0.1278, name: 'London', color: '#ff6699' },
  { lat: 48.8566, lng: 2.3522, name: 'Paris', color: '#66ff66' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo', color: '#ff6600' },
  { lat: 55.7558, lng: 37.6173, name: 'Mosscow', color: '#00ffff' },
  { lat: 24.7136, lng: 46.6753, name: 'Riaz', color: '#ffaa00' },
  { lat: 30.0444, lng: 31.2357, name: 'Qahere', color: '#ff3300' }
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
  return process.env.VUE_APP_AVATAR_APP_URL + `/avatars?${params.toString()}`
}

function pinData(newData = []) {
  if (!globe.value) return

  // Clear existing points if empty
  if (!Array.isArray(newData) || newData.length === 0) {
    globe.value.pointsData([])
    globe.value.htmlElementsData([])
    return
  }

  // Points
  const pointAltitude = 0.6
  const pointRadius = 0.1
  globe.value
    .pointsData(newData.map((u) => ({ ...u, avatarUrl: generateRandomAvatar() })))
    .pointLat((d) => d.lat)
    .pointLng((d) => d.lng)
    .pointColor(() => '#c0392b')
    .pointAltitude(pointAltitude)
    .pointRadius(pointRadius)
    .pointLabel(
      (d) => `
      <div style="background: rgba(0,0,0,0.9); padding: 8px 12px; border-radius: 8px; color: white;">
          <b style="color: #fff;">${d.city}</b>
          <br/>
          <span style="color: #aaa;">
              ${d.name}
           </span>
       </div>
        `
    )

  // Avatars
  globe.value
    .htmlElementsData(newData.map((u) => ({ ...u, avatarUrl: generateRandomAvatar() })))
    .htmlElement((data) => {
      const el = document.createElement('div')
      el.className = 'globe-marker'
      el.style.cssText = `
    position: relative;
    cursor: pointer;
    text-align: center;
    pointer-events: auto;
    transform: translateZ(0);
    transition: transform 0.25s ease, filter 0.25s ease;
  `

      // Common avatar
      const img = document.createElement('img')
      img.src = data.avatarUrl || '/assets/default-avatar.png'
      img.alt = data.name
      img.style.cssText = `
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 0 12px rgba(0,255,180,0.5);
    display: block;
    margin: 0 auto;
    transition: all 0.3s ease;
  `

      // Name Label
      const name = document.createElement('div')
      name.textContent = data.name
      name.style.cssText = `
    color: #fff;
    font-size: 10px;
    margin-top: 6px;
    font-weight: 600;
    text-shadow: 0 0 3px rgba(0,0,0,0.8);
  `

      el.appendChild(img)
      el.appendChild(name)

      // 🌌 If it's a ping
      if (data.type === 'ping') {
        const card = document.createElement('div')
        card.className = 'ping-card'
        card.innerHTML = `
      <p class="ping-text">${data.text}</p>
      <div class="ping-meta">
        <span>❤️ ${data.likes}</span>
        <span>🔁 ${data.reping}</span>
        <span>💬 ${data.comments}</span>
      </div>
    `
        card.style.cssText = `
      background: rgba(10,10,20,0.75);
      backdrop-filter: blur(8px) saturate(1.3);
      -webkit-backdrop-filter: blur(8px) saturate(1.3);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 10px;
      padding: 10px;
      margin-top: 10px;
      color: #fff;
      text-align: left;
      font-size: 11px;
      width: 180px;
      box-shadow: 0 4px 20px rgba(255,0,180,0.25);
      animation: fadeIn 0.4s ease;
      position: relative;
      direction: rtl;
      text-align: right;
    `
        // Ping text
        const style = document.createElement('style')
        style.textContent = `
      .ping-card .ping-text {
        line-height: 1.4;
        margin-bottom: 6px;
        font-weight: 400;
        text-shadow: 0 0 2px rgba(0,0,0,0.4);
        direction: ${/[آ-ی]/.test(data.text) ? 'rtl' : 'ltr'};
      }
      .ping-card .ping-meta {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        opacity: 0.8;
      }
      .globe-marker:hover .ping-card {
        box-shadow: 0 6px 26px rgba(255,0,200,0.35);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
        document.head.appendChild(style)
        el.appendChild(card)
      } else if (data.type === 'gift') {
        const card = document.createElement('div')
        card.className = 'gift-card'
        card.innerHTML = `
      <p class="gift-text">${data.text}</p>
      <div class="gift-meta">
          ${data.gift}
      </div>
    `
        card.style.cssText = `
      background: rgba(10,10,20,0.75);
      backdrop-filter: blur(8px) saturate(1.3);
      -webkit-backdrop-filter: blur(8px) saturate(1.3);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 10px;
      margin-top: 10px;
      color: #fff;
      font-size: 11px;
      width: 180px;
      box-shadow: 0 4px 20px rgba(255,0,180,0.25);
      animation: fadeIn 0.4s ease;
      position: relative;
      direction: rtl;
      text-align: center;
      padding-top: 10px;
    `
        // Ping text
        const style = document.createElement('style')
        style.textContent = `
      .ping-card .ping-text {
        line-height: 1.4;
        margin-bottom: 6px;
        font-weight: 400;
        text-shadow: 0 0 2px rgba(0,0,0,0.4);
        direction: ${/[آ-ی]/.test(data.text) ? 'rtl' : 'ltr'};
      }
      .ping-card .ping-meta {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        opacity: 0.8;
      }
      .globe-marker:hover .ping-card {
        box-shadow: 0 6px 26px rgba(255,0,200,0.35);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `
        document.head.appendChild(style)
        el.appendChild(card)
      }

      // 🌍 Hover behavior
      el.onmouseenter = () => {
        el.style.transform = 'scale(1.05)'
        img.style.boxShadow = '0 0 20px rgba(255,0,200,0.6)'
      }
      el.onmouseleave = () => {
        el.style.transform = 'scale(1.0)'
        img.style.boxShadow = '0 0 12px rgba(0,255,180,0.5)'
      }

      // 📍 On click focus globe
      el.onclick = (e) => {
        e.stopPropagation()
        selectedData.value = data
        globe.value?.pointOfView({ lat: data.lat, lng: data.lng, altitude: 1.5 }, 1500)
      }

      return el
    })

    .htmlLat((d) => d.lat)
    .htmlLng((d) => d.lng)
    .htmlAltitude(0.5)
}

function closePanel() {
  selectedData.value = null
  globe.value.pointOfView({ lat: 30, lng: 20, altitude: 3.5 }, 1500)
}


function createMarker(lat, lng) {
  return {
    lat,
    lng,
    size: 0.8,
    color: '#FF4444'
  }
}

function updateMarkers() {
  if (!globe.value) return
  const allPoints = [...majorCities, ...(marker.value ? [marker.value] : [])]

  globe.value
    .pointsData(allPoints)
    .pointColor(d => d.color || '#ffffff')
    .pointAltitude(d => (d === marker.value ? 0.05 : 0.015))
    .pointRadius(d => (d === marker.value ? 0.8 : 0.25))
}

async function initGlobe() {
  await nextTick()
  emitter.emit('loading', true)
  await new Promise((resolve) => setTimeout(resolve, 100))

  const container = document.getElementById('globe-container')
  if (!container) return console.error('Container not found')
  const globeImageUrl = props.imageUrl ? props.imageUrl : window.location.origin + '/globe/images/earth-dark.jpg'
  try {
    globe.value = Globe()(container)
      .globeImageUrl(globeImageUrl)
      .bumpImageUrl(window.location.origin + '/globe/images/earth-topology.png')
      .backgroundImageUrl(window.location.origin + '/globe/images/night-sky.png')
      .width(window.innerWidth)
      .height(window.innerHeight)

    if (props.locationPicker) {
      globe.value.onGlobeClick(({ lat, lng }) => {
        marker.value = createMarker(lat, lng)
        selectedData.value = {
          lat: lat,
          lng: lng,
          type: 'publish',
        }
        updateMarkers()
        emit('select-location', { lat, lon: lng })
        globe.value.pointOfView(
          { lat: lat - 3, lng: lng, altitude: 1.3 },
          1200
        );
      });

      globe.value.labelsData(majorCities)
        .labelText('name')
        .labelSize(1)
        .labelColor(() => '#ffffff')
        .labelAltitude(0.01)
        .onLabelClick(city => {
          marker.value = createMarker(city.lat, city.lng)
          updateMarkers()
          emit('select-location', { lat: city.lat, lon: city.lng })
          globe.value.pointOfView({ lat: city.lat, lng: city.lng, altitude: 1.8 }, 800)
        })

      // Add base city points
      globe.value.pointsData(majorCities)
        .pointColor(d => d.color)
        .pointAltitude(0.015)
        .pointRadius(0.25)

      marker.value = createMarker(35.6892, 51.389)
      updateMarkers()
    }

    if (props.hexed) {
      if (props.hexed) {
        // Predefined palettes
        const palettes = {
          futuristic: [
            'hsl(200, 100%, 55%)', // Electric Blue – vibrant & techy
            'hsl(330, 100%, 60%)', // Neon Pink – bold & flashy
            'hsl(50, 100%, 60%)',  // Bright Neon Yellow – high energy
            'hsl(160, 100%, 55%)', // Vibrant Cyan-Green – futuristic glow
            'hsl(280, 95%, 60%)'   // Neon Purple – intense & cyberpunk
          ],
          simpleDark: [
            'hsl(0, 0%, 10%)',
            'hsl(0, 0%, 20%)',
            'hsl(0, 0%, 30%)',
            'hsl(0, 0%, 40%)',
            'hsl(0, 0%, 50%)'
          ],
          gray: [
            'hsl(0, 0%, 20%)',
            'hsl(0, 0%, 40%)',
            'hsl(0, 0%, 60%)',
            'hsl(0, 0%, 80%)',
            'hsl(0, 0%, 90%)'
          ],
          whiteHollow: [
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.15)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.25)'
          ],
          blue: [
            'hsl(210, 90%, 50%)',
            'hsl(210, 80%, 60%)',
            'hsl(210, 70%, 70%)',
            'hsl(210, 60%, 80%)',
            'hsl(210, 50%, 90%)'
          ]
        };

        // Choose the palette you want (can be dynamic)
        const selectedPalette = palettes[props.palette] || palettes.gray;

        // hex polygon map configuration
        globe.value
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.3)
          .hexPolygonUseDots(true)
          .hexPolygonColor(() => selectedPalette[Math.floor(Math.random() * selectedPalette.length)]);
      }

    }

    if (props.wired) {
      let cablePaths = []
      wires.features.forEach(({ geometry, properties }) => {
        geometry.coordinates.forEach((coords) => cablePaths.push({ coords, properties }))
      })

      globe.value
        .pathsData(cablePaths)
        .pathPoints('coords')
        .pathPointLat((p) => p[1])
        .pathPointLng((p) => p[0])
        .pathColor((path) => path.properties.color)
        .pathLabel((path) => path.properties.name)
        .pathDashLength(0.1)
        .pathDashGap(0.008)
        .pathDashAnimateTime(14000)
    }
    const controls = globe.value.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = props.autoRotateSpeed
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 180
    controls.maxDistance = 800

    pinData(props.data)
    globe.value.pointOfView({ lat: 30, lng: 20, altitude: 3.5 }, 0)
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
watch(
  () => props.data,
  (newPeople) => pinData(newPeople),
  { deep: true }
)
watch(
  () => props.autoRotateSpeed,
  (speed) => {
    if (globe.value) globe.value.controls().autoRotateSpeed = speed
  }
)
watch(
  () => props.imageUrl,
  (url) => {
    if (globe.value) globe.value.globeImageUrl(url)
  }
)
watch(
  () => props.person,
  (person) => {
    selectedData.value = person
  }
)

onMounted(() => {
  initGlobe()
  if (props.person) {
    selectedData.value = {
      ...props.person,
      avatarUrl: generateRandomAvatar()
    }
  }
})

onBeforeUnmount(() => {
  selectedData.value = null
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
  padding: 60px 20px;
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