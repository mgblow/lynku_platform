<template>
  <div class="globe-wrapper">
    <div ref="globeContainer" class="globe-container"></div>

    <!-- Slide-down panel -->
    <transition name="slide-down">
      <div v-if="selectedItem" class="info-panel">
        <div class="post-content">
            <Feed></Feed>
        </div>

        <div class="button-group">
          <!-- Close Button -->
          <button class="flat-btn close-btn" @click="selectedItem = null">
            ببند
          </button>

          <!-- Feed Button -->
          <button class="flat-btn feed-btn" @click="this.$router.push('/topic')">
            برو تو این تاپیک
          </button>
        </div>


      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import Globe from 'globe.gl'
import countries from '@/data/countries'
import Feed from './Feed.vue'
// --- Cities ---
const cities = [
  { id: 1, name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { id: 2, name: 'New York', lat: 40.7128, lng: -74.006, country: 'USA' },
  { id: 3, name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK' },
  { id: 4, name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { id: 5, name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
  { id: 6, name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' }
]

// --- SVG markers ---
const itemSVGs = {
  home: `<svg viewBox="0 0 64 64"><polygon points="32,8 8,32 56,32" fill="#4ECDC4" stroke="#00aaa0" stroke-width="1"/><rect x="16" y="32" width="32" height="24" fill="#008080" stroke="#00aaa0" stroke-width="1"/><rect x="28" y="42" width="8" height="14" fill="#004d4d" stroke="#00aaa0" stroke-width="1"/><polygon points="48,32 48,56 56,56 56,32" fill="rgba(0,170,160,0.3)"/><polygon points="32,8 32,32 56,32" fill="rgba(0,170,160,0.3)"/></svg>`,
  star: `<svg viewBox="0 0 64 64"><polygon points="32,4 39,24 60,24 42,38 48,58 32,46 16,58 22,38 4,24 25,24" fill="#FFE66D" stroke="#FFDD33" stroke-width="1"/></svg>`
}

const itemTypes = [
  { id: 'home', name: 'Home Base', svg: itemSVGs.home },
  { id: 'star', name: 'Favorite', svg: itemSVGs.star }
]

// --- Items near cities ---
const items = []
cities.forEach((city) => {
  const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]
  items.push({
    ...type,
    city,
    lat: city.lat + Math.random() * 0.5 - 0.25,
    lng: city.lng + Math.random() * 0.5 - 0.25
  })
})

// --- Tweets/pings ---
const posts = []
const sampleTexts = [
  'Just visited this place, amazing views!',
  'Building my dream home here 🏠',
  "Look at this star, it's glowing!",
  'Power spot unlocked ⚡',
  'Feeling ❤️ at this city!',
  'Another ping from my travels 🌍',
  'Live streaming this moment!',
  'Collecting memories and stars ⭐'
]
const sampleAvatars = [
  'https://i.pravatar.cc/40?img=5',
  'https://i.pravatar.cc/40?img=12',
  'https://i.pravatar.cc/40?img=24',
  'https://i.pravatar.cc/40?img=32'
]

cities.forEach((city) => {
  const n = Math.floor(Math.random() * 3) + 1
  for (let i = 0; i < n; i++) {
    posts.push({
      name: 'Ping',
      avatar: sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)],
      text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
      lat: city.lat + Math.random() * 0.5 - 0.25,
      lng: city.lng + Math.random() * 0.5 - 0.25
    })
  }
})

const globeContainer = ref(null)
const selectedItem = ref(null)
let globe = null

async function initGlobe() {
  await nextTick()
  const allData = [...items, ...posts]

  globe = Globe()(globeContainer.value)
    .globeImageUrl('//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg')
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.3)
    .hexPolygonUseDots(true)
    .hexPolygonColor(() => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`)
    .hexPolygonLabel(
      ({ properties: d }) => `<b>${d.ADMIN} (${d.ISO_A2})</b> <br />Population: <i>${d.POP_EST}</i>`
    )
    .htmlElementsData(allData)
    .htmlElement((d) => {
      const el = document.createElement('div')
      el.style.cssText = `
        cursor:pointer;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        transform-origin:center;
        text-align:center;
        pointer-events:auto;
        margin:0 auto;
      `
      if (d.svg) {
        el.innerHTML = d.svg
      } else if (d.avatar) {
        const avatarEl = document.createElement('img')
        avatarEl.src = d.avatar
        avatarEl.style.cssText = `
          width:40px;
          height:40px;
          border-radius:50%;
          border:2px solid #FFF26F;
          box-shadow:0 0 8px #1da1f2;
          margin-bottom:4px;
        `
        el.appendChild(avatarEl)

        const textEl = document.createElement('div')
        textEl.textContent = d.text
        textEl.style.cssText = `
          font-size:12px;
          color:#fff;
          background:rgba(9,19,30,0.9);
          padding:3px 8px;
          border-radius:5px;
          max-width:130px;
          text-align:center;
        `
        el.appendChild(textEl)
      }

      el.addEventListener('click', (ev) => {
        ev.stopPropagation()
        selectedItem.value = d
      })
      return el
    })
    .htmlLat((d) => d.lat)
    .htmlLng((d) => d.lng)
    .htmlAltitude(0.5)

  globe.controls().autoRotate = true
  globe.controls().autoRotateSpeed = 0.3
  globe.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0)

  window.addEventListener('resize', () => {
    globe.width(window.innerWidth)
    globe.height(window.innerHeight)
  })
}

onMounted(() => initGlobe())
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

/* Slide-down panel */
.slide-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

/* Info panel: top to half of screen */
.info-panel {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 95%;
  height: 70vh;
  background: #000;
  color: #fff;
  padding: 16px;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Post content */
.post-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

/* Close button at bottom */
.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

.flat-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1a1a1f;
  color: #ffffffcc;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 18px;
  border-radius: 12px;
  border: 1px solid #2a2a35;
  cursor: pointer;
  transition: all 0.25s ease;
}

.flat-btn svg {
  stroke: #ffffffcc;
  transition: stroke 0.25s ease, transform 0.25s ease;
}

.flat-btn:hover {
  background-color: #2a2a35;
  border-color: #3a3a45;
}

.flat-btn:hover svg {
  stroke: #ffffff;
  transform: scale(1.1);
}

.close-btn {
  background-color: #2b1a1a;
  border-color: #3a2a2a;
  color: #ff6b6b;
}

.close-btn:hover {
  background-color: #3a2a2a;
  color: #ff4c4c;
}

.feed-btn {
  background-color: #1a1a2b;
  border-color: #2a2a3a;
  color: #6bb0ff;
}

.feed-btn:hover {
  background-color: #2a2a3a;
  color: #4c8fff;
}



.post-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.item-icon svg {
  width: 50px;
  height: 50px;
  margin-bottom: 6px;
  filter: drop-shadow(0 0 8px #FF40AF);
}

.post-name {
  font-weight: 700;
  font-size: 16px;
  margin: 0;
}

.post-city {
  font-size: 13px;
  color: #8899a6;
}

.post-text {
  font-size: 14px;
  line-height: 1.4;
}
</style>
