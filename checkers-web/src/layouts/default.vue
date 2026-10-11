<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue'
import MainNav from '@/components/layout/MainNav.vue'
</script>

<template>
  <div class="page-layout">
    <div class="page-layout__left-column">
      <header class="page-layout__header">
        <AppLogo />
        <MainNav />
      </header>

      <aside v-if="$slots.sidebar" class="page-layout__sidebar">
        <slot name="sidebar" />
      </aside>
    </div>

    <main class="page-layout__main">
      <div class="page-layout__content">
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
  width: 100%;
  min-height: 0;
}

.page-layout__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.5rem;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
}

.page-layout__sidebar {
  width: 100%;
  padding: 0 1.5rem 1.5rem 1.5rem;
  box-sizing: border-box;
}

.page-layout__main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: auto;
}

.page-layout__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

@media (min-width: $breakpoint) {
  .page-layout {
    flex-direction: row;
    align-items: flex-start;
  }

  .page-layout__left-column {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: auto;
    min-width: auto;
  }

  .page-layout__header {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    min-width: auto;
    padding: 1.5rem;
    order: 1;
  }

  .page-layout__sidebar {
    order: 3;
    width: auto;
    flex-shrink: 0;
    padding: 1.5rem 1.5rem 1.5rem 0;
  }

  .page-layout__main {
    order: 2;
    flex: 1;
    align-items: stretch;
    justify-content: flex-start;
  }

  .page-layout__content {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;
    flex: 1;
  }
}
</style>
