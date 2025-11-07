<template>
    <div class="splash-screen">
        <!-- Animated Background -->
        <div class="splash-background">
            <div class="floating-orb orb-1"></div>
            <div class="floating-orb orb-2"></div>
            <div class="floating-orb orb-3"></div>
            <div class="grid-lines"></div>
        </div>

        <!-- Main Content -->
        <div class="splash-content">
            <!-- Animated Logo -->
            <div class="logo-container">
                <div class="letter-animation">
                    <span class="letter" v-for="(letter, index) in letters" :key="index" :style="getLetterStyle(index)"
                        @animationend="onLetterAnimationEnd(index)">
                        {{ letter }}
                    </span>
                </div>
                <div class="domain">.xyz</div>
            </div>

            <!-- Tagline -->
            <div class="tagline" :class="{ 'fade-in': showTagline }">
                <p>جهان دیجیتال شما</p>
                <p>Your Digital Universe</p>
            </div>

            <!-- Loading Progress -->
            <div class="loading-container" :class="{ 'fade-in': showLoading }">
                <div class="loading-bar">
                    <div class="loading-progress" :style="{ width: loadingProgress + '%' }"></div>
                </div>
                <div class="loading-text">
                    در حال بارگذاری... {{ Math.round(loadingProgress) }}%
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="splash-footer" :class="{ 'fade-in': showFooter }">
            <div class="footer-content">
                <span class="copyright">© 2024 Lynku.xyz</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SplashScreen',
    emits: ['login', 'register'],
    data() {
        return {
            letters: ['L', 'Y', 'N', 'K', 'U'],
            animatedLetters: 0,
            showTagline: false,
            showLoading: false,
            showActions: false,
            showFooter: false,
            loadingProgress: 0,
            loadingInterval: null
        }
    },
    mounted() {
        this.startAnimationSequence();
    },
    beforeUnmount() {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
    },
    methods: {
        startAnimationSequence() {
            setTimeout(() => {
                this.animateLetters();
            }, 500);

            setTimeout(() => {
                this.startLoadingProgress();
            }, 2000);
        },

        animateLetters() {
            // Letters animate through CSS
        },

        onLetterAnimationEnd(index) {
            this.animatedLetters++;
            const self = this;
            if (this.animatedLetters === this.letters.length) {
                setTimeout(() => {
                    this.showTagline = true;
                }, 300);

                setTimeout(() => {
                    this.showLoading = true;
                }, 800);
            }
        },

        startLoadingProgress() {
            this.loadingInterval = setInterval(() => {
                if (this.loadingProgress < 100) {
                    this.loadingProgress += Math.random() * 15;
                    if (this.loadingProgress > 100) this.loadingProgress = 100;
                } else {
                    clearInterval(this.loadingInterval);
                }
            }, 200);
        },

        getLetterStyle(index) {
            return {
                animationDelay: `${index * 0.2}s`
            }
        }
    }
}
</script>

<style scoped>
.splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    overflow: hidden;
}

/* Animated Background */
.splash-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.floating-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.3;
    animation: float 6s ease-in-out infinite;
}

.orb-1 {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #1da1f2, #00ba7c);
    top: 20%;
    left: 10%;
    animation-delay: 0s;
}

.orb-2 {
    width: 150px;
    height: 150px;
    background: linear-gradient(135deg, #f91880, #ffad1f);
    top: 60%;
    right: 15%;
    animation-delay: 2s;
}

.orb-3 {
    width: 180px;
    height: 180px;
    background: linear-gradient(135deg, #7857ff, #00ba7c);
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
}

.grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
        linear-gradient(rgba(29, 161, 242, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(29, 161, 242, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
}

/* Logo Animation */
.logo-container {
    text-align: center;
    margin-bottom: 40px;
    direction: ltr;
}

.letter-animation {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-bottom: 10px;
}

.letter {
    font-size: 4rem;
    font-weight: 900;
    color: transparent;
    background: linear-gradient(135deg, #1da1f2, #00ba7c, #f91880);
    -webkit-background-clip: text;
    background-clip: text;
    animation: letterPop 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(30px) scale(0.8);
    font-family: "Honk", system-ui;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-variation-settings:
        "MORF" 15,
        "SHLN" 50;
    color: #000;
}

.domain {
    font-size: 1.5rem;
    color: #8899a6;
    font-weight: 300;
    letter-spacing: 2px;
}

/* Tagline */
.tagline {
    text-align: center;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
}

.tagline.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.tagline p {
    margin: 5px 0;
    color: #ffffff;
    font-size: 1.2rem;
}

.tagline p:first-child {
    font-weight: 700;
}

.tagline p:last-child {
    color: #8899a6;
    font-size: 1rem;
}

/* Loading */
.loading-container {
    width: 300px;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
}

.loading-container.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.loading-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 10px;
}

.loading-progress {
    height: 100%;
    background: linear-gradient(90deg, #1da1f2, #00ba7c);
    border-radius: 3px;
    transition: width 0.3s ease;
}

.loading-text {
    text-align: center;
    color: #8899a6;
    font-size: 0.9rem;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 15px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
}

.action-buttons.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.auth-btn {
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 140px;
}

.auth-btn.primary {
    background: linear-gradient(135deg, #1da1f2 0%, #1a91da 100%);
    color: white;
}

.auth-btn.primary:hover {
    background: linear-gradient(135deg, #1a91da 0%, #1a7bb9 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 161, 242, 0.4);
}

.auth-btn.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-btn.secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

/* Footer */
.splash-footer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    opacity: 0;
    transition: all 0.8s ease;
}

.splash-footer.fade-in {
    opacity: 1;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
    color: #8899a6;
    font-size: 0.8rem;
}

.footer-links {
    display: flex;
    gap: 20px;
}

.footer-link {
    color: #8899a6;
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-link:hover {
    color: #1da1f2;
}

/* Animations */
@keyframes letterPop {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.8);
    }

    70% {
        transform: translateY(-5px) scale(1.1);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-20px) rotate(180deg);
    }
}

@keyframes gridMove {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(50px, 50px);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .letter {
        font-size: 3rem;
    }

    .domain {
        font-size: 1.2rem;
    }

    .action-buttons {
        flex-direction: column;
        gap: 10px;
    }

    .footer-content {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }

    .loading-container {
        width: 250px;
    }
}
</style>