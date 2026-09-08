<template>
  <section id="about" class="section about">
    <SectionTitle :eyebrow="tr(ui.about.eyebrow)" :title="tr(ui.about.title)" />

    <div class="about__grid">
      <GlassCard class="about__core" ref="coreRef">
        <p class="about__summary">{{ tr(profile.summary) }}</p>
        <div class="about__meta">
          <div>
            <span class="about__meta-label">{{ tr(ui.about.location) }}</span>
            <span class="about__meta-value">{{ profile.location }}</span>
          </div>
          <div>
            <span class="about__meta-label">{{ tr(ui.about.focus) }}</span>
            <span class="about__meta-value">{{ tr(ui.about.focusValue) }}</span>
          </div>
        </div>
      </GlassCard>

      <div class="about__stats">
        <StatCard v-for="stat in profile.stats" :key="tr(stat.label)" :value="stat.value" :label="tr(stat.label)" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SectionTitle from '../common/SectionTitle.vue'
import GlassCard from '../common/GlassCard.vue'
import StatCard from './StatCard.vue'
import { profile } from '../../data/profile'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

gsap.registerPlugin(ScrollTrigger)

const { tr } = useLocale()

const coreRef = ref(null)

onMounted(() => {
  gsap.fromTo(
    coreRef.value.$el,
    { y: 40, opacity: 0, rotateX: 6 },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: coreRef.value.$el, start: 'top 85%' },
    }
  )
})
</script>

<style scoped>
.about__grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 28px;
  align-items: start;
}

@media (max-width: 860px) {
  .about__grid {
    grid-template-columns: 1fr;
  }
}

.about__core {
  padding: 40px;
}

.about__summary {
  font-size: 1.08rem;
  color: var(--ink-1);
}

.about__meta {
  display: flex;
  gap: 40px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.about__meta-label {
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-2);
  margin-bottom: 6px;
}

.about__meta-value {
  font-size: 0.95rem;
  color: var(--ink-0);
}

.about__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 500px) {
  .about__stats {
    grid-template-columns: 1fr;
  }
}
</style>
