<script setup>
import Gift from '@/components/Gift.vue'
import Publish from '@/views/Publish.vue'
import Person from '@/components/Person.vue'
import Ping from '@/components/Ping.vue'
import { onMounted, ref } from 'vue'
import { emitter } from '@/utils/event-bus'
import AvatarGenerator from '@/views/AvatarGenerator.vue'
import Settings from '@/views/Settings.vue'

const props = defineProps({
  selectedData: { type: Object, default: null }
})

const closePanel = (()=> {
  drawerData.value = {}
  emitter.emit('globe:pointOfView', { lat: 30, lng: 20, altitude: 3.5, transition: 1500 })
})

const drawerData = ref({})

onMounted(() => {
  emitter.on('drawer:publish', (data) => {
    drawerData.value = {
      ...data,
      type: 'publish',
    }
  })
  emitter.on('drawer:ping', (data) => {
    drawerData.value = {
      ...data,
      type: 'ping',
    }
  })
  emitter.on('drawer:gift', (data) => {
    drawerData.value = {
      ...data,
      type: 'gift',
    }
  })
  emitter.on('drawer:person', (data) => {
    drawerData.value = {
      ...data,
      type: 'person',
    }
  })
  emitter.on('drawer:avatarConfig', (data) => {
    drawerData.value = {
      ...data,
      type: 'avatarConfig',
    }
  })
  emitter.on('drawer:settings', (data) => {
    drawerData.value = {
      ...data,
      type: 'settings',
    }
  })



  emitter.on('drawer:close', () => {
    closePanel()
  })
})
</script>

<template>
  <Teleport to="body">
    <div class="user-popup" v-show="drawerData.type" v-if="drawerData.type">
      <button class="close-btn" @click="closePanel()">×</button>
      <AvatarGenerator v-if="drawerData.type === 'avatarConfig'"></AvatarGenerator>
      <Settings v-if="drawerData.type === 'settings'"></Settings>
      <Ping v-if="drawerData.type === 'ping'"></Ping>
      <Person v-if="drawerData.type === 'person'" :selectedData="drawerData"></Person>
      <Gift v-if="drawerData.type === 'gift'" :selectedData="drawerData"></Gift>
      <Publish v-if="drawerData.type === 'publish'" :location="drawerData"></Publish>
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
  animation: slideIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
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
  transition: background 0.3s, transform 0.3s;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.user-popup h3 {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
  color: #4a90e2; /* Primary blue */
  text-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

@media (max-width: 600px) {
  .user-popup {
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    transform: none; /* Override desktop transform */
    border-radius: 20px 20px 0 0;
    padding: 20px;
    animation: slideInMobile 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
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
    box-shadow: 0 0 25px rgba(0, 255, 230, 0.15), inset 0 0 20px rgba(0, 255, 230, 0.05);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 255, 230, 0.25), inset 0 0 25px rgba(0, 255, 230, 0.1);
  }
}
</style>