<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LogoIcon from '@/assets/LogoIcon.vue'
import ArrowNext from '@/assets/ArrowNext.vue'

gsap.registerPlugin(ScrollTrigger)

const containerRef = ref(null)
const scrollTriggers = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!containerRef.value) return
  gsap.set(containerRef.value, { opacity: 0 })
}

const animateElements = () => {
  if (!containerRef.value) return

  const tl = gsap.timeline()
  tl.to(containerRef.value, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
  })

  const trigger = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top 80%',
    animation: tl
  })

  scrollTriggers.value.push(trigger)
  hasAnimated.value = true
}

const playGlobalCTAExitAnimations = () => {
  if (!containerRef.value) return
  gsap.to(containerRef.value, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in'
  })
}

window.playGlobalCTAExitAnimations = playGlobalCTAExitAnimations

onMounted(async () => {
  await nextTick()
  setInitialStates()
  animateElements()
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <section ref="containerRef">
    <div class="is-logo">
      <LogoIcon/>
    </div>
    <div class="is-action">
      <router-link to="/contact">
        Contactez-moi
        <ArrowNext/>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  padding-bottom: calc(var(--space-lg) + 4em);
  gap: var(--space-md);
  will-change: opacity;

  > .is-logo {
    margin-right: -1.5em;
  }

  > .is-action {
    a, router-link {
      font-size: var(--font-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-rg);
    }
  }

  > nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: var(--space-rg);
    z-index: 2;

    a, p {
      text-transform: uppercase;
      font-size: var(--font-rg);
    }

    > .is-items {
      display: flex;
      gap: var(--space-rg);
    }
  }
}
</style>
