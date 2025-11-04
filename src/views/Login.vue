<template>
  <div class="container page" style="padding:0;margin-top: 30px;margin-bottom: 50px;">
    <div class="row">
      <div class="col-12 p-1" v-if="!nextStep">
        <div class="box p-2">
          <div class="row add-box">
            <svg class="mt-4 mb-2" xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 124 124" fill="none">
              <rect width="124" height="124" rx="24" fill="#ABEBC6" />
              <path
                d="M19.375 36.7818V100.625C19.375 102.834 21.1659 104.625 23.375 104.625H87.2181C90.7818 104.625 92.5664 100.316 90.0466 97.7966L26.2034 33.9534C23.6836 31.4336 19.375 33.2182 19.375 36.7818Z"
                fill="white" />
              <circle cx="63.2109" cy="37.5391" r="18.1641" fill="black" />
              <rect opacity="0.4" x="81.1328" y="80.7198" width="17.5687" height="17.3876" rx="4"
                transform="rotate(-45 81.1328 80.7198)" fill="#FDBA74" />
            </svg>
            <h2 class="pt-2">همین حالا وارد فاکس باکس شو</h2>
          </div>
          <div class="form-group">
            <label class="mb-2">شماره موبایل</label>
            <input v-model="phone" type="number" class="form-control" placeholder="شماره موبایل">
            <small class="form-text text-muted"></small>
          </div>
          <button class="btn btn-dark" @click="login()">
            ارسال کد تایید
          </button>
        </div>
      </div>
      <div class="col-12 p-1" v-if="nextStep">
        <div class="box p-2">
          <div class="row add-box">
            <img :src="require('@/assets/add-box.avif')">
            <h2 class="pt-2">وارد کردن کد تایید</h2>
          </div>
          <div class="form-group">
            <label class="mb-2">کد تایید</label>
            <input v-model="code" type="number" class="form-control" placeholder="کد تایید">
            <small class="form-text text-muted"></small>
          </div>
          <button class="btn btn-dark" @click="verify()">
            احراز هویت
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '@/api';
import { setCookie, getCookie } from '@/cookie';

export default {
  emits: ["loading-started", "loading-ended"],
  name: 'Login',
  components: {},
  data() {
    return {
      nextStep: false,
      phone: '',
      code: ''
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    verify() {
      if (this.code.length < 3) return;
      this.$emit("loading-started", "true");
      post('/auth/verify', { phone: this.phone, code: this.code })
        .then(response => {
          // Handle the response data
          if (response.success) {
            setCookie("app-token", response.token, 7);
            setCookie("app-channel", response.channel, 7);
            window.location.assign("/");
          }
        })
        .catch(error => {
          // Handle the error
          console.error(error);
        });
    },
    login() {
      // Make a POST request
      post('/auth/entry', { phone: this.phone })
        .then(response => {
          // Handle the response data
          if (response.success) {
            this.nextStep = true;
          }
        })
        .catch(error => {
          // Handle the error
          console.error(error);
        });
    }
  }
}

</script>

<style scoped>
.page {
  animation: slideUp 0.2s ease-out;
}


@keyframes slideUp {
  from {
    transform: scaleX(0.2);
    transition: transform 0.5s ease-in-out;
  }

  to {
    transform: scaleX(1.2);
    transition: transform 0.2s ease-in-out;
  }
}

.inner-box {
  background: #000;
  margin-bottom: 10px;
}

.box {
  background: #000;
  margin-bottom: 10px;
  border-radius: 1rem;
  border: 1px solid #555;
  box-shadow: 0 0 2px #222;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  width: 100%;
}

.add-box {
  text-align: center;
}

.add-box img {
  width: 60%;
  display: inline-block;
  height: auto;
  margin: auto;
}

.box h2 {
  font-size: 1rem;
  color: #ffffff;
}

.box label {
  color: #ffffff;
  font-size: 0.8rem;
}

.box:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}


.full-post .box {
  padding-top: 10px;
  position: fixed;
  overflow: hidden;
  width: 100%;
  opacity: 1;
}

.full-post .box img {
  border-radius: 1rem;
}


.box .content h2 {
  font-weight: 500;
  color: #ffffff;
  font-size: 16px;
  width: 100%;
}

.full-post .box .content p {
  font-size: 1rem;
  text-wrap: normal;
  word-break: break-all;
  color: #ffffff;
}

button {
  margin-top: 20px;
  background-color: #222;
  float: left;
}

button img {
  width: 30px;
}
</style>