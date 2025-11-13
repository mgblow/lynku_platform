<template>
  <Globe :autoRotateSpeed="0.2" :imageUrl="'//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg'" :data="people" />
</template>

<script setup>
import { ref } from 'vue'
import Globe from '@/components/Globe.vue'

const people = ref([]) // <-- reactive reference

setTimeout(() => {
  people.value = [
    { name: 'Luna', city: 'Hanoi', lat: 21.0278, lng: 105.8342 },
    { name: 'Tyler', city: 'Seattle', lat: 47.6062, lng: -122.3321 },
    { name: 'Aria', city: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
    { name: 'Leo', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Mason', city: 'Denver', lat: 39.7392, lng: -104.9903 },
    { name: 'Amelia', city: 'Zurich', lat: 47.3769, lng: 8.5417 },
    { name: 'Evan', city: 'Montreal', lat: 45.5017, lng: -73.5673 },
    // Iranian Cities (70% of the list)
    { name: 'Parisa', city: 'Tehran', lat: 35.6892, lng: 51.389 },
    { name: 'Amir', city: 'Mashhad', lat: 36.2605, lng: 59.6168 },
    { name: 'Zahra', city: 'Isfahan', lat: 32.6546, lng: 51.668 },
    { name: 'Reza', city: 'Tabriz', lat: 38.0962, lng: 46.2738 },
    { name: 'Narges', city: 'Shiraz', lat: 29.5918, lng: 52.5837 },
    { name: 'Ali', city: 'Karaj', lat: 35.84, lng: 50.9391 },
    { name: 'Sara', city: 'Ahvaz', lat: 31.3183, lng: 48.6706 },
    { name: 'Hossein', city: 'Qom', lat: 34.6399, lng: 50.8759 },
    { name: 'Fatemeh', city: 'Kermanshah', lat: 34.3142, lng: 47.065 },
    { name: 'Mohammad', city: 'Urmia', lat: 37.5527, lng: 45.0759 },
    { name: 'Leila', city: 'Rasht', lat: 37.2809, lng: 49.5832 },
    { name: 'Mehdi', city: 'Zahedan', lat: 29.4517, lng: 60.8931 },
    { name: 'Yasaman', city: 'Hamadan', lat: 34.7989, lng: 48.515 },
    { name: 'Babak', city: 'Yazd', lat: 31.8948, lng: 54.357 },
    { name: 'Navid', city: 'Ardabil', lat: 38.2537, lng: 48.2974 },
    { name: 'Shirin', city: 'Bandar Abbas', lat: 27.1832, lng: 56.2666 },
    { name: 'Kian', city: 'Kashan', lat: 33.985, lng: 51.41 }
  ]
}, 1000)
</script>
