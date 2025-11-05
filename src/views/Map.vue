<template>
  <div id="earth-container">
    <div id="earth"></div>
    
    <!-- Profile Modal -->
    <div v-if="selectedAvatar" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        
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
                  <div class="stat-fill" :style="{width: selectedAvatar.stats.power + '%'}"></div>
                  <span class="stat-value">{{ selectedAvatar.stats.power }}</span>
                </div>
              </div>
              <div class="stat-item">
                <label>Speed</label>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{width: selectedAvatar.stats.speed + '%'}"></div>
                  <span class="stat-value">{{ selectedAvatar.stats.speed }}</span>
                </div>
              </div>
              <div class="stat-item">
                <label>Magic</label>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{width: selectedAvatar.stats.magic + '%'}"></div>
                  <span class="stat-value">{{ selectedAvatar.stats.magic }}</span>
                </div>
              </div>
              <div class="stat-item">
                <label>Intelligence</label>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{width: selectedAvatar.stats.intelligence + '%'}"></div>
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

        <div class="modal-actions">
          <button class="btn primary" @click="flyToAvatar">Fly to Location</button>
          <button class="btn secondary" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
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
  name: "About",
  data() {
    return {
      selectedAvatar: null,
      globe: null,
      pointLayer: null,
      center: null,
      avatarEntities: [], // Store entities for easier access
      avatarNames: [
        "Cloudy Whiskers", "Misty Paws", "Thunder Tail", "Stormy Whiskers",
        "Rainbow Purr", "Lightning Leap", "Foggy Mittens", "Breeze Napper",
        "Cyclone Cuddles", "Tempest Pounce", "Zephyr Stretch", "Gale Hunter"
      ],
      avatarSpecialties: [
        "Cloud Shaping", "Rainbow Creation", "Thunder Control", "Wind Riding",
        "Mist Manipulation", "Lightning Speed", "Storm Prediction", "Breeze Whispering"
      ],
      secondarySkills: [
        "Weather Forecasting", "Sky Painting", "Dream Weaving", "Star Gazing",
        "Moonlight Harvest", "Sunbeam Collection", "Aurora Dancing", "Cloud Sculpting"
      ],
      avatarSVG: `
        <svg width="80" height="80" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="20" cy="25" rx="15" ry="10" fill="#87CEEB" stroke="#4682B4" stroke-width="2"/>
          <circle cx="20" cy="20" r="12" fill="#FFB6C1"/>
          <path d="M12 10 L20 5 L28 10 Z" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1"/>
          <path d="M28 10 L36 5 L32 10 Z" fill="#FFB6C1" stroke="#FF69B4" stroke-width="1"/>
          <circle cx="16" cy="18" r="3" fill="#000"/>
          <circle cx="24" cy="18" r="3" fill="#000"/>
          <path d="M20 22 L18 25 L22 25 Z" fill="#FF69B4"/>
          <path d="M18 28 Q20 30 22 28" stroke="#000" stroke-width="1.5" fill="none"/>
          <path d="M8 20 L14 20" stroke="#000" stroke-width="1"/>
          <path d="M8 22 L14 23" stroke="#000" stroke-width="1"/>
          <path d="M8 24 L14 26" stroke="#000" stroke-width="1"/>
          <path d="M32 20 L26 20" stroke="#000" stroke-width="1"/>
          <path d="M32 22 L26 23" stroke="#000" stroke-width="1"/>
          <path d="M32 24 L26 26" stroke="#000" stroke-width="1"/>
        </svg>
      `
    };
  },
  mounted() {
    this.initGlobe();
  },
  beforeUnmount() {
    if (this.globe) {
      this.globe.planet.events.off("draw", this.rotatePoints);
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
        const avatarDataURL = `data:image/svg+xml;base64,${btoa(this.avatarSVG)}`;

        // Create points array and store entities
        let points = [];
        this.avatarEntities = [];

        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < 6; j++) {
            const lon = 51.3890 + (i - 3) * 0.1;
            const lat = 35.6892 + (j - 3) * 0.1;
            const coords = new LonLat(lon, lat);
            
            const name = this.avatarNames[(i * 6 + j) % this.avatarNames.length];
            const specialty = this.avatarSpecialties[(i * 6 + j) % this.avatarSpecialties.length];
            const secondarySkill = this.secondarySkills[(i * 6 + j) % this.secondarySkills.length];
            
            const avatarData = {
              id: i * 6 + j,
              name: name,
              coordinates: `${lon.toFixed(4)}°, ${lat.toFixed(4)}°`,
              region: this.getRegionName(lon, lat),
              status: this.getRandomStatus(),
              specialty: specialty,
              secondarySkill: secondarySkill,
              level: Math.floor(Math.random() * 50) + 1,
              stats: {
                power: Math.floor(Math.random() * 100) + 1,
                speed: Math.floor(Math.random() * 100) + 1,
                magic: Math.floor(Math.random() * 100) + 1,
                intelligence: Math.floor(Math.random() * 100) + 1
              },
              bio: this.generateBio(name, specialty),
              lon: lon,
              lat: lat
            };

            // Create entity with billboard properties directly on the entity
            const entity = new Entity({
              name: name,
              lonlat: coords,
              billboard: {
                src: avatarDataURL,
                size: [40, 40],
                offset: [0, 20],
                rotation: math.RADIANS * (Math.random() * 360)
              },
              userData: avatarData // Store avatar data directly on entity
            });

            this.avatarEntities.push({
              entity: entity,
              data: avatarData
            });
            points.push(entity);
          }
        }

        // Create point layer
        this.pointLayer = new Vector("pointLayer", {
          clampToGround: true,
          entities: points,
          async: false,
          picking: true
        });

        // Base OSM Layer
        const osm = new XYZ("OpenStreetMap", {
          isBaseLayer: true,
          url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: "Cloudy Cat Avatars On Earth",
        });

        // Create Globe
        this.globe = new Globe({
          target: "earth",
          name: "Earth",
          layers: [osm, this.pointLayer],
          autoActivate: true,
        });

        // Set center for rotation
        this.center = new LonLat(51.3890, 35.6892);

        // Use a safer approach to set initial view
        this.setInitialView();

        // Handle avatar clicks
        this.globe.planet.events.on("lclick", this.handleAvatarClick);

        // Rotate points around the center - use our stored entities array
        this.rotatePoints = () => {
          if (!this.avatarEntities.length) return;
          
          let angle = 0.02 * math.RADIANS;
          
          this.avatarEntities.forEach((avatarObj) => {
            const entity = avatarObj.entity;
            if (!entity) return;
            
            const c = entity.getLonLat();
            const rotatedLon = Math.cos(angle) * (c.lon - this.center.lon) - Math.sin(angle) * (c.lat - this.center.lat) + this.center.lon;
            const rotatedLat = Math.sin(angle) * (c.lon - this.center.lon) + Math.cos(angle) * (c.lat - this.center.lat) + this.center.lat;
            
            entity.setLonLat(new LonLat(rotatedLon, rotatedLat));
            
            // Update stored coordinates in userData
            avatarObj.data.lon = rotatedLon;
            avatarObj.data.lat = rotatedLat;
            avatarObj.data.coordinates = `${rotatedLon.toFixed(4)}°, ${rotatedLat.toFixed(4)}°`;
            
            // Update bobbing animation
            const time = Date.now() * 0.001;
            const bobOffset = Math.sin(time + c.lon * 100) * 2;
            
            // Update billboard offset directly
            if (entity.billboard) {
              entity.billboard.offset = [0, 20 + bobOffset];
            }
          });
        };

        // Add draw event listener for rotation
        this.globe.planet.events.on("draw", this.rotatePoints);

        // Handle resize events
        window.addEventListener("resize", this.handleResize);

        console.log("Globe initialized successfully with", this.avatarEntities.length, "avatars");

      } catch (error) {
        console.error("Error initializing globe:", error);
      }
    },

    setInitialView() {
      if (!this.globe) return;
      
      // Use a timeout to ensure the globe is fully initialized
      setTimeout(() => {
        try {
          // Use viewExtent instead of flyLonLat
          this.globe.planet.viewExtent([
            this.center.lon - 2, // min lon
            this.center.lat - 2, // min lat
            this.center.lon + 2, // max lon
            this.center.lat + 2  // max lat
          ]);
        } catch (error) {
          console.warn("Could not set initial view:", error);
        }
      }, 1000);
    },

    handleAvatarClick(e) {
      if (!e.pickingObject) return;
      
      console.log("Click detected:", e.pickingObject);
      
      // Try to get the entity from the picking object
      const entity = e.pickingObject.entity || e.pickingObject;
      
      if (entity && entity.userData) {
        // Entity has userData directly
        this.selectedAvatar = { ...entity.userData };
        console.log("Avatar clicked:", this.selectedAvatar.name);
      } else if (entity && entity._entity && entity._entity.userData) {
        // Some versions store entity differently
        this.selectedAvatar = { ...entity._entity.userData };
        console.log("Avatar clicked (alt):", this.selectedAvatar.name);
      }
    },

    flyToAvatar() {
      if (!this.selectedAvatar || !this.globe) return;
      
      try {
        const lon = this.selectedAvatar.lon;
        const lat = this.selectedAvatar.lat;
        
        this.globe.planet.viewExtent([
          lon - 0.5, // min lon
          lat - 0.5, // min lat
          lon + 0.5, // max lon
          lat + 0.5  // max lat
        ]);
      } catch (error) {
        console.warn("Could not fly to avatar location:", error);
      }
    },

    closeModal() {
      this.selectedAvatar = null;
    },

    getRegionName(lon, lat) {
      const regions = [
        "Cloud District", "Misty Valley", "Thunder Plains", "Rainbow Ridge",
        "Breeze Bay", "Foggy Forest", "Stormy Coast", "Calm Meadows",
        "Whispering Woods", "Golden Fields", "Crystal Lake", "Emerald Hills"
      ];
      return regions[Math.floor(Math.random() * regions.length)];
    },

    getRandomStatus() {
      const statuses = [
        "Exploring", "Resting", "Training", "Socializing",
        "Meditating", "Playing", "Learning", "Guarding"
      ];
      return statuses[Math.floor(Math.random() * statuses.length)];
    },

    generateBio(name, specialty) {
      const bios = [
        `A skilled ${specialty.toLowerCase()} expert who roams the skies bringing joy to all cloud cats.`,
        `Master of ${specialty.toLowerCase()} with a passion for creating beautiful weather patterns.`,
        `Known for incredible ${specialty.toLowerCase()} abilities and a friendly, approachable nature.`,
        `Specializes in ${specialty.toLowerCase()} and loves to teach young cloud cats the ways of the sky.`,
        `A legendary ${specialty.toLowerCase()} practitioner with centuries of experience.`
      ];
      return bios[Math.floor(Math.random() * bios.length)];
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
/* Your existing CSS styles remain exactly the same */
/* Full-screen container */
#earth-container {
  width: 100vw;
  height: 50vh;
  overflow: hidden;
  background: none;
  position: relative;
}

/* OpenGlobus canvas fills its container */
#earth {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
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
  padding: 30px 30px 20px;
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  border-radius: 16px 16px 0 0;
  color: white;
}

.avatar-image {
  margin-right: 20px;
}

.avatar-title h2 {
  margin: 0 0 5px 0;
  font-size: 1.8em;
}

.level {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
}

.profile-grid {
  padding: 20px 30px;
}

.profile-section {
  margin-bottom: 25px;
}

.profile-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.2em;
  border-bottom: 2px solid #87CEEB;
  padding-bottom: 5px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-item label {
  font-weight: 600;
  color: #333;
  min-width: 100px;
  margin-right: 10px;
}

.info-item span {
  color: #555;
}

.status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.85em;
  font-weight: 600;
}

.status.exploring { background: #e3f2fd; color: #1976d2; }
.status.resting { background: #f3e5f5; color: #7b1fa2; }
.status.training { background: #e8f5e8; color: #388e3c; }
.status.playing { background: #fff3e0; color: #f57c00; }

.specialties {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.specialty-tag {
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 600;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-item label {
  min-width: 100px;
  font-weight: 600;
  color: #333;
}

.stat-bar {
  flex: 1;
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #87CEEB, #4682B4);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.stat-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8em;
  font-weight: 600;
  color: #2c3e50;
}

.bio {
  color: #555;
  line-height: 1.5;
  margin: 0;
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px 30px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #87CEEB, #4682B4);
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(135, 206, 235, 0.4);
}

.btn.secondary {
  background: #ecf0f1;
  color: #666;
}

.btn.secondary:hover {
  background: #bdc3c7;
  color: #333;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Optional: subtle animation when loading */
#earth::after {
  content: "🌍 Loading Cloudy Cat Avatars...";
  color: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  pointer-events: none;
  animation: fadeOut 1.5s ease-in-out forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; }
  90% { opacity: 0; }
  100% { display: none; }
}

body {
  margin: 0;
  padding: 0;
  background: #000;
}

/* Hide OpenGlobus coordinate overlay */
.og-coordinates {
  display: none !important;
}

/* Responsive */
@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .avatar-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-image {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>