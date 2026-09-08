<template>
  <div
    class="glass-card"
    :class="{ 'glass-card--interactive': interactive }"
    ref="cardRef"
    @mousemove="handleMove"
    @mouseleave="handleLeave"
  >
    <div class="glass-card__sheen" ref="sheenRef"></div>
    <slot />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  interactive: { type: Boolean, default: false },
})

const cardRef = ref(null)
const sheenRef = ref(null)

function handleMove(e) {
  const el = cardRef.value
  const sheen = sheenRef.value
  if (!el || !sheen) return
  const rect = el.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  sheen.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.10), transparent 55%)`
}

function handleLeave() {
  if (sheenRef.value) sheenRef.value.style.background = 'transparent'
}

defineExpose({ handleMove, handleLeave })
</script>

<style scoped>
.glass-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: transform 0.5s var(--ease-premium), border-color 0.5s;
}

.glass-card--interactive:hover {
  border-color: rgba(255, 255, 255, 0.22);
  transform: translateY(-4px);
}

.glass-card__sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: background 0.2s ease-out;
}
</style>
