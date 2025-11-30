<template>
  <div class="sound-player">
    <!-- MODE SWITCH: record / upload (icon only) -->
    <div class="mode-switch">
      <button
        class="mode-btn"
        :class="{ active: mode === 'record' }"
        @click="switchMode('record')"
        aria-label="ضبط صدا"
      >
        <!-- Mic icon -->
        <svg viewBox="0 0 24 24">
          <rect x="9" y="4" width="6" height="10" rx="3" />
          <path d="M7 11v1a5 5 0 0 0 10 0v-1" />
          <path d="M12 16v4" />
          <path d="M9 20h6" />
        </svg>
      </button>
      <button
        class="mode-btn"
        :class="{ active: mode === 'upload' }"
        @click="switchMode('upload')"
        aria-label="آپلود صدا"
      >
        <!-- Upload / cloud icon -->
        <svg viewBox="0 0 24 24">
          <path
            d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1.2A4 4 0 1 1 17 18H7z"
          />
          <path d="M12 9v7" />
          <path d="M9.5 11.5 12 9l2.5 2.5" />
        </svg>
      </button>
    </div>

    <!-- RECORD MODE -->
    <div v-if="mode === 'record'" class="record-panel">
      <button
        class="record-btn"
        :class="{ recording: isRecording }"
        @click="toggleRecording"
        aria-label="شروع یا توقف ضبط"
      >
        <div class="record-icon-wrap">
          <div class="record-pulse" v-if="isRecording"></div>
          <div class="record-circle">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
            </svg>
          </div>
        </div>
      </button>

      <div class="record-meta">
        <div class="time-row">
          <span class="time-current">{{ formatTime(recordTime) }}</span>
          <span class="time-divider">/</span>
          <span class="time-limit">{{ formatTime(recordLimit) }}</span>
        </div>
        <div class="time-bar">
          <div
            class="time-fill"
            :style="{ width: Math.min(100, (recordTime / recordLimit) * 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- UPLOAD MODE -->
    <div v-else class="upload-panel">
      <label class="upload-btn" aria-label="انتخاب فایل صوتی">
        <input type="file" hidden accept="audio/*" @change="handleUpload" />
        <svg viewBox="0 0 24 24">
          <path d="M12 16V5" />
          <path d="M8.5 8.5 12 5l3.5 3.5" />
          <rect x="5" y="14" width="14" height="5" rx="1.5" />
        </svg>
      </label>

      <div class="file-info">
        <svg viewBox="0 0 24 24" class="file-icon">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h2" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>

        <span v-if="fileName" class="file-name">
          {{ fileName }}
        </span>
        <span v-else class="file-placeholder">
          …
        </span>

        <button
          v-if="audioLoaded"
          class="clear-btn"
          @click="clearAudio"
          aria-label="حذف صدا"
        >
          <svg viewBox="0 0 24 24">
            <path d="M6 7h12" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 7l1-2h4l1 2" />
            <rect x="6" y="7" width="12" height="12" rx="2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioEl"
      @timeupdate="updateTime"
      @loadedmetadata="setDuration"
      @ended="onEnded"
    ></audio>

    <!-- VISUALIZER -->
    <div class="visualizer" :class="{ disabled: !audioLoaded }">
      <div
        v-for="(h, i) in bars"
        :key="i"
        class="bar"
        :style="{ height: (audioLoaded ? h : 5) + '%' }"
      ></div>
    </div>

    <!-- PLAYER CONTROLS -->
    <div class="player">
      <!-- Play / Pause (bigger neon) -->
      <button
        class="play-wrapper"
        :class="{ disabled: !audioLoaded || isRecording }"
        @click="togglePlay"
        :disabled="!audioLoaded || isRecording"
        aria-label="پخش / توقف"
      >
        <!-- PLAY -->
        <svg
          v-if="!isPlaying"
          width="72"
          height="72"
          viewBox="0 0 72 72"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="neon-glow-play-big">
              <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00f6ff" />
            </filter>
          </defs>
          <circle cx="36" cy="36" r="30" stroke="#00f6ff" stroke-width="3" fill="none" />
          <circle cx="36" cy="36" r="30" filter="url(#neon-glow-play-big)" />
          <polygon points="30,24 48,36 30,48" fill="#00f6ff" />
        </svg>

        <!-- PAUSE -->
        <svg
          v-else
          width="72"
          height="72"
          viewBox="0 0 72 72"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="neon-glow-pause-big">
              <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#1DA1F2" />
            </filter>
          </defs>
          <circle cx="36" cy="36" r="30" stroke="#1DA1F2" stroke-width="3" fill="none" />
          <circle cx="36" cy="36" r="30" filter="url(#neon-glow-pause-big)" />
          <rect x="28" y="24" width="7" height="24" fill="#1DA1F2" />
          <rect x="37" y="24" width="7" height="24" fill="#1DA1F2" />
        </svg>
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
        <div class="time-row small">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- Volume & speed -->
      <div class="extras">
        <div class="volume">
          <button class="icon-btn small" aria-label="ولوم">
            <svg viewBox="0 0 24 24">
              <path d="M5 10v4h3l4 3V7L8 10H5z" />
              <path d="M16 9a3 3 0 0 1 0 6" />
            </svg>
          </button>
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
          <button class="icon-btn small" aria-label="سرعت پخش">
            <svg viewBox="0 0 24 24">
              <path d="M5 5h14v14H5z" />
              <path d="M10 9l3 3-3 3" fill="#050814" />
            </svg>
          </button>
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
import { ref, onUnmounted, defineExpose } from "vue"

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

// 24 bars, stretch full width
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

const switchMode = nextMode => {
  if (mode.value === nextMode) return
  mode.value = nextMode
  errorMessage.value = ""
}

// ---------- Upload from <input type="file"> ----------
const handleUpload = e => {
  try {
    const file = e.target.files?.[0]
    if (!file) return

    errorMessage.value = ""
    fileName.value = file.name

    loadFromBlob(file)
  } catch (err) {
    console.error(err)
    errorMessage.value = "خطا در خواندن فایل صوتی."
  }
}

// ---------- Generic loaders for binary / streams ----------
const loadFromBlob = blob => {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl)
    currentObjectUrl = null
  }

  currentObjectUrl = URL.createObjectURL(blob)

  resetPlayerState()
  if (!audioEl.value) return
  audioEl.value.src = currentObjectUrl
  audioEl.value.load()
  audioLoaded.value = true
  initVisualizerGraph()
}

/**
 * Load audio from ArrayBuffer (e.g. fetch response.arrayBuffer())
 * mimeType: e.g. 'audio/webm' or 'audio/mpeg' or 'audio/mp4'
 */
const loadFromArrayBuffer = (buffer, mimeType = "audio/webm") => {
  const blob = new Blob([buffer], { type: mimeType })
  fileName.value = "streamed-audio"
  loadFromBlob(blob)
}

/**
 * Load audio from Uint8Array (raw bytes)
 */
const loadFromByteArray = (byteArray, mimeType = "audio/webm") => {
  const blob = new Blob([byteArray], { type: mimeType })
  fileName.value = "streamed-audio"
  loadFromBlob(blob)
}

/**
 * Example for a binary endpoint that returns bytes:
 * await playerRef.loadFromUrlAsBytes('/api/audio/123', 'audio/webm')
 */
const loadFromUrlAsBytes = async (url, mimeType = "audio/webm") => {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to load audio")
    const buffer = await res.arrayBuffer()
    loadFromArrayBuffer(buffer, mimeType)
  } catch (e) {
    console.error(e)
    errorMessage.value = "خطا در دریافت صدا."
  }
}

// expose for parent component
defineExpose({
  loadFromArrayBuffer,
  loadFromByteArray,
  loadFromUrlAsBytes
})

// ---------- Clear ----------
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
    try {
      errorMessage.value = ""

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
        fileName.value = "ضبط شده (" + new Date().toLocaleTimeString() + ")"
        loadFromBlob(blob)
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
  padding: 18px;
  border-radius: 20px;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
  "IRANSans", sans-serif;
  background: #050814;
  border: 1px solid rgba(120, 120, 255, 0.28);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
}

/* Mode switch */
.mode-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.mode-btn {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #090d1d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: 0.18s ease;
}

.mode-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #d0d3ff;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mode-btn.active {
  background: #ffffff;
  border-color: #ffffff;
}

.mode-btn.active svg {
  stroke: #050814;
}

/* Record panel */
.record-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.record-btn {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: #090d1d;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-btn.recording {
  background: #1a060b;
  border-color: #ff3b5c;
}

.record-icon-wrap {
  position: relative;
  width: 42px;
  height: 42px;
}

.record-pulse {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 2px solid rgba(255, 59, 92, 0.7);
  animation: pulse 1.2s infinite;
}

.record-circle {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: #ff3b5c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.record-circle svg {
  width: 16px;
  height: 16px;
  fill: #050814;
}

/* Record meta */
.record-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.time-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 0.86rem;
}

.time-row.small {
  justify-content: space-between;
  font-size: 0.78rem;
  opacity: 0.8;
}

.time-current {
  font-weight: 600;
}

.time-divider {
  opacity: 0.6;
}

.time-limit {
  opacity: 0.8;
}

.time-bar {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: #15182a;
  overflow: hidden;
}

.time-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff3b5c, #ffb347);
}

/* Upload panel */
.upload-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.upload-btn {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #090d1d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: #e0e3ff;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
}

.file-icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #a8adff;
  stroke-width: 1.5;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-placeholder {
  flex: 1;
  opacity: 0.4;
}

.clear-btn {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: transparent;
  cursor: pointer;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #f0a0a0;
  stroke-width: 1.6;
}

/* Error */
.error {
  font-size: 0.78rem;
  color: #ff8a8a;
  margin-bottom: 8px;
}

/* Visualizer - full width bars */
.visualizer {
  height: 80px;
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
  align-items: flex-end;
  width: 100%;
}

.visualizer.disabled {
  opacity: 0.4;
}

.bar {
  flex: 1;
  min-width: 0;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffffff, #3b98ff);
  transition: height 0.12s ease-out;
}

/* Player */
.player {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Big neon play button wrapper */
.play-wrapper {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.play-wrapper.disabled {
  opacity: 0.3;
  cursor: default;
}

/* Extras cluster */
.extras {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
}

.icon-btn {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #090d1d;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.small {
  padding: 4px;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #e0e3ff;
  stroke-width: 1.6;
}

/* Timeline */
.timeline {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline input[type="range"] {
  width: 100%;
}

/* Volume & speed */
.volume,
.speed {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume input[type="range"] {
  width: 70px;
}

.speed select {
  background: #090d1d;
  color: #fff;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  padding: 2px 6px;
  font-size: 0.75rem;
}

/* Animations */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.12);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .sound-player {
    padding: 14px;
  }

  .extras {
    min-width: 100px;
  }

  .volume input[type="range"] {
    width: 60px;
  }
}
</style>
