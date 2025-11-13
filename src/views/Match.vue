<template>
  <Globe
    :autoRotateSpeed="0.2"
    :imageUrl="'//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg'"
    :inputPings="people"
  />
</template>

<script setup>
import { ref } from 'vue';
import Globe from '@/views/Globe.vue';

const people = ref([]); // <-- reactive reference

setTimeout(() => {
  people.value = [
    { name: 'Luna', city: 'Hanoi', lat: 21.0278, lng: 105.8342 },
    { name: 'Tyler', city: 'Seattle', lat: 47.6062, lng: -122.3321 },
    { name: 'Aria', city: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
    { name: 'Leo', city: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Mason', city: 'Denver', lat: 39.7392, lng: -104.9903 },
    { name: 'Amelia', city: 'Zurich', lat: 47.3769, lng: 8.5417 },
    { name: 'Evan', city: 'Montreal', lat: 45.5017, lng: -73.5673 },
    { name: 'Clara', city: 'Luxembourg', lat: 49.6117, lng: 6.1319 },
    { name: 'Omar', city: 'Doha', lat: 25.2854, lng: 51.531 },
    { name: 'Fatima', city: 'Muscat', lat: 23.588, lng: 58.3829 },
    { name: 'Rami', city: 'Baghdad', lat: 33.3152, lng: 44.3661 }
  ];
}, 3000);
</script>
