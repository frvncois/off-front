<template>
  <section ref="sectionRef">
    <div class="collab is-wrap">
      <div class="is-content">
        <div class="is-mask">
          <h1>En collaboration avec</h1>
        </div>
        <div class="is-mask" v-if="project?.Collaboration">
          <h1>
            <a v-if="project?.CollaborationLink"
               :href="project.CollaborationLink"
               target="_blank">
              {{ project.Collaboration }}
            </a>
            <span v-else>{{ project.Collaboration }}</span>
          </h1>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const sectionRef = ref(null)
const splitInstances = ref([])
const animations = ref([])
const hasAnimated = ref(false)

/**
 * Cleanup GSAP state
 */
const cleanup = () => {
  animations.value.forEach(anim => anim.kill?.())
  splitInstances.value.forEach(split => { try { split.revert() } catch(e) {} })

  // reset inline styles
  sectionRef.value?.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'))

  // remove leftover gsap pin spacers
  document.querySelectorAll('.gsap-pin-spacer').forEach(spacer => {
    spacer.replaceWith(...spacer.childNodes)
  })

  animations.value = []
  splitInstances.value = []
  hasAnimated.value = false
}

/**
 * Prepare initial animation states
 */
const setInitialStates = () => {
  if (!sectionRef.value) return
  const textElements = sectionRef.value.querySelectorAll('.is-content h1')
  textElements.forEach(el => {
    const split = new SplitText(el, { type: 'chars' })
    splitInstances.value.push(split)
    gsap.set(split.chars, { y: '-100%' })
  })
}

/**
 * Play entrance animations
 */
const animateTextElements = () => {
  if (hasAnimated.value) return

  const chars = splitInstances.value.flatMap(split => split.chars || [])
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

/**
 * Exit animation — triggered globally by router
 */
const playSingleCollabExitAnimations = () => {
  const chars = splitInstances.value.flatMap(split => split.chars || [])
  if (!chars.length) return

  const tl = gsap.timeline()
  tl.to(chars, {
    y: '100%',
    duration: 0.8,
    stagger: 0.02,
    ease: 'power3.in'
  })

  animations.value.push(tl)
}

// Watch for project changes to reset and re-animate
watch(() => props.project?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    cleanup()
    await nextTick()
    if (props.project?.Collaboration) {
      setInitialStates()
      animateTextElements()
    }
  }
}, { immediate: false })

onMounted(async () => {
  await nextTick()
  if (props.project?.Collaboration) {
    setInitialStates()
    animateTextElements()
  }
})

onUnmounted(() => {
  cleanup()
})

watch(() => props.project?.Collaboration, async (newCollab) => {
  if (newCollab && !hasAnimated.value) {
    cleanup()
    await nextTick()
    setInitialStates()
    animateTextElements()
  }
}, { immediate: true })

// expose exit animation for router global runner
window.playSingleCollabExitAnimations = playSingleCollabExitAnimations
</script>

<style scoped>
.collab {
  &.is-wrap {
    > .is-content {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: var(--space-rg);

      > .is-mask {
        overflow: hidden;

        h1 {
          will-change: transform, opacity;
          text-transform: uppercase;
        }
      }
    }
  }
}
</style>
