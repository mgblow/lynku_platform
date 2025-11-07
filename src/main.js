import App from './App.vue'
import Default from '@/layouts/default/Default.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { useMqtt } from './services/mqtt'

const app = createApp(App)

app.component('LayoutDefault', Default)
app.use(createPinia())
app.use(router)

// connect MQTT globally
// const mqttClient = useMqtt()
// app.provide('mqtt', mqttClient)

app.mount('#app')
export const eventBus = app;
