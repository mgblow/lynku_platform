<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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


onMounted(() => {
  console.log("person.value......", person)
})

watch(
  () => props.selectedData,
  (newVal) => {
    person.value = newVal;
    console.log("UPDATED PERSON", person.value);
  },
  { immediate: true }
);


const generateRandomAvatar = (person) => {
  console.log('===========', person)
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
    <img v-if="person" :src="generateRandomAvatar(person)" alt="Avatar" class="popup-avatar" @click="goToGlobe()" />
    <h3 v-if="person">{{ person._id }}</h3>
    <h3 v-if="person">{{ person.username }}</h3>
    <div class="person-hobbies" v-if="person.hobbies && person.hobbies.length">
      <div class="hobby-list">
      <span class="hobby-pill" v-for="h in person.hobbies" :key="h">
        {{ h }}
      </span>
      </div>
    </div>
    <button class="cosmic-btn">
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="34" cy="34" r="20" stroke="#fff" stroke-width="3">
          <animate attributeName="r" values="20;24;20" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
        </circle>

        <circle cx="34" cy="34" r="10" fill="#fff">
          <animate attributeName="r" values="10;14;10" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
      درخواست لینک
    </button>
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
  width: 80%;
  height: fit-content;
  background: rgba(0, 0, 20, 0.55);
  border: 1px solid rgba(100, 100, 255, 0.25);
  overflow: hidden;
}
.user-popup-content h3{
    width: 100%;
  font-size: 1.1rem;
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
  margin-top: 16px;
  width: 90%;
  padding: 0;
  border-radius: 12px;
  font-size: 16px;
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
}

.hobby-pill {
  padding: 4px 9px;
  background-color: #f0f4ff;
  color: #3f51b5;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid #dbe3ff;
  transition: all 0.2s ease-in-out;
}

.hobby-pill:hover {
  background-color: #dbe3ff;
  cursor: default;
}

</style>
