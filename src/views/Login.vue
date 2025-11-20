<template>
  <div class="login-modern-page">
    <div class="modern-container">
      <div class="modern-card">
        <!-- Header -->
        <div class="modern-header">
          <div class="logo-container">
            <span class="brand-text">lynku</span>
          </div>
          <div class="header-glow"></div>
        </div>

        <!-- Content -->
        <div class="modern-content">
          <!-- Phone Entry Step -->
          <div class="step-container" v-if="!nextStep">
            <div class="step-indicator">
              <div class="step active">1</div>
              <div class="step-line"></div>
              <div class="step">2</div>
            </div>

            <h2 class="modern-title">ورود به lynku</h2>
            <p class="modern-subtitle">شماره موبایل خود را وارد کنید</p>

            <div class="input-modern-group">
              <div class="input-container">
                <input
                  id="phone-input"
                  v-model="phone"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="modern-input"
                  placeholder="09123456789"
                  @keyup.enter="login()"
                  maxlength="11"
                >
                <label for="phone-input" class="modern-label">شماره موبایل</label>
                <div class="input-border"></div>
              </div>
              <div class="input-hint" v-if="phone && !isPhoneValid">
                شماره موبایل باید ۱۱ رقم باشد
              </div>
            </div>

            <button class="modern-btn primary" @click="login()" :disabled="!isPhoneValid">
              <span class="btn-content">
                ادامه
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </span>
            </button>
          </div>

          <!-- Verification Step -->
          <div class="step-container" v-if="nextStep">
            <div class="step-indicator">
              <div class="step completed">1</div>
              <div class="step-line active"></div>
              <div class="step active">2</div>
            </div>

            <h2 class="modern-title">کد تأیید</h2>
            <p class="modern-subtitle">کد ارسال شده به {{ formatPhone(phone) }} را وارد کنید</p>

            <div class="input-modern-group">
              <div class="input-container">
                <input
                  id="code-input"
                  v-model="code"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  class="modern-input code-input"
                  placeholder="12345"
                  @keyup.enter="verify()"
                  maxlength="6"
                >
                <label for="code-input" class="modern-label">کد تأیید</label>
                <div class="input-border"></div>
              </div>
              <div class="input-hint" v-if="code && !isCodeValid">
                کد باید حداقل ۳ رقم باشد
              </div>
            </div>

            <div class="timer-section" v-if="nextStep">
              <span class="timer-text">ارسال مجدد کد</span>
              <span class="timer" :class="{ 'timer-active': canResend }">
                {{ formatTime(countdown) }}
              </span>
            </div>

            <div class="action-buttons">
              <button class="modern-btn primary" @click="verify()" :disabled="!isCodeValid">
                <span class="btn-content">
                  تأیید و ورود
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </span>
              </button>

              <button class="modern-btn secondary" @click="resendCode()" :disabled="!canResend">
                <span class="btn-content">
                  ارسال مجدد کد
                </span>
              </button>

              <button class="modern-btn text" @click="nextStep = false">
                <span class="btn-content">
                  تغییر شماره موبایل
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modern-footer">
          <p>با ورود، شرایط و قوانین را می‌پذیرید</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/api';
import { setCookie, getCookie } from '@/cookie';
import { emitter } from './../utils/event-bus';

export default {
  emits: ["loading"],
  name: 'Login',
  data() {
    return {
      nextStep: false,
      phone: '',
      code: '',
      countdown: 60,
      canResend: false
    }
  },
  computed: {
    isPhoneValid() {
      return this.phone.length === 11 && /^\d+$/.test(this.phone);
    },
    isCodeValid() {
      return this.code.length >= 3;
    }
  },
  methods: {
    formatPhone(phone) {
      return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    startCountdown() {
      this.countdown = 60;
      this.canResend = false;

      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.canResend = true;
        }
      }, 1000);
    },

    verify() {
      if (!this.isCodeValid) return;

      this.$emit("loading", true);
      post('/auth/verify', { phone: this.phone, code: this.code })
        .then(response => {
          console.log(response);
          this.$emit("loading", false);

          if (response.success) {
            setCookie("app-token", response.token, 7);
            setCookie("app-id", response._id, 7);
            setCookie("app-channel", response.channel, 7);
            emitter.emit('brokerCredentials');
            emitter.emit('refresh-navigation-state');

            if(response.firstLogin){
              this.$router.push('/avatar');
            }else{
              this.$router.push('/');
            }

          } else {
            alert('کد تأیید اشتباه است.');
          }
        })
        .catch(error => {
          this.$emit("loading-ended", "true");
          console.error(error);
          alert('خطا در احراز هویت. لطفا دوباره تلاش کنید.');
        });
    },

    login() {
      if (!this.isPhoneValid) return;

      this.$emit("loading-started", "true");
      post('/auth/entry', { phone: this.phone })
        .then(response => {
          this.$emit("loading-ended", "true");

          if (response.success) {
            this.nextStep = true;
            this.startCountdown();
          } else {
            alert('خطا در ارسال کد تأیید. لطفا شماره را بررسی کنید.');
          }
        })
        .catch(error => {
          this.$emit("loading-ended", "true");
          console.error(error);
          alert('خطای شبکه. لطفا اتصال خود را بررسی کنید.');
        });
    },

    resendCode() {
      if (!this.canResend) return;

      this.login();
    }
  },
  mounted() {
    if (getCookie('app-token')) {
      this.$router.replace('/');
    }
  }
}
</script>

<style scoped>
/* Base Styles */
.login-modern-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background: #0a0a0a;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(41, 98, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 230, 118, 0.1) 0%, transparent 50%);
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
}

.modern-container {
  width: 100%;
  max-width: 400px;
}

/* Card */
.modern-card {
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.modern-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(41, 98, 255, 0.5), transparent);
}

/* Header */
.modern-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2962ff, #00e676);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-icon svg {
  width: 20px;
  height: 20px;
}

.brand-text {
  font-size: 48px;
  font-family: "Honk", system-ui;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "MORF" 15,
    "SHLN" 50;
  letter-spacing: -0.5px;
}

.header-glow {
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #2962ff, transparent);
  margin: 0 auto;
  opacity: 0.6;
}

/* Content */
.modern-content {
  margin-bottom: 32px;
}

.step-container {
  animation: slideUp 0.4s ease-out;
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

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.step.active {
  background: #2962ff;
  color: white;
  border-color: #2962ff;
}

.step.completed {
  background: #00e676;
  color: #0a0a0a;
  border-color: #00e676;
}

.step-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.step-line.active {
  background: #2962ff;
}

.step-line.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #2962ff;
  animation: lineProgress 60s linear;
}

@keyframes lineProgress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Titles */
.modern-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.modern-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;
}

/* Inputs */
.input-modern-group {
  margin-bottom: 24px;
}

.input-container {
  position: relative;
}

.modern-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 12px;
  padding: 20px 16px 8px;
  padding-top: 35px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  text-align: right;
  direction: ltr;
}

.modern-input.code-input {
  text-align: center;
  letter-spacing: 8px;
  font-size: 18px;
  font-weight: 600;
}

.modern-input:focus {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(41, 98, 255, 0.3);
}

.modern-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* Hide number input spinners */
.modern-input::-webkit-outer-spin-button,
.modern-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.modern-input[type=number] {
  -moz-appearance: textfield;
}

.modern-label {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  transition: all 0.3s ease;
  pointer-events: none;
}

.modern-input:focus + .modern-label,
.modern-input:not(:placeholder-shown) + .modern-label {
  top: 6px;
  font-size: 10px;
  color: #2962ff;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #2962ff, #00e676);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  border-radius: 0 0 12px 12px;
}

.modern-input:focus ~ .input-border {
  transform: scaleX(1);
}

.input-hint {
  font-size: 12px;
  color: #ff4444;
  margin-top: 8px;
  text-align: right;
}

/* Timer */
.timer-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.timer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.timer {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
}

.timer-active {
  color: #00e676;
}

/* Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modern-btn {
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.modern-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Primary Button */
.modern-btn.primary {
  background: linear-gradient(135deg, #2962ff, #00e676);
  color: white;
  box-shadow: 0 4px 20px rgba(41, 98, 255, 0.3);
}

.modern-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(41, 98, 255, 0.4);
}

.modern-btn.primary:active:not(:disabled) {
  transform: translateY(0);
}

/* Secondary Button */
.modern-btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modern-btn.secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Text Button */
.modern-btn.text {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  padding: 12px;
}

.modern-btn.text:hover:not(:disabled) {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

/* Footer */
.modern-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.modern-footer p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .modern-container {
    max-width: 100%;
  }

  .modern-card {
    padding: 32px 24px;
    border-radius: 20px;
  }

  .modern-title {
    font-size: 22px;
  }

  .step-line {
    width: 40px;
  }
}

/* Loading state */
.modern-btn:disabled .btn-content::after {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>