<template>
  <div class="chat-container">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="header-content">
        <button class="back-btn" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        
        <div class="chat-user-info">
          <div class="user-avatar">
            <img :src="require('@/assets/fox.jpg')" alt="User">
            <div class="online-status"></div>
          </div>
          <div class="user-details">
            <h3 class="username">مجتبی اسدی</h3>
            <span class="user-status">آنلاین</span>
          </div>
        </div>
        
        <div class="header-actions">
          <button class="action-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Messages Container -->
    <div class="messages-container" ref="messagesContainer">
      <!-- Date Separator -->
      <div class="date-separator">
        <span>امروز</span>
      </div>

      <!-- Messages -->
      <div class="messages-list">
        <!-- Received Messages -->
        <div class="message-group received" v-for="i in 5" :key="'received-' + i">
          <div class="message-avatar">
            <img :src="require('@/assets/fox.jpg')" alt="User">
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>سلام! چطور می‌تونم کمک کنم؟ این یک پیام نمونه است که می‌تواند طولانی باشد.</p>
              <div class="message-time">
                <span>18:30</span>
                <svg v-if="i === 5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Sent Messages -->
        <div class="message-group sent" v-for="i in 5" :key="'sent-' + i">
          <div class="message-content">
            <div class="message-bubble">
              <p>سلام! ممنون از پیامت. این یک پاسخ نمونه است که می‌تواند شامل متن بیشتری باشد.</p>
              <div class="message-time">
                <span>18:35</span>
                <svg v-if="i === 5" viewBox="0 0 24 24" fill="#1d9bf0">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="#1d9bf0">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="message-input-container">
      <div class="input-wrapper">
        <div class="input-actions">
          <button class="action-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button class="action-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </div>
        
        <div class="text-input">
          <textarea 
            v-model="messageText" 
            placeholder="پیام خود را بنویسید..."
            @keydown.enter.prevent="sendMessage"
            ref="messageInput"
            rows="1"
          ></textarea>
          <div class="input-glow"></div>
        </div>
        
        <button class="send-btn" :disabled="!messageText.trim()" @click="sendMessage">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FuturisticChat',
  data() {
    return {
      messageText: '',
      messages: []
    }
  },
  methods: {
    sendMessage() {
      if (!this.messageText.trim()) return;
      
      // Add new message to chat
      const newMessage = {
        id: Date.now(),
        text: this.messageText,
        timestamp: new Date(),
        sent: true
      };
      
      this.messages.push(newMessage);
      this.messageText = '';
      
      // Auto scroll to bottom
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      // Auto reply after 1 second
      setTimeout(() => {
        this.autoReply();
      }, 1000);
    },
    
    autoReply() {
      const replies = [
        'سلام! چطور می‌تونم کمک کنم؟',
        'پیام شما دریافت شد',
        'لطفاً منتظر باشید...',
        'ممنون از پیام شما',
        'به زودی پاسخ می‌دم'
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage = {
        id: Date.now() + 1,
        text: randomReply,
        timestamp: new Date(),
        sent: false
      };
      
      this.messages.push(replyMessage);
      this.scrollToBottom();
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
      }
    }
  },
  
  watch: {
    messageText() {
      this.$nextTick(() => {
        this.adjustTextareaHeight();
      });
    }
  },
  
  mounted() {
    this.scrollToBottom();
  }
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
}

/* Chat Header */
.chat-header {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #2f3336;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  position: relative;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1d9bf0;
}

.online-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #00ba7c;
  border: 2px solid #000000;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  color: #ffffff;
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.user-status {
  color: #00ba7c;
  font-size: 12px;
}

.header-actions .action-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.header-actions .action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-actions svg {
  width: 20px;
  height: 20px;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: radial-gradient(ellipse at top, #0a0a2a 0%, #000000 100%);
}

/* Date Separator */
.date-separator {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.date-separator span {
  background: rgba(255, 255, 255, 0.1);
  color: #71767b;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 12px;
  backdrop-filter: blur(10px);
}

/* Messages */
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-group {
  display: flex;
  gap: 8px;
  max-width: 80%;
}

.message-group.received {
  align-self: flex-start;
}

.message-group.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  flex: 1;
}

.message-bubble {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  padding: 12px 16px;
  position: relative;
  transition: all 0.3s ease;
}

.message-group.received .message-bubble {
  background: rgba(29, 155, 240, 0.2);
  border-color: rgba(29, 155, 240, 0.3);
}

.message-group.sent .message-bubble {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.message-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.message-bubble p {
  color: #ffffff;
  margin: 0 0 8px 0;
  line-height: 1.4;
  font-size: 14px;
  word-wrap: break-word;
}

.message-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #71767b;
}

.message-time svg {
  width: 14px;
  height: 14px;
}

/* Message Input */
.message-input-container {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid #2f3336;
  padding: 16px;
  position: sticky;
  bottom: 0;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #2f3336;
  border-radius: 24px;
  padding: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.input-wrapper:focus-within {
  border-color: #1d9bf0;
  box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.2);
}

.input-actions {
  display: flex;
  gap: 4px;
}

.input-actions .action-btn {
  background: transparent;
  border: none;
  color: #71767b;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.input-actions .action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.input-actions svg {
  width: 18px;
  height: 18px;
}

.text-input {
  flex: 1;
  position: relative;
}

.text-input textarea {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  width: 100%;
  max-height: 120px;
  outline: none;
  font-family: inherit;
}

.text-input textarea::placeholder {
  color: #71767b;
}

.input-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #1d9bf0, #00ba7c, #f91880);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.input-wrapper:focus-within .input-glow {
  opacity: 1;
}

.send-btn {
  background: #1d9bf0;
  border: none;
  color: #ffffff;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: #1a8cd8;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #71767b;
  cursor: not-allowed;
  opacity: 0.5;
}

.send-btn svg {
  width: 18px;
  height: 18px;
}

/* Scrollbar Styling */
.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .messages-container {
    padding: 16px;
  }
  
  .message-group {
    max-width: 90%;
  }
  
  .message-bubble {
    padding: 10px 14px;
  }
  
  .message-input-container {
    padding: 12px;
  }
}

/* Animations */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-group {
  animation: messageSlideIn 0.3s ease-out;
}
</style>