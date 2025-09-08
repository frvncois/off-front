<template>
  <section>
    <div class="info is-wrap">
      <div class="is-title">
        <h1>Contactez-moi</h1>
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

<script setup>
import { defineProps } from 'vue'

defineProps({
  contact: {
    type: Object,
    default: () => ({})
  }
})

const formatUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}
</script>
<style scoped>
.info {
    &.is-wrap {
        position: fixed;
        inset: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: var(--space-md);
        & h1 {
            font-size: var(--font-2xl);
            font-family: 'serif';
        }
        &  a {
            font-size: var(--font-md);
            font-family: 'serif';
        }
    }
}
</style>