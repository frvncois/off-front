<template>
  <section ref="sectionRef">
    <ul class="gallery is-items">
      <li v-for="(image, index) in project?.Gallery"
          :key="image.id"
          class="is-item">
        <span>({{ String(index + 2).padStart(2, '0') }})</span>
        <img
          :src="image.url"
          :alt="image.name"
        />
      </li>
    </ul>
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
const scrollTriggers = ref([])
const animations = ref([])
const hasAnimated = ref(false)

/**
 * Cleanup GSAP state
 */
const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value.forEach(trigger => trigger.kill?.())

  // reset styles
  sectionRef.value?.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  // remove gsap pin spacers
  document.querySelectorAll('.gsap-pin-spacer').forEach(spacer => {
    spacer.replaceWith(...spacer.childNodes)
  })

  animations.value = []
  scrollTriggers.value = []
  hasAnimated.value = false
}

/**
 * Initial states
 */
const setInitialStates = () => {
  if (!sectionRef.value) return
  const items = sectionRef.value.querySelectorAll('.is-item')
  items.forEach(item => {
    const img = item.querySelector('img')
    const span = item.querySelector('span')
    if (img) gsap.set(img, { clipPath: 'inset(0% 0% 100% 0%)' })
    if (span) gsap.set(span, { opacity: 0 })
  })
}

/**
 * Scroll-triggered animations
 */
const setupGalleryAnimations = () => {
  if (!sectionRef.value) return
  const items = sectionRef.value.querySelectorAll('.is-item')
  if (!items.length) return

  items.forEach((item, index) => {
    const img = item.querySelector('img')
    const span = item.querySelector('span')
    if (!img) return

    const tl = gsap.timeline()
    tl.to(img, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 2,
      ease: 'power4.inOut'
    }, 0)

    if (span) {
      tl.to(span, { opacity: 1, duration: 0.6, ease: 'power4.inOut' }, 1.2)
    }

    scrollTriggers.value.push(
      ScrollTrigger.create({
        trigger: item,
        start: '25% 80%',
        animation: tl
      })
    )

    // parallax on middle items (only on desktop)
    if (index >= 2 && index <= 4 && window.innerWidth > 1120) {
      scrollTriggers.value.push(
        ScrollTrigger.create({
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          animation: gsap.fromTo(item, { y: '-15%' }, { y: '15%' })
        })
      )
    }

    animations.value.push(tl)
  })

  hasAnimated.value = true
}

/**
 * Exit animation — triggered globally
 */
const playSingleGalleryExitAnimations = () => {
  if (!sectionRef.value) return
  const items = sectionRef.value.querySelectorAll('.is-item')
  if (!items.length) return

  const master = gsap.timeline()

  items.forEach((item, index) => {
    const img = item.querySelector('img')
    const span = item.querySelector('span')

    const tl = gsap.timeline()

    if (span) {
      tl.to(span, { opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
    }

    if (img) {
      tl.to(img, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1,
        ease: 'power4.inOut'
      }, 0.2)
    }

    master.add(tl, index * 0.05)
  })

  animations.value.push(master)
}

// Watch for project changes to reset and re-animate
watch(() => props.project?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    cleanup()
    await nextTick()
    if (props.project?.Gallery?.length) {
      setInitialStates()
      setupGalleryAnimations()
    }
  }
}, { immediate: false })

watch(() => props.project?.Gallery, async (newGallery) => {
  if (newGallery?.length > 0 && !hasAnimated.value) {
    cleanup()
    await nextTick()
    setInitialStates()
    setupGalleryAnimations()
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  if (props.project?.Gallery?.length) {
    setInitialStates()
    setupGalleryAnimations()
  }
})

onUnmounted(() => {
  cleanup()
})

// expose exit for router global runner
window.playSingleGalleryExitAnimations = playSingleGalleryExitAnimations
</script>

<style scoped>
.gallery {
  &.is-items {
    display: flex;
    flex-direction: column;
    padding: var(--space-rg);

    > .is-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-rg);

      &:first-child {
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        margin-bottom: var(--space-md);
      }
      &:nth-child(2) {
        width: 20vw;
        aspect-ratio: 4 / 5;
        margin-left: var(--space-lg);
      }
      &:nth-child(3) {
        width: 20vw;
        aspect-ratio: 4 / 5;
        margin-left: auto;
        margin-right: var(--space-lg);
      }
      &:nth-child(4) {
        width: 20vw;
        aspect-ratio: 4 / 5;
        margin-left: var(--space-lg);
      }
      &:nth-child(5) {
        width: 20vw;
        aspect-ratio: 4 / 5;
        margin-left: auto;
        margin-right: var(--space-lg);
      }
      &:last-child {
        width: 100%;
        aspect-ratio: 16 / 9;
        overflow: hidden;
        margin-top: var(--space-lg);
        margin-bottom: var(--space-md);
      }
    }

    & img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      will-change: clip-path, transform, opacity;
    }
  }
}

@media screen and (max-width: 1120px) {
  .gallery {
    &.is-items {
      gap: var(--space-rg);
      > .is-item {
        width: unset !important;
        margin: unset !important;
      }
    }
  }
}
</style>
