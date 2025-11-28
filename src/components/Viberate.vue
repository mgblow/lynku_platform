<template>
  <button @click="vibrateDevice" class="vibrate-btn">
    Vibrate Device
  </button>
</template>

<script setup>
const vibrateDevice = () => {
  if (navigator.vibrate) {
    // Vibrate for 200 milliseconds
    navigator.vibrate(200);
  } else {
    alert("Vibration not supported on this device/browser.");
  }
};
</script>

<style scoped>
.vibrate-btn {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s;
}
.vibrate-btn:active {
  transform: scale(0.95);
}
</style>
