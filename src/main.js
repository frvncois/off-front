import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Lenis from 'lenis'

// Import our custom animation library - IMPORTANT!
import './utils/animate.js'

console.log('🎯 Main.js loaded, animation library should be imported')

import App from './App.vue'
import router from './router'

const app = createApp(App)

const lenis = new Lenis({
  autoRaf: true,
});

lenis.on('scroll', (e) => {
});

app.use(createPinia())
app.use(router)

app.mount('#app')

console.log('🚀 Vue app mounted')