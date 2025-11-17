<template>
  <Globe
    style="height: 100vh; width: 100%"
    :autoRotateSpeed="0.5"
    :hexed="false"
    :imageUrl="globeBackgroundUrl"
    :data="data"
    :person="person"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Globe from '@/components/Globe.vue'
import { useRoute } from 'vue-router'
import { post } from '@/api'
import { getCookie } from '@/cookie'
import { emitter } from '@/utils/event-bus'

const route = useRoute()

// Access the param
const personId = route.params.pid

console.log(personId)
const data = ref([])
const globeBackgroundUrl = ref('')

globeBackgroundUrl.value =
  'https://thumbs.dreamstime.com/z/vintage-grunge-world-map-old-crumpled-parchment-paper-antique-style-world-map-strong-grunge-vintage-aesthetic-410763555.jpg?ct=jpeg'

const pings = [
  // 🌍 Global users
  {
    type: 'gift',
    name: 'Mojtaba',
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
  }
]

const person = ref(null);

// person.value = {
//   type: 'person',
//   name: 'Luna',
//   city: 'Hanoi',
//   lat: 21.0278,
//   lng: 105.8342,
//   id: '691632e1ce4f00f5663dea4d'
// }

const getPersonGlobeData = async () => {
  try {
    const response = await post(
      '/api/v1',
      {
        topic: 'getPerson',
        data: {
          id: personId
        }
      },
      {
        token: getCookie('app-token')
      }
    )
    if (response && response.data.success) {
      console.log(response.data)
      person.value = {
        ...response.data.body,  // existing fields from API
        type: 'person',
      }
    } else {
      emitter.emit('error-message', response.data)
    }
  } catch (error) {
    console.error('Error posting tweet:', error)
    // this.showError('خطا در ارسال توییت. لطفاً دوباره تلاش کنید.')
  } finally {

  }
}

onMounted(() => {

  getPersonGlobeData()

})
setTimeout(() => {
  data.value = [...pings]
}, 1000)
</script>
