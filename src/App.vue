<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import '@/scss/app.scss'
import { post } from '@/api'
import { getCookie } from '@/cookie'

const route = useRoute()

const getPerson = async () => {
  try {
    const response = await post(
      '/api/v1',
      {
        topic: 'getMe',
        data: {}
      },
      {
        token: getCookie('app-token')
      }
    )
    if (response && response.data.success) {
      const person  = {
        ...response.data.body,  // existing fields from API
        type: 'person',
      }
      localStorage.setItem('person', JSON.stringify(person))
      localStorage.setItem('userAvatarConfig', JSON.stringify(response.data.body.avatarConfig))
    } else {
      emitter.emit('error-message', response.data)
    }
  } catch (error) {
    console.error('Error posting tweet:', error)
    // this.showError('خطا در ارسال توییت. لطفاً دوباره تلاش کنید.')
  } finally {

  }
}


const layout = computed(() => {
  return `layout-${route.meta.layout || 'default'}`
  if(getCookie('app-token')) {
    getPerson();
  }
})
</script>

<style></style>
