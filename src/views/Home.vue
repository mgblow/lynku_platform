<template>
  <div class="container page" style="padding: 0; margin-top: 50px; margin-bottom: 50px">
    <div class="row">
      <div class="col-12 p-1">
        <div class="box" @click="boxClicked(post)">
          <img
            class=""
            :src="
              post.img
                ? post.img
                : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637'
            "
          />
          <hr />
          <div class="row content">
            <h2 v-text="post.title.slice(0, 60)"></h2>
          </div>
          <div class="row inside">
            <div class="col-6 p-1 col-xs-6 col-sm-3 col-md-3" v-for="post in posts">
              <div class="box" @click="boxClicked(post)">
                <img
                  class="image"
                  :src="
                    post.img
                      ? post.img
                      : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637'
                  "
                />
                <div class="row content">
                  <h2 v-text="post.title.slice(0, 60)"></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 p-1">
        <div class="box" @click="boxClicked(post)">
          <img
            class=""
            :src="
              post.img
                ? post.img
                : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637'
            "
          />
          <hr />
          <div class="row content">
            <h2 v-text="post.title.slice(0, 60)"></h2>
          </div>
          <div class="row inside">
            <div class="col-6 p-1 col-xs-6 col-sm-3 col-md-3" v-for="post in posts">
              <div class="box" @click="boxClicked(post)">
                <img
                  class="image"
                  :src="
                    post.img
                      ? post.img
                      : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637'
                  "
                />
                <div class="row content">
                  <h2 v-text="post.title.slice(0, 60)"></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 p-1">
        <div class="box" @click="boxClicked(post)">
          <img
            class=""
            :src="
              post.img
                ? post.img
                : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637'
            "
          />
          <hr />
          <div class="row content">
            <h2 v-text="post.title.slice(0, 60)"></h2>
          </div>
          <div class="row inside">
            <div class="col-6 p-1 col-xs-6 col-sm-3 col-md-3" v-for="post in posts">
              <div class="box" @click="boxClicked(post)">
                <img
                  class="image"
                  :src="
                    post.img
                      ? post.img
                      : 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png?20210219185637'
                  "
                />
                <div class="row content">
                  <h2 v-text="post.title.slice(0, 60)"></h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie } from '@/cookie'

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      post: {
        title: 'لورم ایپسوم متن ساختگی با تولید داخلی بر پایه منطق خارجی',
        text: 'Finally, modify the template section to bind the boxExpanded property to the class of the box div. When the boxExpanded property is true, the box-expanded class will be applied to the box div, which will cause it to fill the entire screen'
      },
      posts: [
        {
          expanded: false,
          title: 'Online Daf Sessions With Hooman Tootoonchian',
          text: 'Finally, modify the template section to bind the boxExpanded property to the class of the box div. When the boxExpanded property is true, the box-expanded class will be applied to the box div, which will cause it to fill the entire screen',
          img: 'https://i.pinimg.com/564x/8f/95/1b/8f951b9d4df725eb600bcb550c5860e0.jpg'
        },
        {
          expanded: false,
          title: 'Packahge B',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.',
          img: 'https://i.pinimg.com/564x/9b/3e/6b/9b3e6b629891dec3087b0f06df508b6a.jpg'
        },
        {
          expanded: false,
          title: 'Packahge for the new learners who are veryconserned about learning new technologies',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.',
          img: 'https://i.pinimg.com/564x/1f/ec/6b/1fec6b5302b88d087dbb6071e0397e7b.jpg'
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
          title: 'Online JAVA with Mojtaba Asadi',
          text: 'This appears to be a Vue.js single file component that contains a template, script, and style section. The template section contains HTML code that defines the structure of the component, including a container div, row divs, and box divs that contain images, headers, and paragraphs. The script section defines a Vue.js component named "Home", which has an empty components object and a method named "boxClicked". The style section contains CSS code that styles the box divs with background colors, borders, and box shadows, as well as hover and active effects on the boxes.',
          img: 'https://i.pinimg.com/564x/0b/e3/3b/0be33b1c04e4453f3e5a4b3fb22158ca.jpg'
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
      ]
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
      this.$router.push('/box/12')
    }
  },
  mounted() {
    this.scrollToTop();
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
  background: #ffffff;
  margin-bottom: 10px;
}

.box {
  float: left;
  background: #ffffff;
  margin-bottom: 10px;
  border-radius: 1rem;
  border: 1px solid #555;
  box-shadow: 0 0 2px #222;
  opacity: 0.8;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  width: 100%;
}
.box .box {
  height: 200px;
}

.box img {
  width: 100%;
  height: auto;
  border-radius: 1rem;
}

.box h2 {
  font-size: 1rem;
}

.box p {
  font-size: 0.6rem;
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
  opacity: 1;
}

.full-post .box img {
  border-radius: 1rem;
}

.box .content {
  position: absolute;
  top: 0;
  width: 100%;
  background: #000000;
  opacity: 0.6;
  padding: 10px;
  color: #ffffff;
  margin: 0;
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
}

.inside {
  background: #ffffff;
  border-radius: 20px;
  padding: 10px;
  overflow: hidden;
}

.user-profile {
  background: #ffffff;
  margin-bottom: 50px;
  border-radius: 1rem;
  border: 1px solid #555;
  box-shadow: 0 0 2px #222;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  width: 100%;
  padding: 10px;
}

.user-profile .image {
  float: right;
}

.user-profile .communication {
  float: left;
  text-align: left;
}
</style>