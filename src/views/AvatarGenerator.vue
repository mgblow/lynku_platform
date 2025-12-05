<template>
  <div class="avatar-generator-container">
    <!-- Header -->
    <div class="generator-header">
      <div class="header-content">
        <!-- AVATAR PREVIEW WITH SKELETON -->
        <div
          class="avatar-preview-large"
          :class="{ glowing: avatarLoaded }"
        >
          <!-- Shimmer skeleton while loading -->
          <div
            v-if="!avatarLoaded"
            class="avatar-skeleton"
          ></div>

          <!-- Real avatar (fades in when loaded) -->
          <img
            :src="avatarUrl"
            alt="Avatar Preview"
            class="preview-image"
            :class="{ 'preview-image--hidden': !avatarLoaded }"
            @load="onAvatarLoad"
            @error="onAvatarError"
          />

          <div class="preview-overlay">
            <button class="download-btn" @click="downloadAvatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              دانلود
            </button>
          </div>
        </div>

        <div class="header-text">
          <h1>جهش به دنیای متحرک و آرمانی بعدی شما</h1>
          <p>جایی که آواتارها ملاقات می‌کنند و دنیاها به هم می‌رسند</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="generator-content">
      <!-- Mood / Gender / Random -->
      <div class="mood-gender-bar">
        <div class="pill-group">
          <button
            v-for="g in genderOptions"
            :key="g.value"
            class="pill-btn"
            :class="{ active: selectedGender === g.value }"
            @click="selectedGender = g.value"
          >
            {{ g.label }}
          </button>
        </div>

        <div class="pill-group">
          <button
            v-for="m in moodOptions"
            :key="m.value"
            class="pill-btn"
            :class="{ active: selectedMood === m.value }"
            @click="selectedMood = m.value"
          >
            {{ m.label }}
          </button>
        </div>
        <br>
        <button class="random-avatar-generator-btn" @click="randomizeAvatar">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <!-- پس‌زمینه هاله نئونی -->
              <radialGradient id="raBgGrad1" cx="50%" cy="20%" r="60%">
                <stop offset="0%" stop-color="#ffffff22" />
                <stop offset="50%" stop-color="#5c13ff11" />
                <stop offset="100%" stop-color="#00000000" />
              </radialGradient>

              <!-- گرادیان خود دایس -->
              <linearGradient id="raDiceGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ff00ff" />
                <stop offset="50%" stop-color="#00f5ff" />
                <stop offset="100%" stop-color="#7cff00" />
              </linearGradient>

              <!-- درخشش بیرونی -->
              <filter id="raGlow1" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <!-- شاین اسلایدی روی دایس -->
              <linearGradient id="raShineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="rgba(255,255,255,0)" />
                <stop offset="50%" stop-color="rgba(255,255,255,0.9)" />
                <stop offset="100%" stop-color="rgba(255,255,255,0)" />
              </linearGradient>

              <clipPath id="raDiceClip1">
                <rect x="10" y="10" width="28" height="28" rx="8" ry="8" />
              </clipPath>
            </defs>

            <!-- هاله‌ی نرم پشت آیکن -->
            <circle cx="24" cy="24" r="20" fill="url(#raBgGrad1)" />

            <!-- دایس + نقطه‌ها -->
            <g filter="url(#raGlow1)">
              <rect
                x="10"
                y="10"
                width="28"
                height="28"
                rx="8"
                ry="8"
                fill="url(#raDiceGradient1)"
                stroke="#ffffff"
                stroke-width="1.2"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="2.4s"
                  repeatCount="indefinite"
                  values="-4 24 24;4 24 24;-4 24 24"
                  keyTimes="0;0.5;1"
                />
              </rect>

              <!-- پیت‌های تاس -->
              <circle cx="18" cy="18" r="2.2" fill="#050816" />
              <circle cx="30" cy="30" r="2.2" fill="#050816" />
              <circle cx="18" cy="30" r="2.2" fill="#050816" />
              <circle cx="30" cy="18" r="2.2" fill="#050816" />
              <circle cx="24" cy="24" r="2.4" fill="#050816" />
            </g>

            <!-- شاین روی سطح دایس -->
            <g clip-path="url(#raDiceClip1)">
              <rect
                x="-30"
                y="10"
                width="30"
                height="28"
                fill="url(#raShineGrad1)"
                opacity="0"
              >
                <animate
                  attributeName="x"
                  from="-30"
                  to="40"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0"
                  keyTimes="0;0.5;1"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>

            <!-- ستاره‌های نئونی اطراف -->
            <g>
              <circle cx="10" cy="15" r="1.2" fill="#00f5ff">
                <animate attributeName="r" values="1.2;2;1.2" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="37" cy="13" r="1.4" fill="#ff00ff">
                <animate attributeName="r" values="1.4;2.4;1.4" dur="2.1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.1s" repeatCount="indefinite" />
              </circle>
              <circle cx="38" cy="32" r="1.2" fill="#7cff00">
                <animate attributeName="r" values="1.2;2;1.2" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>

        </button>
      </div>

      <!-- Category Navigation -->
      <!-- Category Navigation -->
      <div class="category-nav">
        <button
          v-for="category in categories"
          :key="category.id"
          class="category-btn"
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
    <span class="category-icon-wrap">
      <svg viewBox="0 0 24 24" class="category-icon" aria-hidden="true">
        <path
          :d="category.iconPath"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
          <span class="category-label">
      {{ category.name }}
    </span>
        </button>
      </div>

      <!-- Options Grid -->
      <div class="options-container">
        <div class="options-section">
          <h3 class="section-title">{{ getCategoryTitle(activeCategory) }}</h3>

          <!-- Style Options -->
          <div v-if="activeCategory === 'style'" class="options-grid">
            <div
              v-for="style in avatarStyles"
              :key="style.value"
              class="option-card"
              :class="{ selected: avatarConfig.avatarStyle === style.value }"
              @click="updateConfig('avatarStyle', style.value)"
            >
              <div class="option-preview">
                <div class="style-preview" :class="style.value"></div>
              </div>
              <span class="option-label">{{ style.label }}</span>
            </div>
          </div>

          <!-- Top Options -->
          <div v-if="activeCategory === 'top'" class="options-grid">
            <div
              v-for="top in topTypes"
              :key="top.value"
              class="option-card"
              :class="{ selected: avatarConfig.topType === top.value }"
              @click="updateConfig('topType', top.value)"
            >
              <div class="option-preview">
                <img :src="generatePreviewUrl({ ...avatarConfig, topType: top.value })" alt="" />
              </div>
              <span class="option-label">{{ top.label }}</span>
            </div>
          </div>

          <!-- Accessories Options -->
          <div v-if="activeCategory === 'accessories'" class="options-grid">
            <div
              v-for="accessory in accessoriesTypes"
              :key="accessory.value"
              class="option-card"
              :class="{ selected: avatarConfig.accessoriesType === accessory.value }"
              @click="updateConfig('accessoriesType', accessory.value)"
            >
              <div class="option-preview">
                <img :src="generatePreviewUrl({ ...avatarConfig, accessoriesType: accessory.value })" alt="" />
              </div>
              <span class="option-label">{{ accessory.label }}</span>
            </div>
          </div>

          <!-- Hair Color Options -->
          <div v-if="activeCategory === 'hairColor'" class="options-grid">
            <div
              v-for="color in hairColors"
              :key="color.value"
              class="option-card"
              :class="{ selected: avatarConfig.hairColor === color.value }"
              @click="updateConfig('hairColor', color.value)"
            >
              <div class="option-preview">
                <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
              </div>
              <span class="option-label">{{ color.label }}</span>
            </div>
          </div>

          <!-- Facial Hair Options -->
          <div v-if="activeCategory === 'facialHair'" class="options-grid">
            <div
              v-for="facialHair in facialHairTypes"
              :key="facialHair.value"
              class="option-card"
              :class="{ selected: avatarConfig.facialHairType === facialHair.value }"
              @click="updateConfig('facialHairType', facialHair.value)"
            >
              <div class="option-preview">
                <img :src="generatePreviewUrl({ ...avatarConfig, facialHairType: facialHair.value })" alt="" />
              </div>
              <span class="option-label">{{ facialHair.label }}</span>
            </div>
          </div>

          <!-- Facial Hair Color Options -->
          <div v-if="activeCategory === 'facialHairColor'" class="options-grid">
            <div
              v-for="color in facialHairColors"
              :key="color.value"
              class="option-card"
              :class="{ selected: avatarConfig.facialHairColor === color.value }"
              @click="updateConfig('facialHairColor', color.value)"
            >
              <div class="option-preview">
                <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
              </div>
              <span class="option-label">{{ color.label }}</span>
            </div>
          </div>

          <!-- Clothes Options -->
          <div v-if="activeCategory === 'clothes'" class="options-grid">
            <div
              v-for="clothe in clotheTypes"
              :key="clothe.value"
              class="option-card"
              :class="{ selected: avatarConfig.clotheType === clothe.value }"
              @click="updateConfig('clotheType', clothe.value)"
            >
              <div class="option-preview">
                <img :src="generatePreviewUrl({ ...avatarConfig, clotheType: clothe.value })" alt="" />
              </div>
              <span class="option-label">{{ clothe.label }}</span>
            </div>
          </div>

          <!-- Clothe Color Options -->
          <div v-if="activeCategory === 'clotheColor'" class="options-grid">
            <div
              v-for="color in clotheColors"
              :key="color.value"
              class="option-card"
              :class="{ selected: avatarConfig.clotheColor === color.value }"
              @click="updateConfig('clotheColor', color.value)"
            >
              <div class="option-preview">
                <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
              </div>
              <span class="option-label">{{ color.label }}</span>
            </div>
          </div>

          <!-- Eyes Options -->
          <div v-if="activeCategory === 'eyes'" class="options-grid">
            <div
              v-for="eye in eyeTypes"
              :key="eye.value"
              class="option-card"
              :class="{ selected: avatarConfig.eyeType === eye.value }"
              @click="updateConfig('eyeType', eye.value)"
            >
              <div class="option-preview">
                <img :src="generatePreviewUrl({ ...avatarConfig, eyeType: eye.value })" alt="" />
              </div>
              <span class="option-label">{{ eye.label }}</span>
            </div>
          </div>

          <!-- Eyebrow Options -->
          <div v-if="activeCategory === 'eyebrow'" class="options-grid">
            <div
              v-for="eyebrow in eyebrowTypes"
              :key="eyebrow.value"
              class="option-card"
              :class="{ selected: avatarConfig.eyebrowType === eyebrow.value }"
              @click="updateConfig('eyebrowType', eyebrow.value)"
            >
              <div class="option-preview">
                <img :src="generatePreviewUrl({ ...avatarConfig, eyebrowType: eyebrow.value })" alt="" />
              </div>
              <span class="option-label">{{ eyebrow.label }}</span>
            </div>
          </div>

          <!-- Mouth Options -->
          <div v-if="activeCategory === 'mouth'" class="options-grid">
            <div
              v-for="mouth in mouthTypes"
              :key="mouth.value"
              class="option-card"
              :class="{ selected: avatarConfig.mouthType === mouth.value }"
              @click="updateConfig('mouthType', mouth.value)"
            >
              <div class="option-preview">
                <img :src="generatePreviewUrl({ ...avatarConfig, mouthType: mouth.value })" alt="" />
              </div>
              <span class="option-label">{{ mouth.label }}</span>
            </div>
          </div>

          <!-- Skin Options -->
          <div v-if="activeCategory === 'skin'" class="options-grid">
            <div
              v-for="skin in skinColors"
              :key="skin.value"
              class="option-card"
              :class="{ selected: avatarConfig.skinColor === skin.value }"
              @click="updateConfig('skinColor', skin.value)"
            >
              <div class="option-preview">
                <div class="skin-preview" :style="{ backgroundColor: skin.hex }"></div>
              </div>
              <span class="option-label">{{ skin.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-bar">
        <button class="action-btn secondary" @click="resetAvatar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            />
          </svg>
          بازنشانی
        </button>
        <button class="action-btn primary" @click="saveAvatar">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
            />
          </svg>
          ذخیره آواتار
        </button>
      </div>
    </div>

    <!-- Live Preview Modal -->
    <div v-if="showPreview" class="preview-modal" @click="showPreview = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>پیش‌نمایش آواتار</h3>
          <button class="close-btn" @click="showPreview = false">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <img :src="avatarUrl" alt="Avatar Preview" class="full-preview" />
        </div>
        <div class="modal-actions">
          <button class="action-btn secondary" @click="showPreview = false">
            بستن
          </button>
          <button class="action-btn primary" @click="downloadAvatar">
            دانلود
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/api'
import { getCookie } from '@/cookie'
import { emitter } from '@/utils/event-bus'

const router = useRouter()

const activeCategory = ref('style')
const showPreview = ref(false)
const isLoading = ref(false)
const avatarLoaded = ref(false)

// Avatar configuration
const avatarConfig = ref({
  avatarStyle: 'Circle',
  topType: 'ShortHairShortFlat',
  accessoriesType: 'Prescription02',
  hairColor: 'BrownDark',
  facialHairType: 'Blank',
  facialHairColor: 'BrownDark',
  clotheType: 'ShirtCrewNeck',
  clotheColor: 'Blue02',
  eyeType: 'Default',
  eyebrowType: 'Default',
  mouthType: 'Default',
  skinColor: 'Light'
})

// Categories
const categories = ref([
  {
    id: 'style',
    name: 'سبک',
    // ✨ Spark / Style – ستاره + دو اسپارک کوچک
    iconPath:
      'M12 3l1.3 3.4L17 7.7l-3.2 1.3L12 12l-1.8-3-3.2-1.3 3.7-1.3L12 3zM5.5 11L7 11.8 8.5 11l-.5 1.9 1 1.9-1.9-.8-1.9.8 1-1.9-.5-1.9zM18.5 11L20 11.8 21.5 11l-.5 1.9 1 1.9-1.9-.8-1.9.8 1-1.9-.5-1.9z'
  },
  {
    id: 'top',
    name: 'مو',
    // 💇 مو + فرم سر
    iconPath:
      'M7 16c0-3.7 2.1-6.5 5-6.5s5 2.8 5 6.5v1H7v-1zM7.4 11c.5-3 2.4-5 4.6-5 2.2 0 4.1 2 4.6 5 .1-2.4-.6-4.3-1.8-5.6C13.6 4.1 12.5 3.5 12 3.5s-1.6.6-2.8 1.9C7.9 6.7 7.3 8.6 7.4 11z'
  },
  {
    id: 'accessories',
    name: 'اکسسوری',
    // 👓 عینک گرد
    iconPath:
      'M5 11c0-1.8 1.4-3.2 3.2-3.2h1.1C11 7.8 12.5 9.2 12.5 11v1.1c0 1.8-1.4 3.2-3.2 3.2H8.2C6.4 15.3 5 13.9 5 12.1V11zm10.5 0c0-1.8 1.4-3.2 3.2-3.2h1.1c1.8 0 3.2 1.4 3.2 3.2v1.1c0 1.8-1.4 3.2-3.2 3.2h-1.1c-1.8 0-3.2-1.4-3.2-3.2V11zM11 12h2'
  },
  {
    id: 'hairColor',
    name: 'رنگ مو',
    // 💧 قطره رنگ مو
    iconPath:
      'M12 3.2L8.1 8.4a4.9 4.9 0 1 0 7.8 0L12 3.2zm0 10.4a2.5 2.5 0 0 1-2.5-2.5'
  },
  {
    id: 'facialHair',
    name: 'ریش',
    // 🧔‍♂️ سبیل نرم و پهن
    iconPath:
      'M4 13.2c1.2-1.3 2.6-2 4.2-2 1.5 0 2.9.6 3.8 1.5.9-.9 2.3-1.5 3.8-1.5 1.6 0 3 .7 4.2 2l-1.2 2.1c-.8-.8-1.8-1.3-2.8-1.3-1.1 0-2.2.4-3.1 1.1-.9-.7-2-1.1-3.1-1.1-1 0-2 .5-2.8 1.3L4 13.2z'
  },
  {
    id: 'facialHairColor',
    name: 'رنگ ریش',
    // 💧 رنگ + اشاره به ریش
    iconPath:
      'M9 5.2L6 9.4A4 4 0 0 0 9 16a4 4 0 0 0 3-6.6L9 5.2zm5.8 7.6c.7.6 1.5.9 2.4.9'
  },
  {
    id: 'clothes',
    name: 'لباس',
    // 👕 تیشرت
    iconPath:
      'M9 4l-2-1-3 3.5L6 10v9h12v-9l2-3.5L17 3l-2 1-3 1-3-1z'
  },
  {
    id: 'clotheColor',
    name: 'رنگ لباس',
    // 👕 + ستاره رنگ
    iconPath:
      'M9 4l-2-1-3 3.5L6 10v9h12v-9l2-3.5L17 3l-2 1-3 1-3-1zM17.2 5.3l.7 1.3 1.3.7-1.3.7-.7 1.3-.7-1.3-1.3-.7 1.3-.7.7-1.3z'
  },
  {
    id: 'eyes',
    name: 'چشم‌ها',
    // 👁 چشم با عنبیه
    iconPath:
      'M12 5C8 5 5 8 3 12c2 4 5 7 9 7s7-3 9-7c-2-4-5-7-9-7zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z'
  },
  {
    id: 'eyebrow',
    name: 'ابرو',
    // قوس ابرو
    iconPath:
      'M4 11c2.1-1.5 4.7-2.3 7.3-2.3S16.6 9.5 20 11l-1 2c-2.4-1.4-4.7-2.1-7.7-2.1S6.9 11.6 4 13l1-2z'
  },
  {
    id: 'mouth',
    name: 'دهان',
    // 🙂 لبخند
    iconPath:
      'M7 14c1.6 2.1 3.2 3.1 5 3.1S15.4 16.1 17 14l-1.6-1.1c-1.1 1.4-2.3 2.1-3.4 2.1s-2.3-.7-3.4-2.1L7 14z'
  },
  {
    id: 'skin',
    name: 'پوست',
    // 🙂 صورت / رنگ پوست
    iconPath:
      'M12 3a7 7 0 0 0-7 7v1a7 7 0 0 0 14 0v-1a7 7 0 0 0-7-7zm-3 7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm6 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-6.5 3c1.1.9 2.4 1.5 3.5 1.5s2.4-.6 3.5-1.5'
  }
])



// Mood / Gender options
const genderOptions = ref([
  { value: 'any', label: 'آزاد' },
  { value: 'male', label: 'پسر' },
  { value: 'female', label: 'دختر' }
])

const moodOptions = ref([
  { value: 'happy', label: 'شاد' },
  { value: 'sad', label: 'غمگین' },
  { value: 'angry', label: 'عصبانی' },
  { value: 'chill', label: 'ریلکس' }
])

const selectedGender = ref('any')
const selectedMood = ref('any')

// Options arrays with ref
const avatarStyles = ref([])
const topTypes = ref([])
const accessoriesTypes = ref([])
const hairColors = ref([])
const facialHairTypes = ref([])
const facialHairColors = ref([])
const clotheTypes = ref([])
const clotheColors = ref([])
const eyeTypes = ref([])
const eyebrowTypes = ref([])
const mouthTypes = ref([])
const skinColors = ref([])

// Computed avatar URL
const avatarUrl = computed(() => {
  const baseUrl = 'https://avataaars.io/'
  const params = new URLSearchParams(avatarConfig.value)
  return `${baseUrl}?${params.toString()}`
})

// Watch URL to show skeleton
watch(avatarUrl, () => {
  avatarLoaded.value = false
})

// Skeleton handlers
const onAvatarLoad = () => {
  avatarLoaded.value = true
}

const onAvatarError = () => {
  avatarLoaded.value = true
}

// API
const getAvatarPickConfig = async () => {
  try {
    const response = await post(
      '/api/v1',
      {
        topic: 'getAvatarPickConfig',
        data: {}
      },
      {
        token: getCookie('app-token')
      }
    )
    if (response && response.data.success) {
      return response.data.body
    } else {
      return null
    }
  } catch (error) {
    return null
  } finally {
    isLoading.value = false
  }
}

const updateConfig = (key, value) => {
  avatarConfig.value[key] = value
}

const generatePreviewUrl = (config) => {
  const baseUrl = 'https://avataaars.io/'
  const params = new URLSearchParams(config)
  return `${baseUrl}?${params.toString()}`
}

const getCategoryTitle = (categoryId) => {
  const category = categories.value.find((cat) => cat.id === categoryId)
  return category ? category.name : 'گزینه‌ها'
}

const resetAvatar = () => {
  avatarConfig.value = {
    avatarStyle: 'Circle',
    topType: 'ShortHairShortFlat',
    accessoriesType: 'Prescription02',
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    facialHairColor: 'BrownDark',
    clotheType: 'ShirtCrewNeck',
    clotheColor: 'Blue02',
    eyeType: 'Default',
    eyebrowType: 'Default',
    mouthType: 'Default',
    skinColor: 'Light'
  }
}

// 🔹 helper to pick random item safely
const randomItem = (arr) => {
  if (!arr || arr.length === 0) return null
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx]
}

// 🔹 Randomize avatar based on gender + mood
const randomizeAvatar = () => {
  const next = { ...avatarConfig.value }

  // ----- gender-based hair / top -----
  const allTop = topTypes.value.map((t) => t.value)

  const maleHair = [
    'ShortHairShortFlat',
    'ShortHairSides',
    'ShortHairTheCaesar',
    'ShortHairTheCaesarSidePart',
    'ShortHairShortRound',
    'ShortHairShortCurly',
    'ShortHairDreads01',
    'ShortHairDreads02',
    'ShortHairShaggyMullet'
  ]

  const femaleHair = [
    'LongHairStraight',
    'LongHairStraight2',
    'LongHairStraightStrand',
    'LongHairCurly',
    'LongHairBun',
    'LongHairBigHair',
    'LongHairBob',
    'LongHairNotTooLong',
    'LongHairFrida'
  ]

  let candidateTop = [...allTop]

  if (selectedGender.value === 'male') {
    candidateTop = allTop.filter(
      (v) =>
        maleHair.includes(v) ||
        v === 'NoHair' ||
        v === 'Hat' ||
        v.startsWith('WinterHat')
    )
  } else if (selectedGender.value === 'female') {
    candidateTop = allTop.filter(
      (v) =>
        femaleHair.includes(v) ||
        v === 'Hijab' ||
        v === 'LongHairFrida'
    )
  }

  if (candidateTop.length === 0) candidateTop = allTop
  if (candidateTop.length > 0) {
    next.topType = randomItem(candidateTop)
  }

  // accessories
  const accVals = accessoriesTypes.value.map((a) => a.value)
  if (accVals.length > 0) {
    next.accessoriesType = randomItem(accVals)
  }

  // hair color
  const hairVals = hairColors.value.map((c) => c.value)
  if (hairVals.length > 0) {
    next.hairColor = randomItem(hairVals)
  }

  // clothes
  const clothVals = clotheTypes.value.map((c) => c.value)
  if (clothVals.length > 0) {
    next.clotheType = randomItem(clothVals)
  }

  const clothColorVals = clotheColors.value.map((c) => c.value)
  if (clothColorVals.length > 0) {
    next.clotheColor = randomItem(clothColorVals)
  }

  // skin
  const skinVals = skinColors.value.map((s) => s.value)
  if (skinVals.length > 0) {
    next.skinColor = randomItem(skinVals)
  }

  // facial hair
  if (selectedGender.value === 'male') {
    const facialVals = facialHairTypes.value
      .map((f) => f.value)
      .filter((v) => v !== 'Blank')
    if (facialVals.length > 0 && Math.random() < 0.6) {
      next.facialHairType = randomItem(facialVals)
    } else {
      next.facialHairType = 'Blank'
    }
  } else {
    next.facialHairType = 'Blank'
  }

  // ----- mood presets -----
  const moodPresets = {
    happy: {
      eyeTypes: ['Happy', 'Default', 'Hearts'],
      mouthTypes: ['Smile', 'Default'],
      eyebrowTypes: ['Default', 'RaisedExcited', 'RaisedExcitedNatural']
    },
    sad: {
      eyeTypes: ['Cry', 'Squint'],
      mouthTypes: ['Sad', 'Serious', 'Disbelief'],
      eyebrowTypes: ['SadConcerned', 'SadConcernedNatural']
    },
    angry: {
      eyeTypes: ['Squint', 'Dizzy', 'EyeRoll'],
      mouthTypes: ['Serious', 'Grimace'],
      eyebrowTypes: ['Angry', 'AngryNatural']
    },
    chill: {
      eyeTypes: ['Default', 'Side', 'Wink', 'WinkWacky'],
      mouthTypes: ['Smile', 'Tongue', 'Default'],
      eyebrowTypes: ['Default', 'RaisedExcited', 'RaisedExcitedNatural']
    }
  }

  const availableEyes = eyeTypes.value.map((e) => e.value)
  const availableMouths = mouthTypes.value.map((m) => m.value)
  const availableBrows = eyebrowTypes.value.map((b) => b.value)

  if (selectedMood.value !== 'any' && moodPresets[selectedMood.value]) {
    const preset = moodPresets[selectedMood.value]

    const moodEyes = (preset.eyeTypes || []).filter((v) =>
      availableEyes.includes(v)
    )
    const moodMouths = (preset.mouthTypes || []).filter((v) =>
      availableMouths.includes(v)
    )
    const moodBrows = (preset.eyebrowTypes || []).filter((v) =>
      availableBrows.includes(v)
    )

    if (moodEyes.length > 0) next.eyeType = randomItem(moodEyes)
    else if (availableEyes.length > 0) next.eyeType = randomItem(availableEyes)

    if (moodMouths.length > 0) next.mouthType = randomItem(moodMouths)
    else if (availableMouths.length > 0) next.mouthType = randomItem(availableMouths)

    if (moodBrows.length > 0) next.eyebrowType = randomItem(moodBrows)
    else if (availableBrows.length > 0) next.eyebrowType = randomItem(availableBrows)
  } else {
    if (availableEyes.length > 0) next.eyeType = randomItem(availableEyes)
    if (availableMouths.length > 0) next.mouthType = randomItem(availableMouths)
    if (availableBrows.length > 0) next.eyebrowType = randomItem(availableBrows)
  }

  avatarConfig.value = next
}

const saveAvatar = async () => {
  try {
    localStorage.setItem('userAvatarConfig', JSON.stringify(avatarConfig.value))

    const response = await post(
      '/api/v1',
      {
        topic: 'updatePersonAvatar',
        data: avatarConfig.value
      },
      {
        token: getCookie('app-token')
      }
    )
    if (response && response.data.success) {
      emitter.emit('success-message', 'آواتارت با موفقیت ساخته شد')
      setTimeout(() => emitter.emit('success-message', 'میتونی با رفتن به تنظمیات اطلاعاتت رو تکمیل کنی'), 3000)
      emitter.emit('reload-me', true)
      router.push({ path: '/' })
    } else {
      emitter.emit('error-message', response.data.message)
    }
  } catch (error) {
    showError('خطا در ذخیره‌سازی آواتار')
  } finally {
    isLoading.value = false
  }
}

const downloadAvatar = async () => {
  try {
    const response = await fetch(avatarUrl.value)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'my-avatar.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    showError('خطا در دانلود آواتار')
  }
}

const showError = (message) => {
  alert(message)
}

// Initialize default options
const initializeDefaultOptions = () => {
  avatarStyles.value = [
    { value: 'Circle', label: 'دایره' },
    { value: 'Transparent', label: 'شفاف' }
  ]

  topTypes.value = [
    { value: 'NoHair', label: 'بدون مو' },
    { value: 'Eyepatch', label: 'چشم‌بند' },
    { value: 'Hat', label: 'کلاه' },
    { value: 'Hijab', label: 'حجاب' },
    { value: 'Turban', label: 'عمامه' },
    { value: 'WinterHat1', label: 'کلاه زمستانی ۱' },
    { value: 'WinterHat2', label: 'کلاه زمستانی ۲' },
    { value: 'WinterHat3', label: 'کلاه زمستانی ۳' },
    { value: 'WinterHat4', label: 'کلاه زمستانی ۴' },
    { value: 'LongHairBigHair', label: 'موی بلند حجیم' },
    { value: 'LongHairBob', label: 'بوب' },
    { value: 'LongHairBun', label: 'دم اسبی' },
    { value: 'LongHairCurly', label: 'فر' },
    { value: 'LongHairCurvy', label: 'موج دار' },
    { value: 'LongHairDreads', label: 'رشته‌ای' },
    { value: 'LongHairFrida', label: 'فریدا' },
    { value: 'LongHairFro', label: 'افرو' },
    { value: 'LongHairFroBand', label: 'افرو با باند' },
    { value: 'LongHairNotTooLong', label: 'نیمه بلند' },
    { value: 'LongHairShavedSides', label: 'طرفین تراشیده' },
    { value: 'LongHairMiaWallace', label: 'میا والاس' },
    { value: 'LongHairStraight', label: 'صاف' },
    { value: 'LongHairStraight2', label: 'صاف ۲' },
    { value: 'LongHairStraightStrand', label: 'رشته صاف' },
    { value: 'ShortHairDreads01', label: 'رشته کوتاه ۱' },
    { value: 'ShortHairDreads02', label: 'رشته کوتاه ۲' },
    { value: 'ShortHairFrizzle', label: 'مجعد' },
    { value: 'ShortHairShaggyMullet', label: 'شگی مولت' },
    { value: 'ShortHairShortCurly', label: 'فر کوتاه' },
    { value: 'ShortHairShortFlat', label: 'صاف کوتاه' },
    { value: 'ShortHairShortRound', label: 'گرد کوتاه' },
    { value: 'ShortHairShortWaved', label: 'موج کوتاه' },
    { value: 'ShortHairSides', label: 'طرفین' },
    { value: 'ShortHairTheCaesar', label: 'سزار' },
    { value: 'ShortHairTheCaesarSidePart', label: 'سزار با خط' }
  ]

  accessoriesTypes.value = [
    { value: 'Blank', label: 'هیچ‌کدام' },
    { value: 'Kurt', label: 'کلاه کورت' },
    { value: 'Prescription01', label: 'عینک ۱' },
    { value: 'Prescription02', label: 'عینک ۲' },
    { value: 'Round', label: 'عینک گرد' },
    { value: 'Sunglasses', label: 'عینک آفتابی' },
    { value: 'Wayfarers', label: 'عینک ویفرز' }
  ]
}

onMounted(async () => {
  initializeDefaultOptions()

  try {
    const response = await getAvatarPickConfig()

    const body = response?.data?.body || response
    const newAvatarConfig = body?.avatarPicks || response?.avatarPicks

    if (newAvatarConfig) {
      avatarStyles.value = newAvatarConfig.avatarStyles || avatarStyles.value
      topTypes.value = newAvatarConfig.topTypes || topTypes.value
      accessoriesTypes.value =
        newAvatarConfig.accessoriesTypes || accessoriesTypes.value
      hairColors.value = newAvatarConfig.hairColors || hairColors.value
      facialHairTypes.value =
        newAvatarConfig.facialHairTypes || facialHairTypes.value
      facialHairColors.value =
        newAvatarConfig.facialHairColors || facialHairColors.value
      clotheTypes.value = newAvatarConfig.clotheTypes || clotheTypes.value
      clotheColors.value = newAvatarConfig.clotheColors || clotheColors.value
      eyeTypes.value = newAvatarConfig.eyeTypes || eyeTypes.value
      eyebrowTypes.value = newAvatarConfig.eyebrowTypes || eyebrowTypes.value
      mouthTypes.value = newAvatarConfig.mouthTypes || mouthTypes.value
      skinColors.value = newAvatarConfig.skinColors || skinColors.value
    }

    const savedConfig = localStorage.getItem('userAvatarConfig')
    if (savedConfig) {
      avatarConfig.value = JSON.parse(savedConfig)
    }
  } catch (error) {
    console.error('Error loading avatar config:', error)
  }
})
</script>

<style scoped>
.avatar-generator-container {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #ffffff;
  padding: 20px;
  animation: slideUp 0.3s ease-out;
  border-radius: 16px;
}

.generator-header {
  background: #000000;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

/* AVATAR PREVIEW + SKELETON */
.avatar-preview-large {
  position: relative;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 8px #6a5af9, 0 0 16px #6a5af9 inset;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s.ease;
}

/* Hover interaction */
.avatar-preview-large:hover {
  transform: translateY(-6px) scale(1.04);
  box-shadow:
    0 0 20px rgba(255, 0, 255, 0.55),
    0 0 40px rgba(255, 0, 255, 0.35),
    inset 0 0 18px rgba(255, 0, 255, 0.25);
  border-color: #ff33ff;
}

/* Subtle breathing glow animation (when loaded) */
.avatar-preview-large.glowing {
  animation: avatarPulse 3s ease-in-out infinite;
}

@keyframes avatarPulse {
  0% {
    box-shadow:
      0 0 14px rgba(255, 0, 255, 0.35),
      0 0 28px rgba(255, 0, 255, 0.2),
      inset 0 0 12px rgba(255, 0, 255, 0.15);
    border-color: rgba(255, 0, 255, 0.9);
  }
  50% {
    box-shadow:
      0 0 24px rgba(255, 0, 255, 0.6),
      0 0 48px rgba(255, 0, 255, 0.35),
      inset 0 0 18px rgba(255, 0, 255, 0.25);
    border-color: #ff55ff;
  }
  100% {
    box-shadow:
      0 0 14px rgba(255, 0, 255, 0.35),
      0 0 28px rgba(255, 0, 255, 0.2),
      inset 0 0 12px rgba(255, 0, 255, 0.15);
    border-color: rgba(255, 0, 255, 0.9);
  }
}

/* Skeleton shimmer */
.avatar-skeleton {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid rgba(150, 150, 255, 0.35);
  background: linear-gradient(
    120deg,
    #0a0a1a 0%,
    #20206a 25%,
    #0a0a1a 50%,
    #20206a 75%,
    #0a0a1a 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
  box-shadow: 0 0 26px rgba(80, 80, 200, 0.55);
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.preview-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transition: opacity 0.3s ease-out;
}

.preview-image--hidden {
  opacity: 0;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-preview-large:hover .preview-overlay {
  opacity: 1;
}

.download-btn {
  background: linear-gradient(135deg, #000000 0%, #1a0a2a 50%, #cc00ff 100%);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(29, 161, 242, 0.4);
}

.download-btn svg {
  width: 16px;
  height: 16px;
}

.header-text h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1da1f2, #00ba7c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-text p {
  margin: 10px 0 0 0;
  color: #8899a6;
  font-size: 1.1rem;
}

.generator-content {
  background: #000000;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}

.category-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding-top: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
  text-align: center;
}

.category-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #333;
  border-radius: 5px;
  padding: 10px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  font-size: 0.9rem;
  width: 30%;
  text-align: center;
}

.category-btn:hover {
  background: rgba(29, 161, 242, 0.2);
  border-color: #1da1f2;
}

.category-btn.active {
  background: rgba(214, 0, 255, 0.08);
  box-shadow:
    0 0 8px rgba(214, 0, 255, 0.4),
    0 0 16px rgba(214, 0, 255, 0.25),
    inset 0 0 10px rgba(214, 0, 255, 0.15);
  transform: translateY(-4px) scale(1.02);
  border-color: #1da1f2;
  color: white;
}

.options-container {
  margin-bottom: 30px;
}

.section-title {
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.options-grid::-webkit-scrollbar {
  width: 6px;
}

.options-grid::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 3px;
}

.options-grid::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.options-grid::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.option-card {
  padding: 16px;
  border-radius: 14px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  transition: 0.25s ease;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
}

.option-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.08);
}

/* Selected (Premium Neon Glow) */
.option-card.selected {
  background: rgba(214, 0, 255, 0.08);
  box-shadow:
    0 0 8px rgba(214, 0, 255, 0.4),
    0 0 16px rgba(214, 0, 255, 0.25),
    inset 0 0 10px rgba(214, 0, 255, 0.15);
  transform: translateY(-4px) scale(1.02);
  animation: neonPulse 2.4s ease-in-out infinite;
}

@keyframes neonPulse {
  0% {
    box-shadow:
      0 0 8px rgba(214, 0, 255, 0.35),
      0 0 16px rgba(214, 0, 255, 0.2),
      inset 0 0 8px rgba(214, 0, 255, 0.12);
  }
  50% {
    box-shadow:
      0 0 14px rgba(214, 0, 255, 0.55),
      0 0 28px rgba(214, 0, 255, 0.3),
      inset 0 0 14px rgba(214, 0, 255, 0.18);
  }
  100% {
    box-shadow:
      0 0 8px rgba(214, 0, 255, 0.35),
      0 0 16px rgba(214, 0, 255, 0.2),
      inset 0 0 8px rgba(214, 0, 255, 0.12);
  }
}

.option-preview {
  width: 60px;
  height: 60px;
  margin: 0 auto 10px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.option-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.style-preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.style-preview.Circle {
  background: linear-gradient(180deg, #000000 0%, #1a0a2a 50%, #cc00ff 100%);
}

.style-preview.Transparent {
  background: linear-gradient(45deg, transparent 48%, #1da1f2 50%, transparent 52%);
}

.color-preview,
.skin-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #333;
}

.option-label {
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 500;
  display: block;
}

/* Mood / Gender bar */
.mood-gender-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  border-radius: 12px;
  padding: 12px 16px;
  background: radial-gradient(circle at 0 0, rgba(214, 0, 255, 0.1), transparent 60%),
  radial-gradient(circle at 100% 100%, rgba(0, 234, 255, 0.08), transparent 60%);
}

.pill-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.pill-label {
  font-size: 0.82rem;
  color: #9ca3af;
}

.pill-btn {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(15, 23, 42, 0.7);
  color: #e5e7eb;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.pill-btn:hover {
  border-color: #6a5af9;
  box-shadow: 0 0 10px rgba(106, 90, 249, 0.4);
}

.pill-btn.active {
  background: radial-gradient(circle, #6a5af9, #1e293b);
  border-color: #a855f7;
  box-shadow:
    0 0 10px rgba(168, 85, 247, 0.6),
    0 0 20px rgba(59, 130, 246, 0.4);
}

/* Random button inside mood bar */

.random-avatar-generator-btn{
  position: relative;
  padding: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  background: #0d0d0d;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: 0.3s ease;
  box-shadow: 0 0 8px #6a5af9, 0 0 16px #6a5af9 inset;
}

/* Quick actions */
.quick-actions-bar {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  font-size: 0.9rem;
}

.action-btn.primary {
  position: relative;
  padding: 12px 28px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  background: #0d0d0d;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: 0.3s ease;
  box-shadow: 0 0 8px #6a5af9, 0 0 16px #6a5af9 inset;
}

/* ✨ Neon Glow on Hover */
.action-btn.primary:hover {
  box-shadow:
    0 0 14px #6a5af9,
    0 0 28px #6a5af9,
    0 0 42px #6a5af9,
    0 0 60px #6a5af9;
  transform: translateY(-3px) scale(1.05);
}

/* 💡 Animated outer glow */
.action-btn.primary::after {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 12px;
  background: linear-gradient(45deg, #6a5af9, #00eaff, #ff00ff);
  z-index: -1;
  filter: blur(12px);
  opacity: 0.6;
  transition: 0.4s ease;
}

/* Stronger glow when hover */
.action-btn.primary:hover::after {
  filter: blur(20px);
  opacity: 1;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid #333;
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* Modal */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #000000;
  border-radius: 20px;
  padding: 30px;
  max-width: 90%;
  max-height: 90%;
  border: 1px solid #333;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;
}

.modal-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.5rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.full-preview {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 4px solid #1da1f2;
  box-shadow: 0 12px 40px rgba(29, 161, 242, 0.3);
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.category-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding: 12px 6px 4px;
  overflow-x: auto;
  justify-content: center;
}

.category-nav::-webkit-scrollbar {
  height: 4px;
}
.category-nav::-webkit-scrollbar-track {
  background: transparent;
}
.category-nav::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.8);
  border-radius: 999px;
}

/* pill button */
.category-btn {
  position: relative;
  min-width: 84px;
  padding: 8px 10px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.9));
  color: #e5e7eb;
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
  flex-shrink: 0;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 14px rgba(129, 140, 248, 0.6),
    0 0 24px rgba(56, 189, 248, 0.4);
  border-color: rgba(129, 140, 248, 0.9);
}

/* active state – neon */
.category-btn.active {
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.35), transparent 65%),
    radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.35), transparent 65%),
    rgba(15, 23, 42, 0.98);
  border-color: rgba(236, 72, 153, 0.9);
  box-shadow:
    0 0 10px rgba(236, 72, 153, 0.7),
    0 0 26px rgba(56, 189, 248, 0.6);
}

/* icon circle */
.category-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 0%, rgba(248, 250, 252, 0.18), transparent 60%);
  box-shadow:
    0 0 10px rgba(129, 140, 248, 0.7),
    inset 0 0 4px rgba(15, 23, 42, 0.9);
}

/* tiny glow pulse for active icon */
.category-btn.active .category-icon-wrap {
  animation: iconPulse 1.8s ease-in-out infinite;
}

.category-icon {
  width: 18px;
  height: 18px;
}

/* label */
.category-label {
  white-space: nowrap;
  font-weight: 500;
}

/* pulse animation */
@keyframes iconPulse {
  0% {
    box-shadow:
      0 0 8px rgba(236, 72, 153, 0.7),
      0 0 16px rgba(59, 130, 246, 0.4),
      inset 0 0 4px rgba(15, 23, 42, 0.9);
  }
  50% {
    box-shadow:
      0 0 14px rgba(236, 72, 153, 0.95),
      0 0 26px rgba(59, 130, 246, 0.7),
      inset 0 0 6px rgba(15, 23, 42, 1);
  }
  100% {
    box-shadow:
      0 0 8px rgba(236, 72, 153, 0.7),
      0 0 16px rgba(59, 130, 246, 0.4),
      inset 0 0 4px rgba(15, 23, 42, 0.9);
  }
}


/* Responsive Design */
@media (max-width: 768px) {
  .avatar-generator-container {
    padding: 10px;
  }

  .generator-header,
  .generator-content {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .category-nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .options-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }

  .quick-actions-bar {
    flex-direction: column;
  }

  .full-preview {
    width: 200px;
    height: 200px;
  }

  .modal-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .options-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .option-card {
    padding: 10px;
  }

  .option-preview {
    width: 50px;
    height: 50px;
  }
}
</style>
