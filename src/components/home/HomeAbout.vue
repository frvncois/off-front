<!-- src/components/home/HomeAbout.vue -->
<template>
  <section>
    <div class="about is-wrap">
      <div class="is-content">
        <p 
          v-for="(item, index) in content?.About" 
          :key="index"
        >
          <component
            :is="getHtmlTag(item.type, item.level)"
            v-html="getTextFromParagraph(item)"
          />
        </p>
      </div>
      <div class="is-action">
        <router-link to="/">
          Rejoignez-nous ->
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  }
})

const getTextFromParagraph = (paragraph) => {
  if (paragraph.children && paragraph.children[0]) {
    return paragraph.children[0].text
  }
  return ''
}

const getHtmlTag = (type, level) => {
  if (type === 'heading') {
    return `h${level}`
  }
  return 'p'
}


</script>

<style scoped>
.about {
  &.is-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    
    > .is-content {
      padding: var(--space-lg);
      
      > p {
        font-family: 'serif';
        font-size: var(--font-lg);
        text-align: center;
        transform: translateY(100%);
      }
    }
    
    > .is-action {
      transform: translateY(100%);
      
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-rg);
        font-size: var(--font-md);
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .about {
    &.is-wrap {
      gap: var(--space-md);
      > .is-content {
        padding: var(--space-rg);
      }
    }
  }
}
</style>