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
      <swiper
        v-if="projects && projects.length"
        :slidesPerView="'4'"
        :spaceBetween="30"
        :modules="modules"
        class="is-items"
        ref="swiperRef"
      >
        <swiper-slide
          v-for="project in projects"
          :key="project.id"
        >
          <router-link
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
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import ArrowNext from '@/assets/ArrowNext.vue'

gsap.registerPlugin(ScrollTrigger)

const modules = [Pagination]

const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

const sectionRef = ref(null)
const swiperRef = ref(null)
const track1 = ref(null)
const track2 = ref(null)

const marqueeAnimations = ref([])
const scrollTriggers = ref([])
const animations = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  marqueeAnimations.value.forEach(anim => anim.kill?.())
  animations.value.forEach(anim => anim.kill?.())
  scrollTriggers.value.forEach(trigger => trigger?.kill?.(true))

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
  const slides = sectionRef.value.querySelectorAll('.swiper-slide')
  const arrowNext = sectionRef.value.querySelector('.is-action a')

  gsap.set(tracks, { y: '1em', opacity: 0 })
  if (arrowNext) gsap.set(arrowNext, { opacity: 0 })

  slides.forEach(slide => {
    const cover = slide.querySelector('.is-cover')
    const t = [slide.querySelector('h2'), slide.querySelector('h3')].filter(Boolean)
    if (cover) gsap.set(cover, { clipPath: 'inset(0% 0% 100% 0%)' })
    if (t.length) gsap.set(t, { y: '1em', opacity: 0 })
  })
}

const animateElements = () => {
  if (hasAnimated.value || !sectionRef.value) return
  const tracks = sectionRef.value.querySelectorAll('.is-track')
  const slides = sectionRef.value.querySelectorAll('.swiper-slide')
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
  slides.forEach(slide => {
    const cover = slide.querySelector('.is-cover')
    const h2 = slide.querySelector('h2')
    const h3 = slide.querySelector('h3')
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


const playHomeProjectsExitAnimations = () => {
  if (!sectionRef.value) return
  const tracks = sectionRef.value.querySelectorAll('.is-track')
  const slides = sectionRef.value.querySelectorAll('.swiper-slide')
  const arrowNext = sectionRef.value.querySelector('.is-action a')

  const tl = gsap.timeline()

  if (tracks.length) {
    tl.to(tracks, { y: '-1em', opacity: 0, duration: 0.8, ease: 'power2.in' }, 0)
  }

  if (arrowNext) {
    tl.to(arrowNext, { opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
  }

  slides.forEach((slide, i) => {
    const cover = slide.querySelector('.is-cover')
    const t = [slide.querySelector('h2'), slide.querySelector('h3')].filter(Boolean)
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
    cleanup()
    await nextTick()

    setInitialStates()
    setupMarqueeAnimations()

    setTimeout(() => {
      if (sectionRef.value && document.contains(sectionRef.value)) {
        animateElements()
      }
    }, 150)
  }
}, { immediate: true })

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
section {
  height: 100vh;
}

.projects {
  &.is-wrap {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;

    > .is-title {
      > .is-track {
        font-size: var(--font-xl);
        text-transform: uppercase;
        width: 100%;
        will-change: transform;
        & h1 { line-height: 0.9; display: flex;}
        & span { font-family: 'serif'; margin: 0 var(--space-xs); line-height: 1; }
      }
      > .is-action {
        display: flex; align-items: center; justify-content: center;
        a { padding: var(--space-md); will-change: opacity; }
      }
    }

    > .is-items {
      flex: 1;
      padding-left: var(--space-lg);
      padding-bottom: var(--space-md);
    }
  }
}

:deep(.swiper-slide) {
  width: auto !important;
  flex-shrink: 0;
}

:deep(.is-item) {
  display: flex;
  flex-direction: column;
  padding: var(--space-rg);
  gap: var(--space-rg);
  height: 100%;
  width: 22.5vw;

  & .is-cover {
    position: relative;
    height: 100%;
    overflow: hidden;
    will-change: clip-path;
    & img { position: absolute; object-fit: cover; height: 100%; width: 100%;}
  }

  & h2, & h3 { will-change: transform, opacity; }
  & h2 { text-transform: uppercase; }
  & h3 { font-family: 'serif'; }
}


:deep(.swiper-pagination-bullet) {
  background: var(--color-text, #000);
  opacity: 0.3;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}

@media screen and (max-width: 1120px) {
  .projects {
    &.is-wrap {
      > .is-items {
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

  :deep(.is-item) {
    width: 60vw;
  }
}
</style>
