<template>
  <div id="globe-container" ref="globeContainer" class="globe-container">
    <div v-if="!globeReady" class="loading">در حال بارگذاری ...</div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Globe from 'globe.gl'

const emit = defineEmits(['select-location'])

const globeContainer = ref(null)
const globe = ref(null)
const globeReady = ref(false)
const marker = ref(null)
const isDragging = ref(false)

let lastCoords = null
let dragStart = { x: 0, y: 0 }

// Create simple marker object
function createMarker(lat, lng) {
  return {
    lat,
    lng,
    size: 0.6,
    color: '#34A853'
  }
}

onMounted(() => {
  globe.value = Globe()(globeContainer.value)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('#000')
    .showGraticules(true)
    .onGlobeClick(({ lat, lng }) => {
      // Add or move marker
      marker.value = createMarker(lat, lng)
      globe.value
        .pointsData([marker.value])
        .pointAltitude('size')
        .pointColor('color')

      emit('select-location', { lat, lon: lng })
    })

  // Set camera position and auto-rotation
  globe.value.controls().autoRotate = true
  globe.value.controls().autoRotateSpeed = 0.5
  globe.value.pointOfView({ lat: 35.6892, lng: 51.389, altitude: 2.5 })

  // Default marker (Tehran)
  marker.value = createMarker(35.6892, 51.389)
  globe.value
    .pointsData([marker.value])
    .pointAltitude('size')
    .pointColor('color')

  // Event listeners for dragging the marker
  globeContainer.value.addEventListener('mousedown', onMouseDown)
  globeContainer.value.addEventListener('mousemove', onMouseMove)
  globeContainer.value.addEventListener('mouseup', onMouseUp)

  // When the globe is rendered for the first time
  setTimeout(() => {
    globeReady.value = true
  }, 1500)
})

onBeforeUnmount(() => {
  if (globeContainer.value) {
    globeContainer.value.removeEventListener('mousedown', onMouseDown)
    globeContainer.value.removeEventListener('mousemove', onMouseMove)
    globeContainer.value.removeEventListener('mouseup', onMouseUp)
  }
  globe.value = null
})

function onMouseDown(e) {
  isDragging.value = true
  dragStart = { x: e.clientX, y: e.clientY }
}

function onMouseUp() {
  isDragging.value = false
}

function onMouseMove(e) {
  if (!isDragging.value) return

  // Optional: you could calculate new lat/lng by screen delta, but it's complex
  // We keep it simple — dragging moves globe, not marker.
}
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  background: rgba(255, 255, 255, 0.9);
  padding: 16px 24px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}
</style>