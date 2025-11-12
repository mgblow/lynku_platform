<template>
  <div
    ref="orb"
    class="floating-orb"
    :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
    @mousedown.prevent="startDrag"
    @touchstart.prevent="startDrag"
  >
    <div class="orb-core"></div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'

export default {
  name: 'FloatingOrb',
  setup() {
    const orb = ref(null)
    const pos = reactive({ x: 100, y: 100 }) // initial position
    const isDragging = ref(false)
    const offset = reactive({ x: 0, y: 0 })

    const startDrag = (e) => {
      isDragging.value = true
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
      offset.x = clientX - pos.x
      offset.y = clientY - pos.y

      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      document.addEventListener('touchmove', onDrag)
      document.addEventListener('touchend', stopDrag)
    }

    const onDrag = (e) => {
      if (!isDragging.value) return
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
      pos.x = clientX - offset.x
      pos.y = clientY - offset.y
    }

    const stopDrag = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.removeEventListener('touchmove', onDrag)
      document.removeEventListener('touchend', stopDrag)
    }

    onMounted(() => {
      orb.value.style.position = 'fixed'
      orb.value.style.zIndex = 9999
    })

    return { orb, pos, startDrag }
  }
}
</script>

<style scoped>
.floating-orb {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #000, #444);
  border: 2px solid rgba(29, 155, 240, 0.8);
  cursor: grab;
  box-shadow: 0 0 20px rgba(29, 155, 240, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.floating-orb:active {
  cursor: grabbing;
  transform: scale(1.1);
}

.orb-core {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  animation: corePulse 2s ease-in-out infinite;
}

@keyframes corePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
