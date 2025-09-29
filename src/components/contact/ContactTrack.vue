<template>
  <section ref="containerRef">
    <div class="track is-wrap">
      <div class="is-item">
        <h1>
          STUDIOOFF STUDIOOFF STUDIOOFF STUDIOOFF STUDIOOFF STUDIOOFF STUDIOOFF
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const containerRef = ref(null)
const marqueeAnimation = ref(null)
const animations = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  marqueeAnimation.value?.kill()
  marqueeAnimation.value = null
  animations.value.forEach(anim => anim.kill())
  animations.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!containerRef.value) return
  const trackElement = containerRef.value.querySelector('.track.is-wrap')
  if (trackElement) {
    gsap.set(trackElement, { opacity: 0 })
  }
}

const animateTrack = () => {
  if (!containerRef.value) return
  const trackElement = containerRef.value.querySelector('.track.is-wrap')
  const itemElement = containerRef.value.querySelector('.is-item')

  if (!trackElement || !itemElement) return

  const tl = gsap.timeline()

  // Fade in the track
  tl.to(trackElement, {
    opacity: 1,
    duration: 1,
    ease: 'power4.inOut'
  }, 0)

  // Start infinite marquee
  marqueeAnimation.value = gsap.fromTo(itemElement,
    { x: '0%' },
    {
      x: '-50%',
      duration: 200,
      ease: 'none',
      repeat: -1
    }
  )

  animations.value.push(tl)
  hasAnimated.value = true
}

const playContactTrackExitAnimations = () => {
  if (!hasAnimated.value || !containerRef.value) return
  const trackElement = containerRef.value.querySelector('.track.is-wrap')
  if (!trackElement) return

  const tl = gsap.timeline()
  tl.to(trackElement, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in'
  })

  animations.value.push(tl)
}

window.playContactTrackExitAnimations = playContactTrackExitAnimations

onMounted(async () => {
  await nextTick()
  setInitialStates()
  animateTrack()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.track {
  &.is-wrap {
    position: absolute;
    inset: 0;
    z-index: -1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    height: 100vh;

    > .is-item {
      white-space: nowrap;

      & h1 {
        font-size: var(--font-3xl);
        font-family: 'Serif';
        opacity: 0.1;
        margin: 0;
        white-space: nowrap;
        will-change: transform;
      }
    }
  }
}
</style>
