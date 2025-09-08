<template>
  <section>
    <div class="stats is-wrap">
      <div class="is-content">
        <div class="is-item">
          <h1>{{ getStatText(content?.Stats01?.[0]) }}</h1>
          <h2>{{ getStatText(content?.Stats01?.[1]) }}</h2>
          <h3>{{ getStatText(content?.Stats01?.[2]) }}</h3>
        </div>
        <div class="is-item">
          <h1>{{ getStatText(content?.Stats02?.[0]) }}</h1>
          <h2>{{ getStatText(content?.Stats02?.[1]) }}</h2>
          <h3>{{ getStatText(content?.Stats02?.[2]) }}</h3>
        </div>
        <div class="is-item">
          <h1>{{ getStatText(content?.Stats03?.[0]) }}</h1>
          <h2>{{ getStatText(content?.Stats03?.[1]) }}</h2>
          <h3>{{ getStatText(content?.Stats03?.[2]) }}</h3>
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

const getStatText = (stat) => {
  if (stat?.children?.[0]?.text) {
    return stat.children[0].text
  }
  return ''
}
</script>

<style scoped>
.stats {
    &.is-wrap {
        padding: var(--space-lg);
        > .is-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-lg);
            > .is-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: var(--space-rg);
                text-align: center;
                > h1 {
                    font-size: var(--font-xl);
                }
                > h2 {
                    font-size: var(--font-xl);
                    font-family: 'serif';
                }
                > h3 {
                    font-size: var(--font-rg);
                }
                &:first-child {
                    grid-column: span 2;
                    > h1 {
                        font-size: var(--font-rg);
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 1120px) {
  .stats {
    &.is-wrap {
      padding: var(--space-rg);
      > .is-content {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>