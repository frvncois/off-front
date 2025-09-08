<script setup lang="ts">
import LogoMain from '@/assets/LogoMain.vue';
</script>

<template>
    <header>
        <router-link to="/">
            <LogoMain/>
        </router-link>
        <nav>
            <router-link to="/projects">Nos projets</router-link>
            <router-link to="/contact">Contact</router-link>
        </nav>
    </header>
</template>

<style scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: var(--space-rg);
    z-index: 3;
}
nav {
    display: flex;
    gap: var(--space-rg);
    a {
        text-transform: uppercase;
        font-size: var(--font-rg);
    }
}
</style>