<template>
  <div class="avatar-profile-container" style="margin-top: 70px">
    <!-- Progress Steps -->
    <div class="progress-steps">
      <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
        <div class="step-number">2</div>
        <div class="step-label">اطلاعات شخصی</div>
      </div>
      <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
        <div class="step-number">3</div>
        <div class="step-label">علایق و کسب‌وکار</div>
      </div>
      <div class="step" :class="{ active: currentStep === 3 }">
        <div class="step-number">4</div>
        <div class="step-label">مرور و ثبت</div>
      </div>
    </div>
    <!-- Step 2: Personal Information -->
    <div v-if="currentStep === 1" class="step-container">
      <div class="step-header">
        <div class="avatar-preview-large" style="display: inline-block; text-align: center">
          <img :src="avatarUrl" alt="Avatar Preview" class="preview-image" style="display: inline-block" />
        </div>
        <h2>اطلاعات شخصی</h2>
        <p>لطفا اطلاعات پایه خود را وارد کنید</p>
      </div>

      <div class="form-container">
        <div class="form-group">
          <label for="username">نام کاربری</label>
          <input type="text" id="username" v-model="userProfile.username" placeholder="نام کاربری خود را وارد کنید" required />
        </div>

        <div class="form-group">
          <label for="gender">نام کاربری</label>
          <input type="text" id="gender" v-model="userProfile.gender" placeholder="جنسیا خودت رو تعیین کن" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="age">سن</label>
            <input type="number" id="age" v-model="userProfile.age" min="1" max="120" placeholder="سن خود را وارد کنید" />
          </div>

          <div class="form-group">
            <label for="weight">وزن (کیلوگرم)</label>
            <input
              type="number"
              id="weight"
              v-model="userProfile.weight"
              min="1"
              max="300"
              placeholder="وزن خود را وارد کنید"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="bio">درباره من</label>
          <textarea id="bio" v-model="userProfile.bio" rows="4" placeholder="درباره خودتان بنویسید..."></textarea>
        </div>

        <div class="form-actions">
          <button class="action-btn secondary" @click="prevStep">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            مرحله قبل
          </button>
          <button class="action-btn primary" @click="nextStep">
            مرحله بعد
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 3: Interests and Business -->
    <div v-if="currentStep === 2" class="step-container">
      <div class="step-header">
        <h2>علایق و کسب‌وکار</h2>
        <p>علایق و زمینه فعالیت خود را انتخاب کنید</p>
      </div>

      <div class="form-container">
        <div class="form-group">
          <label>علایق و سرگرمی‌ها</label>
          <div class="interests-grid">
            <div
              v-for="hobby in hobbiesList"
              :key="hobby.id"
              class="interest-card"
              :class="{ selected: userProfile.hobbies.includes(hobby.id) }"
              @click="toggleHobby(hobby.id)"
            >
              <div class="interest-icon">
                <span v-html="hobby.icon"></span>
              </div>
              <span class="interest-label">{{ hobby.name }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="business">زمینه کسب‌وکار</label>
          <select id="business" v-model="userProfile.business">
            <option value="" disabled selected>لطفا انتخاب کنید</option>
            <option v-for="biz in businessTypes" :key="biz.id" :value="biz.id">{{ biz.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="customInterests">علایق دیگر (با کاما جدا کنید)</label>
          <input
            type="text"
            id="customInterests"
            v-model="userProfile.customInterests"
            placeholder="مثلا: برنامه‌نویسی، عکاسی، سفر"
          />
        </div>

        <div class="form-actions">
          <button class="action-btn secondary" @click="prevStep">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            مرحله قبل
          </button>
          <button class="action-btn primary" @click="nextStep">
            مرحله بعد
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Step 4: Review and Submit -->
    <div v-if="currentStep === 3" class="step-container">
      <div class="step-header">
        <h2>مرور و ثبت اطلاعات</h2>
        <p>اطلاعات خود را بررسی کرده و ثبت نهایی را انجام دهید</p>
      </div>

      <div class="review-container">
        <div class="review-card">
          <div class="review-section">
            <h3>آواتار شما</h3>
            <div class="avatar-review">
              <img :src="avatarUrl" alt="Avatar Preview" class="review-avatar" />
            </div>
          </div>

          <div class="review-section">
            <h3>اطلاعات شخصی</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">نام کاربری:</span>
                <span class="info-value">{{ userProfile.username }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">سن:</span>
                <span class="info-value">{{ userProfile.age || 'ثبت نشده' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">وزن:</span>
                <span class="info-value">{{ userProfile.weight ? userProfile.weight + ' کیلوگرم' : 'ثبت نشده' }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">درباره من:</span>
                <span class="info-value">{{ userProfile.bio || 'ثبت نشده' }}</span>
              </div>
            </div>
          </div>

          <div class="review-section">
            <h3>علایق و کسب‌وکار</h3>
            <div class="info-grid">
              <div class="info-item full-width">
                <span class="info-label">علایق:</span>
                <div class="interests-review">
                  <span v-for="hobbyId in userProfile.hobbies" :key="hobbyId" class="interest-tag">
                    {{ getHobbyName(hobbyId) }}
                  </span>
                  <span
                    v-if="userProfile.customInterests"
                    v-for="interest in userProfile.customInterests.split(',')"
                    :key="interest"
                    class="interest-tag custom"
                  >
                    {{ interest.trim() }}
                  </span>
                  <span v-if="userProfile.hobbies.length === 0 && !userProfile.customInterests" class="no-data">
                    علاقه‌ای ثبت نشده
                  </span>
                </div>
              </div>
              <div class="info-item full-width">
                <span class="info-label">زمینه کسب‌وکار:</span>
                <span class="info-value">{{ getBusinessName(userProfile.business) || 'ثبت نشده' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="action-btn secondary" @click="prevStep">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            ویرایش اطلاعات
          </button>
          <button class="action-btn primary" @click="submitProfile" :disabled="isSubmitting">
            <span v-if="isSubmitting">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              </svg>
              در حال ثبت...
            </span>
            <span v-else> ثبت نهایی پروفایل </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal-content success-modal" @click.stop>
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <h3>پروفایل با موفقیت ایجاد شد!</h3>
        <p>اطلاعات شما با موفقیت در سیستم ثبت شد.</p>
        <button class="action-btn primary" @click="showSuccessModal = false">باشه</button>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/api'
import { getCookie } from '@/cookie'
import { emitter } from '@/utils/event-bus'

export default {
  name: 'Born',
  data() {
    return {
      currentStep: 1,
      isSubmitting: false,
      showSuccessModal: false,

      // Avatar configuration (from your existing code)
      activeCategory: 'style',
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
      },

      // User profile data
      userProfile: {
        username: '',
        gender: 'زن',
        age: null,
        weight: null,
        bio: '',
        hobbies: [],
        business: '',
        customInterests: ''
      },

      // Hobbies list
      hobbiesList: [
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
      ],

      // Business types
      businessTypes: [
        { id: 'tech', name: 'تکنولوژی و فناوری' },
        { id: 'health', name: 'سلامت و پزشکی' },
        { id: 'education', name: 'آموزش' },
        { id: 'finance', name: 'مالی و سرمایه‌گذاری' },
        { id: 'retail', name: 'خرده‌فروشی' },
        { id: 'manufacturing', name: 'تولید و صنعت' },
        { id: 'arts', name: 'هنر و طراحی' },
        { id: 'hospitality', name: 'مهمان‌نوازی' },
        { id: 'other', name: 'سایر' }
      ]
    }
  },
  computed: {
    avatarUrl() {
      const baseUrl = 'https://avataaars.io/'
      const params = new URLSearchParams(this.avatarConfig)
      return `${baseUrl}?${params.toString()}`
    }
  },
  methods: {
    // Navigation methods
    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    // Avatar methods (from your existing code)
    updateConfig(key, value) {
      this.avatarConfig[key] = value
    },

    generatePreviewUrl(config) {
      const baseUrl = 'https://avataaars.io/'
      const params = new URLSearchParams(config)
      return `${baseUrl}?${params.toString()}`
    },

    getCategoryTitle(categoryId) {
      const category = this.categories.find((cat) => cat.id === categoryId)
      return category ? category.name : 'گزینه‌ها'
    },

    resetAvatar() {
      this.avatarConfig = {
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

    async downloadAvatar() {
      try {
        const response = await fetch(this.avatarUrl)
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
        console.error('Error downloading avatar:', error)
        this.showError('خطا در دانلود آواتار')
      }
    },

    // Profile methods
    toggleHobby(hobbyId) {
      const index = this.userProfile.hobbies.indexOf(hobbyId)
      if (index > -1) {
        this.userProfile.hobbies.splice(index, 1)
      } else {
        this.userProfile.hobbies.push(hobbyId)
      }
    },

    getHobbyName(hobbyId) {
      const hobby = this.hobbiesList.find((h) => h.id === hobbyId)
      return hobby ? hobby.name : hobbyId
    },

    getBusinessName(businessId) {
      const business = this.businessTypes.find((b) => b.id === businessId)
      return business ? business.name : businessId
    },

    // Submit profile to API
    async submitProfile() {
      // Validation
      if (!this.userProfile.username.trim()) {
        this.showError('لطفا نام کاربری خود را وارد کنید')
        return
      }

      this.isSubmitting = true

      try {
        // Prepare data for API
        const profileData = {
          username: this.userProfile.username,
          age: this.userProfile.age,
          weight: this.userProfile.weight,
          bio: this.userProfile.bio,
          avatar: this.avatarConfig,
          avatarUrl: this.avatarUrl,
          hobbies: this.userProfile.hobbies,
          customInterests: this.userProfile.customInterests
            ? this.userProfile.customInterests.split(',').map((i) => i.trim())
            : [],
          business: this.userProfile.business,
          createdAt: new Date().toISOString()
        }

        const response = await post(
          '/api/v1',
          {
            topic: 'updatePersonProfile',
            data: profileData
          },
          {
            token: getCookie('app-token')
          }
        )
        if (response && response.data.success) {
          this.$router.push('/')
        } else {
          emitter.emit('error-message', response.data.message)
        }

      } catch (error) {
        console.error('Error submitting profile:', error)
        this.showError('خطا در ثبت اطلاعات. لطفا دوباره تلاش کنید.')
      } finally {
        this.isSubmitting = false
      }
    },

    resetForm() {
      this.currentStep = 1
      this.resetAvatar()
      this.userProfile = {
        username: '',
        age: null,
        weight: null,
        bio: '',
        hobbies: [],
        business: '',
        customInterests: ''
      }
    },

    showError(message) {
      // You can replace this with a proper toast notification
      emitter.emit('error-message', message);
    }
  },
  mounted() {
    // Load saved avatar configuration if exists
    const savedConfig = localStorage.getItem('userAvatarConfig')
    if (savedConfig) {
      this.avatarConfig = JSON.parse(savedConfig)
    }
  }
}
</script>

<style scoped>
.avatar-profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  color: #ffffff;
  padding: 20px;
  animation: slideUp 0.3s ease-out;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 50px;
  right: 50px;
  height: 2px;
  background: #333;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
  max-width: 120px;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  color: #8899a6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(29, 161, 242, 0.3);
}

.step.completed .step-number {
  background: #00ba7c;
  color: white;
}

.step-label {
  font-size: 0.8rem;
  color: #8899a6;
  text-align: center;
}

.step.active .step-label {
  color: #1da1f2;
}

.step.completed .step-label {
  color: #00ba7c;
}

/* Step Container */
.step-container {
  background: #000000;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
}

.step-header {
  text-align: center;
  margin-bottom: 30px;
}

.step-header h2 {
  margin: 0 0 10px 0;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1da1f2, #00ba7c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-header p {
  margin: 0;
  color: #8899a6;
  font-size: 1rem;
}

/* Form Styles */
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 25px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #ffffff;
  font-weight: 500;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #333;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #1da1f2;
  box-shadow: 0 0 0 2px rgba(29, 161, 242, 0.2);
}

input::placeholder,
textarea::placeholder {
  color: #8899a6;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

/* Interests Grid */
.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.interest-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 15px 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.interest-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.interest-card.selected {
  border-color: #1da1f2;
  background: rgba(29, 161, 242, 0.1);
}

.interest-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.interest-label {
  font-size: 0.8rem;
  color: #ffffff;
}

/* Review Section */
.review-container {
  max-width: 700px;
  margin: 0 auto;
}

.review-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  border: 1px solid #333;
}

.review-section {
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #333;
}

.review-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.review-section h3 {
  margin: 0 0 15px 0;
  color: #1da1f2;
  font-size: 1.2rem;
}

.avatar-review {
  display: flex;
  justify-content: center;
}

.review-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #1da1f2;
  box-shadow: 0 8px 25px rgba(29, 161, 242, 0.3);
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 200px;
}

.info-item.full-width {
  flex: 1 0 100%;
}

.info-label {
  color: #8899a6;
  font-size: 0.9rem;
}

.info-value {
  color: #ffffff;
  font-weight: 500;
}

.interests-review {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.interest-tag {
  background: rgba(29, 161, 242, 0.2);
  color: #1da1f2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.interest-tag.custom {
  background: rgba(0, 186, 124, 0.2);
  color: #00ba7c;
}

.no-data {
  color: #8899a6;
  font-style: italic;
}

/* Form Actions */
.form-actions {
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
  background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1a91da 0%, #1a7bb9 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(29, 161, 242, 0.4);
}

.action-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

/* Spinner */
.spinner {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Success Modal */
.modal-overlay {
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

.success-modal {
  background: #000000;
  border-radius: 20px;
  padding: 40px;
  max-width: 400px;
  text-align: center;
  border: 1px solid #333;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s ease-out;
}

.modal-icon {
  width: 80px;
  height: 80px;
  background: rgba(0, 186, 124, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.modal-icon svg {
  width: 40px;
  height: 40px;
  color: #00ba7c;
}

.success-modal h3 {
  margin: 0 0 10px 0;
  color: #ffffff;
  font-size: 1.5rem;
}

.success-modal p {
  margin: 0 0 25px 0;
  color: #8899a6;
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

/* Responsive Design */
@media (max-width: 768px) {
  .avatar-profile-container {
    padding: 10px;
  }

  .progress-steps {
    flex-wrap: wrap;
    gap: 15px;
  }

  .progress-steps::before {
    display: none;
  }

  .step {
    flex: 0 0 calc(50% - 15px);
  }

  .step-container {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .interests-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .form-actions {
    flex-direction: column;
  }

  .success-modal {
    padding: 30px 20px;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .interests-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .info-item {
    min-width: 100%;
  }
}
</style>