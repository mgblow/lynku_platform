<template>
  <Globe
    :autoRotateSpeed="0.25"
    :hexed="true"
    palette="golden"
    :wired="false"
    :data="data"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Globe from '@/components/Globe.vue'
import { emitter } from '@/utils/event-bus'

const data = ref([])

const gemsSeed = [
  {
    type: 'gem',
    _id: 'gem-aurora',
    name: 'Aurora Crown Shard',
    rarity: 'legendary',
    value: 55,
    energy: 'cosmic',
    originVibe: 'northern lights / destiny',
    lore: 'Forged where auroras touch the mind. Only appears to leaders.',
    lat: 69.6492,
    lng: 18.9553,
    city: 'Tromsø',
    country: 'NO',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="karajByte-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7B5CFF"/>
      <stop offset="55%" stop-color="#33F6FF"/>
      <stop offset="100%" stop-color="#FFE36F"/>
    </linearGradient>

    <filter id="karajByte-glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="2.1" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g filter="url(#karajByte-glow)">
    <!-- chip base -->
    <rect x="30" y="30" width="60" height="60" rx="12" fill="#050814" stroke="url(#karajByte-grad)" stroke-width="2.2" opacity="0.95"/>

    <!-- pins -->
    <g opacity="0.75" stroke="#A8FFF6" stroke-width="2" stroke-linecap="round">
      <line x1="40" y1="22" x2="40" y2="30"/><line x1="52" y1="22" x2="52" y2="30"/>
      <line x1="64" y1="22" x2="64" y2="30"/><line x1="76" y1="22" x2="76" y2="30"/>
      <line x1="40" y1="90" x2="40" y2="98"/><line x1="52" y1="90" x2="52" y2="98"/>
      <line x1="64" y1="90" x2="64" y2="98"/><line x1="76" y1="90" x2="76" y2="98"/>
    </g>

    <!-- byte bars -->
    <g>
      <rect x="42" y="44" width="8" height="32" rx="4" fill="#33F6FF">
        <animate attributeName="height" values="10;32;18;32" dur="1.2s" repeatCount="indefinite"/>
        <animate attributeName="y" values="60;44;54;44" dur="1.2s" repeatCount="indefinite"/>
      </rect>
      <rect x="56" y="44" width="8" height="32" rx="4" fill="#FF33FF" opacity="0.9">
        <animate attributeName="height" values="32;16;32;22" dur="1.15s" repeatCount="indefinite"/>
      </rect>
      <rect x="70" y="44" width="8" height="32" rx="4" fill="#FFE36F" opacity="0.85">
        <animate attributeName="height" values="18;32;12;32" dur="1.25s" repeatCount="indefinite"/>
        <animate attributeName="y" values="52;44;60;44" dur="1.25s" repeatCount="indefinite"/>
      </rect>
    </g>

    <!-- scan line -->
    <rect x="34" y="36" width="52" height="2" fill="#FFFFFF" opacity="0.25">
      <animate attributeName="y" values="36;84;36" dur="2.0s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.15;0.45;0.15" dur="2.0s" repeatCount="indefinite"/>
    </rect>
  </g>
</svg>`
  },

  {
    type: 'gem',
    _id: 'gem-neon',
    name: 'Neon Pulse Core',
    rarity: 'epic',
    value: 40,
    energy: 'heartbeat',
    originVibe: 'cyber city / late night code',
    lore: 'Synchronizes with human emotion and bass frequencies.',
    lat: 35.6762,
    lng: 139.6503,
    city: 'Tokyo',
    country: 'JP',
    svg: `
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyline-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#33F6FF"/>
      <stop offset="45%" stop-color="#7B5CFF"/>
      <stop offset="100%" stop-color="#FF33FF"/>
    </linearGradient>

    <filter id="skyline-glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="2.1" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g filter="url(#skyline-glow)">
    <!-- prism -->
    <polygon points="60,14 92,44 78,104 60,112 42,104 28,44"
             fill="url(#skyline-grad)" opacity="0.95">
      <animateTransform attributeName="transform" type="translate"
                        values="0 0; 0 2; 0 0" dur="2.6s" repeatCount="indefinite"/>
    </polygon>

    <!-- facet outlines -->
    <polyline points="60,14 92,44 78,104 60,112 42,104 28,44 60,14"
              fill="none" stroke="#EFFFFB" stroke-opacity="0.85" stroke-width="1.1"/>

    <!-- skyline reflection band -->
    <g opacity="0.9">
      <rect x="36" y="58" width="48" height="2.2" fill="#FFFFFF" opacity="0.25">
        <animate attributeName="x" values="34;38;34" dur="1.4s" repeatCount="indefinite"/>
      </rect>
      <path d="M36 78 H44 V70 H50 V74 H56 V64 H60 V76 H66 V68 H72 V72 H78 V66 H84 V78"
            fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <animate attributeName="stroke-opacity" values="0.25;0.75;0.25" dur="2.0s" repeatCount="indefinite"/>
      </path>
    </g>

    <!-- orbit spark -->
    <circle cx="60" cy="10" r="1.5" fill="#FFF3D1">
      <animateTransform attributeName="transform" type="rotate"
                        from="0 60 60" to="360 60 60" dur="6.8s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>
`
  },

  {
    type: 'gem',
    _id: 'gem-rain',
    name: 'Rain Echo Gem',
    rarity: 'rare',
    value: 22,
    energy: 'melancholy',
    originVibe: 'rain / nostalgia',
    lore: 'Stores memories whispered during rain.',
    lat: 37.2809,
    lng: 49.5832,
    city: 'Rasht',
    country: 'IR',
    svg: `
<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="safavid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE36F"/>
      <stop offset="45%" stop-color="#FF33FF"/>
      <stop offset="100%" stop-color="#33F6FF"/>
    </linearGradient>

    <filter id="safavid-glow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="2.2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g filter="url(#safavid-glow)">
    <!-- rotating tile ring -->
    <g opacity="0.85">
      <circle cx="60" cy="60" r="38" fill="none" stroke="url(#safavid-grad)" stroke-width="3" stroke-dasharray="6 8"/>
      <animateTransform attributeName="transform" type="rotate"
                        from="0 60 60" to="360 60 60" dur="7s" repeatCount="indefinite"/>
    </g>

    <!-- geometric star -->
    <polygon points="60,20 70,44 96,44 74,58 82,84 60,70 38,84 46,58 24,44 50,44"
             fill="url(#safavid-grad)" opacity="0.95">
      <animate attributeName="opacity" values="0.75;1;0.75" dur="2.8s" repeatCount="indefinite"/>
    </polygon>

    <!-- inner core -->
    <circle cx="60" cy="60" r="12" fill="#050814" opacity="0.65"/>
    <circle cx="60" cy="60" r="7" fill="#FFFFFF" opacity="0.85">
      <animate attributeName="r" values="6;9;6" dur="1.9s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>
`
  },

  {
    type: 'gem',
    _id: 'gem-safavid',
    name: 'Safavid Glow Core',
    rarity: 'epic',
    value: 30,
    energy: 'heritage',
    originVibe: 'geometry / ancient art',
    lore: 'Encodes sacred geometry into light.',
    lat: 32.6546,
    lng: 51.668,
    city: 'Isfahan',
    country: 'IR',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldDune-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2B2"/>
      <stop offset="35%" stop-color="#FFD457"/>
      <stop offset="70%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#FF6A00"/>
    </linearGradient>

    <radialGradient id="goldDune-glow" cx="35%" cy="25%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="45%" stop-color="#FFD457" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="goldDune-filter" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="2.2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g filter="url(#goldDune-filter)">
    <circle cx="60" cy="58" r="44" fill="url(#goldDune-glow)" opacity="0.7">
      <animate attributeName="opacity" values="0.45;0.85;0.45" dur="3.4s" repeatCount="indefinite"/>
    </circle>

    <!-- Prism -->
    <polygon points="60,14 96,40 82,104 60,112 38,104 24,40"
             fill="url(#goldDune-grad)" opacity="0.95">
      <animateTransform attributeName="transform" type="translate"
                        values="0 -1; 0 2; 0 -1" dur="2.8s" repeatCount="indefinite"/>
    </polygon>

    <!-- Facet lines -->
    <polyline points="60,14 96,40 82,104 60,112 38,104 24,40 60,14"
              fill="none" stroke="#FFF7D6" stroke-opacity="0.9" stroke-width="1.2"/>
    <polyline points="60,14 60,112" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1"/>
    <polyline points="24,40 60,64 96,40" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>

    <!-- Dune wave highlight -->
    <path d="M30 78 C44 70, 52 88, 66 80 C76 74, 88 84, 96 78"
          fill="none" stroke="#FFF2B2" stroke-opacity="0.75" stroke-width="2" stroke-linecap="round">
      <animate attributeName="stroke-opacity" values="0.35;0.9;0.35" dur="2.1s" repeatCount="indefinite"/>
    </path>
  </g>
</svg>
`
  },

  {
    type: 'gem',
    _id: 'gem-ocean',
    name: 'Ocean Mirage Shard',
    rarity: 'uncommon',
    value: 14,
    energy: 'calm',
    originVibe: 'waves / reflection',
    lore: 'Appears differently to every observer.',
    lat: -33.8688,
    lng: 151.2093,
    city: 'Sydney',
    country: 'AU',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="neonPulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#33F6FF"/>
      <stop offset="45%" stop-color="#FF33FF"/>
      <stop offset="100%" stop-color="#FFB347"/>
    </linearGradient>

    <radialGradient id="neonPulse-core" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="#33F6FF" stop-opacity="0.55"/>
      <stop offset="70%" stop-color="#FF33FF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="neonPulse-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <g filter="url(#neonPulse-glow)">
    <circle cx="60" cy="60" r="34" fill="none" stroke="url(#neonPulse-grad)" stroke-width="4" stroke-dasharray="7 9" opacity="0.9">
      <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="4.8s" repeatCount="indefinite"/>
    </circle>

    <circle cx="60" cy="60" r="22" fill="none" stroke="#33F6FF" stroke-width="2" stroke-dasharray="3 7" opacity="0.9">
      <animateTransform attributeName="transform" type="rotate" from="360 60 60" to="0 60 60" dur="3.2s" repeatCount="indefinite"/>
    </circle>

    <circle cx="60" cy="60" r="18" fill="url(#neonPulse-core)">
      <animate attributeName="r" values="16;22;16" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.65;1;0.65" dur="2.2s" repeatCount="indefinite"/>
    </circle>

    <!-- heartbeat line -->
    <polyline points="18,60 34,60 40,48 48,72 56,56 62,60 70,60 78,52 86,68 102,68"
              fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">
      <animate attributeName="opacity" values="0.35;0.95;0.35" dur="1.35s" repeatCount="indefinite"/>
    </polyline>
  </g>
</svg>
`
  },
  {
    type: 'gem',
    _id: 'gem-ocean',
    name: 'Neon Shard',
    rarity: 'uncommon',
    value: 14,
    energy: 'calm',
    originVibe: 'waves / reflection',
    lore: 'Appears differently to every observer.',
    lat: -33.8688,
    lng: 101.2093,
    city: 'Sydney',
    country: 'AU',
    svg: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="auroraCrown-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7CFFEA"/>
      <stop offset="45%" stop-color="#7B5CFF"/>
      <stop offset="75%" stop-color="#FF33FF"/>
      <stop offset="100%" stop-color="#FFE36F"/>
    </linearGradient>

    <radialGradient id="auroraCrown-core" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#A8FFF6" stop-opacity="0.65"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="auroraCrown-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="auroraCrown-soft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="6" result="bb"/>
      <feColorMatrix in="bb" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.35 0" />
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Aura -->
  <g filter="url(#auroraCrown-soft)">
    <circle cx="60" cy="60" r="42" fill="url(#auroraCrown-core)">
      <animate attributeName="r" values="40;44;40" dur="3.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.55;0.95;0.55" dur="3.2s" repeatCount="indefinite"/>
    </circle>
  </g>

  <!-- Crown ribbons -->
  <g filter="url(#auroraCrown-glow)">
    <path d="M18 64 C30 38, 52 40, 60 54 C68 40, 90 38, 102 64"
          fill="none" stroke="url(#auroraCrown-grad)" stroke-width="5" stroke-linecap="round" opacity="0.95">
      <animate attributeName="stroke-dasharray" values="6 10;10 6;6 10" dur="2.4s" repeatCount="indefinite"/>
    </path>

    <path d="M26 68 C36 52, 50 56, 60 66 C70 56, 84 52, 94 68"
          fill="none" stroke="url(#auroraCrown-grad)" stroke-width="3" stroke-linecap="round" opacity="0.8">
      <animate attributeName="opacity" values="0.55;0.9;0.55" dur="2.2s" repeatCount="indefinite"/>
    </path>

    <!-- Shard -->
    <g>
      <polygon points="60,18 80,44 72,92 60,104 48,92 40,44"
               fill="url(#auroraCrown-grad)" opacity="0.95"/>
      <polyline points="60,18 80,44 72,92 60,104 48,92 40,44 60,18"
                fill="none" stroke="#EFFFFB" stroke-opacity="0.85" stroke-width="1.2"/>
      <polyline points="60,18 62,44 60,104" fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1"/>

      <animateTransform attributeName="transform" type="translate"
                        values="0 -1; 0 2; 0 -1" dur="2.6s" repeatCount="indefinite"/>
    </g>
  </g>

  <!-- Orbit sparkles -->
  <g filter="url(#auroraCrown-glow)">
    <circle cx="60" cy="14" r="1.5" fill="#FFF6C6">
      <animateTransform attributeName="transform" type="rotate"
                        from="0 60 60" to="360 60 60" dur="6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="100" cy="60" r="1.4" fill="#FFB6FF">
      <animateTransform attributeName="transform" type="rotate"
                        from="360 60 60" to="0 60 60" dur="7.3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="60" cy="106" r="1.5" fill="#B8FFFF">
      <animateTransform attributeName="transform" type="rotate"
                        from="0 60 60" to="360 60 60" dur="5.4s" repeatCount="indefinite"/>
    </circle>
  </g>
</svg>
`
  }
]

onMounted(() => {
  data.value = gemsSeed
})

emitter.on('globe:select', (item) => {
  if (item?.type === 'gem') {
    emitter.emit('drawer:gem', item)
  }
})
</script>
