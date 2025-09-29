<template>
  <GlobalHeader />
  <div id="smooth">
    <div id="content">
      <RouterView />
    </div>
  </div>
  <GlobalFooter />
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import { useContentStore } from '@/stores/content.js'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import GlobalHeader from './components/global/GlobalHeader.vue'
import GlobalFooter from './components/global/GlobalFooter.vue'

const contentStore = useContentStore()
const router = useRouter()
const route = useRoute()

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
  ScrollSmoother.create({
    wrapper: "#smooth",
    content: "#content",
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.1
  })

  loadContent()
})
</script>