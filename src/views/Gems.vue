<template>
  <div class="gem-market">
    <!-- GEM GRID -->
    <div class="row">
       <div class="col-6 gem-col" v-for="gem in gems" :key="gem.id">
          <div
            type="button"
            class="gem-card"
            @click="openGem(gem)"
          >
            <div class="gem-svg" v-html="gem.svg"></div>

            <div class="gem-info">
              <div class="gem-title-row">
                <span class="gem-name">{{ gem.name }}</span>
                <span class="gem-tagline">{{ gem.tagline }}</span>
              </div>

              <div class="gem-meta-row">
                <span class="pill pill-rare">
                  کمیاب · {{ gem.rarityLabel }}
                </span>
                <span class="pill pill-count">
                  باقی‌مانده: {{ gem.remaining }} / {{ gem.total }}
                </span>
              </div>

              <div class="gem-price-row">
                <span class="price-label">قیمت</span>
                <span class="price-value">
                  {{ gem.price.toLocaleString("fa-IR") }}
                  <span class="price-unit">جم</span>
                </span>
              </div>
            </div>
          </div>
       </div>
    </div>

    <!-- MODAL -->
    <Transition name="modal-fade">
      <div
        v-if="selectedGem"
        class="lynku-modal-backdrop"
        @click.self="closeModal"
      >
        <div class="lynku-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            class="lynku-modal-close"
            @click="closeModal"
            aria-label="بستن"
          >
            ✕
          </button>

          <div class="lynku-modal-body">
            <div class="lynku-modal-svg" v-html="selectedGem.svg"></div>

            <h3 class="lynku-modal-title">{{ selectedGem.name }}</h3>
            <p class="lynku-modal-tagline">{{ selectedGem.tagline }}</p>

            <p class="lynku-modal-desc">
              {{ selectedGem.description }}
            </p>

            <div class="lynku-modal-stats">
              <div class="stat-box">
                <span class="stat-label">موجودی فعلی</span>
                <span class="stat-value">
                  {{ selectedGem.remaining }} / {{ selectedGem.total }}
                </span>
              </div>
              <div class="stat-box">
                <span class="stat-label">نادر بودن</span>
                <span class="stat-value">
                  {{ selectedGem.rarityLabel }}
                </span>
              </div>
              <div class="stat-box">
                <span class="stat-label">قیمت</span>
                <span class="stat-value">
                  {{ selectedGem.price.toLocaleString("fa-IR") }}
                  <span class="stat-unit">جم</span>
                </span>
              </div>
            </div>

            <div class="lynku-modal-actions">
              <button
                type="button"
                class="btn btn-primary"
                @click="buySelected"
              >
                خرید این جم
              </button>
              <button
                type="button"
                class="btn btn-ghost"
                @click="closeModal"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue"

defineOptions({ name: "GemsView" })

const gems = ref([
  {
    id: "starship",
    name: "جم استارشپ",
    tagline: "موتور پرش بین‌کهکشانی",
    description:
      "این جم به آواتار تو افکت پرش فضایی و رد نور ستاره‌ای می‌دهد. مناسب پروفایل‌های ماجراجو و اکسپلوررهای متاورس.",
    remaining: 87,
    total: 1000,
    price: 120,
    rarityLabel: "Epic",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-starship-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7b5cff"/>
            <stop offset="50%" stop-color="#ff33ff"/>
            <stop offset="100%" stop-color="#33f6ff"/>
          </linearGradient>
          <radialGradient id="grad-starship-glow" cx="50%" cy="10%" r="70%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
            <stop offset="40%" stop-color="#ff33ff" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="48" fill="url(#grad-starship-glow)">
          <animate attributeName="r" values="40;48;40" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
        </circle>
        <g>
          <polygon
            points="60,10 85,45 70,105 60,115 50,105 35,45"
            fill="url(#grad-starship-body)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 -2; 0 2; 0 -2"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </polygon>
          <circle cx="60" cy="45" r="8" fill="#0b1020" stroke="#aaf2ff" stroke-width="2">
            <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite"/>
          </circle>
        </g>
        <g stroke-linecap="round" stroke-width="3">
          <line x1="54" y1="100" x2="50" y2="118" stroke="#33f6ff">
            <animate attributeName="y2" values="118;110;118" dur="1s" repeatCount="indefinite"/>
          </line>
          <line x1="66" y1="100" x2="70" y2="118" stroke="#ff33ff">
            <animate attributeName="y2" values="118;110;118" dur="1.1s" repeatCount="indefinite"/>
          </line>
        </g>
      </svg>
    `
  },
  {
    id: "iceCore",
    name: "هسته یخ‌هولو",
    tagline: "سرد، سایلنت، خفن",
    description:
      "جم یخی با افکت‌های هولوگرافیک که به آواتار تو حس سایبر-سامورایی می‌دهد. مناسب استایل‌های مینیمال و خونسرد.",
    remaining: 230,
    total: 2000,
    price: 80,
    rarityLabel: "Rare",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-ice-core" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#33f6ff"/>
            <stop offset="50%" stop-color="#a5fffb"/>
            <stop offset="100%" stop-color="#3b9dff"/>
          </linearGradient>
        </defs>
        <g>
          <polygon
            points="60,10 90,30 90,70 60,90 30,70 30,30"
            fill="url(#grad-ice-core)"
            stroke="#d7ffff"
            stroke-width="2"
            opacity="0.95"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 4; 0 0"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </polygon>
          <polygon
            points="60,25 78,36 78,62 60,73 42,62 42,36"
            fill="#001b3b"
            opacity="0.9"
          >
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.4s" repeatCount="indefinite"/>
          </polygon>
        </g>
        <g stroke="#a5fffb" stroke-width="1.5">
          <line x1="20" y1="105" x2="40" y2="80">
            <animate attributeName="y1" values="105;95;105" dur="1.6s" repeatCount="indefinite"/>
          </line>
          <line x1="100" y1="105" x2="80" y2="80">
            <animate attributeName="y1" values="105;95;105" dur="1.6s" repeatCount="indefinite" begin="0.3s"/>
          </line>
        </g>
      </svg>
    `
  },
  {
    id: "portal",
    name: "درگاه نئون",
    tagline: "ورودی دنیای مخفی Lynku",
    description:
      "جم پرتال نئون، افکت حلقه‌ای و ورودی مخفی روی پروفایل و آواتار تو ایجاد می‌کند. مناسب کسایی که همیشه یک رویِ مخفی برای کشف شدن دارن.",
    remaining: 57,
    total: 777,
    price: 210,
    rarityLabel: "Legendary",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <radialGradient id="grad-portal-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
            <stop offset="40%" stop-color="#ff33ff" stop-opacity="0.9"/>
            <stop offset="70%" stop-color="#33f6ff" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="40"
          stroke="#ff33ff"
          stroke-width="3"
          fill="none"
          stroke-dasharray="8 10"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx="60"
          cy="60"
          r="26"
          stroke="#33f6ff"
          stroke-width="2"
          fill="none"
          stroke-dasharray="4 6"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 60 60"
            to="0 60 60"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="60" r="20" fill="url(#grad-portal-core)">
          <animate attributeName="r" values="16;22;16" dur="2.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `
  },
  {
    id: "heartBeat",
    name: "هارت‌بیت نئون",
    tagline: "ریتم شبکه اجتماعی تو",
    description:
      "هر بار اکتیویتی مهم انجام می‌دی (پست، ویس، لایک سنگین) افکت نبض نئون روی پروفایل و آواتارت پخش می‌شود.",
    remaining: 310,
    total: 3000,
    price: 45,
    rarityLabel: "Uncommon",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-heart" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff3e7f"/>
            <stop offset="100%" stop-color="#ffb347"/>
          </linearGradient>
        </defs>
        <path
          d="M60 100
             C20 70 20 35 40 25
             C52 18 60 26 60 32
             C60 26 68 18 80 25
             C100 35 100 70 60 100Z"
          fill="url(#grad-heart)"
          stroke="#ff9ac7"
          stroke-width="2.5"
        >
          <animate
            attributeName="transform"
            type="scale"
            values="1 1;1.08 1.08;1 1"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </path>
        <polyline
          points="10,30 25,30 32,50 40,18 50,60 60,30 70,45 80,30 95,30"
          fill="none"
          stroke="#ffb3da"
          stroke-width="2"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.2;1;0.2"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </polyline>
      </svg>
    `
  },
  {
    id: "quantumShard",
    name: "کوآنتوم شارد",
    tagline: "گلیچِ کنترل‌شده",
    description:
      "یک تکه کوآنتومی که گاهی آواتار را گلیچ‌وار تلپورت می‌کند. مناسب استایل‌های گلیچ و هکر.",
    remaining: 140,
    total: 999,
    price: 150,
    rarityLabel: "Epic",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-quantum" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f5a0"/>
            <stop offset="50%" stop-color="#00d9f5"/>
            <stop offset="100%" stop-color="#7b5cff"/>
          </linearGradient>
        </defs>
        <polygon
          points="60,8 100,40 84,110 60,96 36,110 20,40"
          fill="url(#grad-quantum)"
          opacity="0.95"
        >
          <animateTransform
            attributeName="transform"
            type="skewX"
            values="0;5;-3;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </polygon>
        <rect x="30" y="40" width="8" height="12" fill="#050814">
          <animate attributeName="y" values="38;46;38" dur="0.4s" repeatCount="indefinite"/>
        </rect>
        <rect x="80" y="58" width="6" height="10" fill="#050814">
          <animate attributeName="y" values="60;52;60" dur="0.5s" repeatCount="indefinite"/>
        </rect>
      </svg>
    `
  },
  {
    id: "lynkRing",
    name: "رینگ Lynk",
    tagline: "حلقه اتصال دوستان",
    description:
      "حلقه نئونی که کانکشن‌های نزدیک تو را هایلایت می‌کند و در چت‌ها می‌درخشد.",
    remaining: 520,
    total: 5000,
    price: 30,
    rarityLabel: "Common+",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#33f6ff"/>
            <stop offset="100%" stop-color="#ff33ff"/>
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="34"
          stroke="url(#grad-ring)"
          stroke-width="6"
          fill="none"
          stroke-dasharray="10 8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="60" r="6" fill="#ffffff">
          <animate attributeName="r" values="5;8;5" dur="1.6s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `
  },
  {
    id: "echoCube",
    name: "اکو کیوب",
    tagline: "حافظه‌ی ویس‌ها و صداها",
    description:
      "کیوبی که ویس‌های مهم تو را به صورت افکت نئونی روی آواتار نشان می‌دهد. مناسب کسایی که زیاد ویس می‌فرستن.",
    remaining: 260,
    total: 1800,
    price: 60,
    rarityLabel: "Rare",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-cube" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7b5cff"/>
            <stop offset="100%" stop-color="#33f6ff"/>
          </linearGradient>
        </defs>
        <rect x="30" y="30" width="60" height="60" rx="10" fill="#050814" stroke="#33f6ff" stroke-width="2"/>
        <rect x="36" y="36" width="48" height="48" rx="8" fill="url(#grad-cube)" opacity="0.9">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
        </rect>
        <rect x="42" y="44" width="6" height="32" rx="3" fill="#ffffff">
          <animate attributeName="height" values="12;32;16;32" dur="1.2s" repeatCount="indefinite"/>
        </rect>
        <rect x="54" y="44" width="6" height="32" rx="3" fill="#ffffff">
          <animate attributeName="height" values="32;16;32;20" dur="1.2s" repeatCount="indefinite"/>
        </rect>
        <rect x="66" y="44" width="6" height="32" rx="3" fill="#ffffff">
          <animate attributeName="height" values="18;32;12;32" dur="1.2s" repeatCount="indefinite"/>
        </rect>
      </svg>
    `
  },
  {
    id: "pixelNova",
    name: "پیکسل نُوا",
    tagline: "انفجار پیکسلی",
    description:
      "جم انفجاری که موقع لایک‌ها و ری‌اکشن‌ها یک نوا‌ی پیکسلی دور آواتارت پخش می‌کند.",
    remaining: 99,
    total: 888,
    price: 95,
    rarityLabel: "Epic",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <rect x="40" y="40" width="40" height="40" fill="#111122" rx="4"/>
        <rect x="46" y="46" width="10" height="10" fill="#ff33ff">
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="64" y="46" width="10" height="10" fill="#33f6ff">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="46" y="64" width="10" height="10" fill="#ffaa00">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.2s" repeatCount="indefinite"/>
        </rect>
        <rect x="64" y="64" width="10" height="10" fill="#ffffff">
          <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite"/>
        </rect>
        <circle cx="60" cy="60" r="26" fill="none" stroke="#ff33ff" stroke-width="2" stroke-dasharray="2 6">
          <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `
  }
])

const selectedGem = ref(null)

function openGem(gem) {
  selectedGem.value = gem
}

function closeModal() {
  selectedGem.value = null
}

function buySelected() {
  if (!selectedGem.value) return
  console.log("Buying gem:", selectedGem.value.id)
}
</script>

<style scoped>
:host,
.gem-market {
  --bg-main: #050814;
  --card-bg: rgba(15, 18, 40, 0.9);
  --card-border: rgba(255, 255, 255, 0.08);
  --accent-pink: #ff33ff;
  --accent-cyan: #33f6ff;
  --text-main: #f5f5ff;
  --text-sub: #a3a6c3;
  --radius-xl: 20px;
  --transition-fast: 0.18s ease-out;
}

.gem-market {
  direction: rtl;
  padding: 1.5rem;
  color: var(--text-main);
  border-radius: 16px;
  margin-top: 50px;
;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header-main h2 {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.header-main p {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-sub);
}

.badge {
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: linear-gradient(
    135deg,
    rgba(255, 51, 255, 0.2),
    rgba(51, 246, 255, 0.06)
  );
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
}

.gem-col {
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  float: left;
}

/* Gem card */
.gem-card {
  position: relative;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  padding: 0.9rem;
  text-align: center;
  overflow: hidden;
  margin: 0.3rem auto;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    border-color var(--transition-fast),
    background 0.25s ease-out;
}

.gem-card::before {
  content: "";
  position: absolute;
  inset: -40%;
  background: radial-gradient(
    circle at top,
    rgba(255, 51, 255, 0.15),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.25s ease-out;
}

.gem-card:hover {
  transform: translateY(-4px) translateZ(0);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.7),
    0 0 35px rgba(255, 51, 255, 0.3);
}

.gem-card:hover::before {
  opacity: 1;
}

.gem-card:active {
  transform: translateY(-1px) scale(0.99);
}

/* SVG wrapper */
.gem-svg {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gem-svg svg {
  display: block;
  filter: drop-shadow(0 0 12px rgba(255, 51, 255, 0.4));
  animation: float-slow 4s ease-in-out infinite;
}

/* Info block */
.gem-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.gem-title-row {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.gem-name {
  font-size: 0.95rem;
  font-weight: 700;
}

.gem-tagline {
  font-size: 0.8rem;
  color: var(--text-sub);
}

/* Meta row */
.gem-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.15rem;
}

.pill {
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  backdrop-filter: blur(12px);
}

.pill-rare {
  background: linear-gradient(
    135deg,
    rgba(255, 51, 255, 0.18),
    rgba(51, 246, 255, 0.12)
  );
}

.pill-count {
  background: rgba(5, 10, 30, 0.85);
}

/* Price row */
.gem-price-row {
  margin-top: 0.25rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price-label {
  font-size: 0.75rem;
  color: var(--text-sub);
}

.price-value {
  font-size: 0.95rem;
  font-weight: 700;
}

.price-unit {
  font-size: 0.75rem;
  margin-right: 0.25rem;
  color: var(--accent-cyan);
}

/* LYNKU MODAL (no clash with Bootstrap) */
.lynku-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 6, 20, 0.82);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.lynku-modal {
  position: relative;
  width: min(420px, 92vw);
  border-radius: 26px;
  padding: 1.4rem 1.3rem 1.2rem;
  background: radial-gradient(circle at top, #25204a 0, #050814 70%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.85),
    0 0 60px rgba(255, 51, 255, 0.5);
  display: block; /* make sure it's visible even if global CSS does weird stuff */
}

.lynku-modal-body {
  text-align: center;
}

.lynku-modal-svg {
  margin-bottom: 0.6rem;
}

.lynku-modal-svg svg {
  width: 120px;
  height: 120px;
}

.lynku-modal-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.lynku-modal-tagline {
  margin-top: 0.15rem;
  font-size: 0.85rem;
  color: var(--text-sub);
}

.lynku-modal-desc {
  margin-top: 0.7rem;
  font-size: 0.83rem;
  color: var(--text-main);
  opacity: 0.92;
}

.lynku-modal-stats {
  margin-top: 0.9rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.4rem;
}

.stat-box {
  padding: 0.4rem 0.5rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(5, 10, 25, 0.9);
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  color: var(--text-sub);
}

.stat-value {
  display: block;
  margin-top: 0.15rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-unit {
  font-size: 0.75rem;
  margin-right: 0.15rem;
  color: var(--accent-cyan);
}

.lynku-modal-actions {
  margin-top: 1.1rem;
  display: flex;
  gap: 0.5rem;
}

/* Buttons */
.btn {
  flex: 1;
  border-radius: 999px;
  padding: 0.55rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-cyan));
  color: #050814;
  box-shadow: 0 0 25px rgba(255, 51, 255, 0.7);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    0 16px 30px rgba(0, 0, 0, 0.6),
    0 0 35px rgba(255, 51, 255, 0.9);
}

.btn-ghost {
  background: rgba(7, 12, 30, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
  color: var(--text-main);
}

.btn-ghost:hover {
  background: rgba(12, 18, 40, 0.95);
}

/* Close button */
.lynku-modal-close {
  position: absolute;
  top: 0.7rem;
  left: 0.8rem;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(5, 10, 20, 0.95);
  color: var(--text-sub);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    border-color var(--transition-fast);
}

.lynku-modal-close:hover {
  background: rgba(20, 26, 50, 0.98);
  border-color: rgba(255, 255, 255, 0.45);
  transform: scale(1.02);
}

/* Animations */
@keyframes float-slow {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
  100% {
    transform: translateY(0px);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .gem-market {
    padding: 1.1rem;
  }

  .header-main h2 {
    font-size: 1.2rem;
  }

  .gem-card {
    padding: 0.8rem;
  }

  .lynku-modal {
    padding: 1.1rem 1rem 1rem;
  }

  .lynku-modal-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
