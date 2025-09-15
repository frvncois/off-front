<template>
  <section>
    <ul class="gallery is-items">
      <li v-for="(image, index) in project?.Gallery"
          :key="image.id"
          class="is-item">
        <span>({{ String(index + 2).padStart(2, '0') }})</span>
        <img
          :src="image.url"
          :alt="image.name"
        />
      </li>
    </ul>
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
</script>

<style scoped>
.gallery {
    &.is-items {
        display: flex;
        flex-direction: column;
        padding: var(--space-rg);
        > .is-item {
            display: flex;
            flex-direction: column;
            gap: var(--space-rg);
            &:first-child {
                width: 100%;
                height: 80vh;
                overflow: hidden;
                margin-bottom: var(--space-md);
            }
            &:nth-child(2) {
                width: 20vw;
                margin-left: var(--space-lg);
            }
            &:nth-child(3) {
                width: 20vw;
                margin-left: auto;
                margin-right: var(--space-lg);
            }
            &:nth-child(4) {
                width: 20vw;
                margin-left: var(--space-lg);
            }
            &:nth-child(5) {
                width: 20vw;
                margin-left: auto;
                margin-right: var(--space-lg);
            }
            &:last-child {
                width: 100%;
                height: 80vh;
                overflow: hidden;
                margin-top: var(--space-lg);
                margin-bottom: var(--space-md);
            }
        }
        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

@media screen and (max-width: 1120px) {
  .gallery {
    &.is-items {
        display: flex;
        flex-direction: column;
        padding: var(--space-rg);
        gap: var(--space-rg);
        > .is-item {
            display: flex;
            flex-direction: column;
            gap: var(--space-rg);
            width: unset!important;
            margin: unset!important;
        }
      }
    }
}
</style>