<template>
  <section id="certificates" class="section certificates">
    <SectionTitle
      :eyebrow="tr(ui.certificates.eyebrow)"
      :title="tr(ui.certificates.title)"
      :subtitle="tr(ui.certificates.subtitle)"
    />

    <CertificateCarousel v-if="certificates.length" :certificates="certificates" />

    <GlassCard v-else class="certificates__empty">
      <p>{{ tr(ui.certificates.empty) }}</p>
    </GlassCard>
  </section>
</template>

<script setup>
import SectionTitle from '../common/SectionTitle.vue'
import GlassCard from '../common/GlassCard.vue'
import CertificateCarousel from './CertificateCarousel.vue'
import { certificates } from '../../data/certificates'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()
</script>

<style scoped>
.certificates__empty {
  padding: 40px;
  text-align: center;
  max-width: 560px;
  margin: 0 auto;
}

.certificates__empty code {
  color: var(--accent-blue);
  font-size: 0.85rem;
}
</style>
