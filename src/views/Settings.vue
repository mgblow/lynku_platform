<template>
  <div class="lynku-settings">
    <!-- ===== HEADER: AVATAR + USER + ACTIONS ===== -->
    <header class="settings-header">
      <div class="header-main">
        <!-- Avatar -->
        <div class="avatar-wrapper" :class="{ glowing: !isAvatarLoading }">
          <div v-if="isAvatarLoading" class="avatar-skeleton">
            <div class="avatar-skeleton-inner"></div>
          </div>
          <img
            v-show="!isAvatarLoading"
            :src="avatarUrl"
            alt="Avatar"
            class="avatar-img"
            @load="handleAvatarLoad"
            @error="handleAvatarError"
          />
        </div>
      </div>
      <!-- Title + Username -->
      <div class="header-text">
        <div class="header-title">
          <h1>فضای شخصی لینکویی تو ✨</h1>
          <p>آواتار، مود، علایق و تنظیمات حضورت تو جهان Lynku</p>
        </div>

        <div class="header-username">
          <label>نام کاربری</label>
          <div class="username-row">
            <span class="username-prefix">@</span>
            <input
              v-model="userProfile.username"
              type="text"
              class="username-input"
              placeholder="مثلاً mojtabaa یا luna.world"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- ===== MAIN LAYOUT ===== -->
    <div class="settings-layout">
      <!-- LEFT NAV -->
      <nav class="settings-nav">
        <div class="nav-label">بخش‌ها</div>
        <div class="nav-list">
          <button
            v-for="section in sections"
            :key="section.id"
            class="nav-item"
            :class="{ active: activeSection === section.id }"
            @click="activeSection = section.id"
          >
            <div class="nav-icon">
              <!-- icons (no JSX) -->
              <svg v-if="section.id === 'profile'" viewBox="0 0 24 24">
                <path
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-4 0-7 1.79-7 4v1h14v-1c0-2.21-3-4-7-4z"
                />
              </svg>

              <svg v-else-if="section.id === 'interests'" viewBox="0 0 24 24">
                <path
                  d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 0 1 6.5 4 5 5 0 0 1 12 6a5 5 0 0 1 5.5-2 4.5 4.5 0 0 1 4.5 4.5c0 3.78-3.4 6.86-8.55 11.5z"
                />
              </svg>

              <svg v-else-if="section.id === 'app'" viewBox="0 0 24 24">
                <path
                  d="M12 4a8 8 0 0 0-8 8h3l3-4v6l3-4 3 4v-6l3 4h3a8 8 0 0 0-8-8z"
                />
              </svg>

              <svg v-else-if="section.id === 'notifications'" viewBox="0 0 24 24">
                <path
                  d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.92V4a1 1 0 0 0-2 0v1.08A6 6 0 0 0 6 11v5l-2 2v1h16v-1z"
                />
              </svg>

              <svg v-else-if="section.id === 'account'" viewBox="0 0 24 24">
                <path
                  d="M10 17v2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5v2H5v10zm9.59-5-3.3-3.29L17 7l5 5-5 5-1.71-1.71L19.59 12z"
                />
              </svg>
            </div>
            <div class="nav-text">
              <span class="nav-title">{{ section.label }}</span>
              <span class="nav-subtitle">{{ section.sub }}</span>
            </div>
          </button>
        </div>
      </nav>

      <!-- RIGHT CONTENT -->
      <section class="settings-content">
        <!-- PROFILE -->
        <div v-if="activeSection === 'profile'" class="settings-card">
          <div class="card-header">
            <h2>اطلاعات پروفایل</h2>
            <p>نام کاربری، سن و بیوی کوتاه که کنار آواتارت دیده می‌شه.</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>نام کاربری</label>
              <div class="username-row">
                <span class="username-prefix">@</span>
                <input
                  v-model="userProfile.username"
                  type="text"
                  class="username-input"
                  placeholder="مثلاً neon.mj یا orbit.luna"
                />
              </div>
            </div>

            <div class="form-group">
              <label>سن</label>
              <input
                v-model="userProfile.age"
                type="number"
                min="1"
                max="120"
                placeholder="اختیاری"
              />
            </div>
          </div>

          <div class="form-group">
            <label>بیو / معرفی کوتاه</label>
            <textarea
              v-model="userProfile.bio"
              rows="3"
              placeholder="مثلاً: عاشق شهرهای نئونی، کافه‌های خلوت و کد زدن تا صبح..."
            ></textarea>
          </div>
        </div>

        <!-- INTERESTS -->
        <div v-else-if="activeSection === 'interests'" class="settings-card">
          <div class="card-header">
            <h2>علایق</h2>
            <p>چیزهایی که الگوریتم و آدم‌ها از استایل و حال‌وهوات می‌فهمن.</p>
          </div>

          <div class="form-group">
            <label>علایق و سرگرمی‌ها</label>
            <div class="interests-grid">
              <button
                v-for="hobby in hobbiesList"
                :key="hobby.id"
                type="button"
                class="interest-card"
                :class="{ selected: userProfile.hobbies.includes(hobby.id) }"
                @click="toggleHobby(hobby.id)"
              >
                <div class="interest-icon">{{ hobby.icon }}</div>
                <span class="interest-label">{{ hobby.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- APP & PRIVACY -->
        <div v-else-if="activeSection === 'app'" class="settings-card">
          <div class="card-header">
            <h2>ظاهر و حریم خصوصی</h2>
            <p>حس و حال اپ و این‌که چقدر دیده بشی.</p>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>تم</label>
              <select v-model="settings.theme">
                <option value="system">هماهنگ با سیستم</option>
                <option value="dark">تاریک (پیشنهادی)</option>
                <option value="light">روشن</option>
              </select>
            </div>

            <div class="form-group">
              <label>زبان رابط کاربری</label>
              <select v-model="settings.language">
                <option value="fa">فارسی</option>
                <option value="en">English</option>
                <option value="fa-en">دو زبانه (آزمایشی)</option>
              </select>
            </div>
          </div>

          <div class="toggle-list">
            <div class="toggle-item">
              <div class="toggle-texts">
                <div class="toggle-title">نمایش وضعیت آنلاین</div>
                <div class="toggle-sub">
                  اگر روشن باشه، دوستانت می‌فهمن الان تو Lynku فعالی یا نه.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.showOnlineStatus" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-item">
              <div class="toggle-texts">
                <div class="toggle-title">نمایش شهر / لوکیشن کلی</div>
                <div class="toggle-sub">
                  بدون لوکیشن دقیق؛ فقط شهر یا محدودهٔ تقریبی.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.showLocation" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-item">
              <div class="toggle-texts">
                <div class="toggle-title">اجازه پیام از افراد ناشناس</div>
                <div class="toggle-sub">
                  اگر خاموش باشد، فقط کسانی که فالو کردی می‌تونن پیام بدن.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.allowStrangerMessages" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- NOTIFICATIONS -->
        <div v-else-if="activeSection === 'notifications'" class="settings-card">
          <div class="card-header">
            <h2>نوتیفیکیشن‌ها</h2>
            <p>چطور و کِی خبرات رو بگیری.</p>
          </div>

          <div class="toggle-list">
            <div class="toggle-item">
              <div class="toggle-texts">
                <div class="toggle-title">نوتیفیکیشن پوش</div>
                <div class="toggle-sub">
                  برای پیام‌ها، منشن‌ها، دعوت‌ها و رویدادهای مهم.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.pushNotifications" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-item">
              <div class="toggle-texts">
                <div class="toggle-title">ایمیل خلاصه هفتگی</div>
                <div class="toggle-sub">
                  خلاصهٔ فعالیت‌ها، پیشنهاد دنیاها و آدم‌های جدید.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.emailDigest" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-item">
              <div class="toggle-texts">
                <div class="toggle-title">صدا و ویبره داخل اپ</div>
                <div class="toggle-sub">
                  برای نوتی‌های مهم و لحظه‌های ویژه.
                </div>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.inAppSounds" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- ACCOUNT -->
        <div v-else-if="activeSection === 'account'" class="settings-card">
          <div class="card-header">
            <h2>حساب کاربری و امنیت</h2>
            <p>جایی برای چیزهای جدی‌تر مثل ایمیل، امنیت و خروج.</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">شناسه داخلی (UID)</span>
              <span class="info-value mono">{{ me.id || 'نامشخص' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ایمیل</span>
              <span class="info-value">{{ me.email || 'ثبت نشده' }}</span>
            </div>
          </div>

          <div class="account-actions">
            <button class="chip-btn ghost" @click="openSecurity">
              امنیت و ورودها
            </button>
            <button class="chip-btn ghost" @click="openSessions">
              دستگاه‌های فعال
            </button>
          </div>

          <div class="danger-zone">
            <h3>منطقه حساس</h3>
            <p>کارهایی که بهتره با حواس جمع انجام بدی.</p>
            <button class="danger-btn" @click="logout">
              خروج از حساب
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- SAVE BAR -->
    <footer class="save-bar">
      <span class="save-hint">
        همهٔ تغییرات (پروفایل، علایق، تنظیمات) با هم ذخیره می‌شن.
      </span>
      <button class="save-btn" :disabled="isSaving" @click="saveAll">
        <span v-if="isSaving" class="save-loading">
          <svg class="spinner" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
              fill="none"
            />
          </svg>
          در حال ذخیره...
        </span>
        <span v-else>ذخیره همه تغییرات</span>
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/api'
import { getCookie } from '@/cookie'
import { emitter } from '@/utils/event-bus'

const router = useRouter()

const activeSection = ref('profile')
const isAvatarLoading = ref(true)
const isSaving = ref(false)

// avatar config
const avatarConfig = reactive({
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

// me info
const me = reactive({
  id: null,
  email: null
})

// user profile
const userProfile = reactive({
  username: '',
  age: null,
  bio: '',
  hobbies: [],
  mood: 'chill'
})

// app / privacy / notification settings
const settings = reactive({
  theme: 'dark',
  language: 'fa',
  showOnlineStatus: true,
  showLocation: false,
  allowStrangerMessages: true,
  pushNotifications: true,
  emailDigest: false,
  inAppSounds: true
})

// sections meta
const sections = [
  { id: 'profile', label: 'پروفایل', sub: 'نام کاربری، سن، بیو' },
  { id: 'interests', label: 'علایق تو', sub: 'سرگرمی‌ها و استایل حضور' },
  { id: 'app', label: 'ظاهر و حریم خصوصی', sub: 'تم، زبان، دیده‌شدن' },
  { id: 'notifications', label: 'نوتیفیکیشن‌ها', sub: 'پوش، ایمیل، صدا' },
  { id: 'account', label: 'حساب کاربری', sub: 'امنیت، دستگاه‌ها، خروج' }
]

// interests
const hobbiesList = ref([
  { id: 'sports', name: 'ورزش', icon: '⚽' },
  { id: 'music', name: 'موسیقی', icon: '🎵' },
  { id: 'reading', name: 'مطالعه', icon: '📚' },
  { id: 'travel', name: 'سفر', icon: '✈️' },
  { id: 'cooking', name: 'آشپزی', icon: '🍳' },
  { id: 'gaming', name: 'بازی', icon: '🎮' },
  { id: 'art', name: 'هنر', icon: '🎨' },
  { id: 'photography', name: 'عکاسی', icon: '📷' },
  { id: 'technology', name: 'تکنولوژی', icon: '💻' },
  { id: 'nature', name: 'طبیعت', icon: '🌳' },
  { id: 'movies', name: 'فیلم', icon: '🎬' },
  { id: 'fitness', name: 'تناسب اندام', icon: '💪' }
])

// moods
const moodOptions = [
  { value: 'any', label: 'آزاد', icon: '🔄' },
  { value: 'happy', label: 'شاد', icon: '😄' },
  { value: 'chill', label: 'آرام', icon: '😌' },
  { value: 'hyper', label: 'پر انرژی', icon: '⚡' },
  { value: 'quiet', label: 'کم‌حرف', icon: '🌙' }
]

// avatar URL
const avatarUrl = computed(() => {
  const baseUrl = process.env.VUE_APP_AVATAR_APP_URL + '/avatars'
  const params = new URLSearchParams({ ...avatarConfig })
  return `${baseUrl}?${params.toString()}`
})

const handleAvatarLoad = () => {
  isAvatarLoading.value = false
}
const handleAvatarError = () => {
  isAvatarLoading.value = false
}

// toggle hobbies
const toggleHobby = (hobbyId) => {
  const idx = userProfile.hobbies.indexOf(hobbyId)
  if (idx > -1) {
    userProfile.hobbies.splice(idx, 1)
  } else {
    userProfile.hobbies.push(hobbyId)
  }
}

// save all
const saveAll = async () => {
  if (!userProfile.username || !userProfile.username.trim()) {
    emitter.emit('error-message', 'لطفا نام کاربری خود را وارد کنید')
    return
  }

  isSaving.value = true

  try {
    const payload = {
      username: userProfile.username,
      age: userProfile.age,
      bio: userProfile.bio,
      avatar: { ...avatarConfig },
      avatarUrl: avatarUrl.value,
      hobbies: [...userProfile.hobbies],
      mood: userProfile.mood,
      settings: { ...settings },
      updatedAt: new Date().toISOString()
    }

    const response = await post(
      '/api/v1',
      { topic: 'updatePersonProfile', data: payload },
      { token: getCookie('app-token') }
    )

    if (response?.data?.success) {
      emitter.emit('success-message', 'پروفایل و تنظیمات با موفقیت ذخیره شد ✨')
      emitter.emit('reload-me', true)
      localStorage.setItem('userAvatarConfig', JSON.stringify(avatarConfig))
      localStorage.setItem(
        'lynku-settings',
        JSON.stringify({ profile: userProfile, settings })
      )
    } else {
      emitter.emit(
        'error-message',
        response?.data?.message || 'خطا در ذخیره‌سازی تنظیمات.'
      )
    }
  } catch (e) {
    console.error(e)
    emitter.emit('error-message', 'خطا در ذخیره‌سازی تنظیمات. دوباره تلاش کن.')
  } finally {
    isSaving.value = false
  }
}

// account actions
const logout = () => {
  try {
    localStorage.removeItem('me')
    localStorage.removeItem('userAvatarConfig')
    localStorage.removeItem('lynku-settings')
  } catch (e) {
    // ignore
  }
  emitter.emit('logout', true)
  router.push('/logout')
}

const goToAccount = () => {
  activeSection.value = 'account'
}

const openSecurity = () => {
  emitter.emit('info-message', 'بخش امنیت و ورودها به‌زودی در دسترس خواهد بود.')
}

const openSessions = () => {
  emitter.emit('info-message', 'مدیریت دستگاه‌های فعال به‌زودی اضافه می‌شود.')
}

// init
onMounted(() => {
  isAvatarLoading.value = true

  const savedConfig = localStorage.getItem('userAvatarConfig')
  const meJson = localStorage.getItem('me')
  const savedSettings = localStorage.getItem('lynku-settings')

  if (savedConfig) {
    try {
      Object.assign(avatarConfig, JSON.parse(savedConfig))
    } catch {
      // ignore
    }
  }

  if (meJson) {
    try {
      const meData = JSON.parse(meJson)
      me.id = meData?.id || meData?._id || null
      me.email = meData?.email || null

      if (meData.username) userProfile.username = meData.username
      if (meData.age) userProfile.age = meData.age
      if (meData.bio) userProfile.bio = meData.bio
      if (Array.isArray(meData.hobbies)) userProfile.hobbies = [...meData.hobbies]
      if (meData.mood) userProfile.mood = meData.mood
    } catch {
      // ignore
    }
  }

  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      if (parsed.profile) Object.assign(userProfile, parsed.profile)
      if (parsed.settings) Object.assign(settings, parsed.settings)
    } catch {
      // ignore
    }
  }
})
</script>

<style scoped>
:root {
  color-scheme: dark;
}

.lynku-settings {
  direction: rtl;
  background: radial-gradient(circle at top, #050816 0%, #02010a 40%, #000 100%);
  color: #f9fafb;
  padding: 24px 26px 80px;
  border-radius: 18px;
  height: 100vh;
  box-sizing: border-box;
  animation: slideUp 0.3s ease-out;
}

/* ===== HEADER ===== */
.settings-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  margin-bottom: 22px;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.16), transparent 55%),
    radial-gradient(circle at bottom right, rgba(244, 114, 182, 0.16), transparent 55%),
    rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(18px);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.75),
    0 0 40px rgba(56, 189, 248, 0.1);
}

.header-main {
  text-align: center;
  align-items: center;
  gap: 18px;
}

/* Avatar */
.avatar-wrapper {
  position: relative;
  display: inline-block;
  width: 200px !important;
  height: 200px !important;
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid rgba(148, 163, 184, 0.6);
  background: radial-gradient(circle at 30% 20%, #1f2937, #020617);
  box-shadow:
    0 0 16px rgba(129, 140, 248, 0.6),
    inset 0 0 16px rgba(15, 23, 42, 0.9);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.avatar-wrapper:hover {
  transform: translateY(-2px) scale(1.03);
  border-color: #a855f7;
  box-shadow:
    0 0 20px rgba(168, 85, 247, 0.7),
    0 0 36px rgba(56, 189, 248, 0.4);
}

.avatar-wrapper.glowing {
  animation: avatarPulse 3s ease-in-out infinite;
}

.avatar-skeleton {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 30% 30%, #4b5563, #020617);
}

.avatar-skeleton-inner {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    rgba(249, 250, 251, 0.03),
    rgba(249, 250, 251, 0.3),
    rgba(249, 250, 251, 0.03)
  );
  transform: translateX(-100%);
  animation: shimmer 1.6s infinite;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Header text */
.header-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.4;
  background: linear-gradient(135deg, #e5e7eb, #a5b4fc, #22d3ee);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-title p {
  margin: 0;
  font-size: 0.9rem;
  color: #9ca3af;
}

/* username inline */
.header-username {
  margin-top: 10px;
}

.header-username label {
  display: block;
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 4px;
}

.username-row {
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.9);
  border-radius: 999px;
  border: 1px solid rgba(55, 65, 81, 0.9);
  overflow: hidden;
}

.username-prefix {
  padding: 8px 10px;
  font-size: 0.88rem;
  color: #6b7280;
  background: radial-gradient(circle at center, rgba(31, 41, 55, 0.95), rgba(15, 23, 42, 0.7));
  border-left: 1px solid rgba(55, 65, 81, 0.9);
}

.username-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e5e7eb;
  padding: 8px 10px;
  font-size: 0.9rem;
}

.username-input::placeholder {
  color: #6b7280;
}

.username-input:focus {
  outline: none;
}

/* header actions */
.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* chip buttons */
.chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.2s ease;
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

.chip-btn svg {
  width: 16px;
  height: 16px;
}

.chip-btn.ghost {
  border-color: rgba(55, 65, 81, 0.9);
}

.chip-btn.ghost:hover {
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.chip-btn.danger {
  background: linear-gradient(135deg, #b91c1c, #f97373);
  color: #fee2e2;
}

.chip-btn.danger:hover {
  box-shadow: 0 0 14px rgba(248, 113, 113, 0.65);
}

/* ===== MAIN LAYOUT ===== */
.settings-layout {
  margin-top: 18px;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 18px;
}

/* NAV */
.settings-nav {
  border-radius: 16px;
  border: 1px solid rgba(55, 65, 81, 0.9);
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.16), transparent 55%),
  rgba(15, 23, 42, 0.95);
  padding: 14px 12px 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.75);
}

.nav-label {
  font-size: 0.78rem;
  color: #6b7280;
  margin-bottom: 10px;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  width: 100%;
  border: none;
  background: transparent;
  color: #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.18s ease;
}

.nav-item:hover {
  background: rgba(30, 64, 175, 0.45);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.3));
  box-shadow:
    0 0 10px rgba(129, 140, 248, 0.7),
    0 0 18px rgba(56, 189, 248, 0.35);
}

.nav-icon svg {
  width: 20px;
  height: 20px;
  color: #a5b4fc;
}

.nav-text {
  text-align: right;
}

.nav-title {
  font-size: 0.86rem;
  font-weight: 600;
}

.nav-subtitle {
  font-size: 0.6rem;
  color: #9ca3af;
  margin: 0 10px;
}

/* CONTENT */
.settings-content {
  border-radius: 16px;
  border: 1px solid rgba(55, 65, 81, 0.9);
  background: radial-gradient(circle at top left, rgba(129, 140, 248, 0.22), transparent 55%),
  radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.18), transparent 60%),
  rgba(15, 23, 42, 0.97);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.9),
    0 0 24px rgba(129, 140, 248, 0.35);
  padding: 18px 18px 22px;
  min-height: 340px;
}

.settings-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* card header */
.card-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #e5e7eb;
}

.card-header p {
  margin: 4px 0 0 0;
  font-size: 0.82rem;
  color: #9ca3af;
}

/* form layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.8rem;
  color: #e5e7eb;
}

input,
select,
textarea {
  border-radius: 10px;
  border: 1px solid rgba(55, 65, 81, 0.9);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  padding: 9px 10px;
  font-size: 0.88rem;
  transition: border 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  font-family: inherit;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.6);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

input::placeholder,
textarea::placeholder {
  color: #6b7280;
}

/* interests */
.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(105px, 1fr));
  gap: 10px;
}

.interest-card {
  border-radius: 12px;
  padding: 9px 8px;
  border: 1px solid rgba(55, 65, 81, 0.9);
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 70%),
  rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.18s ease;
}

.interest-card:hover {
  transform: translateY(-2px);
  border-color: #38bdf8;
}

.interest-card.selected {
  border-color: #a855f7;
  box-shadow:
    0 0 12px rgba(168, 85, 247, 0.7),
    0 0 22px rgba(56, 189, 248, 0.4);
}

.interest-icon {
  font-size: 1.3rem;
}

.interest-label {
  font-size: 0.78rem;
}

/* mood pills */
.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.8rem;
  border: 1px solid rgba(55, 65, 81, 0.9);
  background: rgba(15, 23, 42, 0.85);
  color: #e5e7eb;
  cursor: pointer;
  transition: 0.18s ease;
}

.pill-btn:hover {
  border-color: #38bdf8;
}

.pill-btn.active {
  border-color: #a855f7;
  background: radial-gradient(circle at center, rgba(129, 140, 248, 0.65), rgba(15, 23, 42, 0.9));
  box-shadow:
    0 0 10px rgba(129, 140, 248, 0.7),
    0 0 18px rgba(56, 189, 248, 0.5);
}

.pill-emoji {
  font-size: 1rem;
}

/* toggles */
.toggle-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid rgba(55, 65, 81, 0.9);
  background: rgba(15, 23, 42, 0.85);
}

.toggle-texts {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toggle-title {
  font-size: 0.86rem;
  color: #e5e7eb;
}

.toggle-sub {
  font-size: 0.76rem;
  color: #9ca3af;
}

/* switch */
.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #4b5563;
  transition: 0.2s;
  border-radius: 999px;
}

.slider::before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background: linear-gradient(135deg, #38bdf8, #a855f7);
}

.switch input:checked + .slider::before {
  transform: translateX(18px);
}

/* account */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  margin-top: 4px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 0.78rem;
  color: #9ca3af;
}

.info-value {
  font-size: 0.88rem;
  color: #e5e7eb;
}

.account-actions {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.danger-zone {
  margin-top: 18px;
  padding: 12px;
  border-radius: 12px;
  border: 1px dashed rgba(248, 113, 113, 0.7);
  background: rgba(30, 64, 175, 0.1);
}

.danger-zone h3 {
  margin: 0 0 4px 0;
  font-size: 0.98rem;
  color: #fecaca;
}

.danger-zone p {
  margin: 0 0 10px 0;
  font-size: 0.78rem;
  color: #fca5a5;
}

.danger-btn {
  border-radius: 999px;
  padding: 7px 14px;
  border: 1px solid rgba(248, 113, 113, 0.9);
  background: rgba(127, 29, 29, 0.95);
  color: #fee2e2;
  cursor: pointer;
  font-size: 0.82rem;
  transition: 0.18s ease;
}

.danger-btn:hover {
  box-shadow: 0 0 14px rgba(248, 113, 113, 0.8);
}

/* save bar */
.save-bar {
  position: sticky;
  bottom: 0;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid rgba(31, 41, 55, 0.9);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.4), transparent);
  backdrop-filter: blur(12px);
}

.save-hint {
  font-size: 0.78rem;
  color: #9ca3af;
}

.save-btn {
  border-radius: 999px;
  padding: 8px 18px;
  border: none;
  cursor: pointer;
  font-size: 0.86rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
  background: linear-gradient(135deg, #38bdf8, #a855f7);
  box-shadow:
    0 0 12px rgba(56, 189, 248, 0.7),
    0 0 24px rgba(168, 85, 247, 0.6);
  transition: 0.18s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.save-loading {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.spinner {
  width: 16px;
  height: 16px;
  animation: spin 0.9s linear infinite;
}

/* animations */
@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes avatarPulse {
  0% {
    box-shadow:
      0 0 14px rgba(129, 140, 248, 0.5),
      0 0 28px rgba(56, 189, 248, 0.3);
  }
  50% {
    box-shadow:
      0 0 24px rgba(129, 140, 248, 0.9),
      0 0 40px rgba(56, 189, 248, 0.5);
  }
  100% {
    box-shadow:
      0 0 14px rgba(129, 140, 248, 0.5),
      0 0 28px rgba(56, 189, 248, 0.3);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* responsive */
@media (max-width: 1024px) {
  .settings-layout {
    grid-template-columns: 220px minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .lynku-settings {
    padding: 14px 12px 70px;
    margin-top: 4rem;
  }

  .settings-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-main {
    width: 100%;
  }

  .header-actions {
    align-self: stretch;
    justify-content: flex-end;
  }

  .settings-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .settings-nav {
    order: 1;
  }

  .settings-content {
    order: 2;
  }

  .save-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .header-main {
    flex-direction: row;
    align-items: flex-start;
  }

  .avatar-wrapper {
    width: 90px;
    height: 90px;
  }

  .form-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .info-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .interests-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .header-actions {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
