<template>
  <div class="sound-player">
    <!-- Upload / Record Buttons -->
    <div class="controls">
      <label class="upload-btn">
        <input type="file" hidden accept="audio/*" @change="handleUpload" />
        Upload Audio
      </label>

      <button class="record-btn" @click="toggleRecording">
        <span v-if="isRecording" class="stop-record">Stop Recording...</span>
        <span v-else>Record</span>
      </button>
    </div>

    <!-- Audio Element -->
    <audio ref="audioEl" @timeupdate="updateTime" @loadedmetadata="setDuration"></audio>

    <!-- Visualizer -->
    <div class="visualizer">
      <div
        v-for="n in bars.length"
        :key="n"
        class="bar"
        :style="{ height: bars[n - 1] + '%' }"
      ></div>
    </div>

    <!-- Music Player Controls -->
    <div class="player">
      <button class="play-btn" @click="togglePlay" v-if="!isPlaying">
        <svg width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
          <circle cx="29" cy="29" r="26" stroke="#00f6ff" stroke-width="3" fill="none" />
          <circle cx="29" cy="29" r="26" filter="url(#neon-glow)" />
          <polygon points="23,18 40,29 23,40" fill="#00f6ff" />
          <defs>
            <filter id="neon-glow">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#00f6ff"/>
            </filter>
          </defs>
        </svg>
      </button>
      <button class="play-btn" @click="togglePlay" v-else>
        <svg width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg">
          <circle cx="29" cy="29" r="26" stroke="#1DA1F2" stroke-width="3" fill="none" />
          <circle cx="29" cy="29" r="26" filter="url(#neon-glow2)" />
          <rect x="22" y="18" width="6" height="22" fill="#1DA1F2"/>
          <rect x="32" y="18" width="6" height="22" fill="#1DA1F2"/>
          <defs>
            <filter id="neon-glow2">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#1DA1F2"/>
            </filter>
          </defs>
        </svg>
      </button>


      <div class="timeline">
        <input type="range" min="0" :max="duration" step="0.01" v-model="currentTime" @input="seek" />
      </div>

      <div class="time">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue"

const audioEl = ref(null)
const isPlaying = ref(false)
const isRecording = ref(false)

const duration = ref(0)
const currentTime = ref(0)

const bars = ref(Array(24).fill(1)) // lightweight visualizer 24 bars

// AudioContext (created once)
let audioCtx = null
let analyser = null
let source = null
let freqData = null
let rafId = null

// ------------------ Upload Audio ------------------
const handleUpload = e => {
  const file = e.target.files?.[0]
  if (!file) return

  const url = URL.createObjectURL(file)
  audioEl.value.src = url
  audioEl.value.load()
  initVisualizer()
}

// ------------------ Recording ------------------
let mediaRecorder = null
let chunks = []

const toggleRecording = async () => {
  if (!isRecording.value) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    chunks = []

    mediaRecorder.ondataavailable = e => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" })
      const url = URL.createObjectURL(blob)
      audioEl.value.src = url
      audioEl.value.load()
      initVisualizer()
    }

    mediaRecorder.start()
    isRecording.value = true
  } else {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

// ------------------ Playback ------------------
const togglePlay = () => {
  if (!audioEl.value.src) return

  if (!isPlaying.value) {
    audioEl.value.play()
    isPlaying.value = true
    startVisualizerLoop()
  } else {
    audioEl.value.pause()
    isPlaying.value = false
    cancelAnimationFrame(rafId)
  }
}

const updateTime = () => (currentTime.value = audioEl.value.currentTime)
const setDuration = () => (duration.value = audioEl.value.duration)

const seek = () => {
  if (audioEl.value) audioEl.value.currentTime = currentTime.value
}

// ------------------ Formatter ------------------
const formatTime = t => {
  if (!t) return "0:00"
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s < 10 ? "0" : ""}${s}`
}

// ------------------ Visualizer ------------------
const initVisualizer = () => {
  // Create or resume AudioContext
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }

  // Create analyser
  if (!analyser) {
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 1024 // lower CPU usage
    freqData = new Uint8Array(analyser.frequencyBinCount)
  }

  // Disconnect previous source if exists
  if (source) {
    try {
      source.disconnect()
    } catch (err) {
      console.warn('Error disconnecting previous source:', err)
    }
    source = null
  }

  // Create a new source node from the audio element
  source = audioCtx.createMediaElementSource(audioEl.value)
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
}


const startVisualizerLoop = () => {
  const loop = () => {
    if (!isPlaying.value) return

    analyser.getByteFrequencyData(freqData)

    const step = Math.floor(freqData.length / bars.value.length)

    for (let i = 0; i < bars.value.length; i++) {
      const slice = freqData.slice(i * step, (i + 1) * step)
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length
      bars.value[i] = Math.max(5, avg / 2) // smoother, low CPU
    }

    rafId = requestAnimationFrame(loop)
  }

  loop()
}

// ------------------ Cleanup ------------------
onUnmounted(() => cancelAnimationFrame(rafId))
</script>

<style scoped>
.sound-player {
  width: 100%;
  margin: auto;
  padding: 20px;
  border-radius: 16px;
  color: #fff;
  font-family: sans-serif;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
  direction: ltr;
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.upload-btn,
.record-btn {
  background: none;
  opacity: 0.7;
  padding: 10px 14px;
  font-size: 10px;
  transition: 0.2s;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  background: #0d0d0d;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 3px #6a5af9, 0 0 16px #6a5af9 inset;
}
.record-btn .stop-record {
  font-style: italic;
  color: redl;
}

.upload-btn:hover,
.record-btn:hover {
  opacity: 0.8;
}

.visualizer {
  height: 60px;
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  align-items: flex-end;
  width: 100%;
}

.bar {
  width: 6px;
  border-radius: 4px;
margin: auto;
 border: 0.1rem solid #000;

  /* Neon glow */
  box-shadow:
    0 0 6px rgb(29, 161, 242),
    0 0 12px rgb(29, 161, 242),
    0 0 10px rgba(29, 161, 242, 0.4);

  /* Smooth bar movement */
  transition: height 0.12s ease-out, box-shadow 0.2s ease-out;

  /* Optional glossy feel */
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


.player {
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-btn {
  background: none;
  opacity: 0.7;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
}

.timeline {
  flex: 1;
}

.timeline input {
  width: 100%;
}

.time {
  font-size: 13px;
  opacity: 0.8;
}
</style>
