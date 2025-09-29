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
  routes,
  scrollBehavior() {
    // Force instant scroll to top without any smooth behavior
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Return position but with instant behavior
    return { left: 0, top: 0, behavior: 'instant' }
  }
})

const MAX_EXIT_DURATION = 1500

router.beforeEach((to, from, next) => {
  if (!from.name) return next()
  const exitFns = Object.entries(window)
    .filter(([key, fn]) => key.startsWith('play') && typeof fn === 'function')

  exitFns.forEach(([_, fn]) => fn())
  setTimeout(() => next(), MAX_EXIT_DURATION)
})

router.afterEach(() => {
  // Ensure ScrollSmoother doesn't interfere with instant positioning
  const scrollSmoother = window.ScrollSmoother?.get()
  if (scrollSmoother) {
    scrollSmoother.scrollTo(0, false)
  }

  // Refresh ScrollTrigger if present
  setTimeout(() => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh()
    }
  }, 100)
})

export default router
