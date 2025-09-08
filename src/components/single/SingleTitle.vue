<template>
  <section>
    <div class="title is-wrap">
      <router-link to="/projects"><-</router-link>
      <h1>{{ project?.Title }}</h1>
      <h2>{{ project?.Location }}</h2>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.title {
    &.is-wrap {
        margin-top: 25vh;
        padding: var(--space-rg);
        > h1 {
            font-size: var(--font-2xl);
            text-transform: uppercase;
        }
        > h2 {
            font-size: var(--font-xl);
            font-family: 'serif';
        }
        > a {
            font-size: var(--font-lg);
        }
    }
}

@media screen and (max-width: 1120px) {
  .title {
    &.is-wrap {
      > h2 {
        font-size: var(--font-md);
      }
    }
  }
}
</style>