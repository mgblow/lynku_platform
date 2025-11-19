<template>
  <div class="gift-card" :class="{ rtl: isRTL }">
    <p class="gift-text">{{ props.text }}</p>
    <div class="gift-meta" v-html="props.gift"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  gift: { type: String, required: true },
})

const isRTL = computed(() => /[آ-ی]/.test(props.text))
</script>

<style scoped>
.gift-card {
  background: rgba(10, 10, 20, 0.75);
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
  text-align: center;
  padding: 10px 6px;
}

.gift-card.rtl { direction: rtl; }
.gift-card:not(.rtl) { direction: ltr; }

.gift-text {
  line-height: 1.4;
  margin-bottom: 6px;
  font-weight: 400;
  text-shadow: 0 0 2px rgba(0,0,0,0.4);
}

.gift-meta {
  font-size: 10px;
  opacity: 0.8;
}

.gift-card:hover {
  box-shadow: 0 6px 26px rgba(255,0,200,0.35);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
