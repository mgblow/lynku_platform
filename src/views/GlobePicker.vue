<template>
  <div id="globe-container" ref="globeContainer" class="globe-container">
    <div v-if="!globeReady" class="loading">در حال بارگذاری ...</div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import countries from '../data/countries'
import Globe from 'globe.gl'

const emit = defineEmits(['select-location'])
const globeContainer = ref(null)
const globe = ref(null)
const globeReady = ref(false)
const marker = ref(null)

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

function createMarker(lat, lng) {
  return {
    lat,
    lng,
    size: 0.8,
    color: '#FF4444'
  }
}


onMounted(() => {
  // Initialize the globe
  const g = Globe()(globeContainer.value)
    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg')
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.4)
    .hexPolygonUseDots(true)
    .hexPolygonColor(() => `#${Math.round(Math.random() * Math.pow(2, 24)).toString(16).padStart(6, '0')}`)
    .hexPolygonLabel(({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
          Population: <i>${d.POP_EST}</i>
        `)
    .onGlobeClick(({ lat, lng }) => {
      marker.value = createMarker(lat, lng)
      updateMarkers()
      emit('select-location', { lat, lon: lng })
    })

  // Add city labels
  g.labelsData(majorCities)
    .labelText('name')
    .labelSize(1)
    .labelColor(() => '#ffffff')
    .labelAltitude(0.01)
    .onLabelClick(city => {
      marker.value = createMarker(city.lat, city.lng)
      updateMarkers()
      emit('select-location', { lat: city.lat, lon: city.lng })
      g.pointOfView({ lat: city.lat, lng: city.lng, altitude: 1.8 }, 800)
    })

  // Add base city points
  g.pointsData(majorCities)
    .pointColor(d => d.color)
    .pointAltitude(0.015)
    .pointRadius(0.25)

  // Disable rotation for static view
  const controls = g.controls()
  controls.autoRotate = false
  controls.enableZoom = true
  controls.enablePan = true

  // Initial camera position
  g.pointOfView({ lat: 25, lng: 45, altitude: 2 })

  globe.value = g
  marker.value = createMarker(35.6892, 51.389)
  updateMarkers()
  globeReady.value = true
})

onBeforeUnmount(() => {
  if (globe.value) {
    globe.value = null
  }
})

function updateMarkers() {
  if (!globe.value) return
  const allPoints = [...majorCities, ...(marker.value ? [marker.value] : [])]

  globe.value
    .pointsData(allPoints)
    .pointColor(d => d.color || '#ffffff')
    .pointAltitude(d => (d === marker.value ? 0.05 : 0.015))
    .pointRadius(d => (d === marker.value ? 0.8 : 0.25))
}
</script>

<style scoped>
.globe-container {
  width: 100%;
  height: 100%;
  background: #000011;
  position: relative;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: bold;
}
</style>
