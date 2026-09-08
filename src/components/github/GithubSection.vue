<template>
  <section id="github" class="section github">
    <SectionTitle :eyebrow="tr(ui.github.eyebrow)" :title="tr(ui.github.title)" />

    <div class="github__grid">
      <DeveloperTerminal />

      <GlassCard class="github__card">
        <h3>{{ tr(ui.github.languages) }}</h3>
        <div class="github__langs">
          <span class="pill" v-for="l in languages" :key="l">{{ l }}</span>
        </div>
        <p class="github__note">
          {{ tr(ui.github.note) }}
        </p>
        <MagneticButton :href="profile.github" external primary>{{ tr(ui.github.viewProfile) }}</MagneticButton>
      </GlassCard>
    </div>
  </section>
</template>

<script setup>
import SectionTitle from '../common/SectionTitle.vue'
import GlassCard from '../common/GlassCard.vue'
import MagneticButton from '../common/MagneticButton.vue'
import DeveloperTerminal from './DeveloperTerminal.vue'
import { profile } from '../../data/profile'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()
const languages = ['Python', 'JavaScript', 'TypeScript', 'Apex', 'HTML/CSS']
</script>

<style scoped>
.github__grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 28px;
  align-items: stretch;
}

@media (max-width: 860px) {
  .github__grid {
    grid-template-columns: 1fr;
  }
}

.github__card {
  padding: 34px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.github__langs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.github__note {
  font-size: 0.9rem;
}
</style>
