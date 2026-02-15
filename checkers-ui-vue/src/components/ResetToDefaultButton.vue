<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'

const { resetToDefault } = useBoardStore()

const handleReset = () => {
  resetToDefault()
}
</script>

<template>
  <button class="btn" @click="handleReset">Reset</button>
</template>

<style lang="scss" scoped>
.btn {
  all: unset;
  cursor: pointer;
  border: none;

  &:hover {
    filter: brightness(1.2);
    transform: scale(1.02);
  }
}
</style>
