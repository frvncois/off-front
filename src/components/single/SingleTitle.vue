<template>
  <section ref="sectionRef">
    <div class="title is-wrap">
      <router-link to="/projects"><ArrowBack/></router-link>
      <div class="is-mask"><h1>{{ project?.Title }}</h1></div>
      <div class="is-mask"><h2>{{ project?.Location }}</h2></div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import ArrowBack from '@/assets/ArrowBack.vue'

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const sectionRef = ref(null)
const animations = ref([])
const hasAnimated = ref(false)

/**
 * Reset GSAP + DOM state
 */
const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  animations.value = []
  hasAnimated.value = false

  // reset inline styles
  sectionRef.value?.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  // remove gsap pin spacers if left behind
  document.querySelectorAll('.gsap-pin-spacer').forEach(spacer => {
    spacer.replaceWith(...spacer.childNodes)
  })
}

/**
 * Initial state before animation
 */
const setInitialStates = () => {
  if (!sectionRef.value) return
  const h1 = sectionRef.value.querySelector('h1')
  const h2 = sectionRef.value.querySelector('h2')
  const arrow = sectionRef.value.querySelector('a')

  if (h1 && h2 && arrow) {
    gsap.set([h1, h2], { y: '100%', opacity: 0 })
    gsap.set(arrow, { opacity: 0 })
  }
}

/**
 * Entrance animation
 */
const animateTitle = () => {
  if (!sectionRef.value || hasAnimated.value) return
  const h1 = sectionRef.value.querySelector('h1')
  const h2 = sectionRef.value.querySelector('h2')
  const arrow = sectionRef.value.querySelector('a')

  if (!h1 || !h2 || !arrow) return

  const tl = gsap.timeline()

  tl.to(h1, {
    y: '0%',
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  }, 0)

  tl.to(h2, {
    y: '0%',
    opacity: 1,
    duration: 1,
    ease: 'power3.out'
  }, 0.25)

  tl.to(arrow, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, 0.75)

  animations.value.push(tl)
  hasAnimated.value = true
}

/**
 * Exit animation — triggered globally
 */
const playSingleTitleExitAnimations = () => {
  if (!sectionRef.value) return
  const h1 = sectionRef.value.querySelector('h1')
  const h2 = sectionRef.value.querySelector('h2')
  const arrow = sectionRef.value.querySelector('a')

  if (!h1 || !h2 || !arrow) return

  const tl = gsap.timeline()

  tl.to(arrow, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in'
  }, 0)

  tl.to(h2, {
    y: '100%',
    opacity: 0,
    duration: 0.8,
    ease: 'power3.in'
  }, 0.1)

  tl.to(h1, {
    y: '100%',
    opacity: 0,
    duration: 0.8,
    ease: 'power3.in'
  }, 0.25)

  animations.value.push(tl)
}

// Watch for project changes to reset and re-animate
watch(() => props.project?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    cleanup()
    await nextTick()
    setInitialStates()
    animateTitle()
  }
}, { immediate: false })

// lifecycle
onMounted(async () => {
  await nextTick()
  setInitialStates()
  animateTitle()
})

onUnmounted(() => {
  cleanup()
})

// expose exit fn globally
window.playSingleTitleExitAnimations = playSingleTitleExitAnimations
</script>

<style scoped>
.title {
  &.is-wrap {
    margin-top: 8vh;
    padding: var(--space-rg);

    > .is-mask {
      overflow: hidden;
    }

    h1 {
      font-size: var(--font-2xl);
      text-transform: uppercase;
      will-change: transform, opacity;
    }

    h2 {
      font-size: var(--font-xl);
      font-family: 'serif';
      will-change: transform, opacity;
    }

    a {
      font-size: var(--font-lg);
      will-change: opacity;
    }
  }
}

@media screen and (max-width: 1120px) {
  .title {
    &.is-wrap {
      h2 {
        font-size: var(--font-md);
      }
    }
  }
}
</style>
