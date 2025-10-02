<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { gsap } from 'gsap'

const emit = defineEmits(['close'])
const router = useRouter()

const contentStore = useContentStore()
const contactData = computed(() => contentStore.getContactInfo)

const formatUrl = (url) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://${url}`
}

let tl
const navRef = ref(null)

onMounted(() => {
  // Disable scrolling when nav opens
  document.body.style.overflow = 'hidden'

  if (!navRef.value) return

  // initial hidden state - scoped to this component
  const mobile = navRef.value.querySelector(".mobile")
  const firstItems = navRef.value.querySelectorAll(".nav-items:first-child > *")
  const lastItems = navRef.value.querySelectorAll(".nav-items:last-child > *")

  gsap.set(mobile, { clipPath: "inset(0% 0% 100% 0%)" })
  gsap.set(firstItems, { y: "1em", opacity: 0 })
  gsap.set(lastItems, { y: "1em", opacity: 0 })

  // timeline for open/close
  tl = gsap.timeline({ paused: true })
    // open clip
    .to(mobile, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.6,
      ease: "power3.inOut"
    })
    // open first items
    .to(firstItems, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.02
    }, "-=0.3")
    // open second items
    .to(lastItems, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.02
    }, "-=0.4")

  // play forward on mount
  tl.play()
})

function handleClose() {
  if (!tl) return

  // Re-enable scrolling when close animation starts
  document.body.style.overflow = ''

  tl.reverse()

  // wait until reverse is done
  const duration = tl.duration() * 1000
  setTimeout(() => {
    emit('close')
  }, duration)
}

// helper: close when clicking nav links
function handleNavClick(route) {
  handleClose()

  // Navigate after close animation finishes
  const duration = tl.duration() * 1000
  setTimeout(() => {
    router.push(route)
  }, duration)
}

// Re-enable scrolling when component is unmounted (safety fallback)
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Expose handleClose method to parent component
defineExpose({
  handleClose
})
</script>

<template>
  <div ref="navRef" class="global-nav-wrapper">
    <div class="mobile">
      <div class="nav-items">
        <button @click="() => handleNavClick('/projects')">
          Projets<span>Réalisés</span>
        </button>
        <button @click="() => handleNavClick('/contact')">
          Contactez<span>Moi</span>
        </button>
      </div>
      <div class="nav-items">
        <h2>Social</h2>
        <a
          v-if="contactData?.Instagram"
          :href="formatUrl(contactData.Instagram)"
          @click="handleClose"
        >
          Instagram
        </a>
        <a
          v-if="contactData?.Whatsapp"
          :href="formatUrl(contactData.Whatsapp)"
          @click="handleClose"
        >
          Whatsapp
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .mobile {
    display: none;
  }
@media screen and (max-width: 1120px) {
  .mobile {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: var(--light);
  max-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-transform: uppercase;
  line-height: 0.9;
  gap: var(--space-md);
  padding: var(--space-rg);
  clip-path: inset(0% 0% 100% 0%);
  overflow: hidden;
}

.nav-items {
  display: flex;
  flex-direction: column;
}

.nav-items > a,
.nav-items > button {
  display: flex;
  flex-direction: column;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  text-align: left;
  cursor: pointer;
}

.nav-items > a > span,
.nav-items > button > span {
  font-family: 'serif';
}

  .nav-items:first-child { gap: var(--space-md); }
  .nav-items:first-child > button { font-size: var(--font-2xl); }

  .nav-items:last-child > a { font-size: var(--font-md); }
  .nav-items:last-child h2 { margin-bottom: var(--space-rg); }
}
</style>
