<template>
  <div class="col default-page-wrapper">
    <slot/>
    <default-nav/>
  </div>
</template>

<script>
import DefaultNav from './DefaultNav.vue'

export default {
  components: {
    DefaultNav
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@700&display=swap');
</style>

<style lang="scss">

html {
  padding: 0;
  margin: 0;
  direction: rtl;
}

*{
  font-family: 'Almarai', sans-serif;
}
body {
  background: #0F172A;
}

.default-page-wrapper {
  margin: 10px auto;
}

a{
  color: #cf6a87;
}

.page {
  animation: slideUp 0.2s ease-out;
}

button:active{
  box-shadow: 0 0 4px #555555;
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

.loading-spinner {
  width: 50px;
  height: 50px;
  animation: spin 2s infinite;
  box-sizing: border-box; /* Ensure border does not affect overall size */
}

@keyframes spin {
  0% {
    transform: rotate(0deg) scale(0.8);
    border-width: 15px;
  }
  50% {
    border-width: 50px;
  }
  100% {
    transform: rotate(360deg) scale(0.8);
    border-width: 15px;
  }
}

</style>
