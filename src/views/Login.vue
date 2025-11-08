<template>
  <div class="login-terminal-page">
    <div class="terminal-container">
      <div class="terminal-glass-panel">
        <div class="terminal-header">
          <span class="brand-text">lynku</span>
        </div>

        <div class="terminal-content">
          <div class="access-request" v-if="!nextStep">
            <h2 class="terminal-title">ورود به دنیای lynku</h2>

            <div class="input-field-group">
              <label for="phone-input" class="input-label">شماره موبایل</label>
              <input id="phone-input" v-model="phone" type="text" class="terminal-input" placeholder="09xx xxx xxxx"
                @keyup.enter="login()" maxlength="11">
              <div class="input-glow-bar"></div>
            </div>

            <button class="terminal-btn btn-primary-glow" @click="login()" :disabled="!isPhoneValid">
              <span class="btn-text">ارسال کد تایید</span>
              <div class="btn-glow"></div>
            </button>
          </div>

          <div class="verification-entry" v-if="nextStep">
            <h2 class="terminal-title">وارد کردن کد تایید</h2>

            <p class="verification-info">کد تایید به شماره {{ phone }} ارسال شد.</p>

            <div class="input-field-group">
              <label for="code-input" class="input-label">کد تایید | Verification Code</label>
              <input id="code-input" v-model="code" type="text" class="terminal-input code-input" placeholder="____"
                @keyup.enter="verify()" maxlength="6">
              <div class="input-glow-bar"></div>
            </div>

            <button class="terminal-btn btn-success-glow" @click="verify()" :disabled="!isCodeValid">
              <span class="btn-text">احراز هویت و ورود</span>
              <div class="btn-glow"></div>
            </button>
            <button class="terminal-btn btn-secondary-text mt-3" @click="nextStep = false">
              <span class="btn-text">تغییر شماره موبایل</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/api';
import { setCookie, getCookie } from '@/cookie'; // Keep your original imports
import { emitter } from './../utils/event-bus'; // If you use an event bus for global events

export default {
  emits: ["loading-started", "loading-ended"],
  name: 'Login',
  data() {
    return {
      nextStep: false,
      phone: '',
      code: ''
    }
  },
  computed: {
    isPhoneValid() {
      // Simple validation: phone should be 11 digits
      return this.phone.length === 11 && /^\d+$/.test(this.phone);
    },
    isCodeValid() {
      // Simple validation: code should be at least 3 digits
      return this.code.length >= 3;
    }
  },
  methods: {
    // --- API Methods (Kept identical to original) ---
    verify() {
      if (!this.isCodeValid) return; // Use computed property for guard

      this.$emit("loading-started", "true");
      post('/auth/verify', { phone: this.phone, code: this.code })
        .then(response => {
          this.$emit("loading-ended", "true");
          // Handle the response data
          if (response.success) {
            setCookie("app-token", response.token, 7);
            setCookie("app-channel", response.channel, 7);
            // Use router push for better Vue integration, but window.location.assign works too
            emitter.emit('refresh-navigation-state');
            this.$router.push('/');
          } else {
            // Handle specific verification failure UI if needed
            alert('کد تایید اشتباه است.');
          }
        })
        .catch(error => {
          this.$emit("loading-ended", "true");
          // Handle the error
          console.error(error);
          alert('خطا در احراز هویت. لطفا دوباره تلاش کنید.');
        });
    },

    login() {
      if (!this.isPhoneValid) return; // Use computed property for guard

      this.$emit("loading-started", "true");
      post('/auth/entry', { phone: this.phone })
        .then(response => {
          this.$emit("loading-ended", "true");
          // Handle the response data
          if (response.success) {
            this.nextStep = true;
          } else {
            alert('خطا در ارسال کد تایید. لطفا شماره را بررسی کنید.');
          }
        })
        .catch(error => {
          this.$emit("loading-ended", "true");
          // Handle the error
          console.error(error);
          alert('خطای شبکه. لطفا اتصال خود را بررسی کنید.');
        });
    }
    // --- End API Methods ---
  },
  mounted() {
    // Optional: Auto-redirect if already logged in (using your cookie function)
    if (getCookie('app-token')) {
      this.$router.replace('/');
    }
  }
}
</script>

<style scoped>
/* Base Setup */
.login-terminal-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 30px;
  background-color: #0d0d2a;
  /* Deep space background */
  background-image: radial-gradient(circle at center, rgba(30, 30, 60, 0.5), #0d0d2a);
  animation: backgroundPulse 15s infinite alternate;
}

@keyframes backgroundPulse {
  0% {
    background-color: #0d0d2a;
  }

  100% {
    background-color: #08081a;
  }
}

.terminal-container {
  width: 100%;
  max-width: 450px;
  perspective: 1000px;
}

/* Glass/Holographic Panel Styling */
.terminal-glass-panel {
  background: rgba(18, 18, 48, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(25, 25, 75, 0.5);
  box-shadow:
    0 0 30px rgba(60, 100, 255, 0.3),
    inset 0 0 10px rgba(100, 150, 255, 0.1);
  padding: 30px;
  animation: terminalFadeIn 0.8s ease-out;
}

@keyframes terminalFadeIn {
  from {
    opacity: 0;
    transform: rotateX(10deg) scale(0.9);
  }

  to {
    opacity: 1;
    transform: rotateX(0deg) scale(1);
  }
}

/* Header/Logo Styling */
.terminal-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.brand-text {
  color: #00ffc8;
  /* Bright teal/cyan for a futuristic glow */
  font-weight: 700;
  font-size: 32px;
  text-shadow: 0 0 8px rgba(0, 255, 200, 0.7);
  letter-spacing: 2px;
  font-family: "Honk", system-ui;
  /* Keeping your font choice */
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.logo-hologram {
  margin-left: 10px;
}

.hologram-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #1d9bf0, #00ba7c, #f91880, #1d9bf0);
  animation: rotate 4s linear infinite;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 255, 200, 0.8);
}

.hologram-circle::before {
  content: '';
  position: absolute;
  inset: 3px;
  background: #0d0d2a;
  border-radius: 50%;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Content Styling */
.terminal-title {
  color: #00ffc8;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(0, 255, 200, 0.3);
}

.verification-info {
  color: #fddb92;
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
}

/* Input Fields */
.input-field-group {
  margin-bottom: 25px;
  position: relative;
}

.input-label {
  display: block;
  color: #a3c4ff;
  font-size: 12px;
  margin-bottom: 8px;
}

.terminal-input {
  width: 100%;
  background: rgba(40, 40, 70, 0.9);
  border: 1px solid rgba(100, 150, 255, 0.5);
  border-radius: 6px;
  padding: 10px 15px;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
  text-align: right;
  /* RTL support */
}

.terminal-input.code-input {
  letter-spacing: 5px;
  text-align: center;
}

.terminal-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.terminal-input:focus {
  border-color: #00ffc8;
  box-shadow: 0 0 10px rgba(0, 255, 200, 0.5);
}

/* Buttons */
.terminal-btn {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 15px;
}

.terminal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #444 !important;
}

.btn-text {
  position: relative;
  z-index: 2;
  color: #0d0d2a;
}

/* Primary Glow Button (Login/Send Code) */
.btn-primary-glow {
  background: #3c64ff;
  color: #0d0d2a;
}

.btn-primary-glow .btn-glow {
  background: rgba(60, 100, 255, 0.7);
}

/* Success Glow Button (Verify) */
.btn-success-glow {
  background: #00ffc8;
  color: #0d0d2a;
}

.btn-success-glow .btn-glow {
  background: rgba(0, 255, 200, 0.7);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: opacity 0.3s;
  opacity: 0;
}

.terminal-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 255, 200, 0.4);
}

.terminal-btn:hover:not(:disabled) .btn-glow {
  opacity: 1;
}

/* Secondary Text Button */
.btn-secondary-text {
  background: none;
  color: #a3c4ff;
  border: 1px solid rgba(163, 196, 255, 0.3);
  font-size: 14px;
}

.btn-secondary-text:hover {
  background: rgba(163, 196, 255, 0.1);
}

/* Animation for the terminal's content slide up */
.terminal-content {
  animation: contentSlideUp 0.5s ease-out;
}

@keyframes contentSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>