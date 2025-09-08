<template>
  <section>
    <div class="collab is-wrap">
      <div class="is-content">
        <h1>En collaboration avec</h1>
        <h2 v-if="project?.Collaboration">
          <a v-if="project?.CollaborationLink" 
             :href="project.CollaborationLink" 
             target="_blank">
            {{ project.Collaboration }}
          </a>
          <span v-else>{{ project.Collaboration }}</span>
        </h2>
      </div>
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
.collab {
    &.is-wrap {
        > .is-content {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            padding: var(--space-rg)
        }
    }
}
</style>