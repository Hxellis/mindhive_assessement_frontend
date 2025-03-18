import { createApp } from 'vue'
import App from './App.vue'
// import { Map, Layers, Sources, Geometries, Styles } from 'vue3-openlayers'
// import 'vue3-openlayers/styles.css' // Required for OpenLayers styles
import './assets/styles/main.css' // Your Tailwind/global styles

const app = createApp(App)

// app.use(Map)
// app.use(Layers)
// app.use(Sources)
// app.use(Styles)
// app.use(Geometries)


app.mount('#app')
