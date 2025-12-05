<template>
  <div class="login-page">
    <div class="bg-orbits"></div>
    <div class="bg-noise"></div>

    <div class="auth-shell">
      <div class="auth-card">
        <!-- Header / Brand -->
        <div class="auth-header">
          <div class="brand">
            <span class="brand-main">lynku</span>
            <span class="brand-sub">metaverse access</span>
          </div>

          <!-- Minimal step pill -->
          <div class="step-pill">
            <span class="step-pill-text">
              {{ nextStep ? '۲ / ۲' : '۱ / ۲' }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="auth-body">
          <!-- STEP 1: phone -->
          <div v-if="!nextStep" class="step fade-in">
            <h1 class="title">ورود به لینکو</h1>
            <p class="subtitle">
              شماره موبایل خود را وارد کنید تا لینک ورود برایتان ارسال شود
            </p>

            <div class="field-group">
              <label class="field-label" for="phone-input">شماره موبایل</label>
              <div class="field-shell" :class="{ error: phone && !isPhoneValid }">
                <input
                  id="phone-input"
                  v-model="phone"
                  type="tel"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="11"
                  class="field-input"
                  placeholder="09123456789"
                  @keyup.enter="login()"
                >
              </div>
              <p v-if="phone && !isPhoneValid" class="field-hint">
                شماره موبایل باید ۱۱ رقم باشد
              </p>
            </div>

            <button
              class="btn primary"
              :disabled="!isPhoneValid"
              @click="login()"
            >
              <span class="btn-inner">
                ادامه
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </span>
            </button>

            <p class="legal">
              با ورود، شرایط استفاده و قوانین لینکو را می‌پذیرید.
            </p>
          </div>

          <!-- STEP 2: code -->
          <div v-else class="step fade-in">
            <h1 class="title">کد تأیید</h1>
            <p class="subtitle">
              کد ارسال‌شده به
              <span class="phone-highlight">{{ formatPhone(phone) }}</span>
              را وارد کنید
            </p>

            <div class="field-group">
              <label class="field-label" for="code-input">کد تأیید</label>
              <div class="field-shell" :class="{ error: code && !isCodeValid }">
                <input
                  id="code-input"
                  v-model="code"
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="6"
                  class="field-input code"
                  placeholder="123456"
                  @keyup.enter="verify()"
                >
              </div>
              <p v-if="code && !isCodeValid" class="field-hint">
                کد باید حداقل ۳ رقم باشد
              </p>
            </div>

            <div class="timer-row">
              <span class="timer-label">ارسال مجدد کد</span>
              <button
                class="timer-btn"
                :class="{ active: canResend }"
                :disabled="!canResend"
                @click="resendCode()"
              >
                {{ canResend ? 'ارسال دوباره' : formatTime(countdown) }}
              </button>
            </div>

            <button
              class="btn primary"
              :disabled="!isCodeValid"
              @click="verify()"
            >
              <span class="btn-inner">
                تأیید و ورود
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M9 16.17L4.83 12 3.41 13.41 9 19 21 7l-1.41-1.41z"
                  />
                </svg>
              </span>
            </button>

            <button class="btn ghost" @click="nextStep = false">
              تغییر شماره موبایل
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { post } from '@/api'
import { setCookie, getCookie } from '@/cookie'
import { emitter } from './../utils/event-bus'

const emit = defineEmits(['loading'])
const router = useRouter()

const nextStep = ref(false)
const phone = ref('')
const code = ref('')
const countdown = ref(60)
const canResend = ref(false)

const isPhoneValid = computed(() => {
  return phone.value.length === 11 && /^\d+$/.test(phone.value)
})

const isCodeValid = computed(() => {
  return code.value.length >= 3
})

const formatPhone = (value) => {
  if (!value) return ''
  return value.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startCountdown = () => {
  countdown.value = 60
  canResend.value = false

  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      canResend.value = true
    }
  }, 1000)
}

const verify = async () => {
  if (!isCodeValid.value) return

  emit('loading', true)
  try {
    const response = await post('/auth/verify', {
      phone: phone.value,
      code: code.value
    })
    emit('loading', false)

    if (response.success) {
      setCookie('app-token', response.token, 7)
      setCookie('app-id', response._id, 7)
      setCookie('app-channel', response.channel, 7)
      emitter.emit('brokerCredentials')

      if (response.firstLogin) {
        emitter.emit('refresh-navigation-state')
        router.push('/avatar')
      } else {
        router.push('/')
      }
    } else {
      alert('کد تأیید اشتباه است.')
    }
  } catch (error) {
    emit('loading', false)
    console.error(error)
    alert('خطا در احراز هویت. لطفا دوباره تلاش کنید.')
  }
}

const login = async () => {
  if (!isPhoneValid.value) return

  emit('loading', true)
  try {
    const response = await post('/auth/entry', { phone: phone.value })
    emit('loading', false)

    if (response.success) {
      nextStep.value = true
      startCountdown()
    } else {
      alert('خطا در ارسال کد تأیید. لطفا شماره را بررسی کنید.')
    }
  } catch (error) {
    emit('loading', false)
    console.error(error)
    alert('خطای شبکه. لطفا اتصال خود را بررسی کنید.')
  }
}

const resendCode = () => {
  if (!canResend.value) return
  login()
}

onMounted(() => {
  if (getCookie('app-token')) {
    router.replace('/')
  }
})
</script>

<style scoped>
/* ===== Page background ===== */
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #050816 0%, #02010a 40%, #010005 100%);
  color: #f9fafb;
  overflow: hidden;
}

/* soft moving blobs */
.bg-orbits {
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.18), transparent 60%),
    radial-gradient(circle at 100% 0%, rgba(244, 114, 182, 0.15), transparent 60%),
    radial-gradient(circle at 50% 100%, rgba(129, 140, 248, 0.18), transparent 65%);
  filter: blur(40px);
  opacity: 0.85;
  pointer-events: none;
}

/* subtle grain */
.bg-noise {
  position: absolute;
  inset: -20%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='noStitch'/%3E%3CfeColorMatrix type='saturate' values='0'%3E%3C/feColorMatrix%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E");
  mix-blend-mode: soft-light;
  pointer-events: none;
}

/* ===== Layout ===== */
.auth-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 16px;
}

.auth-card {
  position: relative;
  border-radius: 26px;
  padding: 26px 22px 24px;
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.92), rgba(5, 7, 15, 0.96));
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.85),
    0 0 60px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(22px);
}

/* glow ring */
.auth-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  border: 1px solid transparent;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.7), rgba(244, 114, 182, 0.7)) border-box;
  mask: linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  opacity: 0.35;
  pointer-events: none;
}

/* ===== Header / Brand ===== */
.auth-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 26px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-main {
  font-family: "Honk", system-ui;
  font-size: 40px;
  line-height: 1;

}

.brand-sub {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9ca3af;
}

/* step pill */
.step-pill {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.7));
  font-size: 11px;
  color: #e5e7eb;
}

.step-pill-text {
  font-variant-numeric: tabular-nums;
}

/* ===== Body ===== */
.auth-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* Title / subtitle */
.title {
  font-size: 22px;
  font-weight: 700;
  color: #f9fafb;
  text-align: right;
}

.subtitle {
  font-size: 13px;
  color: #9ca3af;
  text-align: right;
  line-height: 1.7;
}

.phone-highlight {
  color: #e5e7eb;
  font-weight: 600;
}

/* ===== Fields ===== */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  color: #9ca3af;
  text-align: right;
}

.field-shell {
  position: relative;
  border-radius: 14px;
  padding: 10px 12px;
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(55, 65, 81, 0.9);
  display: flex;
  align-items: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field-shell:focus-within {
  border-color: rgba(129, 140, 248, 0.9);
  box-shadow:
    0 0 0 1px rgba(129, 140, 248, 0.5),
    0 0 20px rgba(59, 130, 246, 0.4);
  background: radial-gradient(circle at top left, rgba(17, 24, 39, 0.98), rgba(15, 23, 42, 0.98));
}

.field-shell.error {
  border-color: rgba(248, 113, 113, 0.9);
  box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.4);
}

.field-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #f9fafb;
  font-size: 15px;
  font-weight: 500;
  text-align: right;
  direction: ltr;
}

.field-input::placeholder {
  color: rgba(148, 163, 184, 0.6);
}

.field-input.code {
  text-align: center;
  letter-spacing: 0.3em;
}

/* numeric tweaks */
.field-input::-webkit-outer-spin-button,
.field-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* hint */
.field-hint {
  font-size: 11px;
  color: #f97373;
  text-align: right;
}

/* ===== Timer row ===== */
.timer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 12px;
  background: radial-gradient(circle at top left, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.85));
  border: 1px solid rgba(55, 65, 81, 0.9);
}

.timer-label {
  font-size: 12px;
  color: #9ca3af;
}

.timer-btn {
  border: none;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  cursor: default;
  font-variant-numeric: tabular-nums;
  transition: color 0.2s ease;
}

.timer-btn.active {
  cursor: pointer;
  color: #4ade80;
}

.timer-btn.active:hover {
  color: #bbf7d0;
}

/* ===== Buttons ===== */
.btn {
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.btn-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* primary */
.btn.primary {
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  color: #f9fafb;
  box-shadow:
    0 10px 30px rgba(79, 70, 229, 0.5),
    0 0 25px rgba(59, 130, 246, 0.7);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 14px 40px rgba(79, 70, 229, 0.7),
    0 0 35px rgba(56, 189, 248, 0.8);
}

.btn.primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow:
    0 6px 20px rgba(79, 70, 229, 0.5),
    0 0 20px rgba(56, 189, 248, 0.6);
}

/* ghost */
.btn.ghost {
  background: transparent;
  color: #9ca3af;
  border-radius: 10px;
}

.btn.ghost:hover {
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

/* disabled */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* ===== Legal ===== */
.legal {
  font-size: 11px;
  color: #6b7280;
  text-align: center;
}

/* ===== Animations ===== */
.fade-in {
  animation: fadeInUp 0.35s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== Responsive ===== */
@media (max-width: 480px) {
  .auth-card {
    padding: 22px 18px 20px;
    border-radius: 22px;
  }

  .brand-main {
    font-size: 34px;
  }

  .title {
    font-size: 20px;
  }
}
</style>
