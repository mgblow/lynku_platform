<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCookie } from '@/cookie'
import { emitter } from '@/utils/event-bus'

const person = ref(null)

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

// Computed style toggle
const popupStyle = computed(() => ({
  display: props.visible ? 'block' : 'none'
}))

const goToGlobe = () => {
  router.push('/globes/' + person.value._id)
}

const appId = ref(null)
appId.value = getCookie('app-id')


onMounted(() => {

})

watch(
  () => props.selectedData,
  (newVal) => {
    person.value = newVal;
  },
  { immediate: true }
);


const generateAvatarUrl = (person) => {
  const params = new URLSearchParams({
    avatarStyle: person.avatarConfig.avatarStyle,
    topType: person.avatarConfig.topType,
    accessoriesType: person.avatarConfig.accessoriesType,
    hairColor: person.avatarConfig.hairColor,
    facialHairType: person.avatarConfig.facialHairType,
    clotheType: person.avatarConfig.clotheType,
    eyeType: person.avatarConfig.eyeType,
    eyebrowType: person.avatarConfig.eyebrowType,
    mouthType: person.avatarConfig.mouthType,
    skinColor: person.avatarConfig.skinColor
  })
  return process.env.VUE_APP_AVATAR_APP_URL + `/avatars?${params.toString()}`
}
</script>

<template>
  <div class="user-popup-content" :style="popupStyle">
    <img v-if="person" :src="generateAvatarUrl(person)" alt="Avatar" class="popup-avatar" @click="goToGlobe()" />
    <h3 v-if="person">{{ person._id }}</h3>
    <h3 v-if="person">{{ person.username }}</h3>
    <div class="person-hobbies" v-if="person.hobbies && person.hobbies.length">
      <div class="hobby-list">
      <span class="hobby-pill" v-for="h in person.hobbies" :key="h">
        {{ h }}
      </span>
      </div>
    </div>

    <button v-if="appId == null ||  person._id != appId" class="futuristic-button pb-2">
      <svg width="54" height="54" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34" cy="34" r="20" stroke="#fff" stroke-width="3">
          <animate attributeName="r" values="20;24;20" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>

        <circle cx="34" cy="34" r="10" fill="#fff">
          <animate attributeName="r" values="10;14;10" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <br>
      لینک
    </button>

    <div class="genz-actions" v-if="appId != null && appId == person._id">
      <!-- AVATAR — Premium neon avatar with dual halo + subtle easing -->
      <button class="futuristic-button" @click="router.push('/avatar')" aria-label="Avatar settings">
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="glowA-pro" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.35" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <!-- soft specular highlight for premium feel -->
            <radialGradient id="specA" cx="25%" cy="20%" r="60%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Head -->
          <circle cx="25" cy="18" r="8" fill="#ff33ff" filter="url(#glowA-pro)">
            <animate attributeName="r" values="8;9;8" dur="1.55s" repeatCount="indefinite" calcMode="spline" keySplines=".25 .1 .25 1;.25 .1 .25 1"/>
          </circle>
          <!-- subtle highlight -->
          <ellipse cx="23" cy="15" rx="6" ry="3" fill="url(#specA)" opacity=".35"/>

          <!-- Hair (sleeker curve) -->
          <path d="M17,17 Q25,9.8 33,17 Q25,13.8 17,17 Z" fill="#ffd457" filter="url(#glowA-pro)">
            <animateTransform attributeName="transform" type="scale" values="1;1.018;1" dur="2.1s" repeatCount="indefinite" calcMode="spline" keySplines=".42 0 .58 1;.42 0 .58 1"/>
          </path>

          <!-- Visor line (premium touch) -->
          <path d="M20 18.5 Q25 16.8 30 18.5" stroke="#00f6ff" stroke-width="1" fill="none" stroke-linecap="round" filter="url(#glowA-pro)" opacity=".9">
            <animate attributeName="opacity" values=".9;.6;.9" dur="2.4s" repeatCount="indefinite"/>
          </path>

          <!-- Neck -->
          <rect x="22" y="25" width="6" height="6" rx="2" ry="2" fill="#33ccff" filter="url(#glowA-pro)">
            <animate attributeName="y" values="25;24.3;25" dur="1.55s" repeatCount="indefinite"/>
          </rect>

          <!-- Shoulders (cleaner geometry) -->
          <path d="M15,35 Q25,25.2 35,35 L35,40 Q25,35.2 15,40 Z" fill="#33ccff" filter="url(#glowA-pro)">
            <animateTransform attributeName="transform" type="scale" values="1;1.02;1" dur="2.2s" repeatCount="indefinite"/>
          </path>

          <!-- Eyes -->
          <circle cx="22" cy="17" r="1.2" fill="#00ffff" filter="url(#glowA-pro)">
            <animate attributeName="r" values="1.2;1.45;1.2" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="28" cy="17" r="1.2" fill="#00ffff" filter="url(#glowA-pro)">
            <animate attributeName="r" values="1.2;1.45;1.2" dur="1s" repeatCount="indefinite"/>
          </circle>

          <!-- Smile -->
          <path d="M21,21 Q25,23 29,21" stroke="#ff33ff" stroke-width="1" fill="none" filter="url(#glowA-pro)">
            <animateTransform attributeName="transform" type="translate" values="0 0;0 0.45;0 0" dur="2s" repeatCount="indefinite"/>
          </path>

          <!-- Dual Halos (counter-rotate for premium depth) -->
          <circle cx="25" cy="18" r="12" stroke="#00f0ff" stroke-width="1" fill="none" filter="url(#glowA-pro)" opacity=".9">
            <animateTransform attributeName="transform" type="rotate" from="0 25 18" to="360 25 18" dur="4.6s" repeatCount="indefinite"/>
          </circle>
          <circle cx="25" cy="18" r="9.5" stroke="#9af9ff" stroke-width="0.8" fill="none" filter="url(#glowA-pro)" opacity=".5">
            <animateTransform attributeName="transform" type="rotate" from="0 25 18" to="-360 25 18" dur="6.2s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </button>

      <!-- ITEMS — Premium gem cut + orbiting chips + ribbon pulse -->
      <button class="futuristic-button" @click="router.push('/gems')" aria-label="Gifts and items">
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="glowG-pro" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.25" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Orbit (subtle) -->
          <circle cx="25" cy="25" r="16" stroke="#66f2ff" stroke-width="0.6" fill="none" opacity="0.25">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="11s" repeatCount="indefinite"/>
          </circle>

          <!-- Premium Gem (faceted) -->
          <g filter="url(#glowG-pro)">
            <polygon points="25,12 34,19 30,32 20,32 16,19" fill="#7de8ff"/>
            <polyline points="25,12 34,19 30,32 20,32 16,19 25,12" fill="none" stroke="#c7f7ff" stroke-width="1"/>
            <polyline points="25,12 27,20 20,32" fill="none" stroke="#eaffff" stroke-width="0.8" opacity=".8"/>
            <polyline points="34,19 27,20 30,32" fill="none" stroke="#eaffff" stroke-width="0.8" opacity=".8"/>
            <animateTransform attributeName="transform" type="scale" values="1;1.03;1" dur="1.9s" repeatCount="indefinite"/>
          </g>

          <!-- Orbiting chips (tokens) -->
          <g fill="#fff3d1" filter="url(#glowG-pro)">
            <circle cx="25" cy="9" r="1.4">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="6s" repeatCount="indefinite"/>
            </circle>
            <circle cx="41" cy="25" r="1.4">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="-360 25 25" dur="7s" repeatCount="indefinite"/>
            </circle>
            <circle cx="25" cy="41" r="1.4">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="5.2s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- Ribbon pulse (reward vibe) -->
          <path d="M18 36 H32" stroke="#ffd98a" stroke-width="1.2" filter="url(#glowG-pro)">
            <animate attributeName="stroke-width" values="1.2;2;1.2" dur="1.6s" repeatCount="indefinite"/>
          </path>
        </svg>
      </button>

      <!-- LYNKS — Premium dimensional portal + twin avatars + particle flow -->
      <button class="futuristic-button" @click="router.push('/lynks')" aria-label="Relations">
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="glowL-rings" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Left ring -->
          <circle cx="20" cy="25" r="9" fill="none" stroke="#00ffff" stroke-width="1.4" filter="url(#glowL-rings)" opacity=".9">
            <animateTransform attributeName="transform" type="rotate" from="0 20 25" to="360 20 25" dur="6.5s" repeatCount="indefinite"/>
          </circle>
          <!-- Right ring -->
          <circle cx="30" cy="25" r="9" fill="none" stroke="#00ff88" stroke-width="1.4" filter="url(#glowL-rings)" opacity=".9">
            <animateTransform attributeName="transform" type="rotate" from="0 30 25" to="-360 30 25" dur="6.5s" repeatCount="indefinite"/>
          </circle>

          <!-- Link overlap highlight -->
          <ellipse cx="25" cy="25" rx="4.2" ry="2.2" fill="none" stroke="#ff79e3" stroke-width="1.1" filter="url(#glowL-rings)" opacity=".95">
            <animate attributeName="rx" values="4.2;5.2;4.2" dur="2.2s" repeatCount="indefinite"/>
          </ellipse>

          <!-- Traveling node across both rings -->
          <g filter="url(#glowL-rings)">
            <circle cx="20" cy="16" r="1.5" fill="#ff00cc">
              <animateTransform attributeName="transform" type="rotate" from="0 20 25" to="360 20 25" dur="3.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="30" cy="34" r="1.5" fill="#ff00cc">
              <animateTransform attributeName="transform" type="rotate" from="0 30 25" to="-360 30 25" dur="3.2s" repeatCount="indefinite"/>
            </circle>
          </g>
        </svg>
      </button>



    </div>


  </div>
</template>

<style scoped>
.user-popup-content {
  backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 22px;
  color: white;
  text-align: center;
  box-shadow: 0 0 30px rgba(0, 0, 40, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 35px;
  height: fit-content;
  background: rgba(0, 0, 20, 0.55);
  border: 1px solid rgba(100, 100, 255, 0.25);
  overflow: hidden;
}
.user-popup-content h3{
    width: 100%;
  font-size: 1rem;
  letter-spacing: 1px;
}
.popup-avatar {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 3px solid rgba(150, 150, 255, 0.5);
  margin-bottom: 10px;
  box-shadow: 0 0 30px rgba(120, 120, 255, 0.3);
}

.city {
  font-size: 14px;
  opacity: 0.9;
}

/* 🌌 Cosmic Button */
.cosmic-btn {
  padding: 0 3px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: bold;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(255, 150, 255, 0.4),
  0 0 30px rgba(80, 80, 255, 0.3);
  transition: 0.25s ease;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
  width: fit-content;
  margin: 15px 8px;
}

.cosmic-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255, 150, 255, 0.7),
  0 0 40px rgba(80, 80, 255, 0.5);
  filter: brightness(1.15);
}

.coords {
  font-size: 12px;
  color: #aaa;
}

.uid {
  font-size: 18px;
  margin-top: 10px;
}

.username {
  font-size: 20px;
  font-weight: 600;
  color: #cfcfff;
}

.person-card {
  max-width: 450px;
  padding: 20px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
  margin: 20px auto;
  font-family: "Inter", sans-serif;
}

.person-title {
  margin: 0 0 12px;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.person-info p {
  margin: 6px 0;
  font-size: 1rem;
  color: #444;
}

.person-hobbies h3 {
  margin-top: 16px;
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #222;
}

.hobby-list {
  flex-wrap: wrap;
  gap: 8px;
  text-align: center;
}

.hobby-pill {
  padding: 4px 9px;
  background-color: #0a0a0a;
  color: #ffffff;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid #dbe3ff;
  transition: all 0.2s ease-in-out;
  display: inline-block;
  margin: 2px 5px;
}

.hobby-pill:hover {
  background-color: #dbe3ff;
  cursor: default;
}


.futuristic-button {
  padding: 7px 7px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fff;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a2a 90%, #6a00ff 130%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  width: fit-content;
  margin: 15px 8px;
  box-shadow:
    0 0 8px rgba(106, 90, 255, 0.6),
    0 0 16px rgba(106, 90, 255, 0.4),
    inset 0 0 6px rgba(255, 0, 255, 0.2);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Neon pulse on hover */
.futuristic-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(106,90,255,0.4) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 50%;
  pointer-events: none;
}

.futuristic-button:hover::before {
  opacity: 1;
}

.futuristic-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 0 12px rgba(106, 90, 255, 0.8),
    0 0 28px rgba(106, 90, 255, 0.6),
    inset 0 0 10px rgba(255, 0, 255, 0.25);
}

/* Optional active click effect */
.futuristic-button:active {
  transform: translateY(1px) scale(0.98);
  box-shadow:
    0 0 6px rgba(106, 90, 255, 0.5),
    0 0 12px rgba(106, 90, 255, 0.3),
    inset 0 0 5px rgba(255, 0, 255, 0.15);
}

</style>
