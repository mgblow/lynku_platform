<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedData: { type: Object, default: null },
  visible: { type: Boolean, default: true }
})

const emit = defineEmits(['close'])

const popupStyle = computed(() => ({
  display: props.visible ? 'block' : 'none'
}))

const rarityClass = computed(
  () => `rarity-${(props.selectedData?.rarity || 'common').toLowerCase()}`
)
</script>

<template>
  <div class="gem-popup mt-4" :style="popupStyle" v-if="selectedData">
    <div class="header mb-2">
      <span class="badge" :class="rarityClass">{{ selectedData.rarity }}</span>
    </div>

    <h3>{{ selectedData.name }}</h3>

    <div class="svg-stage" v-html="selectedData.svg"></div>

    <div class="stats">
      <div><b>Value</b> {{ selectedData.value }}</div>
      <div><b>Location</b> {{ selectedData.city }}, {{ selectedData.country }}</div>
      <div><b>Coords</b> {{ selectedData.lat }}, {{ selectedData.lng }}</div>
    </div>

    <button class="collect">Collect</button>
  </div>
</template>

<style scoped>
.gem-popup {
  background: rgba(5, 8, 20, 0.65);
  backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 18px;
  color: white;
  border: 1px solid rgba(255,215,0,0.25);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: uppercase;
}

.rarity-uncommon { box-shadow: 0 0 14px rgba(120,255,180,.4); }
.rarity-rare { box-shadow: 0 0 18px rgba(80,200,255,.5); }
.rarity-epic { box-shadow: 0 0 22px rgba(255,80,255,.6); }
.rarity-legendary { box-shadow: 0 0 26px rgba(255,210,80,.7); }

.svg-stage {
  width: 140px;
  height: 140px;
  margin: 14px auto;
}

.svg-stage :deep(svg) {
  width: 100%;
  height: 100%;
}

.stats {
  font-size: 13px;
  margin: 12px 0;
  display: grid;
  gap: 6px;
}

.collect {
  width: 100%;
  padding: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg,#ffd24d,#ff9f1c);
  border: none;
  font-weight: 700;
}
</style>
