<template>
  <div class="section-title" ref="rootRef">
    <span class="eyebrow">{{ eyebrow }}</span>
    <h2>{{ title }}</h2>
    <p v-if="subtitle" class="section-title__subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})

const rootRef = ref(null)

onMounted(() => {
  const el = rootRef.value
  gsap.fromTo(
    el.children,
    { y: 28, opacity: 0, filter: 'blur(6px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%' },
    }
  )
})
</script>

<style scoped>
.section-title {
  max-width: 640px;
  margin-bottom: 56px;
}

.section-title h2 {
  font-size: clamp(1.9rem, 4vw, 2.7rem);
}

.section-title__subtitle {
  margin-top: 14px;
  font-size: 1rem;
  color: var(--ink-2);
}
</style>
