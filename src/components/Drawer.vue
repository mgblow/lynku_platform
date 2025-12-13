<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { emitter } from '@/utils/event-bus'

import Gem from '@/components/Gem.vue'
import Tex from '@/views/Tex.vue'
import Person from '@/components/Person.vue'
import TexBox from '@/components/TexBox.vue'
import AvatarGenerator from '@/views/AvatarGenerator.vue'
import Settings from '@/views/Settings.vue'

const props = defineProps({
  selectedData: { type: Object, default: null }
})

const drawerData = ref({})
const isMinimized = ref(false)

const closePanel = () => {
  drawerData.value = {}
  isMinimized.value = false
  emitter.emit('globe:pointOfView', {
    lat: 30,
    lng: 20,
    altitude: 3.5,
    transition: 1500
  })
}

const toggleMinimize = () => {
  // Only allow minimizing if something is open
  if (!drawerData.value.type) return
  isMinimized.value = !isMinimized.value
}

onMounted(() => {
  const openWithType = (type) => (data) => {
    drawerData.value = {
      ...data,
      type
    }
    console.log(drawerData.value)
    isMinimized.value = false
  }

  emitter.on('drawer:publish', openWithType('publish'))
  emitter.on('drawer:tex', openWithType('tex'))
  emitter.on('drawer:gem', openWithType('gem'))
  emitter.on('drawer:person', openWithType('person'))
  emitter.on('drawer:avatarConfig', openWithType('avatarConfig'))
  emitter.on('drawer:settings', openWithType('settings'))

  emitter.on('drawer:close', () => {
    closePanel()
  })
})

onBeforeUnmount(() => {
  emitter.off('drawer:publish')
  emitter.off('drawer:tex')
  emitter.off('drawer:gem')
  emitter.off('drawer:person')
  emitter.off('drawer:avatarConfig')
  emitter.off('drawer:settings')
  emitter.off('drawer:close')
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="drawerData.type"
      v-show="drawerData.type"
      class="user-popup"
      :class="{ minimized: isMinimized }"
    >
      <!-- Close -->
      <button class="close-btn" @click="closePanel">
        ×
      </button>

      <!-- Minimize -->
      <button class="minimize-btn" @click="toggleMinimize">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <!-- simple chevron to imply up/down -->
          <path
            v-if="!isMinimized"
            d="M6 9l6 6 6-6"
          />
          <path
            v-else
            d="M6 15l6-6 6 6"
          />
        </svg>
      </button>

      <!-- Dynamic content -->
      <AvatarGenerator v-if="drawerData.type === 'avatarConfig'" />
      <Settings v-else-if="drawerData.type === 'settings'" />
      <TexBox v-else-if="drawerData.type === 'tex'" :selectedData="drawerData"/>
      <Person v-else-if="drawerData.type === 'person'" :selectedData="drawerData" />
      <Gem v-else-if="drawerData.type === 'gem'" :selectedData="drawerData" />
      <Gem v-else-if="drawerData.type === 'gem'" :selectedData="drawerData" />
      <Tex v-else-if="drawerData.type === 'publish'" :location="drawerData" />
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes rotateBorder {
  0% {
    transform: rotate(0deg);
    filter: hue-rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
    filter: hue-rotate(360deg);
  }
}

@keyframes dotPulse {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
  100% {
    content: '...';
  }
}

@keyframes pulse {
  from {
    box-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
  }
  to {
    box-shadow: 0 0 25px rgba(74, 144, 226, 0.9);
  }
}

.user-popup {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: rgba(5, 5, 20, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  padding: 60px 20px;
  color: white;
  width: 280px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  animation: slideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  transition:
    top 0.35s ease,
    transform 0.35s ease,
    box-shadow 0.35s ease,
    opacity 0.35s ease;
}

/* Minimized state – slide down on desktop */
.user-popup.minimized {
  top: 70%; /* ~70% down the viewport */
  transform: translateY(-50%);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
  opacity: 0.9;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e0f7fa;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  transition:
    background 0.3s,
    transform 0.3s;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* Minimize button on the left */
.minimize-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  color: #e0f7fa;
  cursor: pointer;
  padding: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  transition:
    background 0.3s,
    transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(1px);
}

.minimize-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.user-popup h3 {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
  color: #4a90e2;
  text-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

@media (max-width: 600px) {
  .user-popup {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    transform: none;
    border-radius: 20px 20px 0 0;
    padding: 20px;
    animation: slideInMobile 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  /* On mobile, minimized = slide sheet further down */
  .user-popup.minimized {
    bottom: -60%; /* keep just a small strip visible */
    transform: none;
    opacity: 0.9;
  }

  @keyframes slideInMobile {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .close-btn {
    top: 10px;
    right: 10px;
  }

  .minimize-btn {
    top: 10px;
    left: 10px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes globePulse {
  0%,
  100% {
    box-shadow:
      0 0 25px rgba(0, 255, 230, 0.15),
      inset 0 0 20px rgba(0, 255, 230, 0.05);
  }
  50% {
    box-shadow:
      0 0 40px rgba(0, 255, 230, 0.25),
      inset 0 0 25px rgba(0, 255, 230, 0.1);
  }
}
</style>
