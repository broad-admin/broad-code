import { createApp } from 'vue'
import './style.css'
import { useAppRouter } from './router'
import useAppPinia from './store/index'
import App from './App.vue'

const app = createApp(App)
useAppRouter(app)
useAppPinia(app)

app.mount('#app')
