<!-- src/components/home/HomeAbout.vue -->
<template>
  <section ref="containerRef">
    <div class="about is-wrap">
      <div class="is-content" ref="contentRef">
        <p 
          v-for="(item, index) in content?.About" 
          :key="index"
        >
          <component
            :is="getHtmlTag(item.type, item.level)"
            v-html="getTextFromParagraph(item)"
          />
        </p>
      </div>
      <div class="is-action" ref="actionRef">
        <router-link to="/contact">
          Rejoignez-nous
          <ArrowNext/>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ArrowNext from '@/assets/ArrowNext.vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

const containerRef = ref(null)
const contentRef = ref(null)
const actionRef = ref(null)
const scrollTriggers = ref([])
const hasAnimated = ref(false)

const getTextFromParagraph = (paragraph) => {
  return paragraph?.children?.[0]?.text || ''
}

const getHtmlTag = (type, level) => {
  return type === 'heading' ? `h${level}` : 'p'
}

const cleanup = () => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  scrollTriggers.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (contentRef.value) {
    gsap.set(contentRef.value, { y: '5em', opacity: 0 })
  }
  if (actionRef.value) {
    gsap.set(actionRef.value, { y: '5em', opacity: 0 })
  }
}

const animateElements = () => {
  const tl = gsap.timeline()

  if (contentRef.value) {
    tl.to(contentRef.value, {
      y: '0em',
      opacity: 1,
      duration: 2,
      ease: 'power4.out'
    }, 0)
  }

  if (actionRef.value) {
    tl.to(actionRef.value, {
      y: '0em',
      opacity: 1,
      duration: 2,
      ease: 'power4.out'
    }, 0.2)
  }

  const trigger = ScrollTrigger.create({
    trigger: containerRef.value.querySelector('.about.is-wrap'),
    start: 'top 50%',
    animation: tl
  })

  scrollTriggers.value.push(trigger)
  hasAnimated.value = true
}

const playHomeAboutExitAnimations = () => {
  const tl = gsap.timeline()

  if (contentRef.value) {
    tl.to(contentRef.value, {
      y: '5em',
      opacity: 0,
      duration: 1.2,
      ease: 'power4.in'
    }, 0)
  }

  if (actionRef.value) {
    tl.to(actionRef.value, {
      y: '5em',
      opacity: 0,
      duration: 1.2,
      ease: 'power4.in'
    }, 0.1)
  }
}

window.playHomeAboutExitAnimations = playHomeAboutExitAnimations

onMounted(async () => {
  await nextTick()
  cleanup()
  setInitialStates()
  animateElements()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.about {
  &.is-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;

    > .is-content {
      padding: var(--space-lg);
      will-change: transform;

      > p {
        font-family: 'serif';
        font-size: var(--font-lg);
        text-align: center;
      }
    }

    > .is-action {
      will-change: transform;

      a, router-link {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-rg);
        font-size: var(--font-md);
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .about {
    &.is-wrap {
      gap: var(--space-md);
      > .is-content {
        padding: var(--space-rg);
              > p {
                font-size: var(--font-md);
              }
      }
    }
  }
}
</style>
