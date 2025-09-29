import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { gsap } from "gsap";

import { CustomEase } from "gsap/CustomEase";
    
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";


import App from './App.vue'
import router from './router'

const app = createApp(App)

gsap.registerPlugin(MotionPathPlugin,Observer,ScrollToPlugin,SplitText,ScrollTrigger,ScrollSmoother,TextPlugin,CustomEase);

app.config.globalProperties.$gsap = gsap

app.use(createPinia())
app.use(router)

app.mount('#app')
