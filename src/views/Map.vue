<template>
  <div id="earth-container">
    <div id="earth"></div>
  </div>

</template>

<script>
import { nextTick } from "vue";
import "@openglobus/og/css/og.css";
import { Globe, XYZ, LonLat } from "@openglobus/og";

export default {
  name: "About",
  mounted() {
    // --- Base OSM Layer ---
    const osm = new XYZ("OpenStreetMap", {
      isBaseLayer: true,
      url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "Cloudy Cat Avatars On Earth",
    });

    // --- Create Globe ---
    this.globe = new Globe({
      target: "earth",
      name: "Global Map",
      layers: [osm],
      autoActivate: true,
    });

    // --- Focus on Iran (example center point) ---
    this.globe.planet.flyLonLat(51.3890, 35.6892, 5000000); // Tehran area

    // Handle resize events
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.globe) this.globe.destroy();
  },
  methods: {
    handleResize() {
      if (this.globe && this.globe.renderer) {
        this.globe.renderer.resize();
      }
    },
  },
};
</script>

<style scoped>
/* Full-screen container */
#earth-container {
  width: 100vw;
  height: 50vh;
  overflow: hidden;
  background: none;
}

/* OpenGlobus canvas fills its container */
#earth {
  width: 100%;
  height: 100%;
}

/* Optional: subtle animation when loading */
#earth::after {
  content: "🌍 Loading globe...";
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
  0% {
    opacity: 1;
  }

  90% {
    opacity: 0;
  }

  100% {
    display: none;
  }
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

</style>
