<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content.js'
import ProjectsList from '@/components/projects/ProjectsList.vue'
import ProjectsTitle from '@/components/projects/ProjectsTitle.vue'
import GlobalCTA from '@/components/global/GlobalCTA.vue'

const contentStore = useContentStore()
const projectsData = computed(() => contentStore.getAllProjects)
</script>

<template>
  <ProjectsTitle />
  <ProjectsList :projects="projectsData" />
  <GlobalCTA />
</template>