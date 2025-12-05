<template>
  <div class="ninja-page">
    <div class="ninja-layout">
      <!-- LEFT: GLOBE -->
      <div class="globe-shell">
        <div ref="globeRef" class="globe-canvas"></div>

        <!-- Top HUD -->
        <div class="hud-top">
          <div class="hud-left">
            <div class="brand-pill">LYNKU · NINJA PLANET BUILDER</div>
            <div class="brand-sub">
              build dark neon towers · own tiny shards of the real world
            </div>
          </div>
          <div class="hud-right">
            <div class="hud-chip">
              <span class="chip-label">Tiles</span>
              <span class="chip-value">{{ stats.tiles }}</span>
            </div>
            <div class="hud-chip">
              <span class="chip-label">Max height</span>
              <span class="chip-value">{{ stats.maxHeight }}</span>
            </div>
            <div class="hud-chip">
              <span class="chip-label">Ninja score</span>
              <span class="chip-value">{{ stats.score }}</span>
            </div>
          </div>
        </div>

        <!-- Bottom HUD -->
        <div class="hud-bottom">
          <p>
            <span class="kbd">Left-Click</span> ساخت بلوک ·
            <span class="kbd">Shift + Click</span> یا
            <span class="kbd">Right-Click</span> حذف ·
            درگ = چرخش · اسکرول = زوم
          </p>
        </div>
      </div>

      <!-- RIGHT: CONTROL PANEL -->
      <aside class="panel">
        <!-- HEADER / ACCOUNT -->
        <header class="panel-header">
          <div class="panel-title-block">
            <h1>Blackout World</h1>
            <p>یک سیاره‌ی مشکی نئونی بساز که بعداً می‌تونی بفروشی‌اش 💸</p>
          </div>
          <div class="panel-account">
            <button class="account-btn primary" @click="goToAccount">
              <span class="account-dot"></span>
              <span>Account</span>
            </button>
            <button class="account-btn ghost" @click="logout">
              Logout
            </button>
          </div>
        </header>

        <!-- MODE -->
        <section class="panel-section">
          <div class="section-header">
            <span class="section-title">Mode</span>
            <span class="section-desc">چجوری با سیاره‌ات رفتار می‌کنی</span>
          </div>
          <div class="mode-row">
            <button
              class="mode-chip"
              :class="{ active: mode === 'build' }"
              @click="mode = 'build'"
            >
              <span class="mode-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8z"
                  />
                </svg>
              </span>
              Build
            </button>
            <button
              class="mode-chip"
              :class="{ active: mode === 'erase' }"
              @click="mode = 'erase'"
            >
              <span class="mode-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M16.24 3.56 21 8.33 9.83 19.5H5.07L3 17.43 13.17 7.26l-2.12-2.12L5.07 11.12 3.66 9.71l6.7-6.7a1.5 1.5 0 0 1 2.12 0zM7.5 19.5h13v2h-13z"
                  />
                </svg>
              </span>
              Erase
            </button>
          </div>
        </section>

        <!-- BLOCK PALETTE -->
        <section class="panel-section">
          <div class="section-header">
            <span class="section-title">Blocks</span>
            <span class="section-desc">استایل نئون سیاره‌ات</span>
          </div>

          <div class="block-grid">
            <button
              v-for="b in blocks"
              :key="b.id"
              class="block-card"
              :class="{ selected: selectedBlockId === b.id }"
              @click="selectBlock(b.id)"
            >
              <div class="block-swatch" :style="{ '--block-color': b.color }">
                <div class="block-cube">
                  <div class="face top"></div>
                  <div class="face left"></div>
                  <div class="face right"></div>
                </div>
              </div>
              <div class="block-info">
                <div class="block-name">{{ b.name }}</div>
                <div class="block-tagline">{{ b.tagline }}</div>
              </div>
            </button>
          </div>
        </section>

        <!-- WORLD ACTIONS -->
        <section class="panel-section">
          <div class="section-header">
            <span class="section-title">World Actions</span>
            <span class="section-desc">برای پول‌سازی آماده‌اش کن</span>
          </div>
          <div class="actions-col">
            <button class="panel-btn secondary" @click="seedDemoWorld">
              <svg viewBox="0 0 24 24">
                <path
                  d="M4 4h7v2H6v3H4V4zm16 16h-7v-2h5v-3h2v5zM7 17h3v3h2v-5H7v2zm10-8h-3V6h-2v5h5V9z"
                />
              </svg>
              Spawn Ninja City
            </button>

            <button class="panel-btn ghost" @click="resetWorld">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6 6 6 0 0 1-5.65-4H4.26A8 8 0 0 0 12 21a8 8 0 0 0 0-16z"
                />
              </svg>
              Reset Planet
            </button>

            <button class="panel-btn primary" @click="exportBlueprint">
              <svg viewBox="0 0 24 24">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16l4-3 4 3 4-3 4 3V8z"
                />
              </svg>
              Export Blueprint.json
            </button>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="panel-footer">
          <p>
            هر سیاره‌ای که می‌سازی می‌تونه تبدیل بشه به
            <span class="badge">قابل فروش</span>
            : ذخیره کن، بفرست برای سرور و بعداً روش
            <span class="badge-soft">NFT / اشتراک</span>
            تعریف کن.
          </p>
        </footer>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Globe from 'globe.gl'

const router = useRouter()

const globeRef = ref(null)
const globe = ref(null)

// --- Builder config ---
const GRID_STEP = 3 // degrees
const MAX_HEIGHT = 10
const BASE_ALT = 0.012
const ALT_STEP = 0.012

const mode = ref('build') // 'build' | 'erase'

// block palette
const blocks = [
  {
    id: 'void-violet',
    name: 'Void Violet',
    color: '#a855f7',
    tagline: 'ستون‌های نئونی برای برج‌های وسط شب'
  },
  {
    id: 'acid-green',
    name: 'Acid Green',
    color: '#22c55e',
    tagline: 'چمن رادیواکتیو برای بیس‌های پول‌ساز'
  },
  {
    id: 'ice-cyan',
    name: 'Ice Cyan',
    color: '#22d3ee',
    tagline: 'برای قطب‌های یخی و پایگاه‌های مخفی'
  },
  {
    id: 'magma-orange',
    name: 'Magma Core',
    color: '#fb923c',
    tagline: 'آتشفشان‌های هیجانی و خطرناک'
  },
  {
    id: 'golden',
    name: 'Gold Pillar',
    color: '#fbbf24',
    tagline: 'برج طلایی، مناسب VIP منطقه‌ات 💰'
  }
]

const selectedBlockId = ref('void-violet')

const currentColor = computed(() => {
  const b = blocks.find((x) => x.id === selectedBlockId.value)
  return b ? b.color : '#a855f7'
})

// tile store: key -> tile object
const tiles = reactive({})

// helpers
const snap = (val, step) => Math.round(val / step) * step
const tileKey = (lat, lng) => `${lat.toFixed(3)}_${lng.toFixed(3)}`

const stats = computed(() => {
  const all = Object.values(tiles)
  const tilesCount = all.length
  const maxHeight = all.reduce((m, t) => Math.max(m, t.height), 0)
  const score = tilesCount * 5 + maxHeight * 13
  return { tiles: tilesCount, maxHeight, score }
})

const selectBlock = (id) => {
  selectedBlockId.value = id
}

const syncToGlobe = () => {
  if (!globe.value) return
  globe.value.pointsData(Object.values(tiles))
}

// main interaction
const touchTile = (coords, forceErase = false) => {
  if (!coords) return

  const lat = snap(coords.lat, GRID_STEP)
  const lng = snap(coords.lng, GRID_STEP)
  const key = tileKey(lat, lng)
  const existing = tiles[key]

  const erase = forceErase || mode.value === 'erase'

  if (erase) {
    if (!existing) return
    if (existing.height > 1) {
      existing.height -= 1
    } else {
      delete tiles[key]
    }
  } else {
    if (existing) {
      if (existing.height < MAX_HEIGHT) {
        existing.height += 1
      }
    } else {
      tiles[key] = {
        id: key,
        lat,
        lng,
        height: 1,
        color: currentColor.value,
        blockId: selectedBlockId.value
      }
    }
  }

  // light haptic
  if (typeof window !== 'undefined' && 'vibrate' in window.navigator) {
    window.navigator.vibrate(erase ? [30] : [40, 20, 40])
  }

  syncToGlobe()
}

// seed a visible demo city so “nothing’s there” never happens
const seedDemoWorld = () => {
  // clear
  Object.keys(tiles).forEach((k) => delete tiles[k])

  const demoCenters = [
    { lat: 34.05, lng: -118.25 }, // LA
    { lat: 40.71, lng: -74.0 },   // NYC
    { lat: 35.6892, lng: 51.389 }, // Tehran
    { lat: 51.5074, lng: -0.1278 } // London
  ]

  demoCenters.forEach((c, idx) => {
    const palette = blocks[idx % blocks.length]
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (Math.random() < 0.35) continue
        const lat = snap(c.lat + dx * GRID_STEP, GRID_STEP)
        const lng = snap(c.lng + dy * GRID_STEP, GRID_STEP)
        const key = tileKey(lat, lng)
        tiles[key] = {
          id: key,
          lat,
          lng,
          height: 2 + Math.floor(Math.random() * 5),
          color: palette.color,
          blockId: palette.id
        }
      }
    }
  })

  syncToGlobe()
}

const resetWorld = () => {
  Object.keys(tiles).forEach((k) => delete tiles[k])
  syncToGlobe()
}

const exportBlueprint = () => {
  const blueprint = {
    createdAt: new Date().toISOString(),
    tiles: Object.values(tiles).map((t) => ({
      lat: t.lat,
      lng: t.lng,
      height: t.height,
      blockId: t.blockId
    }))
  }
  const json = JSON.stringify(blueprint, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'lynku-ninja-world-blueprint.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// account
const goToAccount = () => {
  router.push({ path: '/settings' })
}

const logout = () => {
  localStorage.removeItem('app-token')
  router.push({ path: '/login' })
}

// init globe
onMounted(() => {
  if (!globeRef.value) return

  const g = Globe()(globeRef.value)

  globe.value = g

  g
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('#000000')
    .showAtmosphere(true)
    .atmosphereColor('#38bdf8')
    .atmosphereAltitude(0.22)
    .pointAltitude((d) => BASE_ALT + (d.height - 1) * ALT_STEP)
    .pointRadius(0.26)
    .pointColor((d) => d.color || '#a855f7')
    .pointsData([])

  // camera POV
  g.pointOfView({ lat: 20, lng: 10, altitude: 2.2 }, 0)

  // controls tuning
  const controls = g.controls()
  if (controls) {
    controls.enableDamping = true
    controls.dampingFactor = 0.07
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.2
    controls.rotateSpeed = 0.6
    controls.minDistance = 200
    controls.maxDistance = 1400
  }

  // interactions
  g.onGlobeClick((coords, event) => {
    const erase =
      mode.value === 'erase' ||
      (event && (event.shiftKey || event.ctrlKey || event.metaKey))
    touchTile(coords, erase)
  })

  // right click (some versions name differs; this is safe-guarded)
  if (typeof g.onGlobeRightClick === 'function') {
    g.onGlobeRightClick((coords) => {
      touchTile(coords, true)
    })
  }

  // always seed demo city so you SEE something
  seedDemoWorld()
})

onBeforeUnmount(() => {
  if (globe.value && typeof globe.value._destructor === 'function') {
    globe.value._destructor()
  }
  globe.value = null
})
</script>

<style scoped>
.ninja-page {
  height: 100vh;
  width: 100%;
  background: radial-gradient(circle at top, #020617 0%, #020014 40%, #000 100%);
  color: #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: stretch;
  overflow: hidden;
  margin-top: 70px
}

.ninja-layout {
  max-width: 1400px;
  width: 100%;
  height: 100%;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(320px, 2fr);
  gap: 18px;
}

/* GLOBE */
.globe-shell {
  position: relative;
  border-radius: 26px;
  overflow: hidden;
  background: radial-gradient(circle at 20% 0, #020617 0, #000 55%, #000 100%);
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow:
    0 0 60px rgba(0, 0, 0, 0.95),
    0 0 160px rgba(56, 189, 248, 0.18);
}

.globe-canvas {
  width: 100%;
  height: 100%;
  min-height: 480px;
}

/* HUD TOP */
.hud-top {
  position: absolute;
  inset-inline: 18px;
  top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
}

.hud-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.brand-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #f9fafb;
  background: radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.9), rgba(15, 23, 42, 0.9));
  box-shadow:
    0 0 14px rgba(56, 189, 248, 0.9),
    0 0 40px rgba(59, 130, 246, 0.6);
}

.brand-sub {
  font-size: 0.8rem;
  color: #9ca3af;
}

.hud-right {
  display: flex;
  gap: 8px;
  pointer-events: auto;
}

.hud-chip {
  min-width: 78px;
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(107, 114, 128, 0.9);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chip-label {
  font-size: 0.68rem;
  color: #9ca3af;
}

.chip-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f9fafb;
}

/* HUD BOTTOM */
.hud-bottom {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  padding: 12px 16px 14px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95), transparent);
  text-align: center;
  font-size: 0.78rem;
}

.hud-bottom p {
  margin: 0;
  color: #9ca3af;
}

.kbd {
  display: inline-flex;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(148, 163, 184, 0.75);
  background: rgba(15, 23, 42, 0.9);
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
  "Liberation Mono", "Courier New", monospace;
  font-size: 0.7rem;
  color: #e5e7eb;
}

/* PANEL */
.panel {
  border-radius: 26px;
  background: radial-gradient(circle at top, #020617 0, #020014 45%, #020617 100%);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.95),
    0 0 160px rgba(168, 85, 247, 0.35);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Panel Header */
.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}

.panel-title-block h1 {
  margin: 0;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  background: linear-gradient(135deg, #f9fafb, #a855f7, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.panel-title-block p {
  margin: 5px 0 0;
  font-size: 0.8rem;
  color: #9ca3af;
}

.panel-account {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.account-btn {
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  background: none;
  color: #e5e7eb;
  transition: 0.2s ease;
}

.account-btn.primary {
  background: radial-gradient(circle at 0 0, rgba(56, 189, 248, 0.9), rgba(15, 23, 42, 0.95));
  border-color: rgba(56, 189, 248, 0.9);
  box-shadow:
    0 0 14px rgba(56, 189, 248, 0.9),
    0 0 28px rgba(59, 130, 246, 0.7);
}

.account-btn.primary:hover {
  transform: translateY(-1px) scale(1.01);
}

.account-btn.ghost {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(75, 85, 99, 0.9);
}

.account-btn.ghost:hover {
  background: rgba(30, 64, 175, 0.75);
}

.account-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 0, #22c55e, #22c55e, #14532d);
  box-shadow:
    0 0 6px rgba(34, 197, 94, 0.9),
    0 0 16px rgba(34, 197, 94, 0.6);
}

/* Panel Sections */
.panel-section {
  border-radius: 18px;
  padding: 10px 11px 12px;
  background: radial-gradient(circle at 0 0, rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(55, 65, 81, 0.9);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e5e7eb;
}

.section-desc {
  font-size: 0.74rem;
  color: #9ca3af;
}

/* Mode Row */
.mode-row {
  display: flex;
  gap: 8px;
}

.mode-chip {
  flex: 1;
  border-radius: 999px;
  border: 1px solid rgba(75, 85, 99, 0.9);
  padding: 7px 10px;
  font-size: 0.78rem;
  background: rgba(0, 0, 0, 0.9);
  color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.mode-chip:hover {
  border-color: rgba(96, 165, 250, 0.9);
}

.mode-chip.active {
  background: radial-gradient(circle at 0 0, #38bdf8, #111827);
  border-color: #a855f7;
  box-shadow:
    0 0 12px rgba(56, 189, 248, 0.9),
    0 0 26px rgba(129, 140, 248, 0.8);
}

.mode-icon svg {
  width: 14px;
  height: 14px;
}

/* Block palette */
.block-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.block-card {
  display: flex;
  gap: 8px;
  padding: 8px 9px;
  border-radius: 14px;
  background: radial-gradient(circle at 0 0, #020617, #020617);
  border: 1px solid rgba(55, 65, 81, 0.9);
  cursor: pointer;
  transition: 0.2s ease;
}

.block-card:hover {
  transform: translateY(-1px);
}

.block-card.selected {
  border-color: #a855f7;
  box-shadow:
    0 0 16px rgba(168, 85, 247, 0.9),
    0 0 32px rgba(56, 189, 248, 0.7);
}

.block-swatch {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: radial-gradient(circle at 20% 0, var(--block-color), #020617);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.block-cube {
  position: relative;
  width: 22px;
  height: 22px;
  transform: rotateX(60deg) rotateZ(45deg);
  transform-style: preserve-3d;
}

.block-cube .face {
  position: absolute;
  inset: 0;
  background: var(--block-color);
}

.block-cube .top {
  transform: translateZ(6px);
  filter: brightness(1.2);
}
.block-cube .left {
  transform: rotateY(90deg) translateZ(6px);
  filter: brightness(0.75);
}
.block-cube .right {
  transform: rotateX(90deg) translateZ(-6px);
  filter: brightness(0.6);
}

.block-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.block-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e5e7eb;
}
.block-tagline {
  font-size: 0.7rem;
  color: #9ca3af;
}

/* Panel actions */
.actions-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-btn {
  border-radius: 999px;
  padding: 8px 10px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid transparent;
  cursor: pointer;
  background: none;
  color: #e5e7eb;
  transition: 0.2s ease;
}

.panel-btn svg {
  width: 16px;
  height: 16px;
}

.panel-btn.primary {
  background: #020617;
  border-color: rgba(168, 85, 247, 0.9);
  box-shadow:
    0 0 10px rgba(168, 85, 247, 0.9),
    0 0 28px rgba(56, 189, 248, 0.9);
}
.panel-btn.primary:hover {
  transform: translateY(-1px) scale(1.02);
}

.panel-btn.secondary {
  background: rgba(15, 23, 42, 0.96);
  border-color: rgba(59, 130, 246, 0.9);
}
.panel-btn.secondary:hover {
  background: rgba(30, 64, 175, 0.9);
}

.panel-btn.ghost {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(75, 85, 99, 0.95);
}
.panel-btn.ghost:hover {
  background: rgba(15, 23, 42, 0.9);
}

/* Footer */
.panel-footer {
  font-size: 0.78rem;
  color: #9ca3af;
}

.badge {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.1);
  border: 1px solid rgba(248, 250, 252, 0.8);
  color: #f9fafb;
}

.badge-soft {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(168, 85, 247, 0.16);
  border: 1px solid rgba(168, 85, 247, 0.6);
  color: #e9d5ff;
}

/* Responsive */
@media (max-width: 1024px) {
  .ninja-layout {
    grid-template-columns: minmax(0, 1.7fr);
    grid-template-rows: minmax(320px, 1.2fr) auto;
  }

  .panel {
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .ninja-layout {
    padding: 10px;
  }

  .panel-header {
    flex-direction: column;
    gap: 10px;
  }

  .panel-account {
    flex-direction: row;
  }

  .globe-canvas {
    min-height: 360px;
  }
}
</style>
