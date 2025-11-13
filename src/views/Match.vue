<template>
  <div class="match-container">
    <div ref="globeContainer" class="globe"></div>

    <!-- Discovery Button -->
    <transition name="fade">
      <button
        v-if="!isSpinning && !avatarsVisible"
        class="action-btn"
        @click="triggerDiscovery"
      >
        🚀 کشف تصادفی
      </button>
    </transition>

    <!-- Profile Info Panel -->
    <transition name="slide-up">
      <div v-if="selectedAvatar" class="info-panel">
        <button class="close-btn" @click="selectedAvatar = null">×</button>
        <div class="info-avatar">
          <img :src="selectedAvatar.img" :alt="selectedAvatar.name" />
        </div>
        <h3>{{ selectedAvatar.name }}</h3>
        <p>{{ selectedAvatar.bio }}</p>
        <div class="info-actions">
          <button class="like-btn">❤️ پسند</button>
          <button class="chat-btn">💬 گفتگو</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Globe from "globe.gl";

const globeContainer = ref(null);
const isSpinning = ref(false);
const avatarsVisible = ref(false);
const selectedAvatar = ref(null);
let globe;

// Dummy avatars
const avatars = [
  { id: 1, name: "Sara", lat: 48.8566, lng: 2.3522, img: "https://i.pravatar.cc/120?img=11", bio: "📍 پاریس، عاشق سفر و موسیقی." },
  { id: 2, name: "Reza", lat: 35.6892, lng: 51.389, img: "https://i.pravatar.cc/120?img=12", bio: "🌍 اهل ماجراجویی و عاشق کوه‌نوردی." },
  { id: 3, name: "Mina", lat: 40.7128, lng: -74.006, img: "https://i.pravatar.cc/120?img=13", bio: "🗽 اهل نیویورک، دوست‌دار گربه‌ها و قهوه." },
  { id: 4, name: "John", lat: 34.0522, lng: -118.2437, img: "https://i.pravatar.cc/120?img=14", bio: "🌴 عاشق موج‌سواری در لس‌آنجلس." },
  { id: 5, name: "Yuki", lat: 35.6895, lng: 139.6917, img: "https://i.pravatar.cc/120?img=15", bio: "🍣 اهل توکیو، شیفته طراحی و فناوری." }
];

onMounted(() => {
  globe = Globe()(globeContainer.value)
    .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
    .backgroundColor("rgba(0,0,0,0)")
    .pointOfView({ lat: 20, lng: 0, altitude: 2.5 });

  const controls = globe.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;
});

const triggerDiscovery = () => {
  isSpinning.value = true;
  avatarsVisible.value = false;

  const controls = globe.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 8; // fast spin

  // After 7 seconds → stop & show avatars
  setTimeout(() => {
    controls.autoRotateSpeed = 0;
    isSpinning.value = false;
    avatarsVisible.value = true;
    showAvatars();
  }, 7000);
};

function showAvatars() {
  globe.htmlElementsData(avatars)
    .htmlElement((d) => {
      const el = document.createElement("div");
      el.className = "avatar-pin";
      el.innerHTML = `<img src="${d.img}" title="${d.name}" />`;
      el.addEventListener("click", () => {
        selectedAvatar.value = d;
      });
      return el;
    });
}
</script>

<style scoped>
.match-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: radial-gradient(circle at 50% 40%, #001018, #000);
  overflow: hidden;
}

.globe {
  width: 100%;
  height: 100%;
}

/* Avatars on globe */
.avatar-pin {
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.avatar-pin img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #1da1f2;
  box-shadow: 0 0 15px rgba(29, 155, 240, 0.6);
}
.avatar-pin:hover {
  transform: translate(-50%, -50%) scale(1.3);
}

/* Button */
.action-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #1da1f2, #0d8ddb);
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 14px 28px;
  border: none;
  border-radius: 50px;
  box-shadow: 0 0 25px rgba(29, 155, 240, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}
.action-btn:hover {
  background: linear-gradient(135deg, #0d8ddb, #1da1f2);
  transform: translateX(-50%) scale(1.08);
}

/* Info Panel */
.info-panel {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 340px;
  background: rgba(18, 25, 38, 0.95);
  color: #fff;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 5px 25px rgba(29, 155, 240, 0.3);
  backdrop-filter: blur(10px) brightness(1.2);
  animation: slideUp 0.6s ease;
}

.close-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
}
.close-btn:hover {
  color: #fff;
}

.info-avatar img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #1da1f2;
  box-shadow: 0 0 10px rgba(29, 155, 240, 0.6);
}

.info-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
.like-btn, .chat-btn {
  background: linear-gradient(135deg, #1da1f2, #0d8ddb);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}
.like-btn:hover { background: linear-gradient(135deg, #ff3366, #ff6699); }
.chat-btn:hover { background: linear-gradient(135deg, #2ecc71, #27ae60); }

@keyframes slideUp {
  from { transform: translate(-50%, 100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
