<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeProjects from '@/components/home/HomeProjects.vue'
import HomeStats from '@/components/home/HomeStats.vue'
import GlobalFooter from '@/components/global/GlobalFooter.vue'

const contentStore = useContentStore()
const contentData = computed(() => contentStore.getGeneralContent)
const projectsData = computed(() => contentStore.getAllProjects)
</script>

<template>
  <HomeHero :content="contentData" />
  <HomeAbout :content="contentData" />
  <HomeProjects :projects="projectsData" />
  <HomeStats :content="contentData" />
  <GlobalFooter />
</template>