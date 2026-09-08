<template>
  <section id="experience" class="section experience">
    <SectionTitle
      :eyebrow="tr(ui.experience.eyebrow)"
      :title="tr(ui.experience.title)"
      :subtitle="tr(ui.experience.subtitle)"
    />

    <div class="experience__track">
      <div class="experience__line"></div>

      <div
        v-for="(item, i) in experience"
        :key="item.company"
        class="experience__item"
        :class="{ 'experience__item--current': item.current }"
        ref="itemsRef"
      >
        <div class="experience__node"></div>
        <GlassCard class="experience__card" interactive>
          <div class="experience__card-head">
            <div>
              <h3>{{ tr(item.role) }}</h3>
              <span class="experience__company">{{ item.company }}</span>
            </div>
            <span class="experience__dates">{{ tr(item.startDate) }} – {{ tr(item.endDate) }}</span>
          </div>

          <ul class="experience__achievements">
            <li v-for="a in item.achievements" :key="tr(a)">{{ tr(a) }}</li>
          </ul>

          <div class="experience__tech">
            <span class="pill" v-for="t in item.technologies" :key="tr(t)">{{ tr(t) }}</span>
          </div>
        </GlassCard>
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
import { experience } from '../../data/experience'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

gsap.registerPlugin(ScrollTrigger)

const { tr } = useLocale()

const itemsRef = ref([])

onMounted(() => {
  itemsRef.value.forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: i % 2 === 0 ? -40 : 40, z: -80 },
      {
        opacity: 1,
        x: 0,
        z: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      }
    )
  })
})
</script>

<style scoped>
.experience__track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 48px;
  padding-left: 28px;
}

.experience__line {
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(180deg, var(--accent-blue), rgba(255, 255, 255, 0.05));
}

.experience__item {
  position: relative;
}

.experience__node {
  position: absolute;
  left: -28px;
  top: 30px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--bg-0);
  border: 2px solid var(--accent-blue);
}

.experience__item--current .experience__node {
  background: var(--accent-blue);
  box-shadow: 0 0 0 6px rgba(79, 209, 255, 0.15);
}

.experience__card {
  padding: 30px 32px;
}

.experience__item--current .experience__card {
  border-color: rgba(79, 209, 255, 0.35);
}

.experience__card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.experience__card-head h3 {
  font-size: 1.15rem;
}

.experience__company {
  display: block;
  font-size: 0.85rem;
  color: var(--accent-blue);
  margin-top: 4px;
}

.experience__dates {
  font-size: 0.8rem;
  color: var(--ink-2);
  white-space: nowrap;
}

.experience__achievements {
  margin: 0 0 18px;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.experience__achievements li {
  font-size: 0.92rem;
  color: var(--ink-1);
}

.experience__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
