<template>
    <section>
        <div class="title is-wrap">
            <div class="is-header">
                <h1><span>Projets</span> Réalisés</h1>
            </div>
        </div>
    </section>
</template>

<style scoped>
.title {
    &.is-wrap {
        display: flex;
        align-items: flex-end;
        padding: var(--space-rg);
        height: 25vh;
        > .is-header h1 {
            display: flex;
            flex-direction: column;
            text-transform: uppercase;
            > span {
                font-family: 'serif';
            }
        }
    }
}
</style>