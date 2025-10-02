// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import SingleView from '@/views/SingleView.vue'
import ContactView from '@/views/ContactView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/projects', name: 'projects', component: ProjectsView },
  { path: '/project/:id', name: 'single', component: SingleView },
  { path: '/contact', name: 'contact', component: ContactView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const MAX_EXIT_DURATION = 1500

router.beforeEach((to, from, next) => {
  if (!from.name) {
    return next()
  }

  const exitFns = Object.entries(window)
    .filter(([key, fn]) => key.startsWith('play') && typeof fn === 'function')

  exitFns.forEach(([_, fn]) => fn())
  setTimeout(() => next(), MAX_EXIT_DURATION)
})

router.afterEach(() => {
  // Refresh ScrollTrigger
  setTimeout(() => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh()
    }
  }, 150)
})

export default router
