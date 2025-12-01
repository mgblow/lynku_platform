<template>
  <!-- Do NOT render anything if no selectedData is passed -->
  <div v-if="rawTex" class="tex-card mt-3">
    <div class="tex-main">
      <!-- Header -->
      <div class="tex-header">
        <div class="user-avatar">
          <router-link :to="`/profile/@${authorHandle}`">
            <img :src="authorAvatarUrl" :alt="authorName" />
          </router-link>
        </div>

        <div class="user-info">
          <div class="username-display">
            <span class="display-name">{{ authorName }}</span>
            <span class="separator">·</span>
            <span class="post-time">{{ displayTime }}</span>
          </div>
          <div class="user-handle">@{{ authorHandle }}</div>
        </div>

        <div class="tex-options">
          <button class="option-btn" @click.stop="$emit('options', tex)">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="7" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="17" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="tex-content" @click="$emit('open', tex)">
        <p class="tex-text">
          {{ tex.title || tex.text }}
        </p>
        <p v-if="tex.subtitle" class="tex-subtitle">
          {{ tex.subtitle }}
        </p>
      </div>

      <!-- Actions -->
      <div class="tex-actions">
        <div class="action-group">
          <!-- Comment -->
          <button class="action-btn comment-btn" @click.stop="$emit('comment', tex)">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2.5L12 22l4.5-4H19a2 2 0 0 0 2-2V6z"
                />
              </svg>
            </div>
            <span class="action-count">{{ commentsCount }}</span>
          </button>

          <!-- Lynk / ReTex -->
          <button class="action-btn retweet-btn" @click.stop="$emit('lynk', tex)">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M23 7l-4-4v3H9a4 4 0 0 0-4 4v1h2v-1a2 2 0 0 1 2-2h10v3l4-4zM1 17l4 4v-3h10a4 4 0 0 0 4-4v-1h-2v1a2 2 0 0 1-2 2H5v-3L1 17z"
                />
              </svg>
            </div>
            <span class="action-count">{{ lynkCount }}</span>
          </button>

          <!-- Like -->
          <button class="action-btn like-btn" @click.stop="$emit('like', tex)">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12.1 21.3l-1.1-.99C5.4 15.3 2 12.6 2 9.5 2 7.01 4.01 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C13.46 5.99 14.96 5 16.5 5 18.99 5 21 7.01 21 9.5c0 3.1-3.4 5.8-8.9 11.32l-1 .98z"
                />
              </svg>
            </div>
            <span class="action-count">{{ likeCount }}</span>
          </button>

          <!-- Stats / Views -->
          <button class="action-btn stats-btn" @click.stop="$emit('stats', tex)">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 18h3v-7H4v7zm6 0h3v-11h-3v11zm6 0h3v-14h-3v14z" />
              </svg>
            </div>
            <span class="action-count">{{ viewCount }}</span>
          </button>

          <!-- Bookmark -->
          <button class="action-btn bookmark-btn" @click.stop="$emit('bookmark', tex)">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedData: {
    type: Object,
    required: false,
    default: null
  }
})

const rawTex = computed(() => props.selectedData)
const tex = computed(() => rawTex.value || {})

// ---------- AUTHOR ----------
const authorName = computed(() => {
  const t = tex.value
  return (
    t.authorName ||
    t.author?.name ||
    t.author?.displayName ||
    t.name ||
    'ناشناس'
  )
})

const authorHandle = computed(() => {
  const t = tex.value
  return (
    t.authorHandle ||
    t.author?.handle ||
    t.username ||
    t.handle ||
    'user'
  )
})

function buildAvatarUrlFromConfig(config) {
  if (!config || typeof config !== 'object') return null
  const baseUrl = process.env.VUE_APP_AVATAR_APP_URL + '/avatars'
  const params = new URLSearchParams(config)
  return `${baseUrl}?${params.toString()}`
}

const authorAvatarUrl = computed(() => {
  const t = tex.value

  if (t.authorAvatar) return t.authorAvatar

  const avatarConfig =
    t.authorAvatarConfig ||
    t.author?.avatarConfig ||
    t.avatarConfig ||
    null

  const fromConfig = buildAvatarUrlFromConfig(avatarConfig)
  if (fromConfig) return fromConfig

  return require('@/assets/fox.jpg')
})

// ---------- TIME ----------
function formatTimeAgo(createdAt) {
  if (!createdAt) return 'now'
  const created = new Date(createdAt)
  if (Number.isNaN(created.getTime())) return 'now'

  const diffMs = Date.now() - created.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return 'now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d`
  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 4) return `${diffWeek}w`
  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth}mo`
  const diffYear = Math.floor(diffDay / 365)
  return `${diffYear}y`
}

const displayTime = computed(() => {
  const t = tex.value
  return t.timeAgo || t.createdAgo || formatTimeAgo(t.createdAt)
})

// ---------- STATS ----------
const likeCount = computed(() => {
  const t = tex.value
  return t.stats?.likes ?? t.likes ?? 0
})

const lynkCount = computed(() => {
  const t = tex.value
  return (
    t.stats?.lynks ??
    t.stats?.retex ??
    t.lynks ??
    t.retex ??
    t.reping ??
    0
  )
})

const commentsCount = computed(() => {
  const t = tex.value
  return t.stats?.comments ?? t.comments ?? 0
})

const viewCount = computed(() => {
  const t = tex.value
  return t.stats?.views ?? t.views ?? 0
})
</script>

<style scoped>
.tex-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 16px;
}

/* center the whole card content */
.tex-main {
  border-bottom: 1px solid #2f3336;
  padding: 16px 12px;
  text-align: center;
  direction: rtl;
}

/* HEADER: avatar on top center, text centered */
.tex-header {
  display: flex;
  flex-direction: column;   /* column instead of row */
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
}

.user-avatar {
  margin-left: 0;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.user-avatar:hover img {
  border-color: #1d9bf0;
}

.user-info {
  flex: 0;
  min-width: 0;
  text-align: center;
}

.username-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
}

.display-name {
  font-weight: 700;
  color: #ffffff;
  font-size: 15px;
  line-height: 20px;
}

.user-handle {
  color: #71767b;
  font-size: 14px;
  line-height: 20px;
}

.separator {
  color: #71767b;
}

.post-time {
  color: #71767b;
  font-size: 13px;
}

/* options button top-right but over the header */
.tex-options {
  position: absolute;
  top: 0;
  left: 0;              /* for RTL you can flip later if you want */
  text-align: left;
}

.option-btn {
  display: inline-block;
  background: transparent;
  border: none;
  color: #71767b;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  background: rgba(29, 155, 240, 0.1);
  color: #1d9bf0;
}

/* CONTENT CENTERED */
.tex-content {
  margin-bottom: 12px;
  cursor: pointer;
}

.tex-text {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.tex-subtitle {
  margin-top: 6px;
  color: #8899a6;
  font-size: 14px;
}

/* ACTIONS CENTERED */
.tex-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-group {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 8px;
  margin: 8px 4px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #71767b;
  min-height: 34px;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  transition: all 0.2s ease;
}

.action-count {
  font-size: 13px;
  font-weight: 400;
  min-width: 20px;
  text-align: center;
  transition: color 0.2s ease;
}

/* hover states */
.comment-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}
.comment-btn:hover .action-icon {
  transform: scale(1.1);
}

.retweet-btn:hover {
  color: #00ba7c;
  background: rgba(0, 186, 124, 0.1);
}
.retweet-btn:hover .action-icon {
  transform: scale(1.1);
}

.like-btn:hover {
  color: #f91880;
  background: rgba(249, 24, 128, 0.1);
}
.like-btn:hover .action-icon {
  transform: scale(1.1);
}

.stats-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}
.stats-btn:hover .action-icon {
  transform: scale(1.1);
}

.bookmark-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}
.bookmark-btn:hover .action-icon {
  transform: scale(1.1);
}

/* mobile */
@media (max-width: 768px) {
  .tex-main {
    padding: 12px;
  }

  .user-avatar img {
    width: 100px;
    height: 100px;
  }

  .action-btn {
    padding: 6px;
    min-height: 32px;
  }
}
</style>
