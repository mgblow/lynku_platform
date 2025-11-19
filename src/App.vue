<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import '@/scss/app.scss'
const route = useRoute()


const layout = computed(() => {
  return `layout-${route.meta.layout || 'default'}`
})
</script>

<style></style>
