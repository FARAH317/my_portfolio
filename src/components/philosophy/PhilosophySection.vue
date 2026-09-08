<template>
  <section class="section philosophy">
    <SectionTitle :eyebrow="tr(ui.philosophy.eyebrow)" :title="tr(ui.philosophy.title)" />

    <div class="philosophy__grid">
      <GlassCard
        v-for="(item, i) in profile.philosophy"
        :key="tr(item.title)"
        interactive
        class="philosophy__block"
        ref="blocksRef"
      >
        <span class="philosophy__index">0{{ i + 1 }}</span>
        <h3>{{ tr(item.title) }}</h3>
        <p>{{ tr(item.text) }}</p>
      </GlassCard>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SectionTitle from '../common/SectionTitle.vue'
import GlassCard from '../common/GlassCard.vue'
import { profile } from '../../data/profile'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

gsap.registerPlugin(ScrollTrigger)

const { tr } = useLocale()

const blocksRef = ref([])

onMounted(() => {
  blocksRef.value.forEach((block, i) => {
    gsap.fromTo(
      block.$el,
      { opacity: 0, y: 50 + i * 6 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.05,
        scrollTrigger: { trigger: block.$el, start: 'top 88%' },
      }
    )
  })
})
</script>

<style scoped>
.philosophy__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 960px) {
  .philosophy__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 560px) {
  .philosophy__grid {
    grid-template-columns: 1fr;
  }
}

.philosophy__block {
  padding: 30px 24px;
}

.philosophy__index {
  display: block;
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--accent-blue);
  margin-bottom: 16px;
}

.philosophy__block h3 {
  font-size: 1.05rem;
  margin-bottom: 10px;
}

.philosophy__block p {
  font-size: 0.88rem;
}
</style>
