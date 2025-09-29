<template>
  <section ref="sectionRef">
    <div class="projects is-wrap">
      <div class="is-title">
        <div class="is-track" ref="track1">
          <h1>
            Projets<span>Réalisé</span>Projets<span>Réalisé</span>
            Projets<span>Réalisé</span>Projets<span>Réalisé</span>
          </h1>
        </div>
        <div class="is-track" ref="track2">
          <h1>
            Projets<span>Réalisé</span>Projets<span>Réalisé</span>
            Projets<span>Réalisé</span>Projets<span>Réalisé</span>
          </h1>
        </div>
        <div class="is-action">
          <router-link to="/projects"><ArrowNext/></router-link>
        </div>
      </div>
      <div class="is-items" ref="itemsRef">
        <router-link
          v-for="project in projects"
          :key="project.id"
          v-if="projects && projects.length"
          :to="`/project/${project.id}`"
          class="is-item"
        >
          <div class="is-cover">
            <img v-if="project.Cover" :src="project.Cover.url" :alt="project.Title" />
          </div>
          <div class="is-details">
            <h2>{{ project.Title }}</h2>
            <h3>{{ project.Location }}</h3>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ArrowNext from '@/assets/ArrowNext.vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

const sectionRef = ref(null)
const itemsRef = ref(null)
const track1 = ref(null)
const track2 = ref(null)

const marqueeAnimations = ref([])
const scrollTriggers = ref([])
const animations = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  // Kill animations first
  marqueeAnimations.value.forEach(anim => anim.kill?.())
  animations.value.forEach(anim => anim.kill?.())

  // Kill ScrollTriggers more carefully
  scrollTriggers.value.forEach(trigger => {
    if (trigger && trigger.kill) {
      trigger.kill(true) // Kill and remove from DOM
    }
  })

  // Clean up any remaining pin-spacers specifically for this component
  if (sectionRef.value) {
    const parentSpacer = sectionRef.value.closest('.gsap-pin-spacer')
    if (parentSpacer) {
      parentSpacer.replaceWith(...parentSpacer.childNodes)
    }
  }

  // Reset arrays
  marqueeAnimations.value = []
  scrollTriggers.value = []
  animations.value = []
  hasAnimated.value = false
}

const setupMarqueeAnimations = () => {
  if (track1.value) {
    marqueeAnimations.value.push(
      gsap.fromTo(track1.value, { x: '0%' }, { x: '-100%', duration: 30, ease: 'none', repeat: -1 })
    )
  }
  if (track2.value) {
    marqueeAnimations.value.push(
      gsap.fromTo(track2.value, { x: '-100%' }, { x: '0%', duration: 30, ease: 'none', repeat: -1 })
    )
  }
}

const setInitialStates = () => {
  if (!sectionRef.value) return
  const tracks = sectionRef.value.querySelectorAll('.is-track')
  const items = sectionRef.value.querySelectorAll('.is-item')
  const arrowNext = sectionRef.value.querySelector('.is-action a')

  gsap.set(tracks, { y: '1em', opacity: 0 })
  if (arrowNext) gsap.set(arrowNext, { opacity: 0 })

  items.forEach(item => {
    const cover = item.querySelector('.is-cover')
    const t = [item.querySelector('h2'), item.querySelector('h3')].filter(Boolean)
    if (cover) gsap.set(cover, { clipPath: 'inset(0% 0% 100% 0%)' })
    if (t.length) gsap.set(t, { y: '1em', opacity: 0 })
  })
}

const animateElements = () => {
  if (hasAnimated.value || !sectionRef.value) return
  const tracks = sectionRef.value.querySelectorAll('.is-track')
  const items = sectionRef.value.querySelectorAll('.is-item')
  const arrowNext = sectionRef.value.querySelector('.is-action a')

  const tl = gsap.timeline()

  if (tracks.length) {
    tl.to(tracks, {
      y: '0em',
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out'
    }, 0)
  }

  if (arrowNext) {
    tl.to(arrowNext, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, 0.5)
  }

  const covers = []
  const titles = []
  items.forEach(item => {
    const cover = item.querySelector('.is-cover')
    const h2 = item.querySelector('h2')
    const h3 = item.querySelector('h3')
    if (cover) covers.push(cover)
    if (h2 || h3) titles.push(...[h2, h3].filter(Boolean))
  })

  if (covers.length) {
    tl.to(covers, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 2,
      stagger: 0.25,
      ease: 'power2.out'
    }, 0.5)
  }

  if (titles.length) {
    tl.to(titles, {
      y: '0em',
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    }, 1)
  }

  scrollTriggers.value.push(
    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top 70%',
      animation: tl
    })
  )

  hasAnimated.value = true
  animations.value.push(tl)
}

const setupScrollEffects = () => {
  if (!sectionRef.value || !itemsRef.value) return

  const pinElement = sectionRef.value.querySelector('.projects.is-wrap')
  if (!pinElement) return

  // Create pin ScrollTrigger with better error handling
  const pinTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom bottom',
    pin: pinElement,
    pinSpacing: false,
    invalidateOnRefresh: true,
    onRefresh: () => {
      // Ensure element is still valid on refresh
      if (!sectionRef.value || !document.contains(sectionRef.value)) {
        pinTrigger.kill(true)
        return
      }
    }
  })

  // Create scrub animation ScrollTrigger
  const scrubTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    invalidateOnRefresh: true,
    animation: gsap.fromTo(itemsRef.value, { x: '0%' }, { x: '-60%' }),
    onRefresh: () => {
      // Ensure element is still valid on refresh
      if (!itemsRef.value || !document.contains(itemsRef.value)) {
        scrubTrigger.kill(true)
        return
      }
    }
  })

  scrollTriggers.value.push(pinTrigger, scrubTrigger)
}

const playHomeProjectsExitAnimations = () => {
  if (!sectionRef.value) return
  const tracks = sectionRef.value.querySelectorAll('.is-track')
  const items = sectionRef.value.querySelectorAll('.is-item')
  const arrowNext = sectionRef.value.querySelector('.is-action a')

  const tl = gsap.timeline()

  if (tracks.length) {
    tl.to(tracks, { y: '-1em', opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
  }

  if (arrowNext) {
    tl.to(arrowNext, { opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
  }

  items.forEach((item, i) => {
    const cover = item.querySelector('.is-cover')
    const t = [item.querySelector('h2'), item.querySelector('h3')].filter(Boolean)
    if (cover) {
      tl.to(cover, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'power2.in' }, i * 0.15)
    }
    if (t.length) {
      tl.to(t, { y: '1em', opacity: 0, duration: 0.6, ease: 'power2.in' }, i * 0.2 + 0.2)
    }
  })

  animations.value.push(tl)
}

window.playHomeProjectsExitAnimations = playHomeProjectsExitAnimations

watch(() => props.projects, async (newProjects) => {
  if (newProjects?.length) {
    // Always cleanup first to handle re-navigation to home
    cleanup()
    await nextTick()

    // Set up fresh animations
    setInitialStates()
    setupMarqueeAnimations()

    // Delay scroll effects setup to ensure DOM is ready and avoid conflicts
    setTimeout(() => {
      if (sectionRef.value && document.contains(sectionRef.value)) {
        setupScrollEffects()
        animateElements()
      }
    }, 150)
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  // The watcher handles all setup, just ensure we're ready
  // This avoids duplicate initialization
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
section {
  height: 300vh; /* keep this */
}

.projects {
  &.is-wrap {
    display: flex;
    flex-direction: column;
    width: 100vw;
    overflow: hidden;
    height: 100vh;

    > .is-title {
      > .is-track {
        font-size: var(--font-xl);
        text-transform: uppercase;
        width: 100%;
        will-change: transform;
        & h1 { line-height: 0.9; display: flex; }
        & span { font-family: 'serif'; margin: 0 var(--space-xs); }
      }
      > .is-action {
        display: flex; align-items: center; justify-content: center;
        a { padding: var(--space-md); will-change: opacity; }
      }
    }

    > .is-items {
      display: flex;
      flex: 1;
      padding-left: var(--space-lg);
      padding-bottom: var(--space-md);
      flex-wrap: nowrap;
      width: 200vw;
      will-change: transform;

      > .is-item {
        display: flex;
        flex-direction: column;
        padding: var(--space-rg);
        gap: var(--space-rg);
        width: 22vw;
        flex: 1;

        & .is-cover {
          position: relative;
          height: 100%;
          overflow: hidden;
          flex: 1;
          will-change: clip-path;
          & img { position: absolute; object-fit: cover; height: 100%; width: 100%; }
        }

        & h2, & h3 { will-change: transform, opacity; }
        & h2 { text-transform: uppercase; }
        & h3 { font-family: 'serif'; }
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .projects {
    &.is-wrap {
      > .is-items {
        width: 400vw;
        padding-left: var(--space-rg);
        padding-right: 0;
      }

    > .is-title {
      > .is-track {
        font-size: var(--font-md);
      }
    }
    }
  }
}
</style>
