<template>
  <div id="globe-container" ref="globeContainer" class="globe-container">
    <div v-if="!globeReady" class="loading">در حال بارگذاری کره زمین ...</div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Globe from 'globe.gl'

const globeContainer = ref(null)
const globe = ref(null)
const globeReady = ref(false)

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
  { name: 'Olga', city: 'Moscow', lat: 55.7558, lng: 37.6173 }
]

const avatarUsers = users.map(u => ({
  ...u,
  avatarUrl: generateRandomAvatar()
}))

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
  return `https://avataaars.io/?${params.toString()}`
}

onMounted(() => {
  const g = Globe()(globeContainer.value)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('#000010')
    .showAtmosphere(true)
    .atmosphereColor('#00ccff')
    .atmosphereAltitude(0.2)
    .showGraticules(true)

  // ⚓ Static globe (no rotation)
  const controls = g.controls()
  controls.autoRotate = false
  controls.enableZoom = true
  controls.enablePan = true

  // 👤 Add pinned avatars
  g.htmlElementsData(avatarUsers)
    .htmlElement(user => {
      const el = document.createElement('div')
      el.style.position = 'relative'
      el.style.cursor = 'pointer'
      el.style.textAlign = 'center'

      const img = document.createElement('img')
      img.src = user.avatarUrl
      img.style.width = '50px'
      img.style.height = '50px'
      img.style.borderRadius = '50%'
      img.style.border = '2px solid #00bcd4'
      img.style.boxShadow = '0 0 8px rgba(0,255,255,0.6)'

      const label = document.createElement('div')
      label.textContent = `${user.name} – ${user.city}`
      label.style.color = '#ffffff'
      label.style.fontSize = '11px'
      label.style.marginTop = '3px'

      el.appendChild(img)
      el.appendChild(label)

      el.onclick = () => {
        g.pointOfView({ lat: user.lat, lng: user.lng, altitude: 1.6 }, 1000)
      }

      return el
    })

  // 🌍 Initial POV
  g.pointOfView({ lat: 20, lng: 10, altitude: 2 })

  globe.value = g
  globeReady.value = true
})

onBeforeUnmount(() => {
  if (globe.value) globe.value = null
})
</script>

<style scoped>
.globe-container {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 30% 30%, #000015, #000010, #000000);
  overflow: hidden;
  position: relative;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 1.1rem;
  border: 1px solid #00bcd4;
}
</style>
