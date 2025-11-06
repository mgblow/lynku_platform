// src/services/mqtt.js
import mqtt from 'mqtt'

let client = null

const MQTT_URL = 'ws://10.20.151.166:8083/mqtt'
const MQTT_OPTIONS = {
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 5000,
  clientId: 'metaverse_' + Math.random().toString(16).substring(2, 8)
}

export function useMqtt() {
  if (!client) {
    client = mqtt.connect(MQTT_URL, MQTT_OPTIONS)

    client.on('connect', () => {
      console.log('✅ MQTT Connected:', MQTT_URL)
    })

    client.on('reconnect', () => {
      console.log('♻️ MQTT reconnecting...')
    })

    client.on('error', (err) => {
      console.error('❌ MQTT Error:', err)
    })

    client.on('message', (topic, message) => {
      console.log(`📩 ${topic}:`, message.toString())
    })
  }

  const subscribe = (topic, callback) => {
    if (!client) return
    client.subscribe(topic, (err) => {
      if (err) console.error('MQTT subscribe error:', err)
    })
    client.on('message', (t, msg) => {
      if (t === topic) callback(msg.toString())
    })
  }

  const publish = (topic, payload) => {
    if (!client) return
    client.publish(topic, payload)
  }

  const isConnected = () => client?.connected

  return { client, subscribe, publish, isConnected }
}
