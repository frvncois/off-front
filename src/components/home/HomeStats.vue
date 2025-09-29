<template>
  <section ref="sectionRef">
    <div class="stats is-wrap">
      <div class="is-content">
        <div class="is-item">
          <h1>{{ getStatText(content?.Stats01?.[0]) }}</h1>
          <h2>{{ getStatText(content?.Stats01?.[1]) }}</h2>
          <h3>{{ getStatText(content?.Stats01?.[2]) }}</h3>
        </div>
        <div class="is-item">
          <h1>{{ getStatText(content?.Stats02?.[0]) }}</h1>
          <h2>{{ getStatText(content?.Stats02?.[1]) }}</h2>
          <h3>{{ getStatText(content?.Stats02?.[2]) }}</h3>
        </div>
        <div class="is-item">
          <h1>{{ getStatText(content?.Stats03?.[0]) }}</h1>
          <h2>{{ getStatText(content?.Stats03?.[1]) }}</h2>
          <h3>{{ getStatText(content?.Stats03?.[2]) }}</h3>
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
  content: {
    type: Object,
    default: () => ({})
  }
})

const sectionRef = ref(null)
const scrollTriggers = ref([])
const animations = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  scrollTriggers.value.forEach(trigger => trigger.kill?.())
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value = []
  animations.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!sectionRef.value) return
  const statsItems = sectionRef.value.querySelectorAll('.is-item')
  if (!statsItems.length) return
  gsap.set(statsItems, { y: '1em', opacity: 0 })
}

const animateElements = () => {
  if (!sectionRef.value || hasAnimated.value) return
  const statsItems = sectionRef.value.querySelectorAll('.is-item')
  if (!statsItems.length) return

  const tl = gsap.timeline()
  tl.to(statsItems, {
    y: '0em',
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.out'
  })

  scrollTriggers.value.push(
    ScrollTrigger.create({
      trigger: sectionRef.value.querySelector('.stats.is-wrap'),
      start: 'top 70%',
      animation: tl
    })
  )

  animations.value.push(tl)
  hasAnimated.value = true
}

const playHomeStatsExitAnimations = () => {
  if (!sectionRef.value) return
  const statsItems = sectionRef.value.querySelectorAll('.is-item')
  if (!statsItems.length) return

  gsap.to(statsItems, {
    y: '1em',
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.in'
  })
}

window.playHomeStatsExitAnimations = playHomeStatsExitAnimations

watch(() => props.content, async (newContent) => {
  if (newContent && Object.keys(newContent).length && !hasAnimated.value) {
    cleanup()
    await nextTick()
    setInitialStates()
    animateElements()
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  if (props.content && Object.keys(props.content).length) {
    setInitialStates()
    animateElements()
  }
})

onUnmounted(() => {
  cleanup()
})

const getStatText = (stat) => stat?.children?.[0]?.text || ''
</script>

<style scoped>
.stats {
  &.is-wrap {
    padding: var(--space-lg);

    > .is-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);

      > .is-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--space-rg);
        text-align: center;
        will-change: transform, opacity;

        > h1 { font-size: var(--font-xl); }
        > h2 { font-size: var(--font-xl); font-family: 'serif'; }
        > h3 { font-size: var(--font-rg); }

        &:first-child {
          grid-column: span 2;
          > h1 { font-size: var(--font-rg); }
        }
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .stats {
    &.is-wrap {
      padding: var(--space-rg);

      > .is-content {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
