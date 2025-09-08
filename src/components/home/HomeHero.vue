<template>
  <section>
    <div class="hero is-wrap">
      <div class="is-cover">
        <img v-if="content?.Cover" :src="getImageUrl(content.Cover)" :alt="content.Title" />
      </div>
      <div class="is-content">
        <p v-for="(paragraph, index) in content.Intro" :key="index">
          {{ getTextFromParagraph(paragraph) }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

const getImageUrl = (imageObj) => {
  if (!imageObj?.url) return null
  return `http://localhost:1337${imageObj.url}`
}

const getTextFromParagraph = (paragraph) => {
  if (paragraph.children && paragraph.children[0]) {
    return paragraph.children[0].text
  }
  return ''
}
</script>





<style scoped>
.hero {
  &.is-wrap {
    display: flex;
    height: 100vh;
    
    > .is-cover {
      flex-basis: 50%;
      flex-shrink: 0;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    > .is-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-basis: 50%;
      padding: var(--space-lg);
      
      > p {
        font-family: 'serif';
        font-size: var(--font-md);
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .hero {
    &.is-wrap {
      flex-direction: column-reverse;
      height: auto;
    }
    > .is-content {
      padding: var(--space-rg)!important;
      margin-top: 25vh;
    }
    > .is-cover {
      padding: var(--space-rg)!important;}
  }
}
</style>