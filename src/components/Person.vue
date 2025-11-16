<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// Props: parent passes selectedUser object
const props = defineProps({
  selectedData: {
    type: Object,
    default: null
  },
  visible: {
    type: Boolean,
    default: true
  }
})

// Emit close event
const emit = defineEmits(['close'])

// Computed style toggle
const popupStyle = computed(() => ({
  display: props.visible ? 'block' : 'none'
}))


const goToGlobe = () => {
  router.push('/globes/' + props.selectedData.id)
}

</script>

<template>
  <div class="user-popup-content" :style="popupStyle">
    <img v-if="selectedData" :src="selectedData.avatarUrl" alt="Avatar" class="popup-avatar" @click="goToGlobe()"/>
    <h3 v-if="selectedData">{{ selectedData.id }}</h3>
    <h3 v-if="selectedData">{{ selectedData.name }}</h3>
    <p v-if="selectedData" class="city">📍 {{ selectedData.city }}</p>
    <p v-if="selectedData" class="coords">{{ selectedData.lat.toFixed(4) }}°, {{ selectedData.lng.toFixed(4) }}°</p>
  </div>
</template>

<style scoped>
.user-popup-content {
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 20px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  width: 80%;
  height: 35vh;
}

.popup-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 2px solid white;
  margin-bottom: 10px;
}

.city {
  font-size: 14px;
  opacity: 0.9;
}

.coords {
  font-size: 12px;
  color: #aaa;
}
</style>
