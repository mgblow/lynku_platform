<template>
  <div class="container page" style="padding:0;margin-top: 60px;margin-bottom: 50px;">
    <!-- Feed Container -->
    <div class="feed-container">
      <!-- Tweet Cards -->
      <div 
        class="tweet-card" 
        v-for="post in posts" 
        :key="post.id"
      >
        <!-- Tweet Header -->
        <div class="tweet-header">
          <div class="user-avatar">
            <router-link :to="`/profile/${post.author.handle}`">
              <img :src="post.author.avatar" :alt="post.author.name">
            </router-link>
          </div>
          <div class="user-info">
            <div class="username-display">
              <span class="display-name">{{ post.author.name }}</span>
              <span class="separator">·</span>
              <span class="post-time">{{ post.time }}</span>
            </div>
            <div class="user-handle">@{{ post.author.handle }}</div>
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

        <!-- Tweet Content -->
        <div class="tweet-content" @click="viewPost(post)">
          <p class="tweet-text">{{ post.content }}</p>
        </div>

        <!-- Tweet Actions -->
        <div class="tweet-actions">
          <div class="action-group">
            <!-- Comment -->
            <button class="action-btn comment-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2.5L12 22l4.5-4H19a2 2 0 0 0 2-2V6z"/>
                </svg>
              </div>
              <span class="action-count">{{ post.stats.replies }}</span>
            </button>

            <!-- Retweet -->
            <button class="action-btn retweet-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 7l-4-4v3H9a4 4 0 0 0-4 4v1h2v-1a2 2 0 0 1 2-2h10v3l4-4zM1 17l4 4v-3h10a4 4 0 0 0 4-4v-1h-2v1a2 2 0 0 1-2 2H5v-3L1 17z"/>
                </svg>
              </div>
              <span class="action-count">{{ post.stats.retweets }}</span>
            </button>

            <!-- Like -->
            <button class="action-btn like-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.1 21.3l-1.1-.99C5.4 15.3 2 12.6 2 9.5 2 7.01 4.01 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C13.46 5.99 14.96 5 16.5 5 18.99 5 21 7.01 21 9.5c0 3.1-3.4 5.8-8.9 11.32l-1.0.98z"/>
                </svg>
              </div>
              <span class="action-count">{{ post.stats.likes }}</span>
            </button>

            <!-- Views -->
            <button class="action-btn views-btn">
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </div>
              <span class="action-count">{{ post.stats.views }}</span>
            </button>

            <!-- Share -->
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
  </div>
</template>

<script>
export default {
  name: 'Feed',
  data() {
    return {
      posts: [
        {
          id: 1,
          author: {
            name: "مجتبی اسدی",
            handle: "mojtaba",
            avatar: require('@/assets/fox.jpg')
          },
          content: "متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد...",
          media: "https://i.pinimg.com/564x/9b/3e/6b/9b3e6b629891dec3087b0f06df508b6a.jpg",
          time: "2h",
          stats: {
            replies: "1.2K",
            retweets: "1K",
            likes: "5.6K",
            views: "12.5K"
          }
        },
        {
          id: 2,
          author: {
            name: "طراح خلاق",
            handle: "creative_designer",
            avatar: "https://i.pinimg.com/564x/1f/ec/6b/1fec6b5302b88d087dbb6071e0397e7b.jpg"
          },
          content: "وقتی می‌گی فقط پنج دقیقه دراز می‌کشم بعد پا می‌شی می‌بینی یه قرن گذشته و بچه‌هات دانشگاه رفتن 😴",
          time: "5h",
          stats: {
            replies: "2.4K",
            retweets: "1.5K",
            likes: "15.6K",
            views: "45.6K"
          }
        },
        {
          id: 3,
          author: {
            name: "تکنولوژی",
            handle: "tech_persian",
            avatar: "https://i.pinimg.com/564x/0b/e3/3b/0be33b1c04e4453f3e5a4b3fb22158ca.jpg"
          },
          content: "هیچ چیز توی دنیا اندازه وقتی اینترنت قطعه و می‌خوای به بقیه ثابت کنی مشکل از اونا نیست، حس عذاب وجدان نمی‌ده 😅",
          time: "1d",
          stats: {
            replies: "3.1K",
            retweets: "2.8K",
            likes: "23.4K",
            views: "78.9K"
          }
        },
        {
          id: 4,
          author: {
            name: "برنامه‌نویس",
            handle: "coder_life",
            avatar: "https://i.pinimg.com/564x/9b/3e/6b/9b3e6b629891dec3087b0f06df508b6a.jpg"
          },
          content: "گاهی اوقات بهترین راه حل برای یک مشکل، استراحت و نگاه کردن از زاویه‌ای دیگر است ☕",
          time: "3h",
          stats: {
            replies: "892",
            retweets: "1.2K",
            likes: "8.7K",
            views: "34.2K"
          }
        },
        {
          id: 5,
          author: {
            name: "هنرمند",
            handle: "art_lover",
            avatar: "https://i.pinimg.com/564x/1f/ec/6b/1fec6b5302b88d087dbb6071e0397e7b.jpg"
          },
          content: "هنر یعنی بیان ناگفته‌ها با زبانی که همه می‌فهمند اما کسی نمی‌تواند بیانش کند 🎨",
          media: "https://i.pinimg.com/564x/0b/e3/3b/0be33b1c04e4453f3e5a4b3fb22158ca.jpg",
          time: "7h",
          stats: {
            replies: "1.5K",
            retweets: "2.1K",
            likes: "12.3K",
            views: "56.7K"
          }
        },
        {
          id: 6,
          author: {
            name: "کتابخوان",
            handle: "book_worm",
            avatar: require('@/assets/fox.jpg')
          },
          content: "یک کتاب خوب مانند یک دوست وفادار است که همیشه در کنار شماست و هرگز شما را تنها نمی‌گذارد 📚",
          time: "1d",
          stats: {
            replies: "2.3K",
            retweets: "3.4K",
            likes: "18.9K",
            views: "67.8K"
          }
        },
        {
          id: 7,
          author: {
            name: "سفرنامه",
            handle: "travel_diary",
            avatar: "https://i.pinimg.com/564x/1f/ec/6b/1fec6b5302b88d087dbb6071e0397e7b.jpg"
          },
          content: "سفر کردن تنها تغییر مکان نیست، تغییر دیدگاه است ✈️",
          media: "https://i.pinimg.com/564x/9b/3e/6b/9b3e6b629891dec3087b0f06df508b6a.jpg",
          time: "4h",
          stats: {
            replies: "3.2K",
            retweets: "4.5K",
            likes: "25.6K",
            views: "89.1K"
          }
        },
        {
          id: 8,
          author: {
            name: "ورزشکار",
            handle: "fitness_iran",
            avatar: "https://i.pinimg.com/564x/0b/e3/3b/0be33b1c04e4453f3e5a4b3fb22158ca.jpg"
          },
          content: "تنها رقیب واقعی شما، خود دیروز شماست 💪",
          time: "6h",
          stats: {
            replies: "1.8K",
            retweets: "2.9K",
            likes: "14.7K",
            views: "52.3K"
          }
        },
        {
          id: 9,
          author: {
            name: "آشپز",
            handle: "chef_iranian",
            avatar: require('@/assets/fox.jpg')
          },
          content: "غذای خوب تنها سیرکننده شکم نیست، بلکه غذای روح هم هست 🍲",
          time: "2d",
          stats: {
            replies: "4.1K",
            retweets: "5.2K",
            likes: "32.8K",
            views: "123.4K"
          }
        },
        {
          id: 10,
          author: {
            name: "موسیقی‌دان",
            handle: "music_lover",
            avatar: "https://i.pinimg.com/564x/1f/ec/6b/1fec6b5302b88d087dbb6071e0397e7b.jpg"
          },
          content: "موسیقی زبانی است که همه ملل آن را درک می‌کنند 🎵",
          media: "https://i.pinimg.com/564x/0b/e3/3b/0be33b1c04e4453f3e5a4b3fb22158ca.jpg",
          time: "8h",
          stats: {
            replies: "2.7K",
            retweets: "3.8K",
            likes: "21.5K",
            views: "76.9K"
          }
        }
      ]
    }
  },
  methods: {
    viewPost(post) {
      this.$router.push(`/post/${post.id}`);
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

.feed-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 !important;
}

.tweet-card {
  background: #000000;
  border: 1px solid #2f3336;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
}

.tweet-card:hover {
  border-color: #536471;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.tweet-header {
  display: flex;
  align-items: flex-start;
  padding: 16px 16px 12px 16px;
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
  padding: 0 16px 12px 16px;
  cursor: pointer;
}

.tweet-text {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 12px 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.tweet-media {
  border-radius: 16px;
  overflow: hidden;
  margin-top: 12px;
}

.tweet-media img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.tweet-media:hover img {
  transform: scale(1.02);
}

.tweet-actions {
  padding: 0 16px 16px 16px;
}

.action-group {
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

/* Views Button */
.views-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}

.views-btn:hover .action-icon {
  transform: scale(1.1);
}

/* Share Button */
.share-btn:hover {
  color: #1d9bf0;
  background: rgba(29, 155, 240, 0.1);
}

.share-btn:hover .action-icon {
  transform: scale(1.1);
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
.option-btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
.action-btn:focus,
.option-btn:focus {
  outline: 2px solid #1d9bf0;
  outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .feed-container {
    padding: 0 12px;
  }
  
  .tweet-card {
    border-radius: 0;
  }
  
  .tweet-header {
    padding: 12px;
  }
  
  .user-avatar img {
    width: 40px;
    height: 40px;
  }
  
  .tweet-content {
    padding: 0 12px 12px 12px;
  }
  
  .tweet-actions {
    padding: 0 12px 12px 12px;
  }
  
  .action-group {
    max-width: 100%;
  }
  
  .action-btn {
    padding: 6px;
    min-height: 32px;
  }
}
</style>