<template>
  <!-- Render only if something is selected -->
  <div v-if="rawGem" class="gem-card">
    <!-- Gem icon / visual -->
    <div class="gem-header">
      <div class="gem-icon-wrapper">
        <div class="gem-diamond"></div>
        <div class="gem-glow"></div>
      </div>

      <div class="gem-main-info">
        <div class="gem-name-row">
          <h2 class="gem-name">{{ displayName }}</h2>
          <span class="gem-rarity" :class="`rarity-${rarityKey}`">
            {{ rarityLabel }}
          </span>
        </div>

        <div class="gem-meta">
          <span v-if="displayCity" class="gem-location">
            📍 {{ displayCity }}
          </span>
          <span v-if="hasValue" class="gem-value">
            💎 {{ gemValue }} امتیاز
          </span>
        </div>
      </div>
    </div>

    <!-- Details section -->
    <div class="gem-body">
      <div class="gem-row">
        <span class="label">ID</span>
        <span class="value monospace">{{ gemId }}</span>
      </div>

      <div class="gem-row" v-if="coordsText">
        <span class="label">مختصات</span>
        <span class="value monospace">{{ coordsText }}</span>
      </div>

      <div class="gem-row" v-if="rawGem.description">
        <span class="label">توضیحات</span>
        <span class="value">{{ rawGem.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedData: {
    type: Object,
    required: false,
    default: null
  }
})

// raw data directly from drawer
const rawGem = computed(() => props.selectedData)
const gem = computed(() => rawGem.value || {})

// Helpers
const gemId = computed(() => gem.value._id || gem.value.id || '—')

const displayName = computed(() => {
  const g = gem.value
  return g.name || g.label || 'Gem'
})

const rarityKey = computed(() => {
  const g = gem.value
  return (g.rarity || 'common').toLowerCase()
})

const rarityLabel = computed(() => {
  const key = rarityKey.value
  switch (key) {
    case 'epic':
      return 'Epic'
    case 'legendary':
      return 'Legendary'
    case 'rare':
      return 'Rare'
    case 'uncommon':
      return 'Uncommon'
    default:
      return 'Common'
  }
})

const gemValue = computed(() => {
  const g = gem.value
  if (typeof g.value === 'number') return g.value
  if (typeof g.value === 'string' && g.value !== '' && !Number.isNaN(Number(g.value))) {
    return Number(g.value)
  }
  return null
})

const hasValue = computed(() => gemValue.value !== null)

const displayCity = computed(() => {
  const g = gem.value
  return g.city ||
    g.location?.city ||
    null
})

const coordsText = computed(() => {
  const g = gem.value
  const lat = g.lat ?? g.location?.coordinates?.[1]
  const lng = g.lng ?? g.location?.coordinates?.[0]

  if (typeof lat !== 'number' || typeof lng !== 'number') return null
  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`
})
</script>

<style scoped>
.gem-card {
  border-radius: 18px;
  padding: 18px 14px;
  background: radial-gradient(circle at top, rgba(251, 191, 36, 0.18), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(248, 250, 252, 0.08);
  box-shadow:
    0 0 24px rgba(251, 191, 36, 0.25),
    0 0 0 1px rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  text-align: center;
  direction: rtl;
}

/* Header */
.gem-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 14px;
}

.gem-icon-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
}

.gem-diamond {
  position: absolute;
  inset: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%) rotate(45deg);
  background: radial-gradient(circle at 30% 30%, #ffffff, #ffe45e, #f59e0b);
  box-shadow: 0 0 22px rgba(251, 191, 36, 0.85);
  border-radius: 6px;
  border: 1px solid rgba(250, 250, 250, 0.75);
}

.gem-glow {
  position: absolute;
  inset: 50%;
  width: 90px;
  height: 90px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.18), transparent 60%);
  filter: blur(2px);
}

.gem-main-info {
  width: 100%;
}

.gem-name-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.gem-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fef3c7;
  text-shadow: 0 0 6px rgba(251, 191, 36, 0.8);
}

.gem-rarity {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* rarity color variants */
.gem-rarity.rarity-common {
  background: rgba(148, 163, 184, 0.35);
  color: #e5e7eb;
}

.gem-rarity.rarity-uncommon {
  background: rgba(45, 212, 191, 0.18);
  color: #6ee7b7;
}

.gem-rarity.rarity-rare {
  background: rgba(59, 130, 246, 0.18);
  color: #93c5fd;
}

.gem-rarity.rarity-epic {
  background: rgba(168, 85, 247, 0.2);
  color: #e9d5ff;
}

.gem-rarity.rarity-legendary {
  background: rgba(251, 191, 36, 0.2);
  color: #facc15;
}

.gem-meta {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.gem-location {
  color: #e5e7eb;
}

.gem-value {
  color: #fde68a;
}

/* Body */
.gem-body {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed rgba(148, 163, 184, 0.4);
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
}

.gem-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 13px;
}

.label {
  color: #9ca3af;
}

.value {
  color: #e5e7eb;
}

.monospace {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
  'Courier New', monospace;
}

@media (max-width: 600px) {
  .gem-card {
    border-radius: 16px;
    padding: 16px 12px;
  }

  .gem-name {
    font-size: 1.1rem;
  }
}
</style>
