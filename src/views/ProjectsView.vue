<script setup lang="ts">
import { computed } from 'vue'
import { useContentStore } from '@/stores/content.js'
import ProjectsList from '@/components/projects/ProjectsList.vue'
import ProjectsTitle from '@/components/projects/ProjectsTitle.vue'
import GlobalFooter from '@/components/global/GlobalFooter.vue'

const contentStore = useContentStore()

const projectsData = computed(() => contentStore.getAllProjects)
</script>

<template>
  <ProjectsTitle />
  <ProjectsList :projects="projectsData" />
  <GlobalFooter />
</template>