<template>
  <div class="container page">
    <div class="row messages">
      <ol class="col-12">
        <li class="list-group-item d-flex align-items-start self" @click="profileClicked()" v-for="i in 10">
          <p class="message">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic adipisci temporibus soluta unde est recusandae ullam
            libero, pariatur nisi magnam voluptatem! Facere est eaque recusandae omnis vero aliquam adipisci aperiam.
          </p>
          <div class="row bottom-actions">
            <span class="text-muted time">
              <span>sunday 2022/16/7 18:30</span>
              <span>&#x2714;</span>
            </span>
          </div>
        </li>
        <li class="list-group-item d-flex align-items-start other" @click="profileClicked()">
          <p class="message">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic adipisci temporibus soluta unde est recusandae ullam
            libero, pariatur nisi magnam voluptatem! Facere est eaque recusandae omnis vero aliquam adipisci aperiam.
          </p>
          <div class="row bottom-actions">
            <span class="text-muted time">
              <span>sunday 2022/16/7 18:30</span>
              <span style="color: #0984e3">&#x2714;&#x2714;</span>
            </span>
          </div>
        </li>
      </ol>
    </div>
    <div class="row reply">
      <textarea class="form-control"></textarea>
      <button class="btn btn-sm btn-dark">send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  components: {},
  data() {
    return {}
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    profileClicked() {
      this.$router.push('/chat/h59gk50gm40e39')
    }
  }
}
</script>

<style scoped>

.header .list-item-image {
  width: 50px; /* Adjust the width as per your requirement */
  height: 50px; /* Adjust the height as per your requirement */
  margin-left: 10px; /* Adjust the margin as per your requirement */
}
.page {
  margin-top: 20px;
}

.page .messages {
  height: 85vh;
  max-height: 80vh;
  overflow: auto;
}

.list-group-item {
  border-radius: 0.5rem;
  margin-bottom: 10px;
  width: 90%;
  padding: 10px;
}

.list-group-item.self {
  float: right;
  background: #7bed9f;
}

.list-group-item.other {
  float: left;
  background: #f1f2f6;
}

.list-group-item:active {
  border: 2px solid #e1e1e1;
}
.list-group-item p {
  font-size: 0.8rem;
}

.list-group-item .bottom-actions {
  position: absolute;
  left: 10px;
  bottom: 5px;
  font-size: 0.6rem;
}

.reply {
  border-radius: 0.5rem;
  z-index: 1200;
  background-color: #000;
  position: fixed;
  padding: 10px;
  bottom: 0;
  right: 12px;
  width: 100%;
}
.reply textarea {
  border: 1px solid #58D68D;
  background: #000;
  color: #ffffff;
}
</style>
