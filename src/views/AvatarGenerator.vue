<template>
    <div class="avatar-generator-container" style="margin-top: 70px;">
        <!-- Header -->
        <div class="generator-header">
            <div class="header-content">
                <div class="avatar-preview-large">
                    <img :src="avatarUrl" alt="Avatar Preview" class="preview-image" />
                    <div class="preview-overlay">
                        <button class="download-btn" @click="downloadAvatar">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                            </svg>
                            دانلود
                        </button>
                    </div>
                </div>
                <div class="header-text">
                    <h1>سازنده آواتار متاورس</h1>
                    <p>آواتار خودت رو شخصی‌سازی کن و در جهان دیجیتال ظاهر شو</p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="generator-content">
            <!-- Category Navigation -->
            <div class="category-nav" style="text-align: center !important;">
                <button v-for="category in categories" :key="category.id" class="category-btn"
                    :class="{ active: activeCategory === category.id }" @click="activeCategory = category.id">
                    <div>{{ category.name }}</div>
                </button>
            </div>

            <!-- Options Grid -->
            <div class="options-container">
                <div class="options-section">
                    <h3 class="section-title">{{ getCategoryTitle(activeCategory) }}</h3>

                    <!-- Style Options -->
                    <div v-if="activeCategory === 'style'" class="options-grid">
                        <div v-for="style in avatarStyles" :key="style.value" class="option-card"
                            :class="{ selected: avatarConfig.avatarStyle === style.value }"
                            @click="updateConfig('avatarStyle', style.value)">
                            <div class="option-preview">
                                <div class="style-preview" :class="style.value"></div>
                            </div>
                            <span class="option-label">{{ style.label }}</span>
                        </div>
                    </div>

                    <!-- Top Options -->
                    <div v-if="activeCategory === 'top'" class="options-grid">
                        <div v-for="top in topTypes" :key="top.value" class="option-card"
                            :class="{ selected: avatarConfig.topType === top.value }"
                            @click="updateConfig('topType', top.value)">
                            <div class="option-preview">
                                <img :src="generatePreviewUrl({ ...avatarConfig, topType: top.value })" alt="" />
                            </div>
                            <span class="option-label">{{ top.label }}</span>
                        </div>
                    </div>

                    <!-- Accessories Options -->
                    <div v-if="activeCategory === 'accessories'" class="options-grid">
                        <div v-for="accessory in accessoriesTypes" :key="accessory.value" class="option-card"
                            :class="{ selected: avatarConfig.accessoriesType === accessory.value }"
                            @click="updateConfig('accessoriesType', accessory.value)">
                            <div class="option-preview">
                                <img :src="generatePreviewUrl({ ...avatarConfig, accessoriesType: accessory.value })"
                                    alt="" />
                            </div>
                            <span class="option-label">{{ accessory.label }}</span>
                        </div>
                    </div>

                    <!-- Hair Color Options -->
                    <div v-if="activeCategory === 'hairColor'" class="options-grid">
                        <div v-for="color in hairColors" :key="color.value" class="option-card"
                            :class="{ selected: avatarConfig.hairColor === color.value }"
                            @click="updateConfig('hairColor', color.value)">
                            <div class="option-preview">
                                <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
                            </div>
                            <span class="option-label">{{ color.label }}</span>
                        </div>
                    </div>

                    <!-- Facial Hair Options -->
                    <div v-if="activeCategory === 'facialHair'" class="options-grid">
                        <div v-for="facialHair in facialHairTypes" :key="facialHair.value" class="option-card"
                            :class="{ selected: avatarConfig.facialHairType === facialHair.value }"
                            @click="updateConfig('facialHairType', facialHair.value)">
                            <div class="option-preview">
                                <img :src="generatePreviewUrl({ ...avatarConfig, facialHairType: facialHair.value })"
                                    alt="" />
                            </div>
                            <span class="option-label">{{ facialHair.label }}</span>
                        </div>
                    </div>

                    <!-- Facial Hair Color Options -->
                    <div v-if="activeCategory === 'facialHairColor'" class="options-grid">
                        <div v-for="color in facialHairColors" :key="color.value" class="option-card"
                            :class="{ selected: avatarConfig.facialHairColor === color.value }"
                            @click="updateConfig('facialHairColor', color.value)">
                            <div class="option-preview">
                                <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
                            </div>
                            <span class="option-label">{{ color.label }}</span>
                        </div>
                    </div>

                    <!-- Clothes Options -->
                    <div v-if="activeCategory === 'clothes'" class="options-grid">
                        <div v-for="clothe in clotheTypes" :key="clothe.value" class="option-card"
                            :class="{ selected: avatarConfig.clotheType === clothe.value }"
                            @click="updateConfig('clotheType', clothe.value)">
                            <div class="option-preview">
                                <img :src="generatePreviewUrl({ ...avatarConfig, clotheType: clothe.value })" alt="" />
                            </div>
                            <span class="option-label">{{ clothe.label }}</span>
                        </div>
                    </div>

                    <!-- Clothe Color Options -->
                    <div v-if="activeCategory === 'clotheColor'" class="options-grid">
                        <div v-for="color in clotheColors" :key="color.value" class="option-card"
                            :class="{ selected: avatarConfig.clotheColor === color.value }"
                            @click="updateConfig('clotheColor', color.value)">
                            <div class="option-preview">
                                <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
                            </div>
                            <span class="option-label">{{ color.label }}</span>
                        </div>
                    </div>

                    <!-- Eyes Options -->
                    <div v-if="activeCategory === 'eyes'" class="options-grid">
                        <div v-for="eye in eyeTypes" :key="eye.value" class="option-card"
                            :class="{ selected: avatarConfig.eyeType === eye.value }"
                            @click="updateConfig('eyeType', eye.value)">
                            <div class="option-preview">
                                <img :src="generatePreviewUrl({ ...avatarConfig, eyeType: eye.value })" alt="" />
                            </div>
                            <span class="option-label">{{ eye.label }}</span>
                        </div>
                    </div>

                    <!-- Eyebrow Options -->
                    <div v-if="activeCategory === 'eyebrow'" class="options-grid">
                        <div v-for="eyebrow in eyebrowTypes" :key="eyebrow.value" class="option-card"
                            :class="{ selected: avatarConfig.eyebrowType === eyebrow.value }"
                            @click="updateConfig('eyebrowType', eyebrow.value)">
                            <div class="option-preview">
                                <img :src="generatePreviewUrl({ ...avatarConfig, eyebrowType: eyebrow.value })"
                                    alt="" />
                            </div>
                            <span class="option-label">{{ eyebrow.label }}</span>
                        </div>
                    </div>

                    <!-- Mouth Options -->
                    <div v-if="activeCategory === 'mouth'" class="options-grid">
                        <div v-for="mouth in mouthTypes" :key="mouth.value" class="option-card"
                            :class="{ selected: avatarConfig.mouthType === mouth.value }"
                            @click="updateConfig('mouthType', mouth.value)">
                            <div class="option-preview">
                                <img :src="generatePreviewUrl({ ...avatarConfig, mouthType: mouth.value })" alt="" />
                            </div>
                            <span class="option-label">{{ mouth.label }}</span>
                        </div>
                    </div>

                    <!-- Skin Options -->
                    <div v-if="activeCategory === 'skin'" class="options-grid">
                        <div v-for="skin in skinColors" :key="skin.value" class="option-card"
                            :class="{ selected: avatarConfig.skinColor === skin.value }"
                            @click="updateConfig('skinColor', skin.value)">
                            <div class="option-preview">
                                <div class="skin-preview" :style="{ backgroundColor: skin.hex }"></div>
                            </div>
                            <span class="option-label">{{ skin.label }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions-bar">
                <button class="action-btn secondary" @click="resetAvatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                    </svg>
                    بازنشانی
                </button>
                <button class="action-btn primary" @click="saveAvatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                    </svg>
                    ذخیره آواتار
                </button>
            </div>
        </div>

        <!-- Live Preview Modal -->
        <div v-if="showPreview" class="preview-modal" @click="showPreview = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>پیش‌نمایش آواتار</h3>
                    <button class="close-btn" @click="showPreview = false">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <img :src="avatarUrl" alt="Avatar Preview" class="full-preview" />
                </div>
                <div class="modal-actions">
                    <button class="action-btn secondary" @click="showPreview = false">بستن</button>
                    <button class="action-btn primary" @click="downloadAvatar">دانلود</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AvatarGenerator',
    data() {
        return {
            activeCategory: 'style',
            showPreview: false,
            avatarConfig: {
                avatarStyle: 'Circle',
                topType: 'ShortHairShortFlat',
                accessoriesType: 'Prescription02',
                hairColor: 'BrownDark',
                facialHairType: 'Blank',
                facialHairColor: 'BrownDark',
                clotheType: 'ShirtCrewNeck',
                clotheColor: 'Blue02',
                eyeType: 'Default',
                eyebrowType: 'Default',
                mouthType: 'Default',
                skinColor: 'Light'
            },
            categories: [
                {
                    id: 'style',
                    name: 'سبک',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2a9.98 9.98 0 0 0-7.09 2.91L2 8l3.09 3.09A9.98 9.98 0 0 0 12 22Z"/></svg>`
                },
                {
                    id: 'top',
                    name: 'مو',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="7"/><path d="M21 21l-5.2-5.2"/></svg>`
                },
                {
                    id: 'accessories',
                    name: 'اکسسوری',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M10 15h4"/></svg>`
                },
                {
                    id: 'hairColor',
                    name: 'رنگ مو',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M4.93 10.93a10 10 0 0 0 14.14 0"/></svg>`
                },
                {
                    id: 'facialHair',
                    name: 'ریش',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14s2 4 10 4 10-4 10-4"/><path d="M2 14c0-4 2-8 10-8s10 4 10 8"/></svg>`
                },
                {
                    id: 'facialHairColor',
                    name: 'رنگ ریش',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M19 19l-7-7-7 7"/></svg>`
                },
                {
                    id: 'clothes',
                    name: 'لباس',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M9 4v8l3-2 3 2V4"/></svg>`
                },
                {
                    id: 'clotheColor',
                    name: 'رنگ لباس',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>`
                },
                {
                    id: 'eyes',
                    name: 'چشم‌ها',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`
                },
                {
                    id: 'eyebrow',
                    name: 'ابرو',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9c3-3 15-3 18 0"/></svg>`
                },
                {
                    id: 'mouth',
                    name: 'دهان',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14s2 4 10 4 10-4 10-4"/></svg>`
                },
                {
                    id: 'skin',
                    name: 'پوست',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 15s2 2 4 2 4-2 4-2"/></svg>`
                }
            ]
            ,
            avatarStyles: [
                { value: 'Circle', label: 'دایره' },
                { value: 'Transparent', label: 'شفاف' }
            ],
            topTypes: [
                { value: 'NoHair', label: 'بدون مو' },
                { value: 'Eyepatch', label: 'چشم‌بند' },
                { value: 'Hat', label: 'کلاه' },
                { value: 'Hijab', label: 'حجاب' },
                { value: 'Turban', label: 'عمامه' },
                { value: 'WinterHat1', label: 'کلاه زمستانی ۱' },
                { value: 'WinterHat2', label: 'کلاه زمستانی ۲' },
                { value: 'WinterHat3', label: 'کلاه زمستانی ۳' },
                { value: 'WinterHat4', label: 'کلاه زمستانی ۴' },
                { value: 'LongHairBigHair', label: 'موی بلند حجیم' },
                { value: 'LongHairBob', label: 'بوب' },
                { value: 'LongHairBun', label: 'دم اسبی' },
                { value: 'LongHairCurly', label: 'فر' },
                { value: 'LongHairCurvy', label: 'موج دار' },
                { value: 'LongHairDreads', label: 'رشته‌ای' },
                { value: 'LongHairFrida', label: 'فریدا' },
                { value: 'LongHairFro', label: 'افرو' },
                { value: 'LongHairFroBand', label: 'افرو با باند' },
                { value: 'LongHairNotTooLong', label: 'نیمه بلند' },
                { value: 'LongHairShavedSides', label: 'طرفین تراشیده' },
                { value: 'LongHairMiaWallace', label: 'میا والاس' },
                { value: 'LongHairStraight', label: 'صاف' },
                { value: 'LongHairStraight2', label: 'صاف ۲' },
                { value: 'LongHairStraightStrand', label: 'رشته صاف' },
                { value: 'ShortHairDreads01', label: 'رشته کوتاه ۱' },
                { value: 'ShortHairDreads02', label: 'رشته کوتاه ۲' },
                { value: 'ShortHairFrizzle', label: 'مجعد' },
                { value: 'ShortHairShaggyMullet', label: 'شگی مولت' },
                { value: 'ShortHairShortCurly', label: 'فر کوتاه' },
                { value: 'ShortHairShortFlat', label: 'صاف کوتاه' },
                { value: 'ShortHairShortRound', label: 'گرد کوتاه' },
                { value: 'ShortHairShortWaved', label: 'موج کوتاه' },
                { value: 'ShortHairSides', label: 'طرفین' },
                { value: 'ShortHairTheCaesar', label: 'سزار' },
                { value: 'ShortHairTheCaesarSidePart', label: 'سزار با خط' }
            ],
            accessoriesTypes: [
                { value: 'Blank', label: 'هیچ‌کدام' },
                { value: 'Kurt', label: 'کلاه کورت' },
                { value: 'Prescription01', label: 'عینک ۱' },
                { value: 'Prescription02', label: 'عینک ۲' },
                { value: 'Round', label: 'عینک گرد' },
                { value: 'Sunglasses', label: 'عینک آفتابی' },
                { value: 'Wayfarers', label: 'عینک ویفرز' }
            ],
            hairColors: [
                { value: 'Auburn', label: 'عنابی', hex: '#A55728' },
                { value: 'Black', label: 'مشکی', hex: '#2C1B18' },
                { value: 'Blonde', label: 'بلوند', hex: '#B58143' },
                { value: 'BlondeGolden', label: 'بلوند طلایی', hex: '#D6B370' },
                { value: 'Brown', label: 'قهوه‌ای', hex: '#724133' },
                { value: 'BrownDark', label: 'قهوه‌ای تیره', hex: '#4A312C' },
                { value: 'PastelPink', label: 'صورتی پاستلی', hex: '#F59797' },
                { value: 'Platinum', label: 'پلاتینیوم', hex: '#ECDCBF' },
                { value: 'Red', label: 'قرمز', hex: '#C93305' },
                { value: 'SilverGray', label: 'نقره‌ای', hex: '#E8E1E1' }
            ],
            facialHairTypes: [
                { value: 'Blank', label: 'هیچ‌کدام' },
                { value: 'BeardMedium', label: 'ریش متوسط' },
                { value: 'BeardLight', label: 'ریش کم' },
                { value: 'BeardMajestic', label: 'ریش مجلل' },
                { value: 'MoustacheFancy', label: 'سبیل فانتزی' },
                { value: 'MoustacheMagnum', label: 'سبیل بزرگ' }
            ],
            facialHairColors: [
                { value: 'Auburn', label: 'عنابی', hex: '#A55728' },
                { value: 'Black', label: 'مشکی', hex: '#2C1B18' },
                { value: 'Blonde', label: 'بلوند', hex: '#B58143' },
                { value: 'BlondeGolden', label: 'بلوند طلایی', hex: '#D6B370' },
                { value: 'Brown', label: 'قهوه‌ای', hex: '#724133' },
                { value: 'BrownDark', label: 'قهوه‌ای تیره', hex: '#4A312C' },
                { value: 'Platinum', label: 'پلاتینیوم', hex: '#ECDCBF' },
                { value: 'Red', label: 'قرمز', hex: '#C93305' }
            ],
            clotheTypes: [
                { value: 'BlazerShirt', label: 'بلزر و پیراهن' },
                { value: 'BlazerSweater', label: 'بلزر و سوئیشرت' },
                { value: 'CollarSweater', label: 'سوئیشرت یقه دار' },
                { value: 'GraphicShirt', label: 'پیراهن گرافیکی' },
                { value: 'Hoodie', label: 'هودی' },
                { value: 'Overall', label: 'اورال' },
                { value: 'ShirtCrewNeck', label: 'پیراهن یقه گرد' },
                { value: 'ShirtScoopNeck', label: 'پیراهن یقه اسکوپ' },
                { value: 'ShirtVNeck', label: 'پیراهن یقه وی' }
            ],
            clotheColors: [
                { value: 'Black', label: 'مشکی', hex: '#262E33' },
                { value: 'Blue01', label: 'آبی ۱', hex: '#65C9FF' },
                { value: 'Blue02', label: 'آبی ۲', hex: '#5199E4' },
                { value: 'Blue03', label: 'آبی ۳', hex: '#25557C' },
                { value: 'Gray01', label: 'خاکستری ۱', hex: '#E6E6E6' },
                { value: 'Gray02', label: 'خاکستری ۲', hex: '#929598' },
                { value: 'Heather', label: 'هیثر', hex: '#3C4F5C' },
                { value: 'PastelBlue', label: 'آبی پاستلی', hex: '#B1E2FF' },
                { value: 'PastelGreen', label: 'سبز پاستلی', hex: '#A7FFC4' },
                { value: 'PastelOrange', label: 'نارنجی پاستلی', hex: '#FFDEB5' },
                { value: 'PastelRed', label: 'قرمز پاستلی', hex: '#FFAFB9' },
                { value: 'PastelYellow', label: 'زرد پاستلی', hex: '#FFFFB1' },
                { value: 'Pink', label: 'صورتی', hex: '#FF488E' },
                { value: 'Red', label: 'قرمز', hex: '#FF5C5C' },
                { value: 'White', label: 'سفید', hex: '#FFFFFF' }
            ],
            eyeTypes: [
                { value: 'Close', label: 'بسته' },
                { value: 'Cry', label: 'گریه' },
                { value: 'Default', label: 'پیش‌فرض' },
                { value: 'Dizzy', label: 'سرگیجه' },
                { value: 'EyeRoll', label: 'چرخش چشم' },
                { value: 'Happy', label: 'شاد' },
                { value: 'Hearts', label: 'قلب' },
                { value: 'Side', label: 'کناری' },
                { value: 'Squint', label: 'نیمه بسته' },
                { value: 'Surprised', label: 'متعجب' },
                { value: 'Wink', label: 'چشمک' },
                { value: 'WinkWacky', label: 'چشمک عجیب' }
            ],
            eyebrowTypes: [
                { value: 'Angry', label: 'عصبی' },
                { value: 'AngryNatural', label: 'عصبی طبیعی' },
                { value: 'Default', label: 'پیش‌فرض' },
                { value: 'DefaultNatural', label: 'طبیعی پیش‌فرض' },
                { value: 'FlatNatural', label: 'صاف طبیعی' },
                { value: 'RaisedExcited', label: 'بالا رفته هیجان‌زده' },
                { value: 'RaisedExcitedNatural', label: 'بالا رفته هیجان‌زده طبیعی' },
                { value: 'SadConcerned', label: 'ناراحت نگران' },
                { value: 'SadConcernedNatural', label: 'ناراحت نگران طبیعی' },
                { value: 'UnibrowNatural', label: 'اتصال ابرو طبیعی' },
                { value: 'UpDown', label: 'بالا پایین' },
                { value: 'UpDownNatural', label: 'بالا پایین طبیعی' }
            ],
            mouthTypes: [
                { value: 'Concerned', label: 'نگران' },
                { value: 'Default', label: 'پیش‌فرض' },
                { value: 'Disbelief', label: 'ناباوری' },
                { value: 'Eating', label: 'در حال غذا خوردن' },
                { value: 'Grimace', label: 'اخم' },
                { value: 'Sad', label: 'ناراحت' },
                { value: 'ScreamOpen', label: 'فریاد باز' },
                { value: 'Serious', label: 'جدی' },
                { value: 'Smile', label: 'لبخند' },
                { value: 'Tongue', label: 'زبان' },
                { value: 'Twinkle', label: 'برق' },
                { value: 'Vomit', label: 'استفراغ' }
            ],
            skinColors: [
                { value: 'Tanned', label: 'برنزه', hex: '#FD9841' },
                { value: 'Yellow', label: 'زرد', hex: '#F8D25C' },
                { value: 'Pale', label: 'سفید', hex: '#FFDBB4' },
                { value: 'Light', label: 'روشن', hex: '#EDB98A' },
                { value: 'Brown', label: 'قهوه‌ای', hex: '#D08B5B' },
                { value: 'DarkBrown', label: 'قهوه‌ای تیره', hex: '#AE5D29' },
                { value: 'Black', label: 'مشکی', hex: '#614335' }
            ]
        }
    },
    computed: {
        avatarUrl() {
            const baseUrl = 'https://avataaars.io/'
            const params = new URLSearchParams(this.avatarConfig)
            return `${baseUrl}?${params.toString()}`
        }
    },
    methods: {
        updateConfig(key, value) {
            this.avatarConfig[key] = value
        },

        generatePreviewUrl(config) {
            const baseUrl = 'https://avataaars.io/'
            const params = new URLSearchParams(config)
            return `${baseUrl}?${params.toString()}`
        },

        getCategoryTitle(categoryId) {
            const category = this.categories.find(cat => cat.id === categoryId)
            return category ? category.name : 'گزینه‌ها'
        },

        resetAvatar() {
            this.avatarConfig = {
                avatarStyle: 'Circle',
                topType: 'ShortHairShortFlat',
                accessoriesType: 'Prescription02',
                hairColor: 'BrownDark',
                facialHairType: 'Blank',
                facialHairColor: 'BrownDark',
                clotheType: 'ShirtCrewNeck',
                clotheColor: 'Blue02',
                eyeType: 'Default',
                eyebrowType: 'Default',
                mouthType: 'Default',
                skinColor: 'Light'
            }
        },

        async saveAvatar() {
            try {
                // Save avatar configuration to localStorage or send to backend
                localStorage.setItem('userAvatarConfig', JSON.stringify(this.avatarConfig))

                // Show success message
                this.showSuccess('آواتار شما با موفقیت ذخیره شد!')
            } catch (error) {
                console.error('Error saving avatar:', error)
                this.showError('خطا در ذخیره‌سازی آواتار')
            }
        },

        async downloadAvatar() {
            try {
                const response = await fetch(this.avatarUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'my-avatar.png'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            } catch (error) {
                console.error('Error downloading avatar:', error)
                this.showError('خطا در دانلود آواتار')
            }
        },

        showSuccess(message) {
            // You can replace this with a proper toast notification
            alert(message)
        },

        showError(message) {
            // You can replace this with a proper toast notification
            alert(message)
        }
    },
    mounted() {
        // Load saved avatar configuration if exists
        const savedConfig = localStorage.getItem('userAvatarConfig')
        if (savedConfig) {
            this.avatarConfig = JSON.parse(savedConfig)
        }
    }
}
</script>

<style scoped>
.avatar-generator-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    color: #ffffff;
    padding: 20px;
    animation: slideUp 0.3s ease-out;
}

.generator-header {
    background: #000000;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 30px;
}

.avatar-preview-large {
    position: relative;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #1da1f2;
    box-shadow: 0 8px 25px rgba(29, 161, 242, 0.3);
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.avatar-preview-large:hover .preview-overlay {
    opacity: 1;
}

.download-btn {
    background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
    border: none;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;
}

.download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(29, 161, 242, 0.4);
}

.download-btn svg {
    width: 16px;
    height: 16px;
}

.header-text h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1da1f2, #00ba7c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.header-text p {
    margin: 10px 0 0 0;
    color: #8899a6;
    font-size: 1.1rem;
}

.generator-content {
    background: #000000;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
}

.category-nav {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    overflow-x: auto;
    padding-bottom: 10px;;
    text-align: center;
}

.category-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #333;
    border-radius: 5px;
    padding: 10px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    display: flex;
    font-size: 0.9rem;
    width: 30%;
    text-align: center;
}

.category-btn:hover {
    background: rgba(29, 161, 242, 0.2);
    border-color: #1da1f2;
}

.category-btn.active {
    background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
    border-color: #1da1f2;
    color: white;
}

.category-icon {
    font-size: 1.2rem;
}

.options-container {
    margin-bottom: 30px;
}

.section-title {
    color: #ffffff;
    margin-bottom: 20px;
    font-size: 1.3rem;
    font-weight: 600;
    border-bottom: 1px solid #333;
    padding-bottom: 10px;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
}

.options-grid::-webkit-scrollbar {
    width: 6px;
}

.options-grid::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 3px;
}

.options-grid::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
}

.options-grid::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.option-card {
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.option-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    border-color: #333;
}

.option-card.selected {
    border-color: #1da1f2;
    background: rgba(29, 161, 242, 0.1);
    box-shadow: 0 4px 15px rgba(29, 161, 242, 0.2);
}

.option-preview {
    width: 60px;
    height: 60px;
    margin: 0 auto 10px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
}

.option-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.style-preview {
    width: 100%;
    height: 100%;
    border-radius: 8px;
}

.style-preview.Circle {
    background: conic-gradient(from 0deg, #1da1f2, #00ba7c, #f91880, #1da1f2);
}

.style-preview.Transparent {
    background: linear-gradient(45deg, transparent 48%, #1da1f2 50%, transparent 52%);
}

.color-preview,
.skin-preview {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #333;
}

.option-label {
    color: #ffffff;
    font-size: 0.8rem;
    font-weight: 500;
    display: block;
}

.quick-actions-bar {
    display: flex;
    gap: 15px;
    justify-content: center;
    padding-top: 20px;
    border-top: 1px solid #333;
}

.action-btn {
    padding: 12px 24px;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    font-size: 0.9rem;
}

.action-btn.primary {
    background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
    color: white;
}

.action-btn.primary:hover {
    background: linear-gradient(135deg, #1a91da 0%, #1a7bb9 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 161, 242, 0.4);
}

.action-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid #333;
}

.action-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.action-btn svg {
    width: 18px;
    height: 18px;
}

.preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
}

.modal-content {
    background: #000000;
    border-radius: 20px;
    padding: 30px;
    max-width: 90%;
    max-height: 90%;
    border: 1px solid #333;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: scaleIn 0.3s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
}

.modal-header h3 {
    margin: 0;
    color: #ffffff;
    font-size: 1.5rem;
}

.close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #ffffff;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
}

.close-btn svg {
    width: 20px;
    height: 20px;
}

.modal-body {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.full-preview {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 4px solid #1da1f2;
    box-shadow: 0 12px 40px rgba(29, 161, 242, 0.3);
}

.modal-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .avatar-generator-container {
        padding: 10px;
    }

    .generator-header,
    .generator-content {
        padding: 20px;
    }

    .header-content {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }

    .category-nav {
        flex-wrap: wrap;
        justify-content: center;
    }

    .options-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
    }

    .quick-actions-bar {
        flex-direction: column;
    }

    .full-preview {
        width: 200px;
        height: 200px;
    }

    .modal-content {
        padding: 20px;
    }
}

@media (max-width: 480px) {
    .options-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .option-card {
        padding: 10px;
    }

    .option-preview {
        width: 50px;
        height: 50px;
    }
}
</style>