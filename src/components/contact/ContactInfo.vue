<script setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const props = defineProps({
  contact: {
    type: Object,
    default: () => ({})
  }
})

const containerRef = ref(null)
const splitInstances = ref([])
const animations = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  animations.value.forEach(tween => tween?.kill?.())
  splitInstances.value.forEach(split => { try { split.revert() } catch (e) {} })
  animations.value = []
  splitInstances.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!containerRef.value) return

  // Split title into chars
  const titleEl = containerRef.value.querySelector('.is-title h1')
  if (titleEl) {
    const split = new SplitText(titleEl, { type: 'chars' })
    splitInstances.value.push(split)
    gsap.set(split.chars, { y: '-100%' })
  }

  // Anchors
  const links = containerRef.value.querySelectorAll('.is-items li a')
  if (links.length) {
    gsap.set(links, { y: '1em', opacity: 0 })
  }
}

const animateElements = () => {
  if (!containerRef.value) return

  const chars = splitInstances.value.flatMap(s => s.chars || [])
  const links = Array.from(containerRef.value.querySelectorAll('.is-items li a'))

  const sequence = [...chars, ...links] // one stagger sequence

  if (!sequence.length) return

  const tl = gsap.timeline()
  tl.to(sequence, {
    y: '0%',
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

  const chars = splitInstances.value.flatMap(s => s.chars || [])
  const links = Array.from(containerRef.value.querySelectorAll('.is-items li a'))
  const sequence = [...links, ...chars] // reverse order on exit

  const tl = gsap.timeline()
  tl.to(sequence, {
    y: '100%',
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

    > .is-title > .is-mask {
      overflow: hidden;
    }

    h1 {
      font-size: var(--font-2xl);
      font-family: 'serif';
      will-change: transform, opacity;
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
