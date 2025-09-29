<script setup>
import { computed, defineProps, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ArrowNext from '@/assets/ArrowNext.vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  },
  allProjects: {
    type: Array,
    default: () => []
  }
})

const sectionRef = ref(null)
const scrollTriggers = ref([])
const animations = ref([])
const hasAnimated = ref(false)

/**
 * Cleanup GSAP state
 */
const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value.forEach(trigger => trigger.kill?.())

  // reset inline styles
  sectionRef.value?.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  // remove pin spacers if any
  document.querySelectorAll('.gsap-pin-spacer').forEach(spacer => {
    spacer.replaceWith(...spacer.childNodes)
  })

  animations.value = []
  scrollTriggers.value = []
  hasAnimated.value = false
}

/**
 * Initial state setup
 */
const setInitialStates = () => {
  if (!sectionRef.value) return
  const nav = sectionRef.value.querySelector('.nav.is-wrap')
  if (nav) gsap.set(nav, { y: '2em', opacity: 0 })
}

/**
 * Scroll-triggered animations
 */
const setupScrollAnimations = () => {
  if (!sectionRef.value || hasAnimated.value) return
  const nav = sectionRef.value.querySelector('.nav.is-wrap')
  if (!nav) return

  const tl = gsap.timeline()
  tl.to(nav, {
    y: '0em',
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  })

  scrollTriggers.value.push(
    ScrollTrigger.create({
      trigger: nav,
      start: 'top 80%',
      animation: tl
    })
  )

  animations.value.push(tl)
  hasAnimated.value = true
}

/**
 * Exit animation — triggered globally
 */
const playSingleNavExitAnimations = () => {
  if (!sectionRef.value) return
  const nav = sectionRef.value.querySelector('.nav.is-wrap')
  if (!nav) return

  const tl = gsap.timeline()
  tl.to(nav, {
    y: '2em',
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in'
  })

  animations.value.push(tl)
}

// Watch for project changes to reset and re-animate
watch(() => props.project?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    // Reset everything when project changes
    cleanup()
    await nextTick()
    setInitialStates()
    setupScrollAnimations()
  }
}, { immediate: false })

// mount lifecycle
onMounted(async () => {
  await nextTick()
  setInitialStates()
  setupScrollAnimations()
})

onUnmounted(() => {
  cleanup()
})

// expose exit fn for router global runner
window.playSingleNavExitAnimations = playSingleNavExitAnimations

/**
 * Compute next project link
 */
const nextProject = computed(() => {
  if (!props.project?.id || !props.allProjects.length) return null
  const currentIndex = props.allProjects.findIndex(p => p.id === props.project.id)
  return props.allProjects[currentIndex + 1] || null
})
</script>

<template>
  <section ref="sectionRef">
    <div class="nav is-wrap">
      <router-link v-if="nextProject" :to="`/project/${nextProject.id}`">
        Suivant
        <ArrowNext/>
      </router-link>
      <router-link v-else to="/projects">
        Retour aux projets ->
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.nav {
  &.is-wrap {
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: var(--font-md);
      gap: var(--space-rg);
      will-change: transform, opacity;
    }
  }
}
</style>
