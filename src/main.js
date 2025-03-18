import { createApp } from 'vue'
import App from './App.vue'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/styles.css' // Required for OpenLayers styles
import './assets/main.css' // Your Tailwind/global styles

const app = createApp(App)

app.use(OpenLayersMap)

app.mount('#app')
