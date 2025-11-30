<template>
  <div class="sound-player">
    <!-- Mode Tabs -->
    <div class="mode-switch">
      <button
        class="mode-btn"
        :class="{ active: mode === 'record' }"
        @click="switchMode('record')"
      >
        🎙 ضبط صدا
      </button>
      <button
        class="mode-btn"
        :class="{ active: mode === 'upload' }"
        @click="switchMode('upload')"
      >
        📂 آپلود صدا
      </button>
    </div>

    <!-- RECORD MODE -->
    <div v-if="mode === 'record'" class="record-panel">
      <button
        class="record-btn"
        :class="{ 'recording': isRecording }"
        @click="toggleRecording"
      >
        <span class="record-indicator">
          <span class="dot"></span>
        </span>
        <span v-if="!isRecording">شروع ضبط</span>
        <span v-else>در حال ضبط... کلیک برای توقف</span>
      </button>

      <div class="record-meta">
        <div class="time-row">
          <span class="time-label">مدت ضبط:</span>
          <span class="time-value">
            {{ formatTime(recordTime) }} / {{ formatTime(recordLimit) }}
          </span>
        </div>
        <div class="hint">
          می‌تونی تا {{ Math.floor(recordLimit / 60) }} دقیقه ضبط کنی. بعد از توقف، صدا برای پخش این پایین میاد.
        </div>
        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <!-- UPLOAD MODE -->
    <div v-else class="upload-panel">
      <label class="upload-btn">
        <input type="file" hidden accept="audio/*" @change="handleUpload" />
        انتخاب فایل صوتی
      </label>
      <div class="file-info">
        <span v-if="fileName">فایل انتخاب‌شده: <strong>{{ fileName }}</strong></span>
        <span v-else class="file-placeholder">هیچ فایلی انتخاب نشده</span>

        <button v-if="audioLoaded" class="clear-btn" @click="clearAudio">
          حذف صدا
        </button>
      </div>
      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioEl"
      @timeupdate="updateTime"
      @loadedmetadata="setDuration"
      @ended="onEnded"
    ></audio>

    <!-- Visualizer -->
    <div class="visualizer" :class="{ disabled: !audioLoaded }">
      <div
        v-for="(h, i) in bars"
        :key="i"
        class="bar"
        :style="{ height: (audioLoaded ? h : 5) + '%' }"
      ></div>
    </div>

    <!-- Player Controls -->
    <div class="player">
      <!-- Play / Pause -->
      <button
        class="play-btn"
        :class="{ disabled: !audioLoaded || isRecording }"
        @click="togglePlay"
        :disabled="!audioLoaded || isRecording"
      >
        <template v-if="!isPlaying">
          <svg width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="neon-glow-play">
                <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#00f6ff"/>
              </filter>
            </defs>
            <circle cx="29" cy="29" r="26" stroke="#00f6ff" stroke-width="3" fill="none" />
            <circle cx="29" cy="29" r="26" filter="url(#neon-glow-play)" />
            <polygon points="23,18 40,29 23,40" fill="#00f6ff" />
          </svg>
        </template>
        <template v-else>
          <svg width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="neon-glow-pause">
                <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#1DA1F2"/>
              </filter>
            </defs>
            <circle cx="29" cy="29" r="26" stroke="#1DA1F2" stroke-width="3" fill="none" />
            <circle cx="29" cy="29" r="26" filter="url(#neon-glow-pause)" />
            <rect x="22" y="18" width="6" height="22" fill="#1DA1F2"/>
            <rect x="32" y="18" width="6" height="22" fill="#1DA1F2"/>
          </svg>
        </template>
      </button>

      <!-- Timeline -->
      <div class="timeline">
        <input
          type="range"
          min="0"
          :max="duration || 0"
          step="0.01"
          v-model.number="currentTime"
          @input="seek"
          :disabled="!audioLoaded"
        />
        <div class="time-row">
          <span>{{ formatTime(currentTime) }}</span>
          <span>/</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Volume + Speed -->
      <div class="extras">
        <div class="volume">
          <span class="label">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="volume"
            @input="updateVolume"
          />
        </div>
        <div class="speed">
          <span class="label">⏩</span>
          <select v-model.number="playbackRate" @change="updateRate">
            <option :value="0.75">0.75x</option>
            <option :value="1">1x</option>
            <option :value="1.25">1.25x</option>
            <option :value="1.5">1.5x</option>
            <option :value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue"

const audioEl = ref(null)
const isPlaying = ref(false)
const isRecording = ref(false)
const mode = ref("record") // 'record' | 'upload'

const duration = ref(0)
const currentTime = ref(0)
const audioLoaded = ref(false)

const recordTime = ref(0)
const recordLimit = 120 // seconds
let recordTimerId = null

const volume = ref(1)
const playbackRate = ref(1)

const bars = ref(Array(24).fill(5))

let audioCtx = null
let analyser = null
let source = null
let freqData = null
let rafId = null
let sourceConnected = false

let mediaRecorder = null
let mediaStream = null
let chunks = []

const errorMessage = ref("")
const fileName = ref("")
let currentObjectUrl = null

// ---------- Helpers ----------
const formatTime = t => {
  if (!t || isNaN(t)) return "0:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s < 10 ? "0" : ""}${s}`
}

// ---------- Mode ----------
const switchMode = nextMode => {
  if (mode.value === nextMode) return
  mode.value = nextMode
  errorMessage.value = ""
}

// ---------- Upload ----------
const handleUpload = e => {
  try {
    const file = e.target.files?.[0]
    if (!file) return

    errorMessage.value = ""
    fileName.value = file.name

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl)
      currentObjectUrl = null
    }

    const url = URL.createObjectURL(file)
    currentObjectUrl = url

    resetPlayerState()
    audioEl.value.src = url
    audioEl.value.load()
    audioLoaded.value = true
    initVisualizerGraph()
  } catch (err) {
    console.error(err)
    errorMessage.value = "خطا در خواندن فایل صوتی."
  }
}

const clearAudio = () => {
  audioLoaded.value = false
  isPlaying.value = false
  fileName.value = ""
  currentTime.value = 0
  duration.value = 0
  if (audioEl.value) {
    audioEl.value.pause()
    audioEl.value.removeAttribute("src")
    audioEl.value.load()
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl)
    currentObjectUrl = null
  }
  cancelAnimationFrame(rafId)
}

// ---------- Recording ----------
const toggleRecording = async () => {
  if (!isRecording.value) {
    // start recording
    try {
      errorMessage.value = ""

      // stop playback if playing
      if (isPlaying.value) {
        audioEl.value.pause()
        isPlaying.value = false
        cancelAnimationFrame(rafId)
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStream = stream
      mediaRecorder = new MediaRecorder(stream)
      chunks = []

      mediaRecorder.ondataavailable = e => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        if (currentObjectUrl) {
          URL.revokeObjectURL(currentObjectUrl)
        }
        const url = URL.createObjectURL(blob)
        currentObjectUrl = url

        fileName.value = "ضبط شده (" + new Date().toLocaleTimeString() + ")"

        resetPlayerState()
        audioEl.value.src = url
        audioEl.value.load()
        audioLoaded.value = true
        initVisualizerGraph()
      }

      mediaRecorder.start()
      isRecording.value = true
      recordTime.value = 0

      recordTimerId = setInterval(() => {
        recordTime.value++
        if (recordTime.value >= recordLimit) {
          stopRecording()
        }
      }, 1000)
    } catch (err) {
      console.error(err)
      errorMessage.value = "دسترسی به میکروفن رد شد یا خطایی رخ داد."
      stopRecording(true)
    }
  } else {
    // stop recording
    stopRecording()
  }
}

const stopRecording = (silent = false) => {
  if (!isRecording.value) return
  isRecording.value = false

  if (recordTimerId) {
    clearInterval(recordTimerId)
    recordTimerId = null
  }

  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop()
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach(t => t.stop())
    mediaStream = null
  }

  if (silent) {
    chunks = []
  }
}

// ---------- Playback ----------
const togglePlay = () => {
  if (!audioLoaded.value || isRecording.value) return

  if (!isPlaying.value) {
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume()
    }
    audioEl.value.play()
    isPlaying.value = true
    startVisualizerLoop()
  } else {
    audioEl.value.pause()
    isPlaying.value = false
    cancelAnimationFrame(rafId)
  }
}

const updateTime = () => {
  if (!audioEl.value) return
  currentTime.value = audioEl.value.currentTime
}

const setDuration = () => {
  if (!audioEl.value || isNaN(audioEl.value.duration)) return
  duration.value = audioEl.value.duration
}

const seek = () => {
  if (!audioEl.value || !audioLoaded.value) return
  audioEl.value.currentTime = currentTime.value
}

const onEnded = () => {
  isPlaying.value = false
  cancelAnimationFrame(rafId)
}

// ---------- Volume & Speed ----------
const updateVolume = () => {
  if (!audioEl.value) return
  audioEl.value.volume = volume.value
}

const updateRate = () => {
  if (!audioEl.value) return
  audioEl.value.playbackRate = playbackRate.value
}

// ---------- Visualizer ----------
const initVisualizerGraph = () => {
  if (!audioEl.value) return

  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }

  if (!analyser) {
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024
    freqData = new Uint8Array(analyser.frequencyBinCount)
  }

  if (!sourceConnected) {
    source = audioCtx.createMediaElementSource(audioEl.value)
    source.connect(analyser)
    analyser.connect(audioCtx.destination)
    sourceConnected = true
  }
}

const startVisualizerLoop = () => {
  const loop = () => {
    if (!isPlaying.value || !analyser || !freqData) return

    analyser.getByteFrequencyData(freqData)
    const step = Math.floor(freqData.length / bars.value.length)

    for (let i = 0; i < bars.value.length; i++) {
      const slice = freqData.subarray(i * step, (i + 1) * step)
      let sum = 0
      for (let j = 0; j < slice.length; j++) sum += slice[j]
      const avg = slice.length ? sum / slice.length : 0
      bars.value[i] = Math.max(5, avg / 2)
    }

    rafId = requestAnimationFrame(loop)
  }

  loop()
}

// ---------- Util ----------
const resetPlayerState = () => {
  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0
  cancelAnimationFrame(rafId)
}

// ---------- Cleanup ----------
onUnmounted(() => {
  cancelAnimationFrame(rafId)

  if (recordTimerId) clearInterval(recordTimerId)
  if (mediaStream) mediaStream.getTracks().forEach(t => t.stop())
  if (audioEl.value) {
    audioEl.value.pause()
  }
  if (audioCtx && audioCtx.state !== "closed") {
    audioCtx.close()
  }
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl)
  }
})
</script>

<style scoped>
.sound-player {
  width: 100%;
  margin: auto;
  padding: 20px;
  border-radius: 16px;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
  "IRANSans", sans-serif;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  background: radial-gradient(circle at top, #1c1636 0, #050814 60%);
  border: 1px solid rgba(120, 120, 255, 0.35);
}

/* Mode switch */
.mode-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.mode-btn {
  flex: 1;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(5, 5, 20, 0.8);
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.mode-btn.active {
  background: linear-gradient(135deg, #ff33ff, #33f6ff);
  color: #050814;
  box-shadow:
    0 0 15px rgba(255, 51, 255, 0.6),
    0 0 20px rgba(51, 246, 255, 0.4);
}

/* Record panel */
.record-panel {
  margin-bottom: 18px;
}

.record-btn {
  width: 100%;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(5, 8, 25, 0.95);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-size: 0.8rem;
  box-shadow:
    0 0 8px rgba(255, 51, 102, 0.6),
    0 0 16px rgba(255, 51, 102, 0.3);
  transition: 0.2s ease;
}

.record-btn:hover {
  transform: translateY(-1px);
}

.record-btn.recording {
  background: radial-gradient(circle at center, #ff4d6a 0, #350014 65%);
}

.record-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.record-indicator .dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ff4d6a;
  box-shadow:
    0 0 8px rgba(255, 77, 106, 0.9),
    0 0 16px rgba(255, 77, 106, 0.8);
  animation: pulse 1s infinite;
}

.record-meta {
  margin-top: 10px;
  font-size: 0.8rem;
}

.record-meta .time-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.record-meta .hint {
  color: #c6c6ff;
  opacity: 0.85;
}

.error {
  margin-top: 6px;
  font-size: 0.78rem;
  color: #ff8080;
}

/* Upload panel */
.upload-panel {
  margin-bottom: 18px;
}

.upload-btn {
  background: none;
  padding: 10px 14px;
  font-size: 0.8rem;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  background: #0d0d0d;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow:
    0 0 3px #6a5af9,
    0 0 16px rgba(106, 90, 249, 0.7) inset;
}

.file-info {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
}

.file-placeholder {
  opacity: 0.7;
}

.clear-btn {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: #fff;
  cursor: pointer;
}

/* Visualizer */
.visualizer {
  height: 70px;
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  align-items: flex-end;
  width: 100%;
}

.visualizer.disabled {
  opacity: 0.45;
}

.bar {
  width: 6px;
  border-radius: 4px;
  margin: auto;
  border: 0.08rem solid #000;
  box-shadow:
    0 0 6px rgb(29, 161, 242),
    0 0 12px rgb(29, 161, 242),
    0 0 10px rgba(29, 161, 242, 0.4);
  transition: height 0.12s ease-out, box-shadow 0.2s ease-out;
  position: relative;
  overflow: hidden;
}

.bar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: rgba(255, 255, 255, 0.18);
  filter: blur(4px);
}

/* Player */
.player {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-btn {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.9;
  transition: 0.2s ease;
}

.play-btn.disabled {
  opacity: 0.3;
  cursor: default;
}

.play-btn:hover:not(.disabled) {
  transform: translateY(-1px) scale(1.02);
}

.timeline {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.timeline input[type="range"] {
  width: 100%;
}

.timeline .time-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 2px;
}

/* Extras: volume + speed */
.extras {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.volume,
.speed {
  display: flex;
  align-items: center;
  gap: 6px;
}

.label {
  font-size: 0.85rem;
}

.volume input[type="range"] {
  width: 80px;
}

.speed select {
  background: #050814;
  color: #fff;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 3px 6px;
  font-size: 0.75rem;
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.4;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}
</style>
