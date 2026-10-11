<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref<boolean>(false)
const VISIBLE_MS = 3500
let scrollTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined

const handleInteraction = () => {
  isVisible.value = true

  clearTimeout(scrollTimeoutId)
  scrollTimeoutId = setTimeout(() => {
    isVisible.value = false
  }, VISIBLE_MS)
}

onMounted(() => {
  document.addEventListener('wheel', handleInteraction, { passive: true, capture: true })
  document.addEventListener('touchmove', handleInteraction, { passive: true, capture: true })
})

onUnmounted(() => {
  document.removeEventListener('wheel', handleInteraction, { capture: true })
  document.removeEventListener('touchmove', handleInteraction, { capture: true })
  if (scrollTimeoutId) {
    clearTimeout(scrollTimeoutId)
  }
})
</script>

<template>
  <footer class="footer" :class="{ visible: isVisible }">
    <div class="footer-container">
      <a class="footer-link" href="https://github.com/ifmcjthenknczny/checkers-with-engine">
        ©2026 Maciej Konieczny
      </a>
    </div>
  </footer>
</template>

<style scoped>
p {
  margin: 0;
  display: block;
}

.footer-container {
  position: relative;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  color: white;
  text-align: center;
  font-weight: 200;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
  transform: translateY(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

footer.visible {
  transform: translateY(0);
}

.footer-link {
  font-size: 1rem;
}

a {
  font-family: 'Courier New', Courier, monospace;
  color: white;
  text-decoration: none;
}
</style>
