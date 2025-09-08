<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    default: () => ({})
  },
  allProjects: {
    type: Array,
    default: () => []
  }
})

const nextProject = computed(() => {
  if (!props.project?.id || !props.allProjects.length) return null
  
  const currentIndex = props.allProjects.findIndex(p => p.id === props.project.id)
  const nextIndex = currentIndex + 1
  
  if (nextIndex < props.allProjects.length) {
    return props.allProjects[nextIndex]
  }
  
  return null
})
</script>

<template>
  <section>
    <div class="nav is-wrap">
      <router-link v-if="nextProject" :to="`/project/${nextProject.id}`">
        Suivant ->
      </router-link>
      <router-link v-else to="/projects">
        Retour aux projets ->
      </router-link>
    </div>
  </section>
</template>

<style scoped>
.nav {
    &.is-wrap {
        display: flex;
        justify-content: center;
        padding: var(--space-md);
        a {
            font-size: var(--font-md);
        }
    }
}
</style>