<template>
  <section ref="sectionRef">
    <ul class="list is-items">
      <li v-for="project in projects" :key="project.id" class="is-item">
        <router-link :to="`/project/${project.id}`">
          <div class="is-title">
            <div class="is-mask"><h1>{{ project.Title }}</h1></div>
            <h2>{{ project.Location }}</h2>
          </div>
        </router-link>
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
  projects: {
    type: Array,
    default: () => []
  }
})

const sectionRef = ref(null)
const scrollTriggers = ref([])
const marqueeAnimations = ref([])
const hasAnimated = ref(false)
let resizeObserver = null

const cleanup = () => {
  scrollTriggers.value.forEach(trigger => trigger.kill())
  marqueeAnimations.value.forEach(anim => anim.kill())
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  scrollTriggers.value = []
  marqueeAnimations.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!sectionRef.value) return
  const h1Elements = sectionRef.value.querySelectorAll('h1')
  const h2Elements = sectionRef.value.querySelectorAll('h2')

  gsap.set(h1Elements, { y: '100%', opacity: 0 })
  gsap.set(h2Elements, { y: '2em', opacity: 0 })
}

const animateElements = () => {
  if (!sectionRef.value) return
  const h1Elements = sectionRef.value.querySelectorAll('h1')
  const h2Elements = sectionRef.value.querySelectorAll('h2')

  if (!h1Elements.length && !h2Elements.length) return

  const tl = gsap.timeline()

  // Animate h1 elements first
  if (h1Elements.length) {
    tl.to(h1Elements, {
      y: '0%',
      opacity: 1,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power4.out'
    }, 0)
  }

  // Animate h2 elements with slight delay
  if (h2Elements.length) {
    tl.to(h2Elements, {
      y: '0em',
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    }, 0.3)
  }

  scrollTriggers.value.push(
    ScrollTrigger.create({
      trigger: sectionRef.value.querySelector('.list.is-items'),
      start: 'top 80%',
      animation: tl
    })
  )

  hasAnimated.value = true
  setupMarqueeHover()
  setupResizeObserver()
}

const setupResizeObserver = () => {
  if (!sectionRef.value) return

  // Clean up existing observer
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  // Create new ResizeObserver to watch for size changes
  resizeObserver = new ResizeObserver(() => {
    // Debounce the recalculation to avoid excessive calls
    clearTimeout(resizeObserver.timeout)
    resizeObserver.timeout = setTimeout(() => {
      recalculateMaskWidths()
    }, 100)
  })

  // Observe the section for size changes
  resizeObserver.observe(sectionRef.value)
}

const recalculateMaskWidths = () => {
  if (!sectionRef.value) return
  const masks = sectionRef.value.querySelectorAll('.is-mask')

  masks.forEach(mask => {
    const h1 = mask.querySelector('h1')
    if (!h1) return

    // Temporarily remove any inline width to get natural width
    mask.style.width = 'auto'
    const h1Width = h1.offsetWidth
    mask.style.width = h1Width + 'px'
  })
}

const setupMarqueeHover = () => {
  if (!sectionRef.value) return
  const masks = sectionRef.value.querySelectorAll('.is-mask')

  masks.forEach(mask => {
    const h1 = mask.querySelector('h1')
    if (!h1) return

    const originalText = h1.textContent
    let marqueeAnim = null

    const h1Width = h1.offsetWidth
    mask.style.width = h1Width + 'px'

    const startMarquee = () => {
      h1.innerHTML = `<span class="original">${originalText}</span><span class="duplicate">${originalText}</span>`
      const spans = h1.querySelectorAll('span')
      gsap.set(spans, { display: 'inline-block', whiteSpace: 'nowrap' })
      gsap.set(h1, { display: 'flex' })

      const textWidth = spans[0].offsetWidth
      const speed = 100
      const duration = textWidth / speed

      marqueeAnim = gsap.fromTo(h1,
        { x: '0%' },
        { x: '-50%', duration, ease: 'none', repeat: -1 }
      )
      marqueeAnimations.value.push(marqueeAnim)
    }

    const stopMarquee = () => {
      if (marqueeAnim) {
        marqueeAnim.kill()
        marqueeAnim = null
      }
      h1.innerHTML = originalText
      gsap.set(h1, { x: '0%', display: 'block' })
    }

    mask.addEventListener('mouseenter', startMarquee)
    mask.addEventListener('mouseleave', stopMarquee)
  })
}

const playProjectsListExitAnimations = () => {
  if (!sectionRef.value) return
  const listItems = sectionRef.value.querySelectorAll('.is-item')
  if (!listItems.length) return

  gsap.to(listItems, {
    y: '-2em',
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.in'
  })
}

window.playProjectsListExitAnimations = playProjectsListExitAnimations

watch(() => props.projects, async (newProjects) => {
  if (newProjects?.length && !hasAnimated.value) {
    cleanup()
    await nextTick()
    setInitialStates()
    animateElements()
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  if (props.projects?.length) {
    setInitialStates()
    animateElements()
  }
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.list {
  &.is-items {
    max-width: 100vw;
    overflow: hidden;
    padding-left: var(--space-xl);

    > li.is-item {
      overflow: hidden;

      .is-title {
        margin-bottom: var(--space-md);
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .is-mask {
          overflow: hidden;
          position: relative;
        }

        & h1 {
          font-size: var(--font-2xl);
          text-transform: uppercase;
          white-space: nowrap;
          will-change: transform, opacity;
        }

        > h2 {
          font-family: 'serif';
          font-size: var(--font-lg);
          will-change: transform, opacity;
        }
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .list {
    &.is-items {
      padding-left: var(--space-rg);

      > li.is-item {
        .is-title {
          margin-bottom: var(--space-md);
          & h1 {
            font-size: var(--font-lg);
          }
          > h2 {
            font-size: var(--font-md);
          }
        }
      }
    }
  }
}
</style>
