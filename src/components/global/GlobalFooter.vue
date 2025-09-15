<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import LogoIcon from '@/assets/LogoIcon.vue'
import { RouterLink } from 'vue-router'

const contentStore = useContentStore()
const contactData = computed(() => contentStore.getContactInfo)

const formatUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}
</script>

<template>
  <footer>
    <div class="is-logo">
      <LogoIcon/>
    </div>
    <div class="is-action">
      <RouterLink to="/contact">Contactez-moi<span>-></span></RouterLink>
    </div>
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
    gap: var(--space-md);
    > .is-logo {
      margin-right: -1.5em;
    }
    > .is-action {
        a {
            font-size: var(--font-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-rg);
        }
    }
    > nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: var(--space-rg);
        a, p {
            text-transform: uppercase;
            font-size: var(--font-rg);
        }
        > .is-items {
            display: flex;
            gap: var(--space-rg);
        }
    }
}
</style>