<template>
  <section>
    <div class="about is-wrap">
      <div class="is-details">
        <h3 v-if="project?.Value">{{ getValueText(project.Value[0]) }}</h3>
        <h4 v-if="project?.Collaboration">{{ project.Collaboration }}</h4>
      </div>
      <div class="is-thumbnail">
        <span>(01)</span>
        <img 
          v-if="project?.Cover" 
          :src="`http://localhost:1337${project.Cover.url}`" 
          :alt="project.Title"
        />
      </div>
      <div class="is-content">
        <p v-if="project?.Intro">{{ getIntroText(project.Intro[0]) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  project: {
    type: Object,
    default: () => ({})
  }
})

const getValueText = (valueItem) => {
  if (valueItem?.children?.[0]?.text) {
    return valueItem.children[0].text
  }
  return ''
}

const getIntroText = (introItem) => {
  if (introItem?.children?.[0]?.text) {
    return introItem.children[0].text
  }
  return ''
}
</script>

<style scoped>
.about {
    &.is-wrap {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: var(--space-rg);
        > .is-details {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }
        > .is-thumbnail {
            display: flex;
            flex-direction: column;
            gap: var(--space-rg);
            width: 20vw;
            margin-left: 25vw;
        }
        > .is-content {
            padding: var(--space-lg) 25vw;
            > p {
                font-size: var(--font-lg);
                font-family: 'serif';
            }
        }
    }
}

@media screen and (max-width: 1120px) {
  .about {
    &.is-wrap {
      gap: var(--space-rg);
      > .is-content {
        padding: 0;
        > p {
          font-size: var(--font-rg);
        }
      }
      > .is-thumbnail{
        margin-left:0;
        width: 100%;
      }
    }
  }
}
</style>