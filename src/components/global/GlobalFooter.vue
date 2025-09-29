<script setup>
import { computed, onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import { gsap } from 'gsap'

const contentStore = useContentStore()
const contactData = computed(() => contentStore.getContactInfo)

const formatUrl = (url) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `https://${url}`
}

onMounted(() => {
  gsap.fromTo(
    '.global-footer nav',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
  )
})
</script>

<template>
  <footer class="global-footer">
    <nav>
      <div class="is-items">
        <a v-if="contactData?.Instagram" :href="formatUrl(contactData.Instagram)">Instagram</a>
        <a v-if="contactData?.Whatsapp" :href="formatUrl(contactData.Whatsapp)">Whatsapp</a>
      </div>
      <p>© 2025 Studiooff</p>
    </nav>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  padding-bottom: calc(var(--space-lg) + 4em);
  gap: var(--space-md);
}

footer > nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-rg);
  z-index: 2;
  will-change: transform, opacity;

  a, p {
    text-transform: uppercase;
    font-size: var(--font-rg);
  }

  > .is-items {
    display: flex;
    gap: var(--space-rg);
  }
}
</style>
