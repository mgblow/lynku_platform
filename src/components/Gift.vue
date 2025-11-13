<script setup>
import { computed } from 'vue'

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
</script>

<template>
  <div class="user-popup-content" :style="popupStyle">
    <img v-if="selectedData" :src="selectedData.avatarUrl" alt="Avatar" class="popup-avatar" />
    <h3 v-if="selectedData">{{ selectedData.name }}</h3>
    <h3 v-if="selectedData" v-html="selectedData.gift"></h3>
    <p v-if="selectedData" v-html="selectedData.text"></p>
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
  height: 40vh;
}

.popup-avatar {
  width: 75px;
  height: 75px;
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
