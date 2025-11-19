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
      <!-- پروفایل من -->
      <button class="futuristic-button" @click="router.push('/avatar')">
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Head -->
          <circle cx="25" cy="18" r="8" fill="#ff33ff" filter="url(#neonGlow)">
            <animate attributeName="r" values="8;9;8" dur="1.5s" repeatCount="indefinite"/>
          </circle>

          <!-- Hair (stylized top) -->
          <path d="M17,17 Q25,10 33,17 Q25,14 17,17 Z" fill="#ffcc00" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="scale" values="1;1.02;1" dur="2s" repeatCount="indefinite" additive="sum"/>
          </path>

          <!-- Neck -->
          <rect x="22" y="25" width="6" height="6" fill="#33ccff" rx="2" ry="2" filter="url(#neonGlow)">
            <animate attributeName="y" values="25;24;25" dur="1.5s" repeatCount="indefinite"/>
          </rect>

          <!-- Shoulders / Torso -->
          <path d="M15,35 Q25,25 35,35 L35,40 Q25,35 15,40 Z" fill="#33ccff" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="scale" values="1;1.03;1" dur="2s" repeatCount="indefinite" additive="sum"/>
          </path>

          <!-- Eyes -->
          <circle cx="22" cy="17" r="1.2" fill="#0ff" filter="url(#neonGlow)">
            <animate attributeName="r" values="1.2;1.5;1.2" dur="1s" repeatCount="indefinite"/>
          </circle>
          <circle cx="28" cy="17" r="1.2" fill="#0ff" filter="url(#neonGlow)">
            <animate attributeName="r" values="1.2;1.5;1.2" dur="1s" repeatCount="indefinite"/>
          </circle>

          <!-- Mouth -->
          <path d="M21,21 Q25,23 29,21" stroke="#ff33ff" stroke-width="1" fill="none" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="translate" values="0 0;0 0.5;0 0" dur="2s" repeatCount="indefinite"/>
          </path>

          <!-- Neon Halo / Outline -->
          <circle cx="25" cy="18" r="12" stroke="#0ff" stroke-width="1" fill="none" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="rotate" from="0 25 18" to="360 25 18" dur="4s" repeatCount="indefinite"/>
          </circle>
        </svg>

      </button>

      <!-- تنظیمات -->
      <button class="futuristic-button" @click="this.router.push('/gems')">
        <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <!-- Avatar Head -->
          <circle cx="25" cy="25" r="8" fill="#ff00ff" filter="url(#neonGlow)">
            <animate attributeName="r" values="8;9;8" dur="1.5s" repeatCount="indefinite"/>
          </circle>

          <!-- Hair icon -->
          <path d="M17,20 Q25,10 33,20" stroke="#0ff" stroke-width="2" fill="none" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="3s" repeatCount="indefinite"/>
          </path>

          <!-- Eyes icon -->
          <circle cx="21" cy="25" r="1.5" fill="#0f0" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="-360 25 25" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="29" cy="25" r="1.5" fill="#0f0" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="-360 25 25" dur="2.5s" repeatCount="indefinite"/>
          </circle>

          <!-- Clothes icon (shirt) -->
          <rect x="22" y="32" width="6" height="5" fill="#00f" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="4s" repeatCount="indefinite"/>
          </rect>

          <!-- Accessory icon (tiny circle) -->
          <circle cx="25" cy="15" r="1.5" fill="#ff0" filter="url(#neonGlow)">
            <animateTransform attributeName="transform" type="translate" values="0,0;5,-5;0,0" dur="1.2s" repeatCount="indefinite"/>
          </circle>

          <!-- Small decorative orbiting dots -->
          <circle cx="10" cy="25" r="1" fill="#0ff">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="3.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="40" cy="25" r="1" fill="#0ff">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="-360 25 25" dur="3.5s" repeatCount="indefinite"/>
          </circle>
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  text-align: center;
}

.hobby-pill {
  padding: 4px 9px;
  background-color: #f0f4ff;
  color: #3f51b5;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid #dbe3ff;
  transition: all 0.2s ease-in-out;
  display: inline;
}

.hobby-pill:hover {
  background-color: #dbe3ff;
  cursor: default;
}


.futuristic-button {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fff;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a2a 60%, #6a00ff 100%);
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
