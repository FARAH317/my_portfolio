<template>
  <GlassCard class="stat-card" interactive ref="cardRef">
    <span class="stat-card__value" ref="valueRef">0</span>
    <span class="stat-card__label">{{ label }}</span>
  </GlassCard>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import GlassCard from '../common/GlassCard.vue'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  value: { type: Number, required: true },
  label: { type: String, required: true },
})

const cardRef = ref(null)
const valueRef = ref(null)

onMounted(() => {
  const counter = { n: 0 }
  gsap.to(counter, {
    n: props.value,
    duration: 1.4,
    ease: 'power2.out',
    onUpdate: () => (valueRef.value.textContent = Math.round(counter.n)),
    scrollTrigger: { trigger: valueRef.value, start: 'top 88%', once: true },
  })
})
</script>

<style scoped>
.stat-card {
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
}

.stat-card__value {
  font-family: var(--font-display);
  font-size: 2.1rem;
  font-weight: 700;
  background: linear-gradient(120deg, var(--accent-blue), var(--accent-violet));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-card__label {
  font-size: 0.82rem;
  color: var(--ink-2);
}
</style>
