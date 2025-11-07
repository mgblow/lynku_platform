<template>
  <div id="earth-container">
    <div id="earth"></div>

    <!-- Bottom Info Panel -->
    <transition name="slide-up">
      <div v-if="selectedAvatar" class="avatar-info-panel">
        <button class="close-btn" @click="closePanel">✕</button>

        <div class="avatar-header">
          <div class="avatar-image">
            <div class="svg-avatar" v-html="avatarSVG"></div>
          </div>
          <div class="avatar-title">
            <h2>{{ selectedAvatar.name }}</h2>
            <span class="level">Level {{ selectedAvatar.level }}</span>
          </div>
        </div>

        <div class="profile-grid">
          <div class="profile-section">
            <h3>Location Info</h3>
            <div class="info-item">
              <label>Coordinates:</label>
              <span>{{ selectedAvatar.coordinates }}</span>
            </div>
            <div class="info-item">
              <label>Region:</label>
              <span>{{ selectedAvatar.region }}</span>
            </div>
            <div class="info-item">
              <label>Status:</label>
              <span class="status" :class="selectedAvatar.status.toLowerCase()">{{ selectedAvatar.status }}</span>
            </div>
          </div>

          <div class="profile-section">
            <h3>Specialties</h3>
            <div class="specialties">
              <span class="specialty-tag">{{ selectedAvatar.specialty }}</span>
              <span class="specialty-tag">{{ selectedAvatar.secondarySkill }}</span>
            </div>
          </div>

          <div class="profile-section">
            <h3>Statistics</h3>
            <div class="stats">
              <div class="stat-item">
                <label>Power</label>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: selectedAvatar.stats.power + '%' }"></div>
                  <span class="stat-value">{{ selectedAvatar.stats.power }}</span>
                </div>
              </div>
              <div class="stat-item">
                <label>Speed</label>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: selectedAvatar.stats.speed + '%' }"></div>
                  <span class="stat-value">{{ selectedAvatar.stats.speed }}</span>
                </div>
              </div>
              <div class="stat-item">
                <label>Magic</label>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: selectedAvatar.stats.magic + '%' }"></div>
                  <span class="stat-value">{{ selectedAvatar.stats.magic }}</span>
                </div>
              </div>
              <div class="stat-item">
                <label>Intelligence</label>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: selectedAvatar.stats.intelligence + '%' }"></div>
                  <span class="stat-value">{{ selectedAvatar.stats.intelligence }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-section">
            <h3>Bio</h3>
            <p class="bio">{{ selectedAvatar.bio }}</p>
          </div>
        </div>

        <div class="panel-actions">
          <button class="btn primary" @click="flyToAvatar">Fly to Location</button>
          <button class="btn secondary" @click="closePanel">Close</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { nextTick } from "vue";
import "@openglobus/og/css/og.css";
import {
  Globe,
  XYZ,
  LonLat,
  Entity,
  Vector,
  math
} from "@openglobus/og";

export default {
  name: "AvatarGlobe",
  data() {
    return {
      selectedAvatar: null,
      globe: null,
      avatarLayer: null,
      center: null,
      // Avatar model data
      avatars: [
        {
          id: 1,
          name: "Cloudy Whiskers",
          coordinates: "51.3890°, 35.6892°",
          region: "Cloud District",
          status: "Exploring",
          specialty: "Cloud Shaping",
          secondarySkill: "Weather Forecasting",
          level: 15,
          stats: { power: 85, speed: 70, magic: 90, intelligence: 75 },
          bio: "A skilled cloud shaping expert who roams the skies bringing joy to all cloud cats.",
          lon: 51.3890,
          lat: 35.6892
        },
        {
          id: 2,
          name: "Misty Paws",
          coordinates: "51.4890°, 35.7892°",
          region: "Misty Valley",
          status: "Resting",
          specialty: "Mist Manipulation",
          secondarySkill: "Dream Weaving",
          level: 12,
          stats: { power: 65, speed: 80, magic: 85, intelligence: 70 },
          bio: "Master of mist manipulation with a passion for creating beautiful weather patterns.",
          lon: 51.4890,
          lat: 35.7892
        },
        {
          id: 3,
          name: "Thunder Tail",
          coordinates: "51.2890°, 35.5892°",
          region: "Thunder Plains",
          status: "Training",
          specialty: "Thunder Control",
          secondarySkill: "Lightning Speed",
          level: 18,
          stats: { power: 95, speed: 60, magic: 80, intelligence: 65 },
          bio: "Known for incredible thunder control abilities and a friendly, approachable nature.",
          lon: 51.2890,
          lat: 35.5892
        },
        {
          id: 4,
          name: "Rainbow Purr",
          coordinates: "51.5890°, 35.4892°",
          region: "Rainbow Ridge",
          status: "Playing",
          specialty: "Rainbow Creation",
          secondarySkill: "Sky Painting",
          level: 14,
          stats: { power: 70, speed: 75, magic: 95, intelligence: 80 },
          bio: "Specializes in rainbow creation and loves to teach young cloud cats the ways of the sky.",
          lon: 51.5890,
          lat: 35.4892
        },
        {
          id: 5,
          name: "Lightning Leap",
          coordinates: "51.1890°, 35.8892°",
          region: "Breeze Bay",
          status: "Exploring",
          specialty: "Lightning Speed",
          secondarySkill: "Wind Riding",
          level: 16,
          stats: { power: 75, speed: 95, magic: 65, intelligence: 70 },
          bio: "A legendary lightning speed practitioner with centuries of experience.",
          lon: 51.1890,
          lat: 35.8892
        },
        {
          id: 6,
          name: "Foggy Mittens",
          coordinates: "51.6890°, 35.3892°",
          region: "Foggy Forest",
          status: "Meditating",
          specialty: "Storm Prediction",
          secondarySkill: "Aurora Dancing",
          level: 20,
          stats: { power: 60, speed: 65, magic: 85, intelligence: 90 },
          bio: "Expert in storm prediction and aurora dancing, bringing peace to the skies.",
          lon: 51.6890,
          lat: 35.3892
        }
      ],
      avatarSVG: null
    };
  },
  mounted() {
    this.initGlobe();
  },
  beforeUnmount() {
    if (this.globe) {
      this.globe.planet.events.off("draw", this.rotateAvatars);
      this.globe.planet.events.off("lclick", this.handleAvatarClick);
      this.globe.destroy();
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    async initGlobe() {
      try {
        await nextTick();

        // Convert SVG to data URL
    

        // Create avatar layer
        this.avatarLayer = new Vector("avatars", {
          clampToGround: true,
          picking: true, // Enable picking for click events
          async: false
        });

        this.avatars.forEach(avatar => {
          const avatarDataURL = `data:image/svg+xml;base64,${this.generateRandomAvatarURL()}`;
          const entity = new Entity({
            name: `avatar-${avatar.id}`,
            lonlat: new LonLat(avatar.lon, avatar.lat),
            billboard: {
              src: this.generateRandomAvatarURL(),
              size: [40, 40],
              offset: [0, 20],
            },
            properties: {
              avatarData: avatar // Store the complete avatar data
            }
          });

          this.avatarLayer.add(entity);
        });


        // Base OSM Layer
        const osm = new XYZ("OpenStreetMap", {
          isBaseLayer: true,
          url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "Lynku Avatars On Earth",
        });

        // Create Globe
        this.globe = new Globe({
          target: "earth",
          name: "Earth",
          layers: [osm, this.avatarLayer],
          autoActivate: true,
        });

        // Set center for rotation
        this.center = new LonLat(51.3890, 35.6892);

        // Set initial view
        this.setInitialView();

        // Handle avatar clicks
        this.setupClickEvents();

        // Add draw event listener for rotation
        // this.globe.planet.events.on("draw", this.rotateAvatars);

        // Handle resize events
        window.addEventListener("resize", this.handleResize);

        console.log("Globe initialized successfully with", this.avatars.length, "avatars");

      } catch (error) {
        console.error("Error initializing globe:", error);
      }
    },

    generateRandomAvatarURL() {
      const options = {
        topType: [
          "ShortHairShortFlat", "LongHairCurly", "NoHair", "Hat", "Eyepatch"
        ],
        accessoriesType: [
          "Blank", "Kurt", "Round", "Prescription02"
        ],
        hairColor: [
          "BrownDark", "Blonde", "Black", "Red"
        ],
        facialHairType: [
          "Blank", "BeardLight", "BeardMedium"
        ],
        facialHairColor: [
          "Red", "Brown", "Black"
        ],
        clotheType: [
          "BlazerSweater", "Hoodie", "ShirtCrewNeck"
        ],
        eyeType: [
          "Happy", "Wink", "WinkWacky", "Squint"
        ],
        eyebrowType: [
          "Default", "UpDown", "Angry"
        ],
        mouthType: [
          "Smile", "Serious", "Vomit", "Twinkle"
        ],
        skinColor: [
          "Light", "Pale", "Brown", "DarkBrown"
        ]
      };

      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

      const query = new URLSearchParams({
        avatarStyle: "Circle",
        topType: pick(options.topType),
        accessoriesType: pick(options.accessoriesType),
        hairColor: pick(options.hairColor),
        facialHairType: pick(options.facialHairType),
        facialHairColor: pick(options.facialHairColor),
        clotheType: pick(options.clotheType),
        eyeType: pick(options.eyeType),
        eyebrowType: pick(options.eyebrowType),
        mouthType: pick(options.mouthType),
        skinColor: pick(options.skinColor),
      });

      return `http://10.20.151.166:5000/avatars?${query.toString()}`;
    },


    setupClickEvents() {
      // Handle click events on avatars
      this.globe.planet.events.on("lclick", (e) => {
        if (e.pickingObject) {
          const entity = e.pickingObject.entity;
          if (entity && entity.properties && entity.properties.avatarData) {
            this.selectedAvatar = { ...entity.properties.avatarData };
            console.log("Avatar clicked:", this.selectedAvatar.name);
          }
        }
      });

      // Alternative click handler
      this.globe.planet.events.on("mousedown", (e) => {
        if (e.pickingObject) {
          const entity = e.pickingObject.entity;
          if (entity && entity.properties && entity.properties.avatarData) {
            this.selectedAvatar = { ...entity.properties.avatarData };
            console.log("Avatar clicked (mousedown):", this.selectedAvatar.name);
          }
        }
      });
    },

    setInitialView() {
      if (!this.globe) return;

      setTimeout(() => {
        try {
          this.globe.planet.viewExtent([
            this.center.lon - 2,
            this.center.lat - 2,
            this.center.lon + 2,
            this.center.lat + 2
          ]);
        } catch (error) {
          console.warn("Could not set initial view:", error);
        }
      }, 1000);
    },

    flyToAvatar() {
      if (!this.selectedAvatar || !this.globe) return;

      try {
        const lon = this.selectedAvatar.lon;
        const lat = this.selectedAvatar.lat;

        this.globe.planet.viewExtent([
          lon - 0.5,
          lat - 0.5,
          lon + 0.5,
          lat + 0.5
        ]);
      } catch (error) {
        console.warn("Could not fly to avatar location:", error);
      }
    },

    closePanel() {
      this.selectedAvatar = null;
    },

    handleResize() {
      if (this.globe && this.globe.renderer) {
        this.globe.renderer.resize();
      }
    },
  },
};
</script>

<style scoped>
#earth-container {
  width: 100vw;
  height: 90vh;
  overflow: hidden;
  background: none;
  position: relative;
}

#earth {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Bottom Panel Styles */
.avatar-info-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid #e1e8ed;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.avatar-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-right: 50px;
}

.avatar-image {
  margin-left: 20px;
}

.avatar-title h2 {
  margin: 0 0 5px 0;
  font-size: 1.5em;
  color: #2c3e50;
}

.level {
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: 600;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.profile-section {
  margin-bottom: 0;
}

.profile-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.1em;
  border-bottom: 2px solid #87CEEB;
  padding-bottom: 5px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 0;
}

.info-item label {
  font-weight: 600;
  color: #333;
  min-width: 80px;
}

.info-item span {
  color: #555;
  text-align: right;
}

.status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8em;
  font-weight: 600;
}

.status.exploring {
  background: #e3f2fd;
  color: #1976d2;
}

.status.resting {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status.training {
  background: #e8f5e8;
  color: #388e3c;
}

.status.playing {
  background: #fff3e0;
  color: #f57c00;
}

.status.meditating {
  background: #fce4ec;
  color: #c2185b;
}

.specialties {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.specialty-tag {
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item label {
  min-width: 80px;
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
}

.stat-bar {
  flex: 1;
  height: 16px;
  background: #ecf0f1;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #87CEEB, #4682B4);
  border-radius: 8px;
  transition: width 0.5s ease;
}

.stat-value {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7em;
  font-weight: 600;
  color: #2c3e50;
}

.bio {
  color: #555;
  line-height: 1.4;
  margin: 0;
  font-style: italic;
  font-size: 0.9em;
}

.panel-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.btn.primary {
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(135, 206, 235, 0.4);
}

.btn.secondary {
  background: #ecf0f1;
  color: #666;
}

.btn.secondary:hover {
  background: #bdc3c7;
  color: #333;
}

/* Slide Up Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .avatar-info-panel {
    padding: 15px;
    max-height: 60vh;
  }

  .profile-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .avatar-header {
    flex-direction: column;
    text-align: center;
    padding-right: 0;
  }

  .avatar-image {
    margin-left: 0;
    margin-bottom: 10px;
  }

  .panel-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

/* Hide OpenGlobus coordinate overlay */
.og-coordinates {
  display: none !important;
}
</style>