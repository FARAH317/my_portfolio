<template>
  <GlassCard class="skill-panel">
    <div class="skill-panel__head">
      <span class="skill-panel__dot" :style="{ background: category.color }"></span>
      <h3>{{ tr(category.label) }}</h3>
    </div>
    <ul class="skill-panel__list">
      <li v-for="item in category.items" :key="item.name">
        <span>{{ item.name }}</span>
        <span class="skill-panel__level">{{ tr(item.level) }}</span>
      </li>
    </ul>
  </GlassCard>
</template>

<script setup>
import GlassCard from '../common/GlassCard.vue'
import { useLocale } from '../../composables/useLocale'

const { tr } = useLocale()

defineProps({
  category: { type: Object, required: true },
})
</script>

<style scoped>
.skill-panel {
  padding: 26px 26px 20px;
}

.skill-panel__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.skill-panel__head h3 {
  font-size: 1.05rem;
}

.skill-panel__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.skill-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-panel__list li {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--ink-1);
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.skill-panel__level {
  font-size: 0.75rem;
  color: var(--ink-2);
}
</style>
