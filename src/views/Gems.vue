<template>
  <div class="gem-market">
    <!-- TABS -->
    <div class="tab-bar">
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'owned' }"
        @click="activeTab = 'owned'"
      >
        جم‌های من
      </button>
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'market' }"
        @click="activeTab = 'market'"
      >
        بازار
      </button>
      <button
        type="button"
        class="tab-btn"
        :class="{ active: activeTab === 'gifts' }"
        @click="activeTab = 'gifts'"
      >
        هدایا
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="filteredItems.length === 0" class="empty-state">
      <p v-if="activeTab === 'owned'">
        هنوز جمی نخریدی. از تب «بازار» یکی بردار 😎
      </p>
      <p v-else-if="activeTab === 'market'">
        همهٔ جم‌های بازار رو گرفتی! 🔥
      </p>
      <p v-else>
        فعلاً هیچ هدیه‌ای نداری. از اینجا می‌تونی برای بقیه هدیه بفرستی 💌
      </p>
    </div>

    <!-- GRID -->
    <div v-else class="row">
      <div class="col-6 gem-col" v-for="item in filteredItems" :key="item.id">
        <div
          type="button"
          class="gem-card"
          @click="openItem(item)"
        >
          <div class="gem-svg" v-html="item.svg"></div>

          <div class="gem-info">
            <div class="gem-title-row">
              <span class="gem-name">
                {{ item.name }}
                <span
                  v-if="activeTab !== 'gifts' && item.owned"
                  class="owned-dot"
                >
                  ●
                </span>
              </span>
              <span class="gem-tagline">{{ item.tagline }}</span>
            </div>

            <div class="gem-meta-row">
              <span class="pill pill-rare">
                <template v-if="activeTab === 'gifts'">
                  نوع هدیه · {{ item.giftCategoryLabel }}
                </template>
                <template v-else>
                  کمیاب · {{ item.rarityLabel }}
                </template>
              </span>
              <span class="pill pill-count">
                باقی‌مانده: {{ item.remaining }} / {{ item.total }}
              </span>
            </div>

            <div class="gem-price-row">
              <span class="price-label">
                {{ activeTab === 'gifts' ? "هزینه ارسال" : "قیمت" }}
              </span>
              <span class="price-value">
                {{ item.price.toLocaleString("fa-IR") }}
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
        v-if="selectedItem"
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
            <div class="lynku-modal-svg" v-html="selectedItem.svg"></div>

            <h3 class="lynku-modal-title">{{ selectedItem.name }}</h3>
            <p class="lynku-modal-tagline">{{ selectedItem.tagline }}</p>

            <p class="lynku-modal-desc">
              {{ selectedItem.description }}
            </p>

            <div class="lynku-modal-stats">
              <div class="stat-box">
                <span class="stat-label">موجودی فعلی</span>
                <span class="stat-value">
                  {{ selectedItem.remaining }} / {{ selectedItem.total }}
                </span>
              </div>
              <div class="stat-box" v-if="!isGiftModal">
                <span class="stat-label">نادر بودن</span>
                <span class="stat-value">
                  {{ selectedItem.rarityLabel }}
                </span>
              </div>
              <div class="stat-box" v-else>
                <span class="stat-label">نوع هدیه</span>
                <span class="stat-value">
                  {{ selectedItem.giftCategoryLabel }}
                </span>
              </div>
              <div class="stat-box">
                <span class="stat-label">
                  {{ isGiftModal ? "هزینه ارسال" : "قیمت" }}
                </span>
                <span class="stat-value">
                  {{ selectedItem.price.toLocaleString("fa-IR") }}
                  <span class="stat-unit">جم</span>
                </span>
              </div>
            </div>

            <div class="lynku-modal-actions">
              <!-- GIFTS -->
              <template v-if="isGiftModal">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="sendGift"
                >
                  ارسال این هدیه
                </button>
                <button
                  type="button"
                  class="btn btn-ghost"
                  @click="closeModal"
                >
                  انصراف
                </button>
              </template>

              <!-- GEMS -->
              <template v-else>
                <button
                  v-if="!selectedItem.owned"
                  type="button"
                  class="btn btn-primary"
                  @click="buySelected"
                >
                  خرید این جم
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-primary btn-owned"
                  disabled
                >
                  این جم رو داری ✔
                </button>
                <button
                  type="button"
                  class="btn btn-ghost"
                  @click="closeModal"
                >
                  انصراف
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

defineOptions({ name: "GemsView" })

/**
 * GEMS (market + owned)
 */
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
    owned: true,
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
    owned: false,
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
    owned: true,
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
    owned: false,
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
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.08;1"
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
    owned: false,
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
    owned: true,
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
    owned: false,
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
    owned: false,
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
  },
  {
    id: "chronoHalo",
    name: "هالو زمان‌برگردان",
    tagline: "اسکرابِ زمان توی پروفایل",
    description:
      "حلقه زمانی که آخرین هایلایت‌ها و لحظات مهم پروفایل را به صورت افکت چرخشی نشان می‌دهد.",
    remaining: 12,
    total: 365,
    price: 260,
    rarityLabel: "Mythic",
    owned: true,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-chrono" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffe36f"/>
            <stop offset="50%" stop-color="#ff33ff"/>
            <stop offset="100%" stop-color="#33f6ff"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="34" fill="none" stroke="url(#grad-chrono)" stroke-width="4" stroke-dasharray="6 8">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="60" cy="60" r="20" fill="#050814" opacity="0.8"/>
        <path d="M60 44 L60 60 L72 60" stroke="#ffe36f" stroke-width="3" stroke-linecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    `
  },
  {
    id: "glitchOrb",
    name: "گلیچ اورب",
    tagline: "توپک نویزی برای هکرها",
    description:
      "کُره‌ای که هر چند ثانیه یک‌بار به شکل رندوم گلیچ و دیستورت می‌شود و اطراف اواتارت ظاهر می‌شود.",
    remaining: 200,
    total: 1500,
    price: 110,
    rarityLabel: "Epic",
    owned: false,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <radialGradient id="grad-glitch" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="40%" stop-color="#00f5a0"/>
            <stop offset="100%" stop-color="#000000"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="26" fill="url(#grad-glitch)">
          <animate attributeName="r" values="22;30;24;28;26" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <rect x="40" y="50" width="40" height="4" fill="#050814">
          <animate attributeName="x" values="36;44;38;40" dur="0.4s" repeatCount="indefinite"/>
        </rect>
        <rect x="46" y="66" width="28" height="3" fill="#050814">
          <animate attributeName="x" values="50;42;47;46" dur="0.35s" repeatCount="indefinite"/>
        </rect>
      </svg>
    `
  },
  {
    id: "auroraBand",
    name: "نوار شفق",
    tagline: "نور شمالیِ شخصی",
    description:
      "نواری از شفق قطبی که روی لبه آواتارت حرکت می‌کند و در لحظات خاص شدت می‌گیرد.",
    remaining: 420,
    total: 4000,
    price: 55,
    rarityLabel: "Uncommon",
    owned: false,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-aurora" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#33f6ff"/>
            <stop offset="50%" stop-color="#7bff7b"/>
            <stop offset="100%" stop-color="#ffb3ff"/>
          </linearGradient>
        </defs>
        <path
          d="M10 70
             C30 60 40 80 60 70
             C80 60 90 80 110 70
             L110 90
             L10 90Z"
          fill="url(#grad-aurora)"
          opacity="0.85"
        >
          <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values="
              M10 70 C30 60 40 80 60 70 C80 60 90 80 110 70 L110 90 L10 90Z;
              M10 68 C30 78 40 60 60 72 C80 82 90 60 110 72 L110 90 L10 90Z;
              M10 70 C30 60 40 80 60 70 C80 60 90 80 110 70 L110 90 L10 90Z
            "
          />
        </path>
      </svg>
    `
  },
  {
    id: "shadowGlyph",
    name: "شدو گلیف",
    tagline: "امضای سایه‌ای",
    description:
      "یک گلیف سایه‌ای که روی پس‌زمینه آواتار حک می‌شود و با حرکت موس/انگشت کمی جابه‌جا می‌شود.",
    remaining: 333,
    total: 2222,
    price: 70,
    rarityLabel: "Rare",
    owned: false,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#111111"/>
            <stop offset="100%" stop-color="#444466"/>
          </linearGradient>
        </defs>
        <path
          d="M30 90
             C40 40 80 40 90 90
             L75 80
             C68 60 52 60 45 80Z"
          fill="url(#grad-shadow)"
          opacity="0.9"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;2 -2;-2 1;0 0"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    `
  },
  {
    id: "dataStream",
    name: "استریم دیتا",
    tagline: "بارکد زنده‌ی پروفایل",
    description:
      "ستون‌هایی از خط‌های نئونی که مثل دیتاستریم دور پروفایل بالا و پایین می‌روند.",
    remaining: 190,
    total: 1500,
    price: 85,
    rarityLabel: "Epic",
    owned: false,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <rect x="20" y="20" width="80" height="80" rx="10" fill="#050814" stroke="#33f6ff" stroke-width="2"/>
        <rect x="30" y="30" width="6" height="40" fill="#33f6ff">
          <animate attributeName="height" values="10;40;20;35" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="44" y="30" width="6" height="40" fill="#ff33ff">
          <animate attributeName="height" values="35;15;40;25" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="58" y="30" width="6" height="40" fill="#33f6ff">
          <animate attributeName="height" values="20;40;15;30" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="72" y="30" width="6" height="40" fill="#ffb347">
          <animate attributeName="height" values="40;18;36;22" dur="1s" repeatCount="indefinite"/>
        </rect>
      </svg>
    `
  },
  {
    id: "neonComet",
    name: "نئون کومِت",
    tagline: "شهاب‌سنگ اجتماعی",
    description:
      "هر بار رشد ناگهانی در پروفایلت اتفاق می‌افتد، یک دنباله‌دار نئونی اطراف آواتارت رد می‌شود.",
    remaining: 44,
    total: 500,
    price: 240,
    rarityLabel: "Legendary",
    owned: true,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-comet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#33f6ff"/>
            <stop offset="50%" stop-color="#ff33ff"/>
            <stop offset="100%" stop-color="#ffb347"/>
          </linearGradient>
        </defs>
        <circle cx="20" cy="40" r="4" fill="url(#grad-comet)">
          <animate
            attributeName="cx"
            values="20;100;20"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="40;60;40"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
        <path
          d="M20 40 Q60 50 100 60"
          stroke="url(#grad-comet)"
          stroke-width="3"
          stroke-linecap="round"
          fill="none"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.2;1;0.2"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    `
  },
  {
    id: "signalRing",
    name: "رینگ سیگنال",
    tagline: "وایب آنلاین بودن",
    description:
      "حلقه‌ای که شدت سیگنال و آنلاین بودن تو رو با موج‌های ریز دور آواتار نشان می‌دهد.",
    remaining: 800,
    total: 6000,
    price: 35,
    rarityLabel: "Common+",
    owned: false,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="20" fill="#050814" stroke="#33f6ff" stroke-width="2"/>
        <circle cx="60" cy="60" r="26" fill="none" stroke="#33f6ff" stroke-width="2" stroke-dasharray="4 6">
          <animate attributeName="r" values="22;30;22" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="60" r="34" fill="none" stroke="#ff33ff" stroke-width="1.5" stroke-dasharray="2 8">
          <animate attributeName="r" values="30;38;30" dur="1.8s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `
  },
  {
    id: "orbitBits",
    name: "اوربیت بیت‌ها",
    tagline: "دورمدارِ دیتا",
    description:
      "چند بیت کوچک که مثل ماهواره دور آواتارت می‌چرخند، مخصوص پروفایل‌های تکنولوژی‌محور.",
    remaining: 260,
    total: 2200,
    price: 90,
    rarityLabel: "Rare",
    owned: false,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="30" fill="none" stroke="#33f6ff" stroke-width="1.5"/>
        <g fill="#ff33ff">
          <circle cx="60" cy="30" r="4">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 60 60"
              to="360 60 60"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="60" cy="90" r="3">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 60 60"
              to="0 60 60"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    `
  },
  {
    id: "pulseGrid",
    name: "پالس گرید",
    tagline: "شبکه نبضی",
    description:
      "گریدی از مربع‌های کوچک که نسبت به میزان اکتیویتی تو روشن و خاموش می‌شوند.",
    remaining: 500,
    total: 4000,
    price: 65,
    rarityLabel: "Uncommon",
    owned: false,
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <rect x="25" y="25" width="70" height="70" rx="8" fill="#050814" stroke="#2c2f66" stroke-width="2"/>
        <rect x="32" y="32" width="10" height="10" fill="#33f6ff">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1s" repeatCount="indefinite"/>
        </rect>
        <rect x="50" y="32" width="10" height="10" fill="#ff33ff">
          <animate attributeName="opacity" values="1;0.2;1" dur="1.3s" repeatCount="indefinite"/>
        </rect>
        <rect x="68" y="32" width="10" height="10" fill="#ffaa00">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.1s" repeatCount="indefinite"/>
        </rect>
        <rect x="32" y="50" width="10" height="10" fill="#ffffff">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite"/>
        </rect>
        <rect x="50" y="50" width="10" height="10" fill="#33f6ff">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.9s" repeatCount="indefinite"/>
        </rect>
        <rect x="68" y="50" width="10" height="10" fill="#ff33ff">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite"/>
        </rect>
      </svg>
    `
  }
])

/**
 * GIFTS (for sending to others)
 */
const gifts = ref([
  {
    id: "lovePulseGift",
    name: "هدیه پالس عشق",
    tagline: "برای کراش‌ها و رِل‌های نئونی",
    description:
      "هدیه‌ای با قلب نئون و اموجی‌های معلق که موقع دریافت، یک نبض نرم روی پروفایل طرف مقابل پخش می‌کند.",
    remaining: 999,
    total: 9999,
    price: 25,
    giftCategoryLabel: "عشق / Love",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-love-heart" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff4b9b"/>
            <stop offset="100%" stop-color="#ffb3ff"/>
          </linearGradient>
        </defs>
        <path
          d="M60 96
             C25 72 20 42 38 30
             C48 24 58 28 60 36
             C62 28 72 24 82 30
             C100 42 95 72 60 96Z"
          fill="url(#grad-love-heart)"
          stroke="#ffe0f5"
          stroke-width="2"
        >
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.06;1"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>
        <text x="48" y="52" font-size="14" fill="#ffffff">❤️</text>
        <text x="70" y="40" font-size="12" fill="#ffdefa">✨</text>
      </svg>
    `
  },
  {
    id: "birthdayNovaGift",
    name: "هدیه نُوا تولد",
    tagline: "برای تبریک تولدهای GenZ",
    description:
      "کیک نئونی با انفجار کنفِتی که به محض دریافت روی پروفایل یک لحظه جشن کوچیک اجرا می‌کند.",
    remaining: 420,
    total: 5000,
    price: 40,
    giftCategoryLabel: "تولد / Birthday",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <rect x="38" y="60" width="44" height="26" rx="6" fill="#1a1030" stroke="#ffb3ff" stroke-width="2"/>
        <rect x="42" y="64" width="36" height="10" rx="4" fill="#ff7bb3"/>
        <rect x="54" y="46" width="4" height="16" fill="#ffd966"/>
        <circle cx="56" cy="44" r="3" fill="#ffeb99">
          <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite"/>
        </circle>
        <circle cx="40" cy="40" r="2" fill="#ff33ff">
          <animate attributeName="cy" values="40;32;40" dur="1.4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="80" cy="32" r="2" fill="#33f6ff">
          <animate attributeName="cy" values="32;26;32" dur="1.2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    `
  },
  {
    id: "hardWorkTrophyGift",
    name: "هدیه تروفی زحمت‌کش",
    tagline: "برای آدم‌های خفن و پرتلاش",
    description:
      "جام نئونی که روی پروفایل طرف، یک نشان «سخت‌کوش» می‌گذارد و چند روز می‌درخشد.",
    remaining: 300,
    total: 3000,
    price: 50,
    giftCategoryLabel: "زحمت‌کش / Hard work",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-trophy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffd966"/>
            <stop offset="100%" stop-color="#ffb347"/>
          </linearGradient>
        </defs>
        <rect x="46" y="78" width="28" height="6" fill="#22223b"/>
        <rect x="42" y="84" width="36" height="6" rx="2" fill="#333355"/>
        <path d="M50 78 L70 78 L66 60 L54 60Z" fill="#444466"/>
        <path d="M54 60 L66 60 L68 40 L52 40Z" fill="url(#grad-trophy)" stroke="#ffeec2" stroke-width="2">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 -2;0 0"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx="60" cy="48" r="4" fill="#ffeec2"/>
      </svg>
    `
  },
  {
    id: "supportWaveGift",
    name: "هدیه موج حمایت",
    tagline: "وقتی یکی رو می‌خوای ساپورت کنی",
    description:
      "امواج نئونی که نشون می‌ده پشت طرف هستی؛ برای روزهای سخت و فاز «هستم کنارت».",
    remaining: 650,
    total: 6000,
    price: 30,
    giftCategoryLabel: "حمایت / Support",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-support" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#33f6ff"/>
            <stop offset="100%" stop-color="#7bffb3"/>
          </linearGradient>
        </defs>
        <path
          d="M10 72
             C30 64 40 80 60 72
             C80 64 90 80 110 72"
          stroke="url(#grad-support)"
          stroke-width="4"
          fill="none"
        >
          <animate
            attributeName="d"
            dur="2.2s"
            repeatCount="indefinite"
            values="
              M10 72 C30 64 40 80 60 72 C80 64 90 80 110 72;
              M10 70 C30 78 40 64 60 74 C80 82 90 64 110 74;
              M10 72 C30 64 40 80 60 72 C80 64 90 80 110 72
            "
          />
        </path>
      </svg>
    `
  },
  {
    id: "comebackSparkGift",
    name: "هدیه کامبک اسپارک",
    tagline: "برای وقتی یکی بعد مدت‌ها برگشته",
    description:
      "اسپارک برگشت؛ به محض دریافت، یک افکت «کامبک» روی پروفایل می‌افتد که نشون می‌ده همه منتظرش بودن.",
    remaining: 180,
    total: 2000,
    price: 35,
    giftCategoryLabel: "کامبک / Comeback",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="grad-comeback" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffdd55"/>
            <stop offset="100%" stop-color="#33f6ff"/>
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="22" fill="none" stroke="url(#grad-comeback)" stroke-width="3">
          <animate attributeName="r" values="18;26;18" dur="1.6s" repeatCount="indefinite"/>
        </circle>
        <polygon
          points="60,42 64,54 76,54 66,62 70,74 60,66 50,74 54,62 44,54 56,54"
          fill="url(#grad-comeback)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="3s"
            repeatCount="indefinite"
          />
        </polygon>
      </svg>
    `
  },
  {
    id: "thankYouBloomGift",
    name: "هدیه بلوم مرسی",
    tagline: "برای تشکرهای باکلاسِ Lynku",
    description:
      "گل نئونی که روی پروفایل طرف به صورت کوتاه شکوفه می‌زند و حس «دمت گرم» را منتقل می‌کند.",
    remaining: 500,
    total: 5000,
    price: 20,
    giftCategoryLabel: "مرسی / Thank you",
    svg: `
      <svg width="100" height="100" viewBox="0 0 120 120">
        <defs>
          <radialGradient id="grad-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="40%" stop-color="#ffb3ff"/>
            <stop offset="100%" stop-color="#ff4b9b"/>
          </radialGradient>
        </defs>
        <circle cx="60" cy="64" r="6" fill="url(#grad-bloom)">
          <animate attributeName="r" values="4;8;4" dur="1.8s" repeatCount="indefinite"/>
        </circle>
        <g fill="#ff7bd5" opacity="0.9">
          <circle cx="60" cy="50" r="5"/>
          <circle cx="72" cy="60" r="5"/>
          <circle cx="60" cy="72" r="5"/>
          <circle cx="48" cy="60" r="5"/>
        </g>
        <rect x="58" y="72" width="4" height="14" rx="2" fill="#33a36b"/>
      </svg>
    `
  }
])

const activeTab = ref("owned") // 'owned' | 'market' | 'gifts'
const selectedItem = ref(null)
const selectedType = ref(null) // 'gem' | 'gift'

const isGiftModal = computed(() => selectedType.value === "gift")

const filteredItems = computed(() => {
  if (activeTab.value === "gifts") {
    return gifts.value
  }
  if (activeTab.value === "owned") {
    return gems.value.filter(g => g.owned)
  }
  return gems.value.filter(g => !g.owned)
})

function openItem(item) {
  selectedItem.value = item
  selectedType.value = activeTab.value === "gifts" ? "gift" : "gem"
}

function closeModal() {
  selectedItem.value = null
  selectedType.value = null
}

function buySelected() {
  if (!selectedItem.value || selectedType.value !== "gem") return
  const gem = gems.value.find(g => g.id === selectedItem.value.id)
  if (!gem) return

  if (!gem.owned) {
    gem.owned = true
    if (gem.remaining > 0) gem.remaining--
  }
  closeModal()
}

function sendGift() {
  if (!selectedItem.value || selectedType.value !== "gift") return
  // TODO: call backend API to send gift
  console.log("Sending gift:", selectedItem.value.id)
  if (selectedItem.value.remaining > 0) {
    selectedItem.value.remaining--
  }
  closeModal()
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
}

/* Tabs */
.tab-bar {
  display: inline-flex;
  padding: 0.2rem;
  border-radius: 999px;
  background: rgba(10, 12, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 1rem;
}

.tab-btn {
  border: none;
  background: transparent;
  color: var(--text-sub);
  padding: 0.35rem 1rem;
  font-size: 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast),
  box-shadow var(--transition-fast), transform var(--transition-fast);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-cyan));
  color: #050814;
  box-shadow: 0 0 18px rgba(255, 51, 255, 0.6);
  transform: translateY(-1px);
}

/* Empty state */
.empty-state {
  margin-top: 1.2rem;
  font-size: 0.9rem;
  color: var(--text-sub);
}

/* Owned dot */
.owned-dot {
  font-size: 0.6rem;
  color: var(--accent-cyan);
  margin-right: 4px;
}

/* Grid */
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

/* Modal */
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

.btn-primary.btn-owned {
  opacity: 0.8;
  box-shadow: none;
  cursor: default;
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
