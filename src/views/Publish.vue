<template>
  <div style="margin-top: 70px; margin-bottom: 100px">
    <div class="tweet-box p-3">
      <!-- Header -->
      <div class="tweet-header">
        <div class="user-avatar">
          <div class="avatar-placeholder">
            <img style="width: 100%" :src="avatarUrl" />
          </div>
        </div>
        <div class="header-text">
          <h3>یه پینگ جدید ارسال کن</h3>
          <p>افکارت رو با جهان به اشتراک بذار</p>
        </div>
      </div>
      <!-- Tweet Text Area -->
      <div class="tweet-textarea">
        <textarea
          v-model="publishText"
          class="tweet-input"
          placeholder="چه خبر؟..."
          maxlength="280"
          style="font-family: inherit"
          @input="updateCharacterCount"
        ></textarea>
        <transition name="fade" style="max-height: 50vh; max-width: 100%">
          <div v-if="showGlobe" class="globe-overlay" style="height: 50vh">
            <GlobePicker @close="showGlobe = false" @select-location="handleLocationSelect" />
          </div>
        </transition>
        <div class="textarea-actions">
          <span class="character-count" :class="{ warning: characterCount > 250, danger: characterCount > 270 }">
            {{ characterCount }}/280
          </span>
        </div>
      </div>

      <!-- Tweet Actions -->
      <div class="tweet-actions">
        <div class="action-buttons">
          <!-- Emoji Picker Trigger -->
          <button class="action-btn" @click="toggleEmojiPicker">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"
              />
            </svg>
          </button>

          <!-- Add Location -->
          <button class="action-btn" @click="addLocation">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
          </button>
        </div>

        <!-- Tweet Button -->
        <button class="tweet-btn" :disabled="!canPublish" @click="postPublish">
          <span class="btn-text">پینگ کن</span>
          <svg v-if="isLoading" class="spinner" width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
              <animate attributeName="stroke-dasharray" values="1, 50; 50, 1; 1, 50" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="stroke-dashoffset" values="0; -15; -34" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </button>
      </div>

      <!-- Emoji Picker -->
      <div v-if="showEmojiPicker" class="emoji-picker">
        <div class="emoji-grid">
          <span v-for="emoji in popularEmojis" :key="emoji" class="emoji" @click="addEmoji(emoji)">
            {{ emoji }}
          </span>
        </div>
      </div>

      <!-- Location Tag -->
      <div v-if="location" class="location-tag">
        <span class="location-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
          </svg>
          {{ location }}
        </span>
        <button class="remove-location" @click="removeLocation">×</button>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '../api'
import { getCookie } from '@/cookie'
import GlobePicker from '@/views/GlobePicker.vue'
import { emitter } from '@/utils/event-bus'

export default {
  name: 'Publish',
  avatarConfig: {},
  components: { GlobePicker },
  data() {
    return {
      showGlobe: false,
      coords: null,
      publishText: '',
      location: '',
      showEmojiPicker: false,
      isLoading: false,
      characterCount: 0,
      imagePreview: null,
      popularEmojis: ['😊', '😂', '❤️', '🔥', '👍', '👏', '🎉', '🙏', '😍', '😎', '🤔', '😢', '🙌', '💯', '✨', '🌟']
    }
  },
  computed: {
    canPublish() {
      return this.publishText.trim().length > 0 && this.publishText.trim().length <= 280 && !this.isLoading
    },
    avatarUrl() {
      this.avatarConfig = Object.assign(
        JSON.parse(localStorage.getItem('userAvatarConfig')),
        this.avatarConfig
      )
      console.log(this.avatarConfig)
      const baseUrl = 'http://31.57.109.158:5000/avatars'
      const params = new URLSearchParams(this.avatarConfig)
      return `${baseUrl}?${params.toString()}`
    }
  },
  mounted() {
    this.scrollToTop()
  },
  methods: {
    handleLocationSelect(coords) {
      console.log('========>', coords)
      this.location = `Lat: ${coords.lat.toFixed(4)}, Lon: ${coords.lon.toFixed(4)}`
      // this.showGlobe = false
    },
    updateCharacterCount() {
      this.characterCount = this.publishText.length
    },

    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker
    },

    addEmoji(emoji) {
      this.publishText += emoji
      this.showEmojiPicker = false
      this.updateCharacterCount()
    },

    async addLocation() {
      // Simulate getting location (in real app, use geolocation API)
      if (this.showGlobe) {
        this.showGlobe = false
        this.coords = null
        this.location = ''
      } else {
        this.showGlobe = true
        this.$data.coords = await this.getUserLocation()
      }
    },

    async postPublish() {
      if (!this.canPublish) return

      this.isLoading = true

      try {
        const response = await post(
          '/api/v1',
          {
            topic: 'createPublish',
            data: {
              text: this.publishText,
              location: {
                type: 'Point',
                coordinates: [this.coords.lng, this.coords.lat] // notice: lng first!
              }
            }
          },
          {
            token: getCookie('app-token')
          }
        )

        if (response && response.data.success) {
          // Reset form
          this.publishText = ''
          this.location = ''
          this.characterCount = 0

          // Show success message
          emitter.emit('success-message', 'پینگت با موفقیت انجام شد!')
          this.$router.push('/')
        }
      } catch (error) {
        console.error('Error posting tweet:', error)
        emitter.emit('error-message', 'تو پینگ کردنت مشکلی به وجود اومده! دوباره تلاش کن.')
      } finally {
        this.isLoading = false
      }
    },

    showSuccess(message) {
      // You can replace this with a proper toast notification
      alert(message)
    },

    showError(message) {
      // You can replace this with a proper toast notification
      alert(message)
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    async getUserLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'))
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              })
            },
            (err) => reject(err),
            { enableHighAccuracy: true }
          )
        }
      })
    }
  }
}
</script>

<style scoped>
.page {
  animation: slideUp 0.3s ease-out;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
}

.tweet-box {
  background: #000000;
  margin-bottom: 5px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.tweet-box:hover {
  border-color: #1da1f2;
  box-shadow: 0 12px 40px rgba(29, 161, 242, 0.15);
}

.tweet-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #333;
}

.user-avatar {
  margin-left: 15px;
}

.avatar-placeholder {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-text h3 {
  color: #ffffff;
  margin: 0;
  font-weight: 700;
  font-size: 1.3rem;
}

.header-text p {
  color: #8899a6;
  margin: 5px 0 0 0;
  font-size: 0.9rem;
}

.tweet-textarea {
  margin-bottom: 20px;
}

.tweet-input {
  width: 100%;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.2rem;
  line-height: 1.5;
  resize: none;
  min-height: 120px;
  outline: none;
  font-family: system-ui, -apple-system, sans-serif;
}

.tweet-input::placeholder {
  color: #5a6d7d;
}

.textarea-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.character-count {
  color: #8899a6;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.character-count.warning {
  color: #ffad1f;
}

.character-count.danger {
  color: #e0245e;
}

.tweet-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-btn {
  background: transparent;
  border: none;
  color: #1da1f2;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(29, 161, 242, 0.1);
  transform: scale(1.1);
}

.tweet-btn {
  background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  justify-content: center;
}

.tweet-btn:disabled {
  background: #1a3a53;
  color: #5a6d7d;
  cursor: not-allowed;
  transform: none;
}

.tweet-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #1a91da 0%, #1a7bb9 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(29, 161, 242, 0.4);
}

.spinner {
  animation: spin 1s linear infinite;
}

.emoji-picker {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 15px;
  margin-top: 15px;
  animation: slideDown 0.2s ease-out;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.emoji {
  font-size: 1.5rem;
  cursor: pointer;
  text-align: center;
  padding: 5px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.emoji:hover {
  background: #333;
  transform: scale(1.2);
}

.location-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a3a53;
  padding: 8px 12px;
  border-radius: 20px;
  margin-top: 15px;
  animation: slideDown 0.2s ease-out;
}

.location-text {
  color: #1da1f2;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.remove-location {
  background: none;
  border: none;
  color: #8899a6;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-location:hover {
  background: #e0245e;
  color: white;
}

.tweet-preview {
  background: #000000;
  border: 1px solid #333;
  border-radius: 16px;
  padding: 20px;
  margin-top: 20px;
  animation: slideUp 0.3s ease-out;
}

.preview-header h4 {
  color: #ffffff;
  margin: 0 0 15px 0;
  font-weight: 600;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.preview-content {
  color: #ffffff;
}

.preview-text {
  line-height: 1.6;
  margin-bottom: 10px;
  white-space: pre-wrap;
}

.preview-location {
  color: #1da1f2;
  font-size: 0.9rem;
}

.btn-text {
  font-weight: 700;
}

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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .tweet-box {
    padding: 15px;
    margin: 10px;
  }

  .emoji-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .tweet-actions {
    flex-direction: column;
    gap: 15px;
  }

  .action-buttons {
    width: 100%;
    justify-content: center;
  }

  .tweet-btn {
    width: 100%;
  }
}

/* Custom scrollbar for textarea */
.tweet-input::-webkit-scrollbar {
  width: 6px;
}

.tweet-input::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 3px;
}

.tweet-input::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.tweet-input::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.globe-container {
  overflow: hidden;
}

.preview-image {
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 0 5px #eee;
}
</style>