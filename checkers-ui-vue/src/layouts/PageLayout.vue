<script setup lang="ts">
import LogoSection from '@/components/LogoSection.vue'
import NavSection from '@/components/NavSection.vue'
</script>

<template>
    <div class="page-layout">
        <header class="page-layout__header">
            <LogoSection />
            <NavSection />
        </header>
        <main class="page-layout__main">
            <slot />
        </main>
    </div>
</template>

<style lang="scss" scoped>
.page-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
    min-height: 0;
}

.page-layout__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1rem 0;
    flex-shrink: 0;
}

.page-layout__main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
    min-height: 0;
}
</style>
