<template>
  <div class="container page" style="padding:0;margin-top: 30px;margin-bottom: 50px;">
    <div class="box col-12 p-2 col-xs-3 col-sm-3 col-md-3" v-for="post in posts">
      <div class="col">
        <div class="col col-12 actions">
          <div class="user-profile">
            <router-link to="/profile/@mojtaba">
              <img :src="require('@/assets/fox.jpg')">
            </router-link>
          </div>
          <div class="user-username">
            <h2>
              <a>mojtaba</a><span> | </span><span class="time small">14h</span>
            </h2>
          </div>
        </div>
        <div class="col col-12 mt-2">

          <div class="col-12">
            <div class="col p-2 text" @click="boxClicked(post)">
              <p v-text="post.title"></p>
            </div>
            <div class="buttons">
              <ul class="post-actions" aria-label="Post actions">
                <!-- Comment -->
                <li>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">
                    <title>Comment</title>
                    <path
                      d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2.5L12 22l4.5-4H19a2 2 0 0 0 2-2V6z" />
                  </svg>
                  <span class="action-label">1.2K</span>
                </li>

                <!-- Like (heart) -->
                <li>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">
                    <title>Like</title>
                    <path
                      d="M12.1 21.3l-1.1-.99C5.4 15.3 2 12.6 2 9.5 2 7.01 4.01 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C13.46 5.99 14.96 5 16.5 5 18.99 5 21 7.01 21 9.5c0 3.1-3.4 5.8-8.9 11.32l-1.0.98z" />
                  </svg>
                  <span class="action-label">5.6K</span>
                </li>

                <!-- Retweet -->
                <li>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">
                    <title>Retweet</title>
                    <path
                      d="M23 7l-4-4v3H9a4 4 0 0 0-4 4v1h2v-1a2 2 0 0 1 2-2h10v3l4-4zM1 17l4 4v-3h10a4 4 0 0 0 4-4v-1h-2v1a2 2 0 0 1-2 2H5v-3L1 17z" />
                  </svg>
                  <span class="action-label">1K</span>
                </li>

                <!-- Stats (bars) -->
                <li>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">
                    <title>Stats</title>
                    <path d="M4 18h3v-7H4v7zm6 0h3v-11h-3v11zm6 0h3v-14h-3v14z" />
                  </svg>
                  <span class="action-label">3K</span>
                </li>

                <!-- Bookmark -->
                <li>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">
                    <title>Bookmark</title>
                    <path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z" />
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contracts',
  components: {},
  data() {
    return {
      post: null,
      posts: [
        {
          expanded: false,
          title: 'متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
          text: 'Finally, modify the template section to bind the boxExpanded property to the class of the box div. When the boxExpanded property is true, the box-expanded class will be applied to the box div, which will cause it to fill the entire screen',
          img: "http://192.168.43.140:3000/files/969da544a76e93f04caf0e2578aa1dc8",
        },
        {
          expanded: false,
          title: '‏وقتی می‌گی فقط پنج دقیقه دراز می‌کشم بعد پا می‌شی می‌بینی یه قرن گذشته و بچه‌هات دانشگاه رفتن 😴',
          text: '‏وقتی می‌گی فقط پنج دقیقه دراز می‌کشم بعد پا می‌شی می‌بینی یه قرن گذشته و بچه‌هات دانشگاه رفتن 😴',
          img: "https://i.pinimg.com/564x/9b/3e/6b/9b3e6b629891dec3087b0f06df508b6a.jpg"

        },
        {
          expanded: false,
          title: '‏هیچ چیز توی دنیا اندازه وقتی اینترنت قطعه و می‌خوای به بقیه ثابت کنی مشکل از اونا نیست، حس عذاب وجدان نمی‌ده 😅',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.',
          img: 'https://i.pinimg.com/564x/1f/ec/6b/1fec6b5302b88d087dbb6071e0397e7b.jpg'
        },
        {
          expanded: false,
          title: 'من نمی‌تونم محتوای طنز یا توییت‌هایی بنویسم که موضوع سیاسی یا مرتبط با افراد یا گروه‌های سیاسی باشه — مخصوصاً در زمینهٔ سیاست ایران یا هر کشور دیگه.',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.'
        },
        {
          expanded: false,
          title: 'Packahge B',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.'
        },
        {
          expanded: false,
          title: 'Online JAVA with Mojtaba Asadi',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.',
          img: "https://i.pinimg.com/564x/0b/e3/3b/0be33b1c04e4453f3e5a4b3fb22158ca.jpg"
        },
        {
          expanded: false,
          title: 'Packahge B',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.'
        },
        {
          expanded: false,
          title: 'Packahge B',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.'
        },
        {
          expanded: false,
          title: 'Packahge B',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.'
        },
        {
          expanded: false,
          title: 'Packahge B',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.'
        }

      ],
      boxExpanded: false
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    boxClicked(post) {
      this.$router.push('/box/12');
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

.actions {
  background: #0F172A;
  border-radius: 10px;
  padding: 10px;
  font-size: small;
  overflow: hidden;
  box-shadow: 0 0 5px #000;
}

.user-profile {
  top: 13px;
  left: 15px;
  position: absolute;
  height: 36px;
  width: 36px;
  overflow: hidden;
  float: left;
  background: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 100%;
  box-shadow: 0 0 5px #1E293B;
}

.user-profile img {
  display: inline-block;
  max-width: 100%;
  border-radius: 100%;
}

.user-username {
  float: right;
  font-size: 12px;
  width: fit-content;
}

.user-username h2{
  font-size: 15px;
  width: fit-content;
  color: #fff;
  font-family:  monospace;
  font-style: italic;
}

.user-username h2 a{
  text-decoration: underline;
}

.box {
  float: left;
  background: #000;
  margin-bottom: 10px;
  border-radius: 1rem;
  border: 1px solid #555;
  box-shadow: 0 0 5px #0F172A;
  overflow: hidden;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
}

.box:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.box:active {
  box-shadow: 0 0 8px #000;
  transform: scaleX(1.2);
  transition: transform 0.5s ease-in-out;
}

.full-post .box {
  padding-top: 10px;
  position: fixed;
  overflow: hidden;
  width: 100%;
}

.full-post .box img {
  border-radius: 1rem;
}

.box .content {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 10px;
  color: #fff;
  margin: 0;
}

.box .text {
  float: right;
  text-wrap: normal;
  font-size: 0.9rem;
  line-height: 1.5rem;
  color: #fff;
}




.buttons {
  text-align: center;
}

.post-actions {
  max-width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  display: inline-block;
  text-align: center;
  border-top: 1px solid #e1e1ee;
}

.post-actions li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  color: #222;
  /* change this to tint icons/text */
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  font-size: 13px;
  float: right;
  margin: 0 10px;
}

.post-actions svg {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
}

.post-actions svg:active {
  color: #58D68D;
}

.action-label {
  line-height: 1;
  float: right;
  font-size: 12px;
  color: #fff;
  margin-right: -6px;

}
</style>