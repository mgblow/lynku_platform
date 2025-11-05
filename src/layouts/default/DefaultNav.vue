<template>
  <div class="metaverse-nav">
    <!-- Holographic Top Bar -->
    <div class="hologram-header">
      <div class="hologram-effect"></div>
      <div class="nav-brand">
        <div class="logo-hologram">
          <div class="hologram-circle"></div>
        </div>
      </div>

      <div class="universal-search">
        <div class="search-orb" @click="toggleSearch">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <div class="search-field" v-if="showSearch">
          <input type="text" placeholder="جستجو در متاورس..." v-model="searchQuery" @keyup.enter="performSearch">
          <div class="search-aura"></div>
        </div>
      </div>
    </div>

    <!-- Floating Navigation Orb -->
    <div class="nav-orb-container">
      <div class="nav-orb" :class="{ 'active': orbActive }" @click="toggleOrb">
        <div class="orb-core"></div>
        <div class="orb-rings">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
      </div>

      <!-- Orb Menu Items -->
      <div class="orb-menu" v-if="orbActive">
        <!-- Home Portal -->
        <div class="orb-item home-portal" @click="navigateTo('/')">
          <div class="portal-glow"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span class="tooltip">پورتال اصلی</span>
        </div>

        <!-- Universe -->
        <div class="orb-item new-tweet" @click="navigateTo('/tweet')">
          <div class="tweet-glow"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 11h3v-2h-3V8h-2v3H8v2h3v3h2v-3z" />
          </svg>
          <span class="tooltip">توییت جدید</span>
        </div>


        <!-- Social Hub -->
        <div class="orb-item social-hub" @click="navigateTo('/mail')">
          <div class="hub-glow"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          <span class="tooltip">هاب اجتماعی</span>
        </div>

        <!-- AR World -->
        <div class="orb-item ar-world" @click="navigateTo('/map')">
          <div class="ar-glow"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm8 10c0 1.3-.31 2.52-.85 3.6H16.9a15.92 15.92 0 0 0 0-7.2h2.25c.54 1.08.85 2.3.85 3.6zM12 4c1.4 0 2.7.37 3.84 1.02h-2.22A15.99 15.99 0 0 0 9.1 7.2H7.15A7.98 7.98 0 0 1 12 4zm-7.15 9.6H7.1a15.92 15.92 0 0 0 0-7.2H4.85A7.93 7.93 0 0 0 4 12c0 1.3.31 2.52.85 3.6zm2.3 2.4h1.95a15.99 15.99 0 0 0 4.52 2.18v2.22A7.98 7.98 0 0 1 7.15 16zm6.85 4.4v-2.22a15.99 15.99 0 0 0 4.52-2.18h1.95A7.98 7.98 0 0 1 14 20.4z" />
          </svg>
          <span class="tooltip">دنیای AR</span>
        </div>


        <!-- Marketplace -->
        <div class="orb-item marketplace" @click="navigateTo('/market')">
          <div class="market-glow"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
          <span class="tooltip">بازار متاورس</span>
        </div>

        <!-- Profile Portal -->
        <div class="orb-item profile-portal" @click="navigateTo('/profile')">
          <div class="profile-glow"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          <span class="tooltip">پورتال شخصی</span>
        </div>
      </div>
    </div>

    <!-- Digital Universe Map -->
    <div class="universe-map" v-if="showUniverseMap">
      <div class="map-grid">
        <div class="galaxy" v-for="galaxy in galaxies" :key="galaxy.id" :class="galaxy.type"
          @click="enterGalaxy(galaxy)">
          <div class="galaxy-core"></div>
          <div class="galaxy-stars"></div>
          <span class="galaxy-name">{{ galaxy.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetaverseNavigation',
  data() {
    return {
      orbActive: false,
      showSearch: false,
      searchQuery: '',
      showUniverseMap: false,
      unreadNotifications: 3,
      unreadMessages: 5,
      galaxies: [
        { id: 1, name: 'جهت گربه‌ها', type: 'feline', active: true },
        { id: 2, name: 'قلمرو سگ‌ها', type: 'canine', active: true },
        { id: 3, name: 'آسمان پرندگان', type: 'avian', active: false },
        { id: 4, name: 'اقیانوس آبزیان', type: 'aquatic', active: false },
        { id: 5, name: 'جنگل خزندگان', type: 'reptile', active: true }
      ]
    }
  },
  methods: {
    toggleOrb() {
      this.orbActive = !this.orbActive;
    },

    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        setTimeout(() => {
          document.querySelector('.search-field input')?.focus();
        }, 100);
      }
    },

    performSearch() {
      if (this.searchQuery.trim()) {
        console.log('Searching for:', this.searchQuery);
        // Implement search logic
      }
    },

    navigateTo(route) {
      this.orbActive = false;
      this.$router.push(route);
    },

    createPost() {
      this.$router.push('/create');
    },

    toggleNotifications() {
      // Toggle notifications panel
      console.log('Toggle notifications');
    },

    toggleMessages() {
      // Toggle messages panel
      console.log('Toggle messages');
    },

    enterGalaxy(galaxy) {
      if (galaxy.active) {
        this.$router.push(`/galaxy/${galaxy.type}`);
      }
    },

    toggleUniverseMap() {
      this.showUniverseMap = !this.showUniverseMap;
    }
  }
}
</script>

<style scoped>
.metaverse-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  pointer-events: none;
}

/* Holographic Header */
.hologram-header {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(29, 155, 240, 0.3);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  pointer-events: all;
}

.hologram-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
      transparent,
      #1d9bf0,
      #00ba7c,
      #f91880,
      transparent);
  animation: hologramScan 3s linear infinite;
}

@keyframes hologramScan {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.logo-hologram {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
  font-weight: 700;
  font-size: 18px;
}

.hologram-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #1d9bf0, #00ba7c, #f91880, #1d9bf0);
  animation: rotate 4s linear infinite;
  position: relative;
}

.hologram-circle::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: #000;
  border-radius: 50%;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.universal-search {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-orb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(29, 155, 240, 0.2);
  border: 1px solid rgba(29, 155, 240, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: all;
}

.search-orb:hover {
  background: rgba(29, 155, 240, 0.4);
  transform: scale(1.1);
}

.search-orb svg {
  width: 20px;
  height: 20px;
  color: #1d9bf0;
}

.search-field {
  position: relative;
  pointer-events: all;
}

.search-field input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(29, 155, 240, 0.5);
  border-radius: 20px;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 14px;
  width: 250px;
  backdrop-filter: blur(10px);
}

.search-field input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-aura {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: linear-gradient(45deg, transparent, rgba(29, 155, 240, 0.2), transparent);
  animation: auraPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes auraPulse {

  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}

/* Navigation Orb */
.nav-orb-container {
  position: fixed;
  bottom: 30px;
  left: 30%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: all;
}

.nav-orb {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #000, #444);
  border: 2px solid rgba(29, 155, 240, 0.8);
  cursor: pointer;
  position: relative;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow:
    0 0 20px rgba(29, 155, 240, 0.5),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
  transform: translateX(-50%) scale(1);
  /* keep horizontally centered */
}


.nav-orb:hover {
  transform: scale(1.1) translateX(-50%);
  box-shadow:
    0 0 30px rgba(29, 155, 240, 0.8),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
}

.nav-orb.active {
  transform: scale(1.2) translateX(-50%);
  background: radial-gradient(circle at 30% 30%, #00ba7c, #000);
  border-color: rgba(0, 186, 124, 0.8);
}

.orb-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  animation: corePulse 2s ease-in-out infinite;
}

@keyframes corePulse {

  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.orb-rings {
  position: relative;
  transform: translate(50%, 50%);
}

.ring {
  position: absolute;
  border: 1px solid rgba(29, 155, 240, 0.6);
  border-radius: 50%;
  animation: ringExpand 3s linear infinite;
}

.ring-1 {
  width: 60px;
  height: 60px;
  animation-delay: 0s;
}

.ring-2 {
  width: 80px;
  height: 80px;
  animation-delay: 1s;
}

.ring-3 {
  width: 100px;
  height: 100px;
  animation-delay: 2s;
}

@keyframes ringExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* Orb Menu */
.orb-menu {
  position: absolute;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 30px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(29, 155, 240, 0.3);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.orb-item {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.orb-item:hover {
  transform: translateY(-5px) scale(1.1);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(29, 155, 240, 0.5);
}

.orb-item svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
  margin-bottom: 8px;
}

.orb-item .tooltip {
  position: absolute;
  bottom: -30px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.orb-item:hover .tooltip {
  opacity: 1;
}

/* Quick Actions */
.quick-actions {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  pointer-events: all;
}

.action-pill {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.action-pill:hover {
  background: rgba(29, 155, 240, 0.2);
  transform: translateY(-2px);
  border-color: rgba(29, 155, 240, 0.5);
}

.action-glow {
  position: absolute;
  inset: 0;
  border-radius: 25px;
  background: linear-gradient(45deg, transparent, rgba(29, 155, 240, 0.1), transparent);
  animation: glowPulse 2s ease-in-out infinite;
  pointer-events: none;
}

.notification-badge,
.message-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f91880;
  color: #ffffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* Universe Map */
.universe-map {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, #0a0a2a 0%, #000000 70%);
  z-index: 9999;
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 40px;
}

.galaxy {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease;
}

.galaxy:hover {
  transform: scale(1.2);
}

.galaxy-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #1d9bf0, #00ba7c, #f91880, #1d9bf0);
  animation: rotate 8s linear infinite;
}

.galaxy-stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, transparent 50%, rgba(255, 255, 255, 0.8) 50%);
  animation: twinkle 3s ease-in-out infinite;
}

.galaxy-name {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 12px;
  white-space: nowrap;
}

@keyframes twinkle {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .orb-menu {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 20px;
  }

  .quick-actions {
    flex-direction: column;
    bottom: 180px;
  }

  .search-field input {
    width: 200px;
  }

  .map-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
</style>