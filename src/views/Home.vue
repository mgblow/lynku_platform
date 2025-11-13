<template>
  <Globe
    style="height: 100vh; width: 100%;"
    :autoRotateSpeed="0.35"
    :hexed="true"
    :imageUrl="'//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg'"
    :data="data"
  />
</template>

<script setup>
import { ref } from 'vue'
import Globe from '@/components/Globe.vue'

const data = ref([]) // <-- reactive reference

const people = [
  { type: 'person', name: 'Luna', city: 'Hanoi', lat: 21.0278, lng: 105.8342 },
  { type: 'person', name: 'Tyler', city: 'Seattle', lat: 47.6062, lng: -122.3321 },
  { type: 'person', name: 'Aria', city: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
  { type: 'person', name: 'Leo', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { type: 'person', name: 'Mason', city: 'Denver', lat: 39.7392, lng: -104.9903 },
  { type: 'person', name: 'Parisa', city: 'Tehran', lat: 35.6892, lng: 51.389 },
  { type: 'person', name: 'Amir', city: 'Mashhad', lat: 36.2605, lng: 59.6168 },
  { type: 'person', name: 'Zahra', city: 'Isfahan', lat: 32.6546, lng: 51.668 },
  { type: 'person', name: 'Reza', city: 'Tabriz', lat: 38.0962, lng: 46.2738 },
  { type: 'person', name: 'Narges', city: 'Shiraz', lat: 29.5918, lng: 52.5837 },
  { type: 'person', name: 'Ali', city: 'Karaj', lat: 35.84, lng: 50.9391 },
  { type: 'person', name: 'Sara', city: 'Ahvaz', lat: 31.3183, lng: 48.6706 },
  { type: 'person', name: 'Hossein', city: 'Qom', lat: 34.6399, lng: 50.8759 },
  { type: 'person', name: 'Leila', city: 'Rasht', lat: 37.2809, lng: 49.5832 }
]

const pings = [
  // 🌍 Global users
  {
    type: 'ping',
    name: 'Luna',
    city: 'Hanoi',
    lat: 21.0278,
    lng: 105.8342,
    text: 'Lost in thought under pink neon lights 🌸✨ #nightvibes',
    likes: 128,
    reping: 21,
    comments: 8
  },

  {
    type: 'ping',
    name: 'Tyler',
    city: 'Seattle',
    lat: 47.6062,
    lng: -122.3321,
    text: 'Rainy mornings + black coffee ☕ = perfect coding weather.',
    likes: 203,
    reping: 44,
    comments: 17
  },

  {
    type: 'ping',
    name: 'Aria',
    city: 'Kuala Lumpur',
    lat: 3.139,
    lng: 101.6869,
    text: 'City feels alive tonight 🌆💖 #neon #galaxy',
    likes: 97,
    reping: 12,
    comments: 6
  },

  {
    type: 'ping',
    name: 'Leo',
    city: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    text: 'Sometimes silence speaks louder than sound.',
    likes: 78,
    reping: 9,
    comments: 5
  },

  {
    type: 'ping',
    name: 'Mason',
    city: 'Denver',
    lat: 39.7392,
    lng: -104.9903,
    text: 'Just deployed something that didn’t crash 😎 #devlife',
    likes: 255,
    reping: 62,
    comments: 24
  },

  // 🇮🇷 Iranian users (70%)
  {
    type: 'ping',
    name: 'Parisa',
    city: 'Tehran',
    lat: 35.6892,
    lng: 51.389,
    text: 'تهران بوی بارون میده، و دلم بوی دلتنگی 🍂☕️',
    likes: 430,
    reping: 110,
    comments: 47
  },

  {
    type: 'ping',
    name: 'Amir',
    city: 'Mashhad',
    lat: 36.2605,
    lng: 59.6168,
    text: 'تو سکوت شب، فقط صدای تایپ‌ کردنه که آرومم می‌کنه 💻✨',
    likes: 289,
    reping: 71,
    comments: 33
  },

  {
    type: 'ping',
    name: 'Zahra',
    city: 'Isfahan',
    lat: 32.6546,
    lng: 51.668,
    text: 'یه قهوه‌ی تلخ و یه آهنگ قدیمی... همین کافیه برای امشب ☕🎶',
    likes: 376,
    reping: 92,
    comments: 38
  },

  {
    type: 'ping',
    name: 'Reza',
    city: 'Tabriz',
    lat: 38.0962,
    lng: 46.2738,
    text: 'کاش همه چیز به سادگی یه سلام بود 👋',
    likes: 214,
    reping: 48,
    comments: 16
  },

  {
    type: 'ping',
    name: 'Narges',
    city: 'Shiraz',
    lat: 29.5918,
    lng: 52.5837,
    text: 'عطر بهار نارنج پیچیده توی خیابونای شیراز 🍊🌸',
    likes: 498,
    reping: 120,
    comments: 54
  },

  {
    type: 'ping',
    name: 'Ali',
    city: 'Karaj',
    lat: 35.84,
    lng: 50.9391,
    text: 'امروز فقط با هدفون و خلسه‌ی موسیقی 🎧🔥',
    likes: 175,
    reping: 39,
    comments: 12
  },

  {
    type: 'ping',
    name: 'Sara',
    city: 'Ahvaz',
    lat: 31.3183,
    lng: 48.6706,
    text: 'خورشید هنوزم عاشق جنوبه ☀️🌴 #Ahvaz',
    likes: 322,
    reping: 87,
    comments: 29
  },

  {
    type: 'ping',
    name: 'Hossein',
    city: 'Qom',
    lat: 34.6399,
    lng: 50.8759,
    text: 'زندگی یه مسابقه نیست، یه سفره 🚶‍♂️',
    likes: 142,
    reping: 28,
    comments: 10
  },

  {
    type: 'ping',
    name: 'Leila',
    city: 'Rasht',
    lat: 37.2809,
    lng: 49.5832,
    text: 'بارونای رشت هیچ‌وقت تکراری نمی‌شن 🌧💜',
    likes: 401,
    reping: 95,
    comments: 40
  }
]

setTimeout(() => {
  data.value = [...pings]
}, 1000)
</script>
