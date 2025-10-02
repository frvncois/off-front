<template>
  <section ref="containerRef">
    <div class="hero is-wrap">
      <div class="is-cover" ref="coverRef">
        <img v-if="content?.Cover" :src="getImageUrl(content.Cover)" :alt="content.Title" />
      </div>
      <div v-if="content?.Intro" class="is-content" ref="contentRef">
        <p v-for="(paragraph, index) in content.Intro"
           :key="index"
           v-html="renderRichText(paragraph)">
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

const containerRef = ref(null)
const coverRef = ref(null)
const contentRef = ref(null)

const splitInstances = ref([])
const animations = ref([])
const scrollTriggers = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value.forEach(trigger => trigger.kill?.())
  splitInstances.value.forEach(split => {
    try { split.revert() } catch (e) {}
  })
  animations.value = []
  scrollTriggers.value = []
  splitInstances.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!containerRef.value) return
  const coverElement = coverRef.value
  const textElements = contentRef.value?.querySelectorAll('p') || []

  if (coverElement) {
    gsap.set(coverElement, { clipPath: 'inset(0% 0% 100% 0%)' })
  }

  if (textElements.length) {
    textElements.forEach(element => {
      const split = new SplitText(element, { type: 'chars' })
      splitInstances.value.push(split)
      gsap.set(split.chars, { y: '110%' })
    })
  }
}

const animateElements = () => {
  if (hasAnimated.value || !containerRef.value) return

  const coverElement = coverRef.value
  const coverImage = coverElement?.querySelector('img')
  const chars = splitInstances.value.flatMap(split => split.chars)

  const tl = gsap.timeline()

  if (coverElement) {
    tl.to(coverElement, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 2,
      ease: 'power4.inOut'
    }, 0)
  }

  if (chars.length) {
    tl.to(chars, {
      y: '0%',
      duration: 0.8,
      stagger: 0.015,
      ease: 'power4.inOut'
    }, 0.3)
  }

  animations.value.push(tl)

  if (coverImage) {
    const parallaxTrigger = ScrollTrigger.create({
      trigger: coverElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      animation: gsap.fromTo(coverImage, { y: '-75%' }, { y: '25%' })
    })
    scrollTriggers.value.push(parallaxTrigger)
  }

  hasAnimated.value = true
}

const playHeroExitAnimations = () => {
  const coverElement = coverRef.value
  const chars = splitInstances.value.flatMap(split => split.chars)

  if (coverElement) {
    gsap.to(coverElement, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 1.2,
      ease: 'power4.in'
    })
  }

  if (chars.length) {
    gsap.to(chars, {
      y: '-110%',
      duration: 1,
      stagger: 0.01,
      ease: 'power4.in'
    })
  }
}

window.playHeroExitAnimations = playHeroExitAnimations

watch(() => props.content?.Intro, async (newIntro) => {
  if (newIntro && !hasAnimated.value) {
    cleanup()
    await nextTick()
    setInitialStates()
    // Immediate animation without delay
    animateElements()
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  if (props.content?.Intro && !hasAnimated.value) {
    setInitialStates()
    animateElements()
  }
})

onUnmounted(() => {
  cleanup()
})

const getImageUrl = (imageObj) => imageObj?.url || null

const renderRichText = (paragraph) => {
  if (!paragraph?.children) return ''
  return paragraph.children.map(child => {
    if (child.type === 'text') {
      let text = child.text
      if (child.bold) text = `<strong>${text}</strong>`
      if (child.italic) text = `<em>${text}</em>`
      if (child.underline) text = `<u>${text}</u>`
      if (child.strikethrough) text = `<s>${text}</s>`
      return text
    }
    if (child.type === 'link') {
      const linkText = child.children?.map(c => c.text).join('') || ''
      return `<a href="${child.url}" target="_blank">${linkText}</a>`
    }
    return child.text || ''
  }).join('')
}
</script>

<style scoped>
.hero {
  &.is-wrap {
    display: flex;
    height: 100vh;

    > .is-cover {
      flex-basis: 50%;
      flex-shrink: 0;
      display: flex;
      align-content: flex-start;
      align-items: flex-end;
      will-change: clip-path;

      > img {
        width: 100%;
        height: 150%;
        object-fit: cover;
        will-change: transform;
      }
    }

    > .is-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-basis: 50%;
      padding: var(--space-lg);

      & p {
        font-family: 'serif';
        font-size: var(--font-md);
        overflow: hidden;
        will-change: transform;
        line-height: 1;
        height: 1.15em;
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .hero {
    &.is-wrap {
      flex-direction: column-reverse;
      height: auto;
    }
    > .is-content {
      padding: var(--space-rg) !important;
      margin-top: 25vh;
    }
    > .is-cover {
      padding: var(--space-rg) !important;
    }
  }
}
</style>
