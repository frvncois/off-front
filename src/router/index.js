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

router.afterEach((to) => {
  // Force immediate scroll reset
  const resetScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  // Immediate reset
  resetScroll()

  // Handle ScrollSmoother
  const scrollSmoother = window.ScrollSmoother?.get()
  if (scrollSmoother) {
    scrollSmoother.scrollTo(0, false)
  }

  // Force additional resets for projects route
  if (to.path === '/projects') {
    // Multiple attempts to ensure it sticks
    setTimeout(() => {
      resetScroll()
      if (window.ScrollSmoother?.get()) {
        window.ScrollSmoother.get().scrollTo(0, false)
      }
    }, 0)

    setTimeout(() => {
      resetScroll()
      if (window.ScrollSmoother?.get()) {
        window.ScrollSmoother.get().scrollTo(0, false)
      }
    }, 50)

    setTimeout(() => {
      resetScroll()
      if (window.ScrollSmoother?.get()) {
        window.ScrollSmoother.get().scrollTo(0, false)
      }
    }, 100)
  }

  // Refresh ScrollTrigger
  setTimeout(() => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh()
    }
  }, 150)
})

export default router
