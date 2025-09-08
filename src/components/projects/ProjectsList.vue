<template>
  <section>
    <ul class="list is-items">
      <li v-for="project in projects" :key="project.id" class="is-item">
        <router-link :to="`/project/${project.id}`">
          <div class="is-title">
            <h1>{{ project.Title }}</h1>
            <h2>{{ project.Location }}</h2>
          </div>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.list {
  &.is-items {
    max-width: 100vw;
    overflow: hidden;
    padding-left: var(--space-xl);
    > li .is-title {
        margin-bottom: var(--space-md);
      > h1 {
        font-size: var(--font-2xl);
        text-transform: uppercase;
        white-space: nowrap;
      }
      > h2 {
        font-family: 'serif';
        font-size: var(--font-lg);
      }
    }
  }
}
</style>