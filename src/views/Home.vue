<template>
  <Globe
    :autoRotateSpeed="0.35"
    :hexed="true"
    palette="futuristic"
    :wired="false"
    :data="data"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Globe from '@/components/Globe.vue'

/**
 * MQTT-normalized payload:
 *   type: 'tex' | 'person' | 'gem'
 *   _id: Mongo ObjectId string
 *   lat, lng: number
 *   city, country: string
 *
 * tex:
 *   text, stats, authorName, authorHandle, avatarConfig, isGemTex, createdAt
 * person:
 *   handle, status, gemsCollected, avatarConfig
 * gem:
 *   rarity, value
 */

const data = ref([])

// 🔹 Mixed batch: tex + person + gem in one array
const worldEventsSeed = [
  // ---------- TEX (short thoughts) ----------
  {
    type: 'tex',
    _id: '671fa3c2b19e4d12c831f203',
    lat: 35.6892,
    lng: 51.389,
    city: 'Tehran',
    country: 'IR',

    name: 'Parisa',
    authorName: 'Parisa',
    authorHandle: 'parisa',
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'Hijab',
      clotheType: 'BlazerSweater'
    },

    text: 'تهران بوی بارون میده، و دلم بوی دلتنگی 🍂☕️',
    isGemTex: true,
    createdAt: '2025-11-30T18:02:00Z',

    stats: {
      likes: 430,
      lynks: 110,
      comments: 47,
      views: 4200
    }
  },
  {
    type: 'tex',
    _id: '671fa3c2b19e4d12c831f204',
    lat: 47.6062,
    lng: -122.3321,
    city: 'Seattle',
    country: 'US',

    name: 'Tyler',
    authorName: 'Tyler',
    authorHandle: 'tyler',
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'ShirtCrewNeck'
    },

    text: 'Rainy mornings + black coffee ☕ = perfect coding weather.',
    isGemTex: false,
    createdAt: '2025-11-27T07:45:00Z',

    stats: {
      likes: 203,
      lynks: 44,
      comments: 17,
      views: 2100
    }
  },
  {
    type: 'tex',
    _id: '671fa3c2b19e4d12c831f205',
    lat: 3.139,
    lng: 101.6869,
    city: 'Kuala Lumpur',
    country: 'MY',

    name: 'Aria',
    authorName: 'Aria',
    authorHandle: 'aria',
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairFro',
      clotheType: 'Hoodie'
    },

    text: 'City feels alive tonight 🌆💖 #neon #galaxy',
    isGemTex: false,
    createdAt: '2025-11-28T18:20:00Z',

    stats: {
      likes: 97,
      lynks: 12,
      comments: 6,
      views: 890
    }
  },
  {
    type: 'tex',
    _id: '671fa3c2b19e4d12c831f206',
    lat: 39.7392,
    lng: -104.9903,
    city: 'Denver',
    country: 'US',

    name: 'Mason',
    authorName: 'Mason',
    authorHandle: 'mason',
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'Hoodie'
    },

    text: 'Just shipped something that didn’t crash 😎 #devlife',
    isGemTex: true,
    createdAt: '2025-11-30T02:11:00Z',

    stats: {
      likes: 255,
      lynks: 62,
      comments: 24,
      views: 3100
    }
  },
  {
    type: 'tex',
    _id: '671fa3c2b19e4d12c831f207',
    lat: 29.5918,
    lng: 52.5837,
    city: 'Shiraz',
    country: 'IR',

    name: 'Narges',
    authorName: 'Narges',
    authorHandle: 'narges',
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairStraight',
      clotheType: 'BlazerSweater'
    },

    text: 'عطر بهار نارنج پیچیده توی خیابونای شیراز 🍊🌸',
    isGemTex: true,
    createdAt: '2025-11-30T06:52:00Z',

    stats: {
      likes: 498,
      lynks: 120,
      comments: 54,
      views: 5600
    }
  },
  {
    type: 'tex',
    _id: '671fa3c2b19e4d12c831f208',
    lat: 37.2809,
    lng: 49.5832,
    city: 'Rasht',
    country: 'IR',

    name: 'Leila',
    authorName: 'Leila',
    authorHandle: 'leila',
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairStraight',
      clotheType: 'Hoodie'
    },

    text: 'بارونای رشت هیچ‌وقت تکراری نمی‌شن 🌧💜',
    isGemTex: true,
    createdAt: '2025-11-29T08:40:00Z',

    stats: {
      likes: 401,
      lynks: 95,
      comments: 40,
      views: 4700
    }
  },

  // ---------- PEOPLE (presence layer) ----------
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f106',
    lat: 29.5918,
    lng: 52.5837,
    city: 'Shiraz',
    country: 'IR',

    name: 'Narges',
    handle: 'narges',
    status: 'Exploring Lynku gems',
    gemsCollected: 6,

    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairStraight',
      clotheType: 'BlazerSweater'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f101',
    lat: 21.0278,
    lng: 105.8342,
    city: 'Hanoi',
    country: 'VN',

    name: 'Luna',
    handle: 'luna',
    status: 'Designing a new avatar',
    gemsCollected: 4,

    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairFro',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f102',
    lat: 47.6062,
    lng: -122.3321,
    city: 'Seattle',
    country: 'US',

    name: 'Tyler',
    handle: 'tyler',
    status: 'Refactoring timelines service',
    gemsCollected: 2,

    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairShortFlat',
      clotheType: 'ShirtCrewNeck'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f103',
    lat: 35.6892,
    lng: 51.389,
    city: 'Tehran',
    country: 'IR',

    name: 'Parisa',
    handle: 'parisa',
    status: 'Scrolling through night texes',
    gemsCollected: 3,

    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'Hijab',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f104',
    lat: 3.139,
    lng: 101.6869,
    city: 'Kuala Lumpur',
    country: 'MY',

    name: 'Aria',
    handle: 'aria',
    status: 'Night ride in neon city',
    gemsCollected: 1,

    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairFro',
      clotheType: 'Hoodie'
    }
  },
  {
    type: 'person',
    _id: '671fa399b19e4d12c831f105',
    lat: 31.3183,
    lng: 48.6706,
    city: 'Ahvaz',
    country: 'IR',

    name: 'Sara',
    handle: 'sara',
    status: 'Listening to lo-fi under the sun',
    gemsCollected: 5,

    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairStraight',
      clotheType: 'Overall'
    }
  },

  // ---------- GEMS (collectibles on the map) ----------
  {
    type: 'gem',
    _id: '671fa4aa0e5f4c18f9b1a001',
    lat: 35.9,
    lng: 51.7,
    city: 'Near Tehran',
    country: 'IR',

    name: 'Aurora Link Shard',
    rarity: 'rare',
    value: 15
  },
  {
    type: 'gem',
    _id: '671fa4aa0e5f4c18f9b1a002',
    lat: 37.4,
    lng: 49.7,
    city: 'Near Rasht',
    country: 'IR',

    name: 'Rain Echo Gem',
    rarity: 'epic',
    value: 25
  },
  {
    type: 'gem',
    _id: '671fa4aa0e5f4c18f9b1a003',
    lat: 47.9,
    lng: -122.5,
    city: 'Seattle Orbit',
    country: 'US',

    name: 'Neon Pulse Core',
    rarity: 'legendary',
    value: 40
  },
  {
    type: 'gem',
    _id: '671fa4aa0e5f4c18f9b1a004',
    lat: 35.84,
    lng: 50.9391,
    city: 'Karaj Belt',
    country: 'IR',

    name: 'Echo Byte Fragment',
    rarity: 'uncommon',
    value: 8
  },
  {
    type: 'gem',
    _id: '671fa4aa0e5f4c18f9b1a005',
    lat: 1.3521,
    lng: 103.8198,
    city: 'Singapore Sky',
    country: 'SG',

    name: 'Skyline Prism',
    rarity: 'rare',
    value: 18
  },
  {
    type: 'gem',
    _id: '671fa4aa0e5f4c18f9b1a006',
    lat: 32.6546,
    lng: 51.668,
    city: 'Isfahan Halo',
    country: 'IR',

    name: 'Safavid Glow Core',
    rarity: 'epic',
    value: 28
  }
]

// Later: MQTT.on('message') → data.value.push(event)
onMounted(() => {
  data.value = worldEventsSeed
})
</script>
