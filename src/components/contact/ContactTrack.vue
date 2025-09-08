<template>
    <section>
        <div class="track is-wrap">
            <div class="is-item">
                STUDIOOFF
            </div>
        </div>
    </section>
</template>

<style scoped>
.track {
    &.is-wrap {
        position: fixed;
        inset: 0;
        z-index: -1;
        > .is-item {
            font-size: var(--font-3xl);
            font-family: 'Serif';
            opacity: 0.1;
        }
    }
}
</style>