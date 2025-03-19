import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'
import subwayBranchInfo from './components/subwayBranchInfo.vue'

const app = createApp(App)

app.component("SubwayBranchInfo", subwayBranchInfo)
app.mount('#app')
