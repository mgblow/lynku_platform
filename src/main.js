import App from './App.vue'
import Default from '@/layouts/default/Default.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { useMqtt } from './services/mqtt'
import { emitter } from '@/utils/event-bus'

const app = createApp(App)

app.component('LayoutDefault', Default)
app.use(createPinia())
app.use(router)

// connect MQTT globally
// const mqttClient = useMqtt()
// app.provide('mqtt', mqttClient)

// Provide emitter globally
app.provide('emitter', emitter);

app.mount('#app')
export const eventBus = app;
