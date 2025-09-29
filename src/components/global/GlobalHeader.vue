<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute } from 'vue-router'
import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText"
import LogoMain from '@/assets/LogoMain.vue'
import GlobalNav from '@/components/global/GlobalNav.vue'

gsap.registerPlugin(SplitText)

const route = useRoute()
const isMenuOpen = ref(false)
let splitMenu, splitClose, tl

// track if nav is currently visible
const navVisible = ref(false)

// Reference to GlobalNav component
const globalNavRef = ref(null)

const toggleMenu = () => {
  if (!tl) return

  if (!navVisible.value) {
    // OPEN
    isMenuOpen.value = true          // mount GlobalNav
    navVisible.value = true
    tl.play()
  } else {
    // CLOSE - trigger GlobalNav's close animation first
    if (globalNavRef.value && globalNavRef.value.handleClose) {
      globalNavRef.value.handleClose()
    }

    // Then reverse the header animation
    tl.reverse()

    // Wait until both animations finish before unmounting
    const delay = tl.duration() * 1000
    setTimeout(() => {
      isMenuOpen.value = false
      navVisible.value = false
    }, delay)
  }
}

// Handle close event from GlobalNav
const onNavClose = () => {
  // This is called when GlobalNav finishes its close animation
  // We can add any additional logic here if needed
}

// Reset menu state on route change
watch(() => route.path, () => {
  if (navVisible.value) {
    // Close the menu if it's open when route changes
    if (globalNavRef.value && globalNavRef.value.handleClose) {
      globalNavRef.value.handleClose()
    }

    // Reset the header toggle animation
    if (tl) {
      tl.reverse()
    }

    // Reset state
    isMenuOpen.value = false
    navVisible.value = false

    // Re-enable scrolling
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  // Duplicate text layers
  const toggleEl = document.querySelector(".toggle-text")
  toggleEl.innerHTML = `
    <span class="word menu">MENU</span>
    <span class="word close" style="position:absolute;">CLOSE</span>
  `

  // Split them into chars
  splitMenu = new SplitText(".word.menu", { type: "chars" })
  splitClose = new SplitText(".word.close", { type: "chars" })

  // Position: Menu visible, Close hidden below
  gsap.set(splitMenu.chars, { yPercent: 0, opacity: 1 })
  gsap.set(splitClose.chars, { yPercent: 100, opacity: 0 })

  // Timeline
  tl = gsap.timeline({ paused: true })
    .to(splitMenu.chars, {
      yPercent: -100,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: "power2.in"
    })
    .to(splitClose.chars, {
      yPercent: 0,
      opacity: 1,
      delay: 0.25,
      stagger: 0.05,
      duration: 0.35,
      ease: "power2.out"
    }, "<")

  // Intro anim (logo + nav)
  const intro = gsap.timeline()
  intro.fromTo(
    '.global-header .logo',
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
  )
  intro.fromTo(
    '.global-header nav',
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
    "-=0.4"
  )
})
</script>

<template>
  <header class="global-header">
    <router-link to="/" class="logo">
      <LogoMain/>
    </router-link>
    <nav>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/projects">Nos projets</router-link>
      <span class="toggle" @click="toggleMenu">
        <span class="toggle-text">MENU</span>
      </span>
    </nav>
  </header>

  <GlobalNav
    v-if="isMenuOpen"
    ref="globalNavRef"
    @close="onNavClose"
  />
</template>

<style scoped>
header {
  position: fixed;
  top: 0; left: 0; right: 0;
  display: flex; justify-content: space-between;
  padding: var(--space-rg);
  z-index: 11;
}

nav {
  display: flex;
  gap: var(--space-md);
}
a, router-link, .toggle {
  text-transform: uppercase;
  font-size: var(--font-rg);
}

.toggle {
  display: none;
  cursor: pointer;
  line-height: 1;
  position: relative;
  overflow: hidden;
}

.toggle-text {
  display: flex;
  position: relative;
  height: 1em;
  width: 5ch;
  flex-direction: column;
  align-items: flex-end;
}

.word {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  text-align: left;
}

@media screen and (max-width: 1120px) {
  .toggle { display: inline-flex; }
  nav a, nav router-link { display: none; }
}
</style>
