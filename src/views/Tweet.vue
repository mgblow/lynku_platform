<template>
  <div class="container page" style="padding:0;margin-top: 30px;margin-bottom: 50px;">
    <div class="tweet-card">
      <!-- Main Tweet -->
      <div class="tweet-main">
        <div class="tweet-header">
          <div class="user-avatar">
            <router-link to="/profile/@mojtaba">
              <img :src="require('@/assets/fox.jpg')" alt="mojtaba">
            </router-link>
          </div>
          <div class="user-info">
            <div class="username-display">
              <span class="display-name">mojtaba</span>
              <span class="separator">·</span>
              <span class="post-time">14h</span>
            </div>
            <div class="user-handle">@mojtaba</div>
          </div>
          <div class="tweet-options">
            <button class="option-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="7" r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="12" cy="17" r="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="tweet-content" @click="boxClicked(post)">
          <p class="tweet-text">{{ post.title }}</p>
        </div>

        <div class="tweet-actions">
          <div class="action-group">
            <!-- Comment -->
            <button class="action-btn comment-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2.5L12 22l4.5-4H19a2 2 0 0 0 2-2V6z"/>
                </svg>
              </div>
              <span class="action-count">1.2K</span>
            </button>

            <!-- Retweet -->
            <button class="action-btn retweet-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7l-4-4v3H9a4 4 0 0 0-4 4v1h2v-1a2 2 0 0 1 2-2h10v3l4-4zM1 17l4 4v-3h10a4 4 0 0 0 4-4v-1h-2v1a2 2 0 0 1-2 2H5v-3L1 17z"/>
                </svg>
              </div>
              <span class="action-count">1K</span>
            </button>

            <!-- Like -->
            <button class="action-btn like-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.1 21.3l-1.1-.99C5.4 15.3 2 12.6 2 9.5 2 7.01 4.01 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C13.46 5.99 14.96 5 16.5 5 18.99 5 21 7.01 21 9.5c0 3.1-3.4 5.8-8.9 11.32l-1.0.98z"/>
                </svg>
              </div>
              <span class="action-count">5.6K</span>
            </button>

            <!-- Stats -->
            <button class="action-btn stats-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18h3v-7H4v7zm6 0h3v-11h-3v11zm6 0h3v-14h-3v14z"/>
                </svg>
              </div>
              <span class="action-count">3K</span>
            </button>

            <!-- Bookmark -->
            <button class="action-btn bookmark-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z"/>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Replies Section -->
      <div class="replies-section">
        <div class="replies-header">
          <span class="replies-count">5 replies</span>
          <div class="replies-actions">
            <button class="sort-btn">Newest first</button>
          </div>
        </div>

        <div class="reply-thread">
          <div class="reply-item" v-for="value in 5" :key="value">
            <div class="reply-connector"></div>
            <div class="reply-content">
              <div class="tweet-header">
                <div class="user-avatar small">
                  <router-link to="/profile/@mojtaba">
                    <img :src="require('@/assets/fox.jpg')" alt="mojtaba">
                  </router-link>
                </div>
                <div class="user-info">
                  <div class="username-display">
                    <span class="display-name">mojtaba</span>
                    <span class="separator">·</span>
                    <span class="post-time">14h</span>
                  </div>
                  <div class="user-handle">@mojtaba</div>
                </div>
              </div>

              <div class="tweet-content">
                <p class="tweet-text">{{ post.text }}</p>
              </div>

              <div class="tweet-actions compact">
                <button class="action-btn comment-btn">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2.5L12 22l4.5-4H19a2 2 0 0 0 2-2V6z"/>
                    </svg>
                  </div>
                  <span class="action-count">24</span>
                </button>

                <button class="action-btn like-btn">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.1 21.3l-1.1-.99C5.4 15.3 2 12.6 2 9.5 2 7.01 4.01 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C13.46 5.99 14.96 5 16.5 5 18.99 5 21 7.01 21 9.5c0 3.1-3.4 5.8-8.9 11.32l-1.0.98z"/>
                    </svg>
                  </div>
                  <span class="action-count">156</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="load-more-replies">
          <button class="load-more-btn">
            Show more replies
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.84L12 13.42l4.59-4.58L18 10.25l-6 6-6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tweet',
  components: {},
  data() {
    return {
      post: {
        title: 'اما اگه منظورت طنز اجتماعی و انتقادی عمومی هست (مثل شوخی با روندهای کلی، تصمیم‌گیری‌ها، یا وضعیت‌های اداری بدون اشاره به شخص یا جناح خاص)، می‌تونم چند نمونه از اون بنویسم؛ در حدی که بی‌طرف، عمومی و خنده‌دار باشن.',
        text: 'Finally, modify the template section to bind the boxExpanded property to the class of the box div. When the boxExpanded property is true, the box-expanded class will be applied to the box div, which will cause it to fill the entire screen',
      }
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    boxClicked(post) {
      this.$router.push('/box/12');
    }
  }
}
</script>

<style scoped>
.page {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tweet-card {
  background: #000000;
  border: 1px solid #2f3336;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 16px;
}

.tweet-card:hover {
  border-color: #536471;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.tweet-main {
  padding: 16px;
  border-bottom: 1px solid #2f3336;
}

.tweet-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  position: relative;
}

.user-avatar {
  margin-left: 12px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.user-avatar.small img {
  width: 36px;
  height: 36px;
}

.user-avatar:hover img {
  border-color: #1d9bf0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username-display {
  display: flex;
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
  font-size: 15px;
  line-height: 20px;
}

.separator {
  color: #71767b;
  font-weight: 400;
}

.post-time {
  color: #71767b;
  font-size: 15px;
}

.tweet-options {
  margin-right: auto;
}

.option-btn {
  background: transparent;
  border: none;
  color: #71767b;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  background: rgba(29, 155, 240, 0.1);
  color: #1d9bf0;
}

.tweet-content {
  margin-bottom: 12px;
  cursor: pointer;
}

.tweet-text {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.tweet-actions {
  display: flex;
  align-items: center;
}

.tweet-actions.compact {
  padding-top: 8px;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 8px;
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

/* Comment Button */
.comment-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}

.comment-btn:hover .action-icon {
  transform: scale(1.1);
}

/* Retweet Button */
.retweet-btn:hover {
  color: #00ba7c;
  background: rgba(0, 186, 124, 0.1);
}

.retweet-btn:hover .action-icon {
  transform: scale(1.1);
}

/* Like Button */
.like-btn:hover {
  color: #f91880;
  background: rgba(249, 24, 128, 0.1);
}

.like-btn:hover .action-icon {
  transform: scale(1.1);
}

/* Stats Button */
.stats-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}

.stats-btn:hover .action-icon {
  transform: scale(1.1);
}

/* Bookmark Button */
.bookmark-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}

.bookmark-btn:hover .action-icon {
  transform: scale(1.1);
}

/* Replies Section */
.replies-section {
  background: #000000;
  border-top: 1px solid #2f3336;
}

.replies-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #2f3336;
}

.replies-count {
  color: #71767b;
  font-size: 15px;
  font-weight: 500;
}

.sort-btn {
  background: transparent;
  border: 1px solid #536471;
  color: #1d9bf0;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-btn:hover {
  background: rgba(29, 155, 240, 0.1);
}

.reply-thread {
  padding: 0 16px;
}

.reply-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #2f3336;
  position: relative;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-connector {
  width: 2px;
  background: #2f3336;
  margin: 0 24px;
  position: relative;
}

.reply-connector::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2f3336;
}

.reply-content {
  flex: 1;
  min-width: 0;
}

.load-more-replies {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #2f3336;
}

.load-more-btn {
  background: transparent;
  border: 1px solid #536471;
  color: #1d9bf0;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.load-more-btn:hover {
  background: rgba(29, 155, 240, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .tweet-card {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .tweet-main {
    padding: 12px;
  }
  
  .user-avatar img {
    width: 40px;
    height: 40px;
  }
  
  .user-avatar.small img {
    width: 32px;
    height: 32px;
  }
  
  .action-group {
    gap: 2px;
  }
  
  .action-btn {
    padding: 6px;
    min-height: 32px;
  }
}

/* Enhanced interactions */
.tweet-content:hover {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin: -4px;
  padding: 4px;
}

.action-btn:active {
  transform: scale(0.95);
}

/* Smooth transitions for all interactive elements */
.tweet-card,
.action-btn,
.option-btn,
.sort-btn,
.load-more-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
.action-btn:focus,
.option-btn:focus,
.sort-btn:focus,
.load-more-btn:focus {
  outline: 2px solid #1d9bf0;
  outline-offset: 2px;
}
</style>