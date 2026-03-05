<template>
  <NuxtLayout>
    <main>
      <NuxtPage />
    </main>
  </NuxtLayout>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Cousine:ital,wght@0,400;0,700;1,400&display=swap');

html {
  font-family: $globalFont;
  font-size: clamp(10px, $nameSquareSizeVertical, 20px);
}

body {
  display: flex;
  flex-flow: column;
  /* Obrazek z public/what-the-hex.png – jeśli dodasz plik, odkomentuj linię poniżej i usuń background-color */
  /* background-image: url('/what-the-hex.png'); */
  background-color: #e8e8e8;
  min-height: 100vh;
  overflow: hidden;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  width: 100%;
  min-height: 0;
}

@media (min-width: $breakpoint) {
  html {
    font-size: 20px;
  }
}
</style>
