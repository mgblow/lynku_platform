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
  </div>
</template>

<script setup>
import { createApp, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Globe from 'globe.gl'
import { emitter } from '@/utils/event-bus'
import Person from '@/components/Person.vue'
import Ping from '@/components/Ping.vue'
import wires from '@/data/wire-data'
import countries from '@/data/countries'
import Gift from '@/components/Gift.vue'
import Publish from '@/views/Publish.vue'
import GiftCard from '@/components/globe/GiftCard.vue'
import PingCard from '@/components/globe/PingCard.vue'

const globeContainer = ref(true)
const globe = ref(null)
const globeReady = ref(false)
const selectedData = ref(null)

// constants
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






const avatarStyles = ['ShortHairShortFlat', 'LongHairFro', 'Hat', 'Hijab', 'WinterHat1', 'Turban', 'LongHairStraight']
const clothes = ['Hoodie', 'ShirtCrewNeck', 'BlazerSweater', 'Overall']
const eyes = ['Happy', 'Close', 'Surprised', 'Squint']
const mouths = ['Smile', 'Default', 'Serious', 'Disbelief']
const skins = ['Light', 'Tanned', 'Brown', 'DarkBrown']
const marker = ref(null)
const emit = defineEmits(['select-location'])

// props

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
  imageUrl: { type: String, default: ''},
  data: { type: Array, default: () => [] },
  person: { type: Object, default: () => null }
})

// functions
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
          <span style="color: #aaa;">${d._id}</span>
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

      if (data.type === 'ping') {
        const wrapper = document.createElement('div')
        const mountPoint = document.createElement('div')
        wrapper.appendChild(mountPoint)

        const app = createApp(PingCard, {
          text: data.text,
          likes: data.likes,
          reping: data.reping,
          comments: data.comments
        })

        app.mount(mountPoint)

        el.appendChild(wrapper)
      }

      if (data.type === 'gift') {
        const wrapper = document.createElement('div')
        wrapper.className = 'gift-card-wrapper'
        wrapper.style.cssText = `
                                  margin-top: 10px;
                                  width: 180px;
                                  position: relative;
                                `

        // Create mounting point
        const mountPoint = document.createElement('div')
        wrapper.appendChild(mountPoint)
        // Mount Vue component programmatically
        const app = createApp(GiftCard, {
          text: data.text,
          gift: data.gift
        })
        app.mount(mountPoint)

        el.appendChild(wrapper)
      }

      el.onmouseenter = () => {
        el.style.transform = 'scale(1.05)'
        img.style.boxShadow = '0 0 20px rgba(255,0,200,0.6)'
      }
      el.onmouseleave = () => {
        el.style.transform = 'scale(1.0)'
        img.style.boxShadow = '0 0 12px rgba(0,255,180,0.5)'
      }

      el.onclick = (e) => {
        e.stopPropagation()
        emitter.emit('drawer:' + data.type, data)
        globe.value?.pointOfView({ lat: data.lat, lng: data.lng, altitude: 1.5 }, 1500)
      }

      return el
    })

    .htmlLat((d) => d.lat)
    .htmlLng((d) => d.lng)
    .htmlAltitude(0.5)
}

function createMarker(lat, lng) {
  return {
    lat,
    lng,
    size: 0.1,
    color: '#FF4444'
  }
}

function updateMarkers() {
  if (!globe.value) return
  const allPoints = [ ...(marker.value ? [marker.value] : [])]

  globe.value
    .pointsData(allPoints)
    .pointColor((d) => d.color || '#ffffff')
    .pointAltitude((d) => (d === marker.value ? 0.1 : 0.01))
    .pointRadius((d) => (d === marker.value ? 0.2 : 0.25))
}

async function initGlobe() {
  await nextTick()
  emitter.emit('loading', true)
  await new Promise((resolve) => setTimeout(resolve, 100))

  const container = document.getElementById('globe-container')
  if (!container) return console.error('Container not found')

  try {
    let globeImageUrl = '';
    if(props.imageUrl === ''){
      globeImageUrl = window.location.origin + '/globe/images/earth-dark.jpg'
    }else{
      globeImageUrl = window.location.origin + props.imageUrl
    }

    globe.value = Globe()(container)
      .globeImageUrl(globeImageUrl)
      .bumpImageUrl(window.location.origin + '/globe/images/earth-topology.png')
      .backgroundImageUrl(window.location.origin + '/globe/images/night-sky.png')
      .width(window.innerWidth)
      .height(window.innerHeight)

    if (props.locationPicker) {
      globe.value.onGlobeClick(({ lat, lng }) => {
        marker.value = createMarker(lat, lng)
        emitter.emit("drawer:publish", {lat: lat, lng: lng})
        updateMarkers()
        emit('select-location', { lat, lon: lng })
        globe.value.pointOfView({ lat: lat - 4, lng: lng, altitude: 1.3 }, 1200)
      })

      globe.value
        .labelsData(majorCities)
        .labelText('name')
        .labelSize(1)
        .labelColor(() => '#ffffff')
        .labelAltitude(0.01)
        .onLabelClick((city) => {
          marker.value = createMarker(city.lat, city.lng)
          updateMarkers()
          emit('select-location', { lat: city.lat, lon: city.lng })
          globe.value.pointOfView({ lat: city.lat, lng: city.lng, altitude: 1.8 }, 800)
        })

      // Add base city points
      globe.value
        .pointsData(majorCities)
        .pointColor((d) => d.color)
        .pointAltitude(0.015)
        .pointRadius(0.25)

      marker.value = createMarker(35.6892, 51.389)
      updateMarkers()
    }

    if (props.hexed) {
      // Predefined palettes
      const palettes = {
        futuristic: [
          'hsl(200, 100%, 55%)', // Electric Blue – vibrant & techy
          'hsl(330, 100%, 60%)', // Neon Pink – bold & flashy
          'hsl(50, 100%, 60%)', // Bright Neon Yellow – high energy
          'hsl(160, 100%, 55%)', // Vibrant Cyan-Green – futuristic glow
          'hsl(280, 95%, 60%)' // Neon Purple – intense & cyberpunk
        ],
        simpleDark: ['hsl(0, 0%, 10%)', 'hsl(0, 0%, 20%)', 'hsl(0, 0%, 30%)', 'hsl(0, 0%, 40%)', 'hsl(0, 0%, 50%)'],
        gray: ['hsl(0, 0%, 20%)', 'hsl(0, 0%, 40%)', 'hsl(0, 0%, 60%)', 'hsl(0, 0%, 80%)', 'hsl(0, 0%, 90%)'],
        whiteHollow: [
          'rgba(255, 255, 255, 0.05)',
          'rgba(255, 255, 255, 0.1)',
          'rgba(255, 255, 255, 0.15)',
          'rgba(255, 255, 255, 0.2)',
          'rgba(255, 255, 255, 0.25)'
        ],
        blue: ['hsl(210, 90%, 50%)', 'hsl(210, 80%, 60%)', 'hsl(210, 70%, 70%)', 'hsl(210, 60%, 80%)', 'hsl(210, 50%, 90%)']
      }

      // Choose the palette you want (can be dynamic)
      const selectedPalette = palettes[props.palette] || palettes.gray

      // hex polygon map configuration
      globe.value
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonUseDots(true)
        .hexPolygonColor(() => selectedPalette[Math.floor(Math.random() * selectedPalette.length)])
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
    globe.value.pointOfView({ lat: 30, lng: 20, altitude: 3.5 }, 500)
    globeReady.value = true

    const handleResize = () => globe.value && (globe.value.width(window.innerWidth), globe.value.height(window.innerHeight))
    window.addEventListener('resize', handleResize)
    globe.value._cleanupResize = () => window.removeEventListener('resize', handleResize)
  } catch (err) {
    console.error('Globe init error:', err)
    globeReady.value = false
  }
}

// watchers
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

// hooks

onMounted(() => {
  initGlobe()
  emitter.on('globe:pointOfView', (viewport) => {
    if (globe.value)
      globe.value.pointOfView({ lat: viewport.lat, lng: viewport.lng, altitude: viewport.altitude }, viewport.transition)
  })
})

onBeforeUnmount(() => {
  globeReady.value = false
  if (globe.value?._cleanupResize) globe.value._cleanupResize()
  globe.value?.pointsData([])
  globe.value?.htmlElementsData([])
  globe.value = null
  globeContainer.value = false
})
</script>

<style scoped>
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