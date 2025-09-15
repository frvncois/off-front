<template>
  <section>
    <div class="hero is-wrap">
      <div class="is-cover">
        <img v-if="content?.Cover" :src="getImageUrl(content.Cover)" :alt="content.Title" />
      </div>
      <div v-if="content?.Intro" 
           class="is-content">
        <div v-for="(paragraph, index) in content.Intro" :key="index">
          <component
            :is="getHtmlTag(paragraph.type, paragraph.level)"
            v-html="renderRichText(paragraph)"
            data-animate="reveal"
          />
        </div>
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
  return imageObj.url
}

const getHtmlTag = (type, level) => {
  if (type === 'heading') {
    return `h${level}`
  }
  return 'p'
}

const renderRichText = (paragraph) => {
  if (!paragraph.children) return ''
  
  return paragraph.children.map(child => {
    if (child.type === 'text') {
      let text = child.text
      // Apply formatting
      if (child.bold) text = `<strong>${text}</strong>`
      if (child.italic) text = `<em>${text}</em>`
      if (child.underline) text = `<u>${text}</u>`
      if (child.strikethrough) text = `<s>${text}</s>`
      return text
    }
    // Handle other node types like links, etc.
    if (child.type === 'link') {
      const linkText = child.children?.map(c => c.text).join('') || ''
      return `<a href="${child.url}" target="_blank">${linkText}</a>`
    }
    return child.text || ''
  }).join('')
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
      > div {
        overflow: hidden;
        padding-bottom: 4px;
      }
      
      & p {
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
      padding: var(--space-rg)!important;
    }
  }
}
</style>