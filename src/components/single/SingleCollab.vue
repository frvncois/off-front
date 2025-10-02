<template>
  <section ref="sectionRef">
    <div class="collab is-wrap">
      <div class="is-content">
        <div class="is-mask">
          <h1>En collaboration avec</h1>
        </div>
        <div class="is-mask" v-if="project?.Collaboration">
          <h1>
            <a v-if="project?.CollaborationLink"
               :href="project.CollaborationLink"
               target="_blank">
              {{ project.Collaboration }}
            </a>
            <span v-else>{{ project.Collaboration }}</span>
          </h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const sectionRef = ref(null)
const animations = ref([])
const scrollTriggers = ref([])
const hasAnimated = ref(false)

/**
 * Cleanup GSAP state
 */
const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value.forEach(trigger => trigger.kill?.())

  // reset inline styles
  sectionRef.value?.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  // remove leftover gsap pin spacers
  document.querySelectorAll('.gsap-pin-spacer').forEach(spacer => {
    spacer.replaceWith(...spacer.childNodes)
  })

  animations.value = []
  scrollTriggers.value = []
  hasAnimated.value = false
}

/**
 * Prepare initial animation states
 */
const setInitialStates = () => {
  if (!sectionRef.value) return
  const h1Elements = sectionRef.value.querySelectorAll('.is-content h1')
  gsap.set(h1Elements, { y: '1em', opacity: 0 })
}

/**
 * Setup scroll-triggered animations
 */
const setupScrollAnimations = () => {
  if (hasAnimated.value || !sectionRef.value) return

  const h1Elements = sectionRef.value.querySelectorAll('.is-content h1')
  if (!h1Elements.length) return

  const tl = gsap.timeline()
  tl.to(h1Elements, {
    y: '0em',
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  })

  // Create ScrollTrigger to animate when component comes into view
  scrollTriggers.value.push(
    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 80%',
      animation: tl,
      once: true
    })
  )

  animations.value.push(tl)
  hasAnimated.value = true
}

/**
 * Exit animation — triggered globally by router
 */
const playSingleCollabExitAnimations = () => {
  if (!sectionRef.value) return
  const h1Elements = sectionRef.value.querySelectorAll('.is-content h1')
  if (!h1Elements.length) return

  const tl = gsap.timeline()
  tl.to(h1Elements, {
    y: '1em',
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.in'
  })

  animations.value.push(tl)
}

// Watch for project changes to reset and re-animate
watch(() => props.project?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    cleanup()
    await nextTick()
    setInitialStates()
    setupScrollAnimations()
  }
}, { immediate: false })

onMounted(async () => {
  await nextTick()
  setInitialStates()
  setupScrollAnimations()
})

onUnmounted(() => {
  cleanup()
})

watch(() => props.project?.Collaboration, async (newCollab, oldCollab) => {
  if (newCollab !== oldCollab && !hasAnimated.value) {
    cleanup()
    await nextTick()
    setInitialStates()
    setupScrollAnimations()
  }
}, { immediate: true })

// expose exit animation for router global runner
window.playSingleCollabExitAnimations = playSingleCollabExitAnimations
</script>

<style scoped>
.collab {
  &.is-wrap {
    > .is-content {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: var(--space-rg);
      margin-bottom: var(--space-lg);

      > .is-mask {
        h1 {
          will-change: transform, opacity;
          text-transform: uppercase;
          margin: 0;
          font-size: var(--font-rg);
        }
        a {
          font-family: 'serif';
        }
      }
    }
  }
}
</style>
