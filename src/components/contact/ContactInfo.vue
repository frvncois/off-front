<script setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
  contact: {
    type: Object,
    default: () => ({})
  }
})

const containerRef = ref(null)
const animations = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  animations.value.forEach(tween => tween?.kill?.())
  animations.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!containerRef.value) return

  // Title
  const titleEl = containerRef.value.querySelector('.is-title h1')
  if (titleEl) {
    gsap.set(titleEl, { y: '-0.5em', opacity: 0 })
  }

  // Anchors
  const links = containerRef.value.querySelectorAll('.is-items li a')
  if (links.length) {
    gsap.set(links, { y: '1em', opacity: 0 })
  }
}

const animateElements = () => {
  if (!containerRef.value) return

  const titleEl = containerRef.value.querySelector('.is-title h1')
  const links = Array.from(containerRef.value.querySelectorAll('.is-items li a'))

  const sequence = [titleEl, ...links].filter(Boolean)

  if (!sequence.length) return

  const tl = gsap.timeline()
  tl.to(sequence, {
    y: '0em',
    opacity: 1,
    duration: 1,
    stagger: 0.08,
    ease: 'power4.out'
  })

  animations.value.push(tl)
  hasAnimated.value = true
}

const playContactInfoExitAnimations = () => {
  if (!hasAnimated.value || !containerRef.value) return

  const titleEl = containerRef.value.querySelector('.is-title h1')
  const links = Array.from(containerRef.value.querySelectorAll('.is-items li a'))
  const sequence = [...links, titleEl].filter(Boolean) // reverse order on exit (links first, then title)

  const tl = gsap.timeline()
  tl.to(sequence, {
    y: '0.25em',
    opacity: 0,
    duration: 0.6,
    stagger: 0.05,
    ease: 'power3.in'
  })

  animations.value.push(tl)
}

window.playContactInfoExitAnimations = playContactInfoExitAnimations

watch(() => props.contact, async (newContact, oldContact) => {
  if (newContact !== oldContact) cleanup()
  await nextTick()
  setInitialStates()
  if (newContact && Object.keys(newContact).length > 0 && !hasAnimated.value) {
    animateElements()
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  if (props.contact && Object.keys(props.contact).length > 0) {
    setInitialStates()
    animateElements()
  }
})

onUnmounted(() => {
  cleanup()
})

const formatUrl = (url) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://${url}`
}
</script>

<template>
  <section ref="containerRef">
    <div class="info is-wrap">
      <div class="is-title">
        <div class="is-mask">
          <h1>Contactez-moi</h1>
        </div>
      </div>
      <ul class="is-items">
        <li v-if="contact?.Whatsapp">
          <a :href="formatUrl(contact.Whatsapp)">Whats App</a>
        </li>
        <li v-if="contact?.YouTube">
          <a :href="formatUrl(contact.YouTube)">Youtube</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.info {
  &.is-wrap {
    position: absolute;
    inset: 0;
    height: 100vh;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--space-md);

    h1 {
      font-size: var(--font-2xl);
      font-family: 'serif';
      will-change: transform, opacity;
      margin: 0;
    }

    .is-items li a {
      font-size: var(--font-md);
      font-family: 'serif';
      display: inline-block;
      will-change: transform, opacity;
    }
  }
}
</style>
