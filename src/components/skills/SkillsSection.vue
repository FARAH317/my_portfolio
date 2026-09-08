<template>
  <section id="skills" class="section skills">
    <SectionTitle
      :eyebrow="tr(ui.skills.eyebrow)"
      :title="tr(ui.skills.title)"
      :subtitle="tr(ui.skills.subtitle)"
    />

    <div class="skills__layout">
      <div class="skills__scene glass-panel">
        <SkillCubeScene :categories="cubeCategories" :active-id="activeId" @select="setActive" />
      </div>

      <div class="skills__side">
        <div class="skills__chips">
          <button
            v-for="cat in cubeCategories"
            :key="cat.id"
            class="skills__chip"
            :class="{ active: activeId === cat.id }"
            :style="{ '--chip-color': cat.color }"
            @click="setActive(cat.id)"
          >
            {{ tr(cat.label) }}
          </button>
        </div>

        <transition name="panel-fade" mode="out-in">
          <SkillPanel :key="activeCategory.id" :category="activeCategory" />
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import SectionTitle from '../common/SectionTitle.vue'
import SkillCubeScene from './SkillCubeScene.vue'
import SkillPanel from './SkillPanel.vue'
import { skillCategories } from '../../data/skills'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()

// Le cube n'affiche que 5 faces techniques (+ 1 face identité) — Salesforce et Odoo
// restent dans les données (utilisées ailleurs, ex. section Projets) mais ne sont
// pas montrés dans ce widget pour l'instant.
const EXCLUDED_FROM_CUBE = ['salesforce', 'odoo']
const cubeCategories = computed(() => skillCategories.filter((c) => !EXCLUDED_FROM_CUBE.includes(c.id)))

const activeId = ref(cubeCategories.value[0].id)
const activeCategory = computed(() => cubeCategories.value.find((c) => c.id === activeId.value))

function setActive(id) {
  activeId.value = id
}
</script>

<style scoped>
.skills__layout {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 28px;
  align-items: stretch;
}

@media (max-width: 900px) {
  .skills__layout {
    grid-template-columns: 1fr;
  }
}

.skills__scene {
  height: 480px;
  overflow: hidden;
  position: relative;
}

@media (max-width: 600px) {
  .skills__scene {
    height: 360px;
  }
}

.skills__side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skills__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skills__chip {
  padding: 9px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--ink-2);
  font-size: 0.82rem;
  transition: all 0.3s ease;
}

.skills__chip.active {
  color: var(--ink-0);
  border-color: var(--chip-color);
  background: color-mix(in srgb, var(--chip-color) 15%, transparent);
}

.panel-fade-enter-active, .panel-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.panel-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
