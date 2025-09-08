<template>
  <GlobalHeader />
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useContentStore } from '@/stores/content.js'
import GlobalHeader from './components/global/GlobalHeader.vue'

const contentStore = useContentStore()

const loadContent = async () => {
  try {
    await contentStore.fetchAllContent()
    console.log('=== STRAPI CONTENT LOADED ===')
    console.log('Contact Data:', contentStore.getContactInfo)
    console.log('Content Data:', contentStore.getGeneralContent)
    console.log('Projects Data:', contentStore.getAllProjects)
    console.log('=== END STRAPI CONTENT ===')
    
  } catch (error) {
    console.error('Failed to load content on app start:', error)
  }
}

onMounted(() => {
  loadContent()
})
</script>