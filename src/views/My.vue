<template>
  <Globe
    style="height: 100vh; width: 100%;"
    :autoRotateSpeed="0"
    :hexed="false"
    :imageUrl="'//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg'"
    :data="data"
  />
</template>

<script setup>
import { ref } from 'vue'
import Globe from '@/components/Globe.vue'

const data = ref([]) // <-- reactive reference

const pings = [
  // 🌍 Global users
  {
    type: 'gift',
    name: 'Luna',
    city: 'Hanoi',
    lat: 21.0278,
    lng: 105.8342,
    text: 'Lost in thought under pink neon lights 🌸✨ #nightvibes',
    gift: `
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(60,60)">
      <circle cx="0" cy="0" r="10" fill="#FFD700"/>
      <g>
        <circle cx="0" cy="-20" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="14" cy="-14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="20" cy="0" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="14" cy="14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="0" cy="20" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-14" cy="14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-20" cy="0" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="-14" cy="-14" r="10" fill="#FF6B81">
          <animateTransform attributeName="transform" type="scale" values="1;1.2;1" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
    </g>
  </svg>
    `
  },
]

setTimeout(() => {
  data.value = [...pings]
}, 1000)
</script>
