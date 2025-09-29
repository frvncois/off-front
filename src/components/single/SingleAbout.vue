<template>
  <section ref="sectionRef">
    <div class="about is-wrap">
      <div class="is-details">
        <h3 v-if="project?.Value">{{ getValueText(project.Value[0]) }}</h3>
        <h4 v-if="project?.Collaboration">{{ project.Collaboration }}</h4>
      </div>
      <div class="is-thumbnail">
        <span>(01)</span>
        <img
          v-if="project?.Cover"
          :src="project.Cover.url"
          :alt="project.Title"
        />
      </div>
      <div class="is-content">
        <p v-if="project?.Intro">{{ getIntroText(project.Intro[0]) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const sectionRef = ref(null)
const splitInstances = ref([])
const animations = ref([])
const scrollTriggers = ref([])
const hasAnimated = ref(false)

/**
 * Cleanup GSAP state
 */
const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value.forEach(trigger => trigger.kill?.())
  splitInstances.value.forEach(split => { try { split.revert() } catch(e) {} })

  // reset inline styles
  sectionRef.value?.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  // remove leftover gsap pin spacers
  document.querySelectorAll('.gsap-pin-spacer').forEach(spacer => {
    spacer.replaceWith(...spacer.childNodes)
  })

  animations.value = []
  scrollTriggers.value = []
  splitInstances.value = []
  hasAnimated.value = false
}

/**
 * Prepare initial animation states
 */
const setInitialStates = () => {
  if (!sectionRef.value) return

  const h3 = sectionRef.value.querySelector('.is-details h3')
  const h4 = sectionRef.value.querySelector('.is-details h4')
  const thumbnailImg = sectionRef.value.querySelector('.is-thumbnail img')
  const thumbnailSpan = sectionRef.value.querySelector('.is-thumbnail span')
  const contentP = sectionRef.value.querySelector('.is-content p')

  if (thumbnailImg) gsap.set(thumbnailImg, { clipPath: 'inset(0% 0% 100% 0%)' })
  if (thumbnailSpan) gsap.set(thumbnailSpan, { opacity: 0 })
  if (contentP) gsap.set(contentP, { opacity: 0 })

  ;[h3, h4].forEach(el => {
    if (el) {
      const split = new SplitText(el, { type: 'chars' })
      splitInstances.value.push(split)
      gsap.set(split.chars, { y: '-100%' })
    }
  })
}

/**
 * Play entrance animations
 */
const animateTextElements = () => {
  if (hasAnimated.value || !sectionRef.value) return

  const chars = splitInstances.value.flatMap(split => split.chars || [])
  const thumbnailImg = sectionRef.value?.querySelector('.is-thumbnail img')
  const thumbnailSpan = sectionRef.value?.querySelector('.is-thumbnail span')
  const contentP = sectionRef.value?.querySelector('.is-content p')

  const tl = gsap.timeline()

  if (thumbnailImg) {
    tl.to(thumbnailImg, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power2.out'
    }, 0)
  }
  if (thumbnailSpan) {
    tl.to(thumbnailSpan, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.25)
  }
  if (chars.length) {
    tl.to(chars, {
      y: '0%',
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.out'
    }, 0.5)
  }

  if (contentP) {
    scrollTriggers.value.push(
      ScrollTrigger.create({
        trigger: contentP,
        start: 'top 80%',
        animation: gsap.to(contentP, {
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        })
      })
    )
  }

  animations.value.push(tl)
  hasAnimated.value = true
}

/**
 * Exit animation — triggered globally by router
 */
const playSingleAboutExitAnimations = () => {
  const chars = splitInstances.value.flatMap(split => split.chars || [])
  const thumbnailImg = sectionRef.value?.querySelector('.is-thumbnail img')
  const thumbnailSpan = sectionRef.value?.querySelector('.is-thumbnail span')
  const contentP = sectionRef.value?.querySelector('.is-content p')

  const tl = gsap.timeline()

  if (contentP) {
    tl.to(contentP, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in'
    }, 0)
  }
  if (chars.length) {
    tl.to(chars, {
      y: '100%',
      duration: 0.8,
      stagger: 0.02,
      ease: 'power3.in'
    }, 0.2)
  }
  if (thumbnailSpan) {
    tl.to(thumbnailSpan, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    }, 0.3)
  }
  if (thumbnailImg) {
    tl.to(thumbnailImg, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.6,
      ease: 'power2.in'
    }, 0.4)
  }

  animations.value.push(tl)
}

// Watch for project changes to reset and re-animate
watch(() => props.project?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    cleanup()
    await nextTick()
    if (props.project?.Value || props.project?.Collaboration) {
      setInitialStates()
      animateTextElements()
    }
  }
}, { immediate: false })

onMounted(async () => {
  await nextTick()
  if (props.project?.Value || props.project?.Collaboration) {
    setInitialStates()
    animateTextElements()
  }
})

onUnmounted(() => {
  cleanup()
})

// expose exit animation for router global runner
window.playSingleAboutExitAnimations = playSingleAboutExitAnimations

const getValueText = (valueItem) => valueItem?.children?.[0]?.text || ''
const getIntroText = (introItem) => introItem?.children?.[0]?.text || ''
</script>

<style scoped>
.about {
  &.is-wrap {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: var(--space-rg);

    > .is-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      h3, h4 {
        overflow: hidden;
        font-size: var(--font-rg);
        will-change: transform, opacity;
      }
    }

    > .is-thumbnail {
      display: flex;
      flex-direction: column;
      gap: var(--space-rg);
      width: 20vw;
      margin-left: 25vw;

      img { will-change: clip-path; }
    }

    > .is-content {
      padding: var(--space-lg) 25vw;
      > p {
        font-size: var(--font-lg);
        font-family: 'serif';
        will-change: opacity, transform;
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .about {
    &.is-wrap {
      gap: var(--space-rg);
      > .is-content {
        padding: 0;
        > p { font-size: var(--font-rg); }
      }
      > .is-thumbnail {
        margin-left: 0;
        width: 100%;
      }
    }
  }
}
</style>
