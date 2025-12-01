<template>
  <div class="globe-wrapper">
    <!-- Globe container -->
    <div id="globe-container" ref="globeContainer" class="globe-container"></div>

    <!-- Fancy loading state -->
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
import wires from '@/data/wire-data'
import countries from '@/data/countries'
import GiftCard from '@/components/globe/GiftCard.vue'
import PingCard from '@/components/globe/PingCard.vue'

// ---------------------------------------------------------------------
// CONSTANTS
// ---------------------------------------------------------------------
const GLOBE_IMAGES_BASE = `${window.location.origin}/globe/images`

const MAJOR_CITIES = [
  { lat: 35.6892, lng: 51.389, name: 'Tehran',  color: '#ffcc00' },
  { lat: 40.7128, lng: -74.006, name: 'NewYork', color: '#00aaff' },
  { lat: 51.5074, lng: -0.1278, name: 'London',  color: '#ff6699' },
  { lat: 48.8566, lng: 2.3522, name: 'Paris',   color: '#66ff66' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo',  color: '#ff6600' },
  { lat: 55.7558, lng: 37.6173, name: 'Mosscow', color: '#00ffff' },
  { lat: 24.7136, lng: 46.6753, name: 'Riaz',    color: '#ffaa00' },
  { lat: 30.0444, lng: 31.2357, name: 'Qahere',  color: '#ff3300' }
]

const PALETTES = {
  futuristic: [
    'hsl(200, 100%, 55%)',
    'hsl(330, 100%, 60%)',
    'hsl(50, 100%, 60%)',
    'hsl(160, 100%, 55%)',
    'hsl(280, 95%, 60%)'
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
}

// ---------------------------------------------------------------------
// PROPS & EMITS
// ---------------------------------------------------------------------
const emit = defineEmits(['select-location'])

const props = defineProps({
  hexed: {
    type: Boolean,
    default: true
  },
  palette: {
    type: String,
    default: 'gray'
  },
  wired: {
    type: Boolean,
    default: false
  },
  locationPicker: {
    type: Boolean,
    default: false
  },
  autoRotateSpeed: {
    type: Number,
    default: 0.5
  },
  imageUrl: {
    type: String,
    default: ''
  },
  // data from Home:
  // [{ type: 'tex' | 'person' | 'gem', _id, lat, lng, name, city, avatarConfig?, ... }]
  data: {
    type: Array,
    default: () => []
  },
  person: {
    type: Object,
    default: () => null
  }
})

// ---------------------------------------------------------------------
// STATE
// ---------------------------------------------------------------------
const globeContainer = ref(null)
const globe = ref(null)
const globeReady = ref(false)
const marker = ref(null)

// ---------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------
function getGlobeImageUrl(customName) {
  if (!customName) return `${GLOBE_IMAGES_BASE}/earth-dark.jpg`
  return `${GLOBE_IMAGES_BASE}/${customName}`
}

function buildAvatarUrl(avatarConfig) {
  if (!avatarConfig || typeof avatarConfig !== 'object') {
    try {
      // same fallback you used elsewhere
      return require('@/assets/fox.jpg')
    } catch {
      return '/assets/fox.jpg'
    }
  }
  const baseUrl = process.env.VUE_APP_AVATAR_APP_URL + '/avatars'
  const params = new URLSearchParams(avatarConfig)
  return `${baseUrl}?${params.toString()}`
}

function createMarker(lat, lng) {
  return {
    lat,
    lng,
    size: 0.1,
    color: '#FF4444'
  }
}

function getUidFromData(d) {
  return d._id || d.uid || d.id || ''
}

function safeNumber(...values) {
  for (const v of values) {
    if (typeof v === 'number' && !Number.isNaN(v)) return v
    if (typeof v === 'string' && v !== '' && !Number.isNaN(Number(v))) {
      return Number(v)
    }
  }
  return 0
}

function getPointColor(d) {
  switch (d.type) {
    case 'tex':
      return '#ff2d95'
    case 'person':
      return '#00e6ff'
    case 'gem':
      return '#ffd93b'
    default:
      return '#c0392b'
  }
}

function getPointAltitude(d) {
  switch (d.type) {
    case 'gem':
      return 0.9
    case 'person':
      return 0.7
    case 'tex':
      return 0.6
    default:
      return 0.5
  }
}

function getPointRadius(d) {
  switch (d.type) {
    case 'person':
      return 0.08
    case 'gem':
      return 0.07
    case 'tex':
      return 0.06
    default:
      return 0.05
  }
}

// ---------------------------------------------------------------------
// DATA LAYERS
// ---------------------------------------------------------------------
function pinData(newData = []) {
  if (!globe.value) return

  if (!Array.isArray(newData) || newData.length === 0) {
    globe.value.pointsData([])
    globe.value.htmlElementsData([])
    return
  }

  const richData = newData.map((u) => ({
    ...u,
    avatarUrl: u.avatarUrl || buildAvatarUrl(u.avatarConfig)
  }))

  globe.value
    .pointsData(richData)
    .pointLat((d) => d.lat)
    .pointLng((d) => d.lng)
    .pointColor((d) => getPointColor(d))
    .pointAltitude((d) => getPointAltitude(d))
    .pointRadius((d) => getPointRadius(d))
    .pointLabel((d) => {
      const id = getUidFromData(d)

      const likes = safeNumber(d.likes, d.stats?.likes)
      const lynks = safeNumber(
        d.retex,
        d.reping,
        d.stats?.retex,
        d.stats?.lynks
      )
      const comments = safeNumber(
        d.comments,
        d.stats?.replies,
        d.stats?.comments
      )

      const base = `
        <div style="background: rgba(0,0,0,0.9); padding: 8px 12px; border-radius: 8px; color: white; max-width: 220px;">
          <b style="color: #fff;">${d.name || d.city || 'Unknown'}</b><br/>
          <span style="color: #aaa;">${d.city || ''}</span><br/>
          <span style="color: #6b7280; font-size: 11px;">_id: ${id}</span><br/>
      `
      if (d.type === 'tex') {
        return (
          base +
          `<span style="color:#f973ff;font-size:11px;">❤ ${likes} · 🔁 ${lynks} · 💬 ${comments}</span></div>`
        )
      }
      if (d.type === 'person') {
        return (
          base +
          `<span style="color:#00f5ff;font-size:11px;">${d.status || 'online'} · 💎 ${d.gemsCollected ?? 0}</span></div>`
        )
      }
      if (d.type === 'gem') {
        return (
          base +
          `<span style="color:#ffe45e;font-size:11px;">💎 ${d.rarity || 'common'} · ${d.value ?? 0} pts</span></div>`
        )
      }
      return base + `<span style="color:#9ca3af;font-size:11px;">${d.type || ''}</span></div>`
    })

  globe.value
    .htmlElementsData(richData)
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

      if (data.type === 'gem') {
        // GEM MARKER
        const gem = document.createElement('div')
        gem.style.cssText = `
          width: 22px;
          height: 22px;
          margin: 0 auto;
          transform: rotate(45deg);
          background: radial-gradient(circle at 30% 30%, #ffffff, #ffe45e, #f59e0b);
          box-shadow: 0 0 18px rgba(251, 191, 36, 0.85);
          border-radius: 4px;
        `
        el.appendChild(gem)

        const name = document.createElement('div')
        name.textContent = data.name || 'Gem'
        name.style.cssText = `
          color: #e5e7eb;
          font-size: 10px;
          margin-top: 4px;
          font-weight: 600;
        `
        el.appendChild(name)

        const rarity = document.createElement('div')
        rarity.textContent = `◆ ${data.rarity || 'common'}`
        rarity.style.cssText = `
          color: #fde68a;
          font-size: 9px;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        `
        el.appendChild(rarity)
      } else {
        // PERSON / TEX – AVATAR MARKER
        const img = document.createElement('img')
        img.src = data.avatarUrl || '/assets/fox.jpg'
        img.alt = data.name
        img.style.cssText = `
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          display: block;
          margin: 0 auto;
          transition: all 0.3s ease;
          box-shadow: ${
          data.type === 'person'
            ? '0 0 14px rgba(0,230,255,0.8)'
            : data.type === 'tex'
              ? '0 0 12px rgba(255,45,149,0.8)'
              : '0 0 12px rgba(0,255,180,0.5)'
        };
        `

        const name = document.createElement('div')
        name.textContent = data.name || 'Unknown'
        name.style.cssText = `
          color: #fff;
          font-size: 10px;
          margin-top: 6px;
          font-weight: 600;
          text-shadow: 0 0 3px rgba(0,0,0,0.8);
        `

        const uid = document.createElement('div')
        uid.textContent = getUidFromData(data)
        uid.style.cssText = `
          color: #9ca3af;
          font-size: 9px;
          margin-top: 2px;
          font-family: monospace;
          opacity: 0.9;
        `

        el.appendChild(img)
        el.appendChild(name)
        el.appendChild(uid)

        if (data.type === 'person' && data.status) {
          const status = document.createElement('div')
          status.textContent = data.status
          status.style.cssText = `
            color: #a5f3fc;
            font-size: 9px;
            margin-top: 2px;
            opacity: 0.95;
          `
          el.appendChild(status)
        }

        if (data.type === 'tex') {
          const wrapper = document.createElement('div')
          const mountPoint = document.createElement('div')
          wrapper.appendChild(mountPoint)

          const likes = safeNumber(data.likes, data.stats?.likes)
          const reping = safeNumber(
            data.retex,
            data.reping,
            data.stats?.retex,
            data.stats?.lynks
          )
          const comments = safeNumber(
            data.comments,
            data.stats?.replies,
            data.stats?.comments
          )

          const app = createApp(PingCard, {
            text: data.text,
            likes,
            reping,
            comments,
            authorName: data.name,
            handle: data.handle || data.authorHandle || data.username || ''
          })

          app.mount(mountPoint)
          el.appendChild(wrapper)
        }

        el.onmouseenter = () => {
          el.style.transform = 'scale(1.05)'
          img.style.filter = 'brightness(1.2)'
        }
        el.onmouseleave = () => {
          el.style.transform = 'scale(1.0)'
          img.style.filter = 'brightness(1.0)'
        }
      }

      el.onclick = (e) => {
        e.stopPropagation()

        // Be explicit: map known types → drawer events
        if (data.type === 'tex') {
          emitter.emit('drawer:tex', data)
        } else if (data.type === 'person') {
          emitter.emit('drawer:person', data)
        } else if (data.type === 'gem') {
          emitter.emit('drawer:gem', data)
        } else if (data.type === 'publish') {
          emitter.emit('drawer:publish', data)
        } else if (data.type === 'avatarConfig') {
          emitter.emit('drawer:avatarConfig', data)
        } else if (data.type === 'settings') {
          emitter.emit('drawer:settings', data)
        }

        globe.value?.pointOfView(
          { lat: data.lat, lng: data.lng, altitude: 1.5 },
          1500
        )
      }


      return el
    })
    .htmlLat((d) => d.lat)
    .htmlLng((d) => d.lng)
    .htmlAltitude((d) => (d.type === 'gem' ? 0.7 : 0.5))
}

function updateMarkers() {
  if (!globe.value) return

  const allPoints = [...(marker.value ? [marker.value] : [])]

  globe.value
    .pointsData(allPoints)
    .pointColor((d) => d.color || '#ffffff')
    .pointAltitude((d) => (d === marker.value ? 0.1 : 0.01))
    .pointRadius((d) => (d === marker.value ? 0.2 : 0.25))
}

// ---------------------------------------------------------------------
// LIFECYCLE
// ---------------------------------------------------------------------
onMounted(async () => {
  await nextTick()

  emitter.emit('loading', true)

  const container = globeContainer.value
  if (!container) {
    // super defensive – but shouldn't happen now
    console.warn('Globe: container ref is null on mounted')
    emitter.emit('loading', false)
    return
  }

  try {
    const globeImageUrl = getGlobeImageUrl(props.imageUrl)

    globe.value = Globe()(container)
      .globeImageUrl(globeImageUrl)
      .bumpImageUrl(`${GLOBE_IMAGES_BASE}/earth-topology.png`)
      .backgroundImageUrl(`${GLOBE_IMAGES_BASE}/night-sky.png`)
      .width(window.innerWidth)
      .height(window.innerHeight)

    // Location picker (for publish)
    if (props.locationPicker) {
      globe.value.onGlobeClick(({ lat, lng }) => {
        marker.value = createMarker(lat, lng)
        emitter.emit('drawer:publish', { lat, lng })
        updateMarkers()
        emit('select-location', { lat, lon: lng })
        globe.value.pointOfView({ lat: lat - 4, lng, altitude: 1.3 }, 1200)
      })

      globe.value
        .labelsData(MAJOR_CITIES)
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

      globe.value
        .pointsData(MAJOR_CITIES)
        .pointColor((d) => d.color)
        .pointAltitude(0.015)
        .pointRadius(0.25)

      marker.value = createMarker(35.6892, 51.389)
      updateMarkers()
    }

    // Hex polygons
    if (props.hexed) {
      const selectedPalette = PALETTES[props.palette] || PALETTES.gray

      globe.value
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonUseDots(true)
        .hexPolygonColor(
          () => selectedPalette[Math.floor(Math.random() * selectedPalette.length)]
        )
    }

    // Wired paths
    if (props.wired) {
      const cablePaths = []
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

    // initial scene from Home
    pinData(props.data)

    globe.value.pointOfView({ lat: 30, lng: 20, altitude: 3.5 }, 500)
    globeReady.value = true

    const handleResize = () => {
      if (!globe.value) return
      globe.value.width(window.innerWidth)
      globe.value.height(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    globe.value._cleanupResize = () => window.removeEventListener('resize', handleResize)

    emitter.on('globe:pointOfView', (viewport) => {
      if (!globe.value) return
      globe.value.pointOfView(
        { lat: viewport.lat, lng: viewport.lng, altitude: viewport.altitude },
        viewport.transition
      )
    })
  } catch (err) {
    console.error('Globe init error:', err)
    globeReady.value = false
  } finally {
    emitter.emit('loading', false)
  }
})

watch(
  () => props.data,
  (newData) => pinData(newData),
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
    if (globe.value) globe.value.globeImageUrl(getGlobeImageUrl(url))
  }
)

onBeforeUnmount(() => {
  globeReady.value = false

  if (globe.value?._cleanupResize) {
    globe.value._cleanupResize()
  }

  globe.value?.pointsData([])
  globe.value?.htmlElementsData([])

  globe.value = null
})
</script>

<style scoped>
.globe-wrapper {
  width: 100vw;
  height: 97vh;
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

/* loading styles */
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
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

@keyframes globePulse {
  0%, 100% {
    box-shadow: 0 0 25px rgba(0, 255, 230, 0.15), inset 0 0 20px rgba(0, 255, 230, 0.05);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 230, 0.25), inset 0 0 25px rgba(0, 255, 230, 0.1);
  }
}
</style>
