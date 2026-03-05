<script setup lang="ts">
import Board from '@/components/BoardComponent.vue'
import EvaluationContainer from '@/components/EvaluationContainer.vue'
import PieceToolbox from '@/components/PieceToolbox.vue'
import PageLayout from '@/layouts/PageLayout.vue'
</script>

<template>
  <PageLayout>
    <div class="analysis-page">
      <div class="analysis-page__board-col">
        <Board context="analysis" />
      </div>
      <aside class="analysis-page__side">
        <EvaluationContainer />
        <PieceToolbox />
      </aside>
    </div>
  </PageLayout>
</template>

<style lang="scss" scoped>
.analysis-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: inherit;
  width: 100%;
  box-sizing: border-box;
}

.analysis-page__board-col {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
}

.analysis-page__side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
}

@media (min-width: 900px) {
  .analysis-page {
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
  }

  .analysis-page__board-col {
    flex: 1;
    justify-content: center;
    min-width: 0;
  }

  .analysis-page__side {
    flex-shrink: 0;
    flex-direction: column;
    align-items: flex-end;
    width: auto;
  }
}
</style>
