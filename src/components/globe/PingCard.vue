<template>
  <div class="ping-card" :class="{ rtl: isRTL }">
    <p class="ping-text">{{ text }}</p>

    <div class="ping-meta">
      <!-- Comment -->
      <span class="meta-item">
        <svg viewBox="0 0 24 24" class="meta-icon">
          <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2.5L12 22l4.5-4H19a2 2 0 0 0 2-2V6z"/>
        </svg>
        {{ comments }}
      </span>

      <!-- Reping / Retweet -->
      <span class="meta-item">
        <svg viewBox="0 0 24 24" class="meta-icon">
          <path d="M23 7l-4-4v3H9a4 4 0 0 0-4 4v1h2v-1a2 2 0 0 1 2-2h10v3l4-4zM1 17l4 4v-3h10a4 4 0 0 0 4-4v-1h-2v1a2 2 0 0 1-2 2H5v-3L1 17z"/>
        </svg>
        {{ reping }}
      </span>

      <!-- Like -->
      <span class="meta-item">
        <svg viewBox="0 0 24 24" class="meta-icon">
          <path d="M12.1 21.3l-1.1-.99C5.4 15.3 2 12.6 2 9.5 2 7.01 4.01 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C13.46 5.99 14.96 5 16.5 5 18.99 5 21 7.01 21 9.5c0 3.1-3.4 5.8-8.9 11.32l-1.0.98z"/>
        </svg>
        {{ likes }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  likes: { type: Number, required: true },
  reping: { type: Number, required: true },
  comments: { type: Number, required: true }
})

const isRTL = computed(() => /[آ-ی]/.test(props.text))
</script>

<style scoped>
.ping-card {
  background: rgba(10,10,20,0.75);
  backdrop-filter: blur(8px) saturate(1.3);
  -webkit-backdrop-filter: blur(8px) saturate(1.3);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  color: #fff;
  font-size: 11px;
  width: 180px;
  box-shadow: 0 4px 20px rgba(255,0,180,0.25);
  animation: fadeIn 0.4s ease;
  position: relative;
}

.ping-card.rtl {
  direction: rtl;
  text-align: right;
}
.ping-card:not(.rtl) {
  direction: ltr;
  text-align: left;
}

.ping-text {
  line-height: 1.4;
  margin-bottom: 6px;
  font-weight: 400;
  text-shadow: 0 0 2px rgba(0,0,0,0.4);
}

.ping-meta {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  width: 16px;
  height: 16px;
  fill: #fff;
  transition: transform 0.2s ease;
}

.ping-card:hover .meta-icon {
  transform: scale(1.2);
}

.ping-card:hover {
  box-shadow: 0 6px 26px rgba(255,0,200,0.35);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
