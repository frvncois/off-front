<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useContentStore } from '@/stores/content'
import SingleAbout from '@/components/single/SingleAbout.vue'
import SingleCollab from '@/components/single/SingleCollab.vue'
import SingleGallery from '@/components/single/SingleGallery.vue'
import SingleNav from '@/components/single/SingleNav.vue'
import SingleTitle from '@/components/single/SingleTitle.vue'
import GlobalFooter from '@/components/global/GlobalFooter.vue'

const route = useRoute()
const contentStore = useContentStore()

const projectId = computed(() => route.params.id)
const project = computed(() => contentStore.getProjectById(projectId.value))
const allProjects = computed(() => contentStore.getAllProjects)
</script>

<template>
  <SingleTitle :project="project" />
  <SingleAbout :project="project" />
  <SingleGallery :project="project" />
  <SingleCollab :project="project" />
  <SingleNav :project="project" :all-projects="allProjects" />
  <GlobalFooter />
</template>