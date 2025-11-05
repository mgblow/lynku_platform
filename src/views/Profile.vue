<template>
  <div class="container page" style="padding:0;margin-top: 20px;margin-bottom: 50px;">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="profile-background"></div>
      
      <div class="profile-info">
        <div class="profile-avatar">
          <img :src="require('@/assets/fox.jpg')" alt="mojtaba">
          <div class="online-status"></div>
        </div>
        
        <div class="profile-details">
          <div class="profile-main">
            <h1 class="display-name">مجتبی اسدی</h1>
            <span class="user-handle">@mojtaba</span>
          </div>
          
          <div class="profile-bio">
            <p>توسعه‌دهنده نرم‌افزار | علاقه‌مند به تکنولوژی و طراحی | ایجاد کننده محتوای آموزشی</p>
          </div>
          
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-number">1.2K</span>
              <span class="stat-label">توییت</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">15.6K</span>
              <span class="stat-label">دنبال‌کننده</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">892</span>
              <span class="stat-label">دنبال‌شونده</span>
            </div>
          </div>
          
          <div class="profile-meta">
            <div class="meta-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
              <span>تهران، ایران</span>
            </div>
            <div class="meta-item">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.18 5 4.05 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>عضویت از ۱۴۰۲</span>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="action-btn follow-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c1.65 0 3 1.35 3 3s-1.35 3-3 3h-3c-.55 0-1 .45-1 1s.45 1 1 1h3c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-9 5c0 .55.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1zm2 3H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h3c.55 0 1-.45 1-1s-.45-1-1-1H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h3c.55 0 1-.45 1-1s-.45-1-1-1z"/>
            </svg>
            دنبال کردن
          </button>
          <button class="action-btn message-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
          </button>
          <button class="action-btn more-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="7" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="12" cy="17" r="1.5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="profile-nav">
      <div class="nav-tabs">
        <button class="nav-tab active">توییت‌ها</button>
        <button class="nav-tab">توییت و پاسخ‌ها</button>
        <button class="nav-tab">رسانه</button>
        <button class="nav-tab">لایک‌ها</button>
      </div>
    </div>

    <!-- Tweets Feed -->
    <div class="tweets-feed">
      <div 
        class="tweet-card" 
        v-for="tweet in tweets" 
        :key="tweet.id"
        @click="viewTweet(tweet)"
      >
        <div class="tweet-header">
          <div class="user-avatar">
            <img :src="tweet.author.avatar" :alt="tweet.author.name">
          </div>
          <div class="user-info">
            <div class="username-display">
              <span class="display-name">{{ tweet.author.name }}</span>
              <span class="user-handle">@{{ tweet.author.handle }}</span>
              <span class="separator">·</span>
              <span class="post-time">{{ tweet.time }}</span>
            </div>
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

        <div class="tweet-content">
          <p class="tweet-text">{{ tweet.content }}</p>
        </div>

        <div class="tweet-actions">
          <button class="action-btn comment-btn">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2.5L12 22l4.5-4H19a2 2 0 0 0 2-2V6z"/>
              </svg>
            </div>
            <span class="action-count">{{ tweet.stats.replies }}</span>
          </button>

          <button class="action-btn retweet-btn">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 7l-4-4v3H9a4 4 0 0 0-4 4v1h2v-1a2 2 0 0 1 2-2h10v3l4-4zM1 17l4 4v-3h10a4 4 0 0 0 4-4v-1h-2v1a2 2 0 0 1-2 2H5v-3L1 17z"/>
              </svg>
            </div>
            <span class="action-count">{{ tweet.stats.retweets }}</span>
          </button>

          <button class="action-btn like-btn">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.1 21.3l-1.1-.99C5.4 15.3 2 12.6 2 9.5 2 7.01 4.01 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C13.46 5.99 14.96 5 16.5 5 18.99 5 21 7.01 21 9.5c0 3.1-3.4 5.8-8.9 11.32l-1.0.98z"/>
              </svg>
            </div>
            <span class="action-count">{{ tweet.stats.likes }}</span>
          </button>

          <button class="action-btn share-btn">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FuturisticProfile',
  data() {
    return {
      tweets: [
        {
          id: 1,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "امروز روی یک پروژه جدید کار می‌کنم که ترکیبی از هوش مصنوعی و طراحی رابط کاربری است. واقعاً هیجان‌انگیزه! 🤖",
          time: "2h",
          stats: {
            replies: "24",
            retweets: "45",
            likes: "156"
          }
        },
        {
          id: 2,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "گاهی ساده‌ترین راه‌حل‌ها بهترین نتیجه را می‌دهند. امروز یک باگ پیچیده را با تغییر یک خط کد حل کردم! 💻",
          time: "5h",
          stats: {
            replies: "12",
            retweets: "23",
            likes: "89"
          }
        },
        {
          id: 3,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "یادگیری مداوم رمز موفقیت در دنیای تکنولوژی است. امروز یک دوره جدید درباره معماری نرم‌افزار شروع کردم. 📚",
          time: "1d",
          stats: {
            replies: "18",
            retweets: "34",
            likes: "127"
          }
        },
        {
          id: 4,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "طراحی کاربرمحور نه تنها محصول بهتری ایجاد می‌کند، بلکه تجربه لذت‌بخشی برای توسعه‌دهندگان است. 🎨",
          time: "1d",
          stats: {
            replies: "31",
            retweets: "56",
            likes: "234"
          }
        },
        {
          id: 5,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "کد تمیز مانند یک داستان خوب است - باید واضح، قابل درک و الهام‌بخش باشد. ✨",
          time: "2d",
          stats: {
            replies: "42",
            retweets: "78",
            likes: "345"
          }
        },
        {
          id: 6,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "تست نویسی ممکن است زمان‌بر باشد، اما در بلندمدت باعث صرفه‌جویی در زمان و کاهش استرس می‌شود. ✅",
          time: "2d",
          stats: {
            replies: "15",
            retweets: "29",
            likes: "98"
          }
        },
        {
          id: 7,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "همکاری تیمی و اشتراک دانش باعث رشد همه اعضای تیم می‌شود. امروز یک جلسه کد ریویو عالی داشتیم! 👥",
          time: "3d",
          stats: {
            replies: "27",
            retweets: "41",
            likes: "167"
          }
        },
        {
          id: 8,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "تکنولوژی زمانی ارزش واقعی پیدا می‌کند که بتواند زندگی مردم را بهبود بخشد. این انگیزه اصلی من است. 💫",
          time: "3d",
          stats: {
            replies: "38",
            retweets: "67",
            likes: "289"
          }
        },
        {
          id: 9,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "هر مشکلی یک فرصت برای یادگیری و رشد است. امروز با یک چالش جدید در بهینه‌سازی عملکرد روبرو شدم. 🚀",
          time: "4d",
          stats: {
            replies: "22",
            retweets: "38",
            likes: "145"
          }
        },
        {
          id: 10,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "خلاقیت در کدنویسی مانند هنر است - نیاز به تمرین، صبر و اشتیاق دارد. امروز یک راه‌حل خلاقانه برای یک مسئله قدیمی پیدا کردم! 🎯",
          time: "4d",
          stats: {
            replies: "33",
            retweets: "52",
            likes: "198"
          }
        }
      ]
    }
  },
  methods: {
    viewTweet(tweet) {
      this.$router.push(`/tweet/${tweet.id}`);
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
.page {
  animation: slideInUp 0.3s ease-out;
  background: #000000;
  min-height: 100vh;
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

/* Profile Header */
.profile-header {
  position: relative;
  border-bottom: 1px solid #2f3336;
}

.profile-background {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.profile-background::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(transparent, #000000);
}

.profile-info {
  padding: 0 20px;
  margin-top: -75px;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
}

.profile-avatar {
  position: relative;
  margin-left: 20px;
}

.profile-avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #000000;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.online-status {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 20px;
  height: 20px;
  background: #00ba7c;
  border: 3px solid #000000;
  border-radius: 50%;
}

.profile-details {
  flex: 1;
  min-width: 0;
  margin-top: 20px;
}

.profile-main {
  margin-bottom: 16px;
}

.display-name {
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  display: block;
  margin-bottom: 4px;
}

.user-handle {
  color: #71767b;
  font-size: 16px;
}

.profile-bio {
  margin-bottom: 16px;
}

.profile-bio p {
  color: #ffffff;
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.profile-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-number {
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
}

.stat-label {
  color: #71767b;
  font-size: 14px;
}

.profile-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #71767b;
  font-size: 14px;
}

.meta-item svg {
  width: 16px;
  height: 16px;
}

.profile-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.follow-btn {
  background: #1d9bf0;
  color: #ffffff;
}

.follow-btn:hover {
  background: #1a8cd8;
}

.message-btn, .more-btn {
  background: transparent;
  border: 1px solid #536471;
  color: #ffffff;
  padding: 8px;
}

.message-btn:hover, .more-btn:hover {
  background: rgba(29, 155, 240, 0.1);
}

/* Navigation Tabs */
.profile-nav {
  border-bottom: 1px solid #2f3336;
}

.nav-tabs {
  display: flex;
  justify-content: space-around;
  max-width: 600px;
  margin: 0 auto;
}

.nav-tab {
  background: transparent;
  border: none;
  color: #71767b;
  padding: 16px 20px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  flex: 1;
  text-align: center;
}

.nav-tab:hover {
  color: #ffffff;
  background: rgba(29, 155, 240, 0.1);
}

.nav-tab.active {
  color: #1d9bf0;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 4px;
  background: #1d9bf0;
  border-radius: 2px;
}

/* Tweets Feed */
.tweets-feed {
  max-width: 600px;
  margin: 0 auto;
}

.tweet-card {
  background: #000000;
  border-bottom: 1px solid #2f3336;
  padding: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tweet-card:hover {
  background: #080808;
}

.tweet-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
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
  flex-wrap: wrap;
}

.display-name {
  font-weight: 700;
  color: #ffffff;
  font-size: 15px;
}

.user-handle, .separator, .post-time {
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
  justify-content: space-between;
  max-width: 425px;
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

/* Action Button Hover Effects */
.comment-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}

.retweet-btn:hover {
  color: #00ba7c;
  background: rgba(0, 186, 124, 0.1);
}

.like-btn:hover {
  color: #f91880;
  background: rgba(249, 24, 128, 0.1);
}

.share-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}

.action-btn:hover .action-icon {
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 16px;
  }
  
  .profile-avatar {
    margin-left: 0;
    margin-bottom: 16px;
  }
  
  .profile-avatar img {
    width: 120px;
    height: 120px;
  }
  
  .profile-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .nav-tabs {
    overflow-x: auto;
  }
  
  .nav-tab {
    white-space: nowrap;
    flex: none;
    padding: 16px;
  }
  
  .tweet-card {
    padding: 12px;
  }
}

/* Smooth transitions */
.tweet-card,
.action-btn,
.option-btn,
.nav-tab {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
.action-btn:focus,
.option-btn:focus,
.nav-tab:focus {
  outline: 2px solid #1d9bf0;
  outline-offset: 2px;
}
</style>