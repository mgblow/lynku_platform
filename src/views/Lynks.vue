<template>
  <div class="container-fluid py-4">

    <!-- Search Bar -->
    <div class="d-flex justify-content-center mb-4">
      <input
        v-model="search"
        type="text"
        class="form-control form-control-lg bg-dark text-white border-0 rounded-pill shadow-sm"
        placeholder="Search Lynks..."
        style="backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15);"
      />
    </div>

    <!-- Lynks Grid -->
    <div class="row g-3">
      <div
        v-for="u in filteredLynks"
        :key="u.uuid"
        class="col-6 col-sm-4 col-md-3 col-lg-2"
      >
        <div class="card h-100 text-center bg-dark bg-opacity-50 border-0 shadow-lg hover-scale-neon position-relative">

          <!-- Neon Avatar -->
          <div class="position-relative d-flex justify-content-center mt-3">
            <div class="avatar-glow position-absolute rounded-circle"></div>
            <img
              v-if="u.avatarUrl"
              :src="u.avatarUrl"
              class="rounded-circle border border-secondary shadow-sm"
              style="width:80px; height:80px; object-fit:cover; z-index:1;"
            />
            <div
              v-else
              class="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
              style="width:80px; height:80px; font-size:1.5rem; z-index:1;"
            >?</div>

            <!-- Status Dot -->
            <span
              :class="['status-dot position-absolute', u.online ? 'bg-success' : 'bg-secondary']"
              style="top:5px; right:5px;"
            ></span>
          </div>

          <!-- Nickname -->
          <div class="card-body p-2 mt-2">
            <h6 class="text-white mb-1 text-truncate">{{ u.nickname }}</h6>
            <p class="text-secondary mb-2 small text-truncate" style="direction: ltr">{{ shortUuid(u.uuid) }}</p>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-center gap-2">
              <button class="btn pv-globe-button" @click.stop="openPrivate(u)">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradientOrbit" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#00FFFF"/>
                      <stop offset="100%" stop-color="#0066FF"/>
                    </linearGradient>
                    <filter id="glowOrbit" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <!-- Central node -->
                  <circle cx="12" cy="12" r="2" fill="url(#gradientOrbit)" filter="url(#glowOrbit)">
                    <animate attributeName="r" values="2;2.5;2" dur="1.2s" repeatCount="indefinite"/>
                  </circle>

                  <!-- Orbiting node -->
                  <circle cx="12" cy="6" r="1.5" fill="url(#gradientOrbit)" filter="url(#glowOrbit)">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="2s" repeatCount="indefinite"/>
                  </circle>

                  <!-- Orbit line -->
                  <circle cx="12" cy="12" r="6" fill="none" stroke="url(#gradientOrbit)" stroke-width="0.5" filter="url(#glowOrbit)">
                    <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite"/>
                  </circle>
                </svg>

              </button>
              <button class="btn unlink-globe-button" @click.stop="unlink(u)">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gradientExplode" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#FF4B4B"/>
                      <stop offset="100%" stop-color="#FF00FF"/>
                    </linearGradient>
                    <filter id="glowExplode" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <!-- Person node -->
                  <circle cx="12" cy="12" r="2" fill="url(#gradientExplode)" filter="url(#glowExplode)">
                    <animate attributeName="r" values="2;3;2" dur="1s" repeatCount="indefinite"/>
                  </circle>

                  <!-- Exploding particles -->
                  <line x1="12" y1="12" x2="16" y2="8" stroke="url(#gradientExplode)" stroke-width="1" stroke-linecap="round" filter="url(#glowExplode)">
                    <animate attributeName="x2" values="16;14;16" dur="0.8s" repeatCount="indefinite"/>
                    <animate attributeName="y2" values="8;6;8" dur="0.8s" repeatCount="indefinite"/>
                  </line>
                  <line x1="12" y1="12" x2="8" y2="16" stroke="url(#gradientExplode)" stroke-width="1" stroke-linecap="round" filter="url(#glowExplode)">
                    <animate attributeName="x2" values="8;10;8" dur="0.8s" repeatCount="indefinite"/>
                    <animate attributeName="y2" values="16;18;16" dur="0.8s" repeatCount="indefinite"/>
                  </line>
                  <line x1="12" y1="12" x2="16" y2="16" stroke="url(#gradientExplode)" stroke-width="1" stroke-linecap="round" filter="url(#glowExplode)">
                    <animate attributeName="x2" values="16;14;16" dur="0.8s" repeatCount="indefinite"/>
                    <animate attributeName="y2" values="16;18;16" dur="0.8s" repeatCount="indefinite"/>
                  </line>
                  <line x1="12" y1="12" x2="8" y2="8" stroke="url(#gradientExplode)" stroke-width="1" stroke-linecap="round" filter="url(#glowExplode)">
                    <animate attributeName="x2" values="8;10;8" dur="0.8s" repeatCount="indefinite"/>
                    <animate attributeName="y2" values="8;6;8" dur="0.8s" repeatCount="indefinite"/>
                  </line>
                </svg>


              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredLynks.length === 0" class="text-center text-secondary mt-5">
      No Lynks found.
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Search input
const search = ref('');

// Default personas
const lynks = ref([
  { uuid: 'c92c2c5e-ae92-4b70-9ac2-4123abcd59ab', nickname: 'SkyWalker', avatarUrl: 'https://i.pravatar.cc/150?img=32', online: true },
  { uuid: 'c92c2c5e-ae92-4b70-9ac2-4123abcd59ab', nickname: 'SkyWalker', avatarUrl: 'https://i.pravatar.cc/150?img=32', online: true },
  { uuid: 'c92c2c5e-ae92-4b70-9ac2-4123abcd59ab', nickname: 'SkyWalker', avatarUrl: 'https://i.pravatar.cc/150?img=32', online: true },
  { uuid: 'ab23fa87-97df-11ee-b9d1-0242ac120002', nickname: 'Raven', avatarUrl: 'https://i.pravatar.cc/150?img=65', online: false },
  { uuid: 'f9e2b1f0-12a3-4c5b-a6c1-9c2d3f8babc1', nickname: 'NeonGhost', avatarUrl: 'https://i.pravatar.cc/150?img=12', online: true },
  { uuid: 'f9e2b1f0-12a3-4c5b-a6c1-9c2d3f8babc1', nickname: 'NeonGhost', avatarUrl: 'https://i.pravatar.cc/150?img=12', online: true },
  { uuid: 'd3a2f1b4-8e2c-49f1-9f7c-4c1a2b3c4d5e', nickname: 'CyberSam', avatarUrl: 'https://i.pravatar.cc/150?img=47', online: true },
  { uuid: 'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh78', nickname: 'LynkuBot', avatarUrl: '', online: false }
]);

// Filtered lynks
const filteredLynks = computed(() => {
  if (!search.value) return lynks.value;
  return lynks.value.filter(u =>
    u.nickname.toLowerCase().includes(search.value.toLowerCase()) ||
    u.uuid.toLowerCase().includes(search.value.toLowerCase())
  );
});

// Short UUID
const shortUuid = (uuid) => uuid ? uuid.substring(0, 8) + '...' : '';

// Actions
const openPrivate = (user) => console.log('Open PV World for', user.nickname);
const unlink = (user) => console.log('Unlink', user.nickname);
</script>

<style scoped>
.container-fluid{
  margin-top: 45px;
  margin-bottom: 125px;
  border-radius: 16px;
}

.hover-scale-neon {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px;
}

.hover-scale-neon:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 25px rgba(0, 255, 255, 0.3);
  border-radius: 16px;
}


/* Avatar Glow */
.avatar-glow {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 255, 255, 0.25);
  filter: blur(12px);
  animation: pulse 2s infinite ease-in-out;
  top: 0;
  left: 0;
  z-index: 0;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

/* Status dot */
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #111;
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.7);
  transition: all 0.3s ease;
  margin-right: 10px;
}

/* Custom Bootstrap cyan button */
.pv-globe-button{
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fff;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a2a 90%, #6a00ff 130%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  margin: 15px 10px;
  box-shadow:
    0 0 8px rgba(106, 90, 255, 0.6),
    0 0 16px rgba(106, 90, 255, 0.4),
    inset 0 0 6px rgba(255, 0, 255, 0.2);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.unlink-globe-button{
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #fff;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a0a2a 90%, #ff0000 130%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  margin: 15px 10px;
  box-shadow:
    0 0 8px rgba(255, 0, 0, 0.6),
    0 0 16px rgba(255, 0, 0, 0.4),
    inset 0 0 6px rgba(255, 0, 255, 0.2);
  backdrop-filter: blur(6px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
}
</style>
