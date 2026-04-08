<script setup lang="ts">
import { RULES_INTRO, RULES_SECTIONS } from '@/content/rules'
</script>

<template>
  <section class="rules-page" aria-labelledby="rules-title">
    <h1 id="rules-title" class="rules-page__title">Rules</h1>
    <p class="rules-page__intro">
      {{ RULES_INTRO }}
    </p>

    <section
      v-for="section in RULES_SECTIONS"
      :key="section.title"
      class="rules-page__section"
      :aria-label="section.title"
    >
      <h2 class="rules-page__section-title">{{ section.title }}</h2>
      <ul class="rules-page__list">
        <li v-for="point in section.points" :key="point" class="rules-page__item">
          {{ point }}
        </li>
      </ul>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.rules-page {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 0.25rem 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rules-page__title {
  margin: 0;
  font-family: $secondaryFont;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.rules-page__intro {
  margin: 0;
  line-height: 1.55;
  color: #2b2b2b;
}

.rules-page__section {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.rules-page__section-title {
  margin: 0;
  font-size: 1.1rem;
  font-family: $secondaryFont;
}

.rules-page__list {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.rules-page__item {
  line-height: 1.5;
}
</style>
