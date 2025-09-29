<script setup>
import { computed } from 'vue'
import { useContentStore } from '@/stores/content'
import ContactInfo from '@/components/contact/ContactInfo.vue'
import ContactTrack from '@/components/contact/ContactTrack.vue'

const contentStore = useContentStore()
const contactData = computed(() => contentStore.getContactInfo)
</script>

<template>
  <ContactTrack />
  <ContactInfo :contact="contactData" />
</template>