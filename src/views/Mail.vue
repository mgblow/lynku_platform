<template>
  <div class="mail-container">
    <!-- Header -->
    <div class="mail-header">
      <h1 class="header-title">پیام‌ها</h1>
      <div class="header-actions">
        <button class="action-btn search-btn" @click="toggleSearch">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
        <button class="action-btn new-chat-btn" @click="startNewChat">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="search-container" v-if="showSearch">
      <div class="search-input-wrapper">
        <svg viewBox="0 0 24 24" fill="currentColor" class="search-icon">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="جستجو در گفتگوها..."
          class="search-input"
        >
        <div class="search-glow"></div>
      </div>
    </div>

    <!-- Chat List -->
    <div class="chats-list">
      <!-- Online Users Section -->
      <div class="section-header">
        <span class="section-title">آنلاین</span>
        <div class="online-indicator">
          <div class="pulse-dot"></div>
          <span>{{ onlineUsers.length }} نفر</span>
        </div>
      </div>

      <div class="online-users">
        <div 
          class="online-user" 
          v-for="user in onlineUsers" 
          :key="user.id"
          @click="startChat(user)"
        >
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.name">
            <div class="online-status"></div>
          </div>
          <span class="user-name">{{ user.name }}</span>
        </div>
      </div>

      <!-- All Chats -->
      <div class="section-header">
        <span class="section-title">همه گفتگوها</span>
        <span class="chats-count">{{ filteredChats.length }} گفتگو</span>
      </div>

      <div class="chat-items">
        <div 
          class="chat-item" 
          v-for="chat in filteredChats" 
          :key="chat.id"
          :class="{ 'unread': chat.unread, 'active': chat.active }"
          @click="openChat(chat)"
        >
          <div class="chat-avatar">
            <img :src="chat.avatar" :alt="chat.name">
            <div class="status-indicator" :class="chat.status"></div>
          </div>
          
          <div class="chat-content">
            <div class="chat-header">
              <h3 class="chat-name">{{ chat.name }}</h3>
              <span class="chat-time">{{ chat.lastMessage.time }}</span>
            </div>
            
            <div class="chat-preview">
              <p class="last-message" :class="{ 'unread-text': chat.unread }">
                {{ chat.lastMessage.text }}
              </p>
              <div class="chat-meta">
                <div class="message-status" v-if="chat.lastMessage.sent">
                  <svg v-if="chat.lastMessage.read" viewBox="0 0 24 24" fill="#1d9bf0">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="#71767b">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </div>
                <div class="unread-badge" v-if="chat.unread">
                  {{ chat.unreadCount }}
                </div>
              </div>
            </div>
          </div>

          <div class="chat-glow"></div>
        </div>
      </div>
    </div>

    <!-- New Chat Modal -->
    <div class="new-chat-modal" v-if="showNewChatModal">
      <div class="modal-overlay" @click="showNewChatModal = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>شروع گفتگوی جدید</h3>
          <button class="close-btn" @click="showNewChatModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>این ویژگی به زودی اضافه خواهد شد...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FuturisticMail',
  data() {
    return {
      showSearch: false,
      searchQuery: '',
      showNewChatModal: false,
      onlineUsers: [
        {
          id: 1,
          name: 'آراد',
          avatar: require('@/assets/fox.jpg'),
          status: 'online'
        },
        {
          id: 2,
          name: 'سارا',
          avatar: require('@/assets/fox.jpg'),
          status: 'online'
        },
        {
          id: 3,
          name: 'پویا',
          avatar: require('@/assets/fox.jpg'),
          status: 'online'
        }
      ],
      chats: [
        {
          id: 1,
          name: 'مجتبی اسدی',
          avatar: require('@/assets/fox.jpg'),
          status: 'online',
          unread: true,
          unreadCount: 3,
          active: false,
          lastMessage: {
            text: 'سلام! چطور می‌تونم کمک کنم؟',
            time: '18:30',
            sent: true,
            read: true
          }
        },
        {
          id: 2,
          name: 'گروه توسعه',
          avatar: require('@/assets/fox.jpg'),
          status: 'offline',
          unread: false,
          unreadCount: 0,
          active: false,
          lastMessage: {
            text: 'جلسه فردا ساعت 10 برگزار می‌شود',
            time: '16:45',
            sent: false,
            read: true
          }
        },
        {
          id: 3,
          name: 'پشتیبانی',
          avatar: require('@/assets/fox.jpg'),
          status: 'online',
          unread: true,
          unreadCount: 1,
          active: false,
          lastMessage: {
            text: 'مشکل شما حل شد؟',
            time: '14:20',
            sent: false,
            read: false
          }
        },
        {
          id: 4,
          name: 'دنیای حیوانات',
          avatar: require('@/assets/fox.jpg'),
          status: 'offline',
          unread: false,
          unreadCount: 0,
          active: false,
          lastMessage: {
            text: 'عکس جدید گربه‌ها آپلود شد',
            time: '12:15',
            sent: true,
            read: true
          }
        },
        {
          id: 5,
          name: 'تیم طراحی',
          avatar: require('@/assets/fox.jpg'),
          status: 'idle',
          unread: false,
          unreadCount: 0,
          active: false,
          lastMessage: {
            text: 'طرح‌های جدید آماده است',
            time: 'دیروز',
            sent: false,
            read: true
          }
        }
      ]
    }
  },
  computed: {
    filteredChats() {
      if (!this.searchQuery) return this.chats;
      
      return this.chats.filter(chat => 
        chat.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        chat.lastMessage.text.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$nextTick(() => {
          document.querySelector('.search-input')?.focus();
        });
      }
    },
    
    startNewChat() {
      this.showNewChatModal = true;
    },
    
    openChat(chat) {
      // Mark as read when opening
      chat.unread = false;
      chat.unreadCount = 0;
      
      this.$router.push(`/chat/${chat.id}`);
    },
    
    startChat(user) {
      // Start new chat with online user
      console.log('Starting chat with:', user.name);
      this.$router.push(`/chat/new/${user.id}`);
    },
    
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
</script>

<style scoped>
.mail-container {
  background: #000000;
  min-height: 100vh;
  color: #ffffff;
}

/* Header */
.mail-header {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #2f3336;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #1d9bf0, #00ba7c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #2f3336;
  color: #ffffff;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(29, 155, 240, 0.2);
  border-color: rgba(29, 155, 240, 0.5);
  transform: scale(1.05);
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

/* Search */
.search-container {
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid #2f3336;
}

.search-input-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #2f3336;
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #1d9bf0;
  box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.2);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #71767b;
  flex-shrink: 0;
}

.search-input {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  flex: 1;
  outline: none;
}

.search-input::placeholder {
  color: #71767b;
}

.search-glow {
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #1d9bf0, transparent);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-input-wrapper:focus-within .search-glow {
  opacity: 1;
}

/* Chats List */
.chats-list {
  padding: 20px;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #71767b;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00ba7c;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.chats-count {
  font-size: 12px;
  color: #71767b;
}

/* Online Users */
.online-users {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  padding: 0 8px;
  overflow-x: auto;
}

.online-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 12px;
  min-width: 60px;
}

.online-user:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
}

.user-avatar {
  position: relative;
}

.user-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #00ba7c;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #00ba7c;
  border: 2px solid #000000;
  border-radius: 50%;
}

.user-name {
  font-size: 11px;
  color: #ffffff;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Chat Items */
.chat-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chat-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(29, 155, 240, 0.3);
  transform: translateX(4px);
}

.chat-item.unread {
  background: rgba(29, 155, 240, 0.1);
  border-color: rgba(29, 155, 240, 0.2);
}

.chat-item.active {
  background: rgba(29, 155, 240, 0.15);
  border-color: rgba(29, 155, 240, 0.4);
}

.chat-avatar {
  position: relative;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2f3336;
  transition: border-color 0.3s ease;
}

.chat-item:hover .chat-avatar img {
  border-color: #1d9bf0;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border: 2px solid #000000;
  border-radius: 50%;
}

.status-indicator.online {
  background: #00ba7c;
}

.status-indicator.offline {
  background: #71767b;
}

.status-indicator.idle {
  background: #ffad1f;
}

.chat-content {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.chat-name {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 11px;
  color: #71767b;
  flex-shrink: 0;
}

.chat-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.last-message {
  font-size: 14px;
  color: #71767b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.last-message.unread-text {
  color: #ffffff;
  font-weight: 500;
}

.chat-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.message-status svg {
  width: 14px;
  height: 14px;
}

.unread-badge {
  background: #f91880;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  animation: badgePulse 1s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.chat-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(29, 155, 240, 0.1), transparent);
  transition: left 0.5s ease;
}

.chat-item:hover .chat-glow {
  left: 100%;
}

/* Modal */
.new-chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.modal-content {
  position: relative;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid #2f3336;
  border-radius: 20px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #2f3336;
}

.modal-header h3 {
  margin: 0;
  color: #ffffff;
}

.close-btn {
  background: transparent;
  border: none;
  color: #71767b;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.modal-body {
  color: #71767b;
  text-align: center;
  padding: 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .mail-header {
    padding: 12px 16px;
  }
  
  .chats-list {
    padding: 16px;
  }
  
  .online-users {
    gap: 12px;
  }
  
  .user-avatar img {
    width: 45px;
    height: 45px;
  }
  
  .chat-avatar img {
    width: 45px;
    height: 45px;
  }
}

/* Scrollbar */
.chats-list::-webkit-scrollbar,
.online-users::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.chats-list::-webkit-scrollbar-track,
.online-users::-webkit-scrollbar-track {
  background: transparent;
}

.chats-list::-webkit-scrollbar-thumb,
.online-users::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.chats-list::-webkit-scrollbar-thumb:hover,
.online-users::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>