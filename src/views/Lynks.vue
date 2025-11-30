<template>
  <div class="lynks-container container-fluid py-4">
    <!-- Search Bar -->
    <div class="d-flex justify-content-center mb-4">
      <input
        v-model="search"
        type="text"
        class="form-control form-control-lg bg-dark text-white border-0 rounded-pill shadow-sm lynks-search"
        placeholder="بین لینکیات بگرد..."
      />
    </div>

    <!-- Lynks Grid -->
    <div class="row g-3">
      <div
        v-for="u in filteredLynks"
        :key="u.uuid"
        class="col-6 col-sm-4 col-md-3 col-lg-2"
      >
        <div
          class="card h-100 text-center bg-dark bg-opacity-50 border-0 shadow-lg hover-scale-neon position-relative lynk-card"
          :class="u.online ? 'lynk-card-online' : 'lynk-card-offline'"
        >
          <!-- Avatar + Status -->
          <div class="position-relative d-flex justify-content-center mt-3">
            <!-- Glow ring -->
            <div
              :class="[
                'avatar-glow position-absolute rounded-circle',
                u.online ? 'avatar-glow-online' : 'avatar-glow-offline'
              ]"
            ></div>

            <!-- Avatar image from avatarConfig -->
            <img
              :src="avatarUrlFor(u)"
              class="rounded-circle border shadow-sm lynk-avatar"
              :class="u.online ? 'lynk-avatar-online' : 'lynk-avatar-offline'"
              alt="avatar"
            />

            <!-- Status Dot -->
            <span
              class="status-dot position-absolute"
              :class="u.online ? 'status-online' : 'status-offline'"
            ></span>
          </div>

          <!-- Nickname + UUID -->
          <div class="card-body p-1 mt-2">
            <h6 class="text-white mb-1 text-truncate">
              {{ u.nickname }}
            </h6>
            <p class="text-secondary mb-2 small text-truncate" style="direction: ltr">
              {{ shortUuid(u.uuid) }}
            </p>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-center gap-2">
              <!-- Open Private Globe -->
              <button
                class="btn pv-globe-button"
                type="button"
                @click.stop="openPrivate(u)"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="gradientPrivateGlobe" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#00FFFF" />
                      <stop offset="100%" stop-color="#0080FF" />
                    </linearGradient>
                    <filter id="glowPrivateGlobe" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <!-- Globe outline -->
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    fill="none"
                    stroke="url(#gradientPrivateGlobe)"
                    stroke-width="1.3"
                    filter="url(#glowPrivateGlobe)"
                  />

                  <!-- Latitude -->
                  <path
                    d="M5.2 11c1.5-1 3.3-1.5 5.8-1.5S15.3 10 16.8 11"
                    fill="none"
                    stroke="url(#gradientPrivateGlobe)"
                    stroke-width="0.8"
                    opacity="0.7"
                  />

                  <!-- Longitude -->
                  <path
                    d="M11 4.5c-1.8 1.7-2.7 3.7-2.7 6.5 0 2.8.9 4.8 2.7 6.5
                       1.8-1.7 2.7-3.7 2.7-6.5 0-2.8-.9-4.8-2.7-6.5z"
                    fill="none"
                    stroke="url(#gradientPrivateGlobe)"
                    stroke-width="0.8"
                    opacity="0.7"
                  />

                  <!-- Orbiting dot -->
                  <circle
                    cx="11"
                    cy="4"
                    r="1"
                    fill="url(#gradientPrivateGlobe)"
                    filter="url(#glowPrivateGlobe)"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 11 11"
                      to="360 11 11"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  <!-- Chat bubble -->
                  <path
                    d="M14.5 13.5h2.3c1.4 0 2.5 1.1 2.5 2.5v1.6c0 .9-.7 1.6-1.6 1.6h-1.3l-1.2.9c-.2.1-.4 0-.4-.2v-.7a2.7 2.7 0 0 1-2.3-2.6v-0.6c0-1.4 1.1-2.5 2.5-2.5z"
                    fill="rgba(0,0,0,0.85)"
                    stroke="url(#gradientPrivateGlobe)"
                    stroke-width="0.9"
                    filter="url(#glowPrivateGlobe)"
                  />
                  <circle cx="16" cy="16.2" r="0.5" fill="#00FFFF" />
                  <circle cx="17.4" cy="16.2" r="0.5" fill="#00FFFF" />
                  <circle cx="18.8" cy="16.2" r="0.5" fill="#00FFFF" />
                </svg>
              </button>

              <!-- Unlink -->
              <button
                class="btn unlink-globe-button"
                type="button"
                @click.stop="requestUnlink(u)"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="gradientUnlink" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#FF4B4B" />
                      <stop offset="100%" stop-color="#FF00FF" />
                    </linearGradient>
                    <filter id="glowUnlink" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <!-- Left chain segment -->
                  <path
                    d="M7 8.5l-2 2a3 3 0 0 0 0 4.2l1.3 1.3a3 3 0 0 0 4.2 0L12 14.5"
                    fill="none"
                    stroke="url(#gradientUnlink)"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    filter="url(#glowUnlink)"
                  />

                  <!-- Right chain segment -->
                  <path
                    d="M17 8.5l2 2a3 3 0 0 1 0 4.2l-1.3 1.3a3 3 0 0 1-4.2 0L12 13.5"
                    fill="none"
                    stroke="url(#gradientUnlink)"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    filter="url(#glowUnlink)"
                  />

                  <!-- Break mark -->
                  <path
                    d="M10.3 10.2l-1-1.7M13.7 10.2l1-1.7"
                    stroke="url(#gradientUnlink)"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    filter="url(#glowUnlink)"
                  />

                  <!-- Small burst lines -->
                  <line
                    x1="11.1"
                    y1="11.3"
                    x2="9.8"
                    y2="9.9"
                    stroke="url(#gradientUnlink)"
                    stroke-width="1"
                    stroke-linecap="round"
                    filter="url(#glowUnlink)"
                  >
                    <animate
                      attributeName="y2"
                      values="9.9;9.4;9.9"
                      dur="0.6s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <line
                    x1="12.9"
                    y1="11.3"
                    x2="14.2"
                    y2="9.9"
                    stroke="url(#gradientUnlink)"
                    stroke-width="1"
                    stroke-linecap="round"
                    filter="url(#glowUnlink)"
                  >
                    <animate
                      attributeName="y2"
                      values="9.9;9.4;9.9"
                      dur="0.6s"
                      repeatCount="indefinite"
                      begin="0.1s"
                    />
                  </line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredLynks.length === 0" class="text-center text-secondary mt-5">
      فعلاً لینکی اینجا نیست، یا سرچت زیادی سخت‌گیر شده 😅
    </div>

    <!-- Unlink Confirm Modal -->
    <div v-if="showUnlinkConfirm" class="unlink-backdrop" @click.self="cancelUnlink">
      <div class="unlink-modal">
        <div class="unlink-header">
          <h5>از این لینک بیایم بیرون؟</h5>
        </div>
        <div class="unlink-body">
          <p>
            اگه این لینک رو برداری، دیگه تو لیست لینکیات نیست و برای وصل شدن دوباره
            باید از اول ریکوئست بدی.
          </p>
          <p v-if="unlinkTarget" class="unlink-nick">
            طرف حساب: <span>{{ unlinkTarget.nickname }}</span>
          </p>
        </div>
        <div class="unlink-actions">
          <button type="button" class="btn btn-cancel" @click="cancelUnlink">
            بیخیال
          </button>
          <button type="button" class="btn btn-confirm" @click="confirmUnlink">
            آره، آن‌لینکش کن
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const search = ref('')

/**
 * PersonLynk DTO (با avatarConfig هم‌راستا با بقیه جاهای پروژه):
 *
 * {
 *   uuid: string;
 *   nickname: string;
 *   online: boolean;
 *   avatarConfig: { ... }
 * }
 */

const lynks = ref([
  {
    uuid: 'c92c2c5e-ae92-4b70-9ac2-4123abcd59ab',
    nickname: 'SkyWalker',
    online: true,
    avatarConfig: {
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
  },
  {
    uuid: 'ab23fa87-97df-11ee-b9d1-0242ac120002',
    nickname: 'Raven',
    online: false,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'LongHairCurly',
      accessoriesType: 'Blank',
      hairColor: 'Black',
      facialHairType: 'Blank',
      facialHairColor: 'Black',
      clotheType: 'Hoodie',
      clotheColor: 'Black',
      eyeType: 'Squint',
      eyebrowType: 'SadConcerned',
      mouthType: 'Serious',
      skinColor: 'Pale'
    }
  },
  {
    uuid: 'f9e2b1f0-12a3-4c5b-a6c1-9c2d3f8babc1',
    nickname: 'NeonGhost',
    online: true,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairTheCaesarSidePart',
      accessoriesType: 'Sunglasses',
      hairColor: 'Blue',
      facialHairType: 'MoustacheMagnum',
      facialHairColor: 'BrownDark',
      clotheType: 'BlazerShirt',
      clotheColor: 'Gray01',
      eyeType: 'Happy',
      eyebrowType: 'UpDown',
      mouthType: 'Smile',
      skinColor: 'Light'
    }
  },
  {
    uuid: 'd3a2f1b4-8e2c-49f1-9f7c-4c1a2b3c4d5e',
    nickname: 'CyberSam',
    online: true,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'ShortHairFrizzle',
      accessoriesType: 'Round',
      hairColor: 'Brown',
      facialHairType: 'BeardMedium',
      facialHairColor: 'BrownDark',
      clotheType: 'GraphicShirt',
      clotheColor: 'Red',
      eyeType: 'Default',
      eyebrowType: 'Default',
      mouthType: 'Default',
      skinColor: 'Brown'
    }
  },
  {
    uuid: 'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh78',
    nickname: 'LynkuBot',
    online: false,
    avatarConfig: {
      avatarStyle: 'Circle',
      topType: 'NoHair',
      accessoriesType: 'Kurt',
      hairColor: 'BrownDark',
      facialHairType: 'Blank',
      facialHairColor: 'BrownDark',
      clotheType: 'ShirtCrewNeck',
      clotheColor: 'Blue03',
      eyeType: 'EyeRoll',
      eyebrowType: 'RaisedExcited',
      mouthType: 'Smile',
      skinColor: 'Light'
    }
  }
])

const buildAvatarUrlFromConfig = (config) => {
  if (!config) return ''
  const params = new URLSearchParams({
    avatarStyle: config.avatarStyle,
    topType: config.topType,
    accessoriesType: config.accessoriesType,
    hairColor: config.hairColor,
    facialHairType: config.facialHairType,
    clotheType: config.clotheType,
    eyeType: config.eyeType,
    eyebrowType: config.eyebrowType,
    mouthType: config.mouthType,
    skinColor: config.skinColor
  })
  return process.env.VUE_APP_AVATAR_APP_URL + `/avatars?${params.toString()}`
}

const avatarUrlFor = (lynk) => {
  if (lynk.avatarUrl) return lynk.avatarUrl
  return buildAvatarUrlFromConfig(lynk.avatarConfig)
}

const filteredLynks = computed(() => {
  if (!search.value) return lynks.value
  const term = search.value.toLowerCase()
  return lynks.value.filter(
    (u) =>
      u.nickname.toLowerCase().includes(term) ||
      u.uuid.toLowerCase().includes(term)
  )
})

const shortUuid = (uuid) =>
  uuid ? uuid.substring(0, 8) + '...' : ''

// Navigate to private globe
const openPrivate = (user) => {
  router.push({
    name: 'PrivateGlobe',
    params: { uuid: user.uuid }
  })
}

/* Unlink confirmation logic */
const showUnlinkConfirm = ref(false)
const unlinkTarget = ref(null)

const requestUnlink = (user) => {
  unlinkTarget.value = user
  showUnlinkConfirm.value = true
}

const cancelUnlink = () => {
  showUnlinkConfirm.value = false
  unlinkTarget.value = null
}

const confirmUnlink = async () => {
  if (!unlinkTarget.value) return

  const targetUuid = unlinkTarget.value.uuid

  // اینجا جای کال API اصلیته، مثل:
  // await api.delete(`/api/lynks/${encodeURIComponent(targetUuid)}`)

  lynks.value = lynks.value.filter((l) => l.uuid !== targetUuid)

  showUnlinkConfirm.value = false
  unlinkTarget.value = null
}
</script>

<style scoped>
.lynks-container {
  margin-top: 45px;
  margin-bottom: 125px;
  border-radius: 16px;
}

/* Search bar */
.lynks-search {
  max-width: 520px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

/* Card base */
.lynk-card {
  border-radius: 16px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.lynk-card-online:hover {
  transform: scale(1.05);
  box-shadow:
    0 0 30px rgba(0, 255, 255, 0.45),
    inset 0 0 24px rgba(255, 255, 255, 0.1);
}

.lynk-card-offline:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.6);
}

/* Avatar */
.lynk-avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  z-index: 1;
  border-width: 2px;
}

.lynk-avatar-online {
  border-color: rgba(0, 255, 255, 0.8);
}

.lynk-avatar-offline {
  border-color: rgba(120, 120, 120, 0.7);
  filter: grayscale(0.8) brightness(0.8);
}

/* Avatar glow */
.avatar-glow {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  top: 0;
  left: 0;
  z-index: 0;
}

.avatar-glow-online {
  background: radial-gradient(circle at 50% 90%, #00ffff, #000);
  filter: blur(12px);
  animation: pulse-online 2s infinite ease-in-out;
}

.avatar-glow-offline {
  background: radial-gradient(circle at 50% 90%, #555, #000);
  filter: blur(10px);
  opacity: 0.3;
  animation: none;
}

/* Status dot */
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #111;
  transition: all 0.3s ease;
  top: 5px;
  right: 8px;
}

.status-online {
  background-color: #00ff9d;
  box-shadow: 0 0 8px rgba(0, 255, 157, 0.8);
}

.status-offline {
  background-color: #555;
  box-shadow: none;
}

/* Buttons */
.pv-globe-button,
.unlink-globe-button {
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fff;
  background: #0d0d0d;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  margin: 15px 6px 10px;
  box-shadow:
    0 0 8px rgba(106, 90, 255, 0.6),
    0 0 16px rgba(106, 90, 255, 0.3),
    inset 0 0 6px rgba(255, 0, 255, 0.15);
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 4px 6px;
}

.pv-globe-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 0 12px rgba(0, 255, 255, 0.9),
    0 0 24px rgba(0, 255, 255, 0.5),
    inset 0 0 8px rgba(0, 255, 255, 0.2);
}

.unlink-globe-button {
  box-shadow:
    0 0 8px rgba(255, 0, 0, 0.6),
    0 0 16px rgba(255, 0, 0, 0.4),
    inset 0 0 6px rgba(255, 0, 0, 0.25);
}

.unlink-globe-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 0 14px rgba(255, 0, 0, 0.9),
    0 0 26px rgba(255, 0, 0, 0.6),
    inset 0 0 8px rgba(255, 0, 0, 0.3);
}

/* Online pulse */
@keyframes pulse-online {
  0%, 100% {
    transform: scale(1);
    opacity: 0.55;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.95;
  }
}

/* Unlink modal */
.unlink-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 15, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.unlink-modal {
  width: min(360px, 90vw);
  background: #050511;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.85),
    0 0 40px rgba(255, 0, 128, 0.4);
  padding: 18px 18px 14px;
  color: #fff;
  animation: unlinkPop 0.2s ease-out;
}

.unlink-header h5 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
}

.unlink-body {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #c8c8d8;
}

.unlink-nick {
  margin-top: 6px;
  font-size: 0.85rem;
}

.unlink-nick span {
  color: #ffffff;
  font-weight: 600;
}

.unlink-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #ddd;
  border-color: rgba(255, 255, 255, 0.12);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
}

.btn-confirm {
  background: linear-gradient(135deg, #ff4b8b, #ff006f);
  color: #050510;
  box-shadow: 0 0 16px rgba(255, 0, 128, 0.7);
}

.btn-confirm:hover {
  box-shadow:
    0 16px 30px rgba(0, 0, 0, 0.8),
    0 0 28px rgba(255, 0, 128, 0.9);
  transform: translateY(-1px);
}

@keyframes unlinkPop {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
