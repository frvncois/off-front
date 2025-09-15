<template>
  <section ref="sectionRef">
    <div class="projects is-wrap">
      <div class="is-title">
        <div class="is-track">
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
        </div>
        <div class="is-track">
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
          <h1>Projets<span>Réalisé</span></h1>
        </div>
        <div class="is-action">
          <router-link to="/projects">-></router-link>
        </div>
      </div>
      <div class="is-items" ref="itemsRef">
        <router-link 
          :to="`/project/${project.id}`" 
          v-if="projects && projects.length"
          v-for="project in projects"
          :key="project.id"
          class="is-item"
        >
          <div class="is-cover">
            <img
              v-if="project.Cover"
              :src="project.Cover.url"
              :alt="project.Title"
            />
          </div>
          <div class="is-details">
            <h2>{{ project.Title }}</h2>
            <h3>{{ project.Location }}</h3>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps, ref, onMounted, onUnmounted } from 'vue'

defineProps({
  projects: {
    type: Array,
    default: () => []
  }
})

const sectionRef = ref(null)
const itemsRef = ref(null)

const handleScroll = () => {
  if (!sectionRef.value || !itemsRef.value) return
  
  const sectionRect = sectionRef.value.getBoundingClientRect()
  const sectionHeight = sectionRef.value.offsetHeight
  const windowHeight = window.innerHeight
  
  const scrollStart = -sectionRect.top
  const scrollEnd = sectionHeight - windowHeight
  const scrollProgress = Math.max(0, Math.min(1, scrollStart / scrollEnd))
  
  const translateX = scrollProgress * -58
  itemsRef.value.style.transform = `translateX(${translateX}%)`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial call
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
section {
  height: 200vh;
}

.projects {
  &.is-wrap {
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    width: 100vw;
    overflow: hidden;
    height: 100vh;
    
    > .is-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      > .is-track {
        display: flex;
        font-size: var(--font-xl);
        text-transform: uppercase;
        
        & h1 {
          line-height: 0.9;
        }
        
        & span {
          font-family: 'serif';
        }
      }
      
      > .is-action {
        display: flex;
        
        a {
          padding: var(--space-md);
        }
      }
    }
    
    > .is-items {
      display: flex;
      flex: 1;
      padding-left: var(--space-lg);
      padding-bottom: var(--space-md);
      flex-wrap: nowrap;
      width: 200vw;
      transition: transform 0.1s ease-out;
      
      > .is-item {
        display: flex;
        flex-direction: column;
        padding: var(--space-rg);
        gap: var(--space-rg);
        width: 22vw;
        flex: 1;
        
        & .is-cover {
          position: relative;
          height: 100%;
          overflow: hidden;
          flex: 1;
          
          & img {
            position: absolute;
            object-fit: cover;
            height: 100%;
            width: 100%;
          }
        }
        
        & h2 {
          text-transform: uppercase;
        }
        
        & h3 {
          font-family: 'serif';
        }
      }
    }
  }
}

@media screen and (max-width: 1120px) {
  .projects {
    &.is-wrap {
      > .is-items {
        width: 400vw;
        padding-left: var(--space-rg);
        padding-right: 0
      }
    }
  }
}
</style>
