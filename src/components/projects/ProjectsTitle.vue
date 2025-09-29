<template>
  <section ref="sectionRef">
    <div class="title is-wrap">
      <div class="is-header">
        <h1><span>Projets</span></h1>
        <h1>Réalisés</h1>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const sectionRef = ref(null)
const splitInstances = ref([])
const animations = ref([])
const hasAnimated = ref(false)

const cleanup = () => {
  animations.value.forEach(anim => anim.kill())
  animations.value = []
  splitInstances.value.forEach(split => {
    try { split.revert() } catch (e) {}
  })
  splitInstances.value = []
  hasAnimated.value = false
}

const setInitialStates = () => {
  if (!sectionRef.value) return
  const textElements = sectionRef.value.querySelectorAll('.is-header h1')
  textElements.forEach(element => {
    const split = new SplitText(element, { type: 'chars' })
    splitInstances.value.push(split)
    gsap.set(split.chars, { y: '-100%' })
  })
}

const animateElements = () => {
  if (!sectionRef.value) return
  const chars = splitInstances.value.flatMap(split => split.chars)
  if (!chars.length) return

  const tl = gsap.timeline()
  tl.to(chars, {
    y: '0%',
    duration: 0.8,
    stagger: 0.02,
    ease: 'power3.out'
  })

  animations.value.push(tl)
  hasAnimated.value = true
}

const playProjectsTitleExitAnimations = () => {
  if (!sectionRef.value) return
  const chars = splitInstances.value.flatMap(split => split.chars)
  if (!chars.length) return

  gsap.to(chars, {
    y: '110%',
    duration: 0.8,
    stagger: 0.02,
    ease: 'power3.in'
  })
}

window.playProjectsTitleExitAnimations = playProjectsTitleExitAnimations

onMounted(async () => {
  await nextTick()
  setInitialStates()
  animateElements()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.title {
  &.is-wrap {
    display: flex;
    align-items: flex-end;
    padding: var(--space-rg);
    height: 25vh;

    > .is-header h1 {
      display: flex;
      text-transform: uppercase;
      overflow: hidden;
      font-size: var(--font-md);
      will-change: transform, opacity;

      > span {
        font-family: 'serif';
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .title > .is-header {
    margin-bottom: var(--space-md);
  }
}

</style>
