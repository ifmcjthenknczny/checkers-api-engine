<script lang="ts" setup>
import { useGameStore } from '@/stores/gameStore'
import ButtonComponent from './ButtonComponent.vue';

const gameStore = useGameStore()

function chooseColor(color: 'white' | 'black') {
  gameStore.chooseColor(color)
}
</script>

<template>
    <div class="container">
    <section class="question">choose your color</section>
    <section class="button-container button-container--question">
        <ButtonComponent
  color-variant="white"
  button-type="color"
  @click="chooseColor('white')">
    white
  </ButtonComponent>
<ButtonComponent
  color-variant="black"
  button-type="color"
  @click="chooseColor('black')">
    black
  </ButtonComponent>
    </section>
    </div>
</template>

<style lang="scss" scoped>
  .button-container {
    display: flex;
    flex-flow: row;

    &--question {
      font-family: $secondaryFont;
      justify-content: space-between;
    }

    &--game {
      width: $boardSizeHorizontal;
      justify-content: space-around;
    }
  }

  @media (max-width: 700px) {
    .button-container--game {
      width: $boardSizeVertical;
    }
  }
</style>