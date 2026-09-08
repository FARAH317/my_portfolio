<template>
  <GlassCard class="terminal">
    <div class="terminal__bar">
      <span></span><span></span><span></span>
      <span class="terminal__title">farah@dev — zsh</span>
    </div>
    <div class="terminal__body" ref="bodyRef">
      <p v-for="(line, i) in visibleLines" :key="i">
        <span v-if="line.prompt" class="terminal__prompt">$ </span>{{ tr(line.text) }}
      </p>
      <span class="terminal__cursor" v-if="!done">▌</span>
    </div>
  </GlassCard>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GlassCard from '../common/GlassCard.vue'
import { useLocale } from '../../composables/useLocale'

const { tr } = useLocale()

const lines = [
  { prompt: true, text: 'whoami' },
  { prompt: false, text: { fr: 'Lahcine Farah — Ingénieure Logicielle', en: 'Lahcine Farah — Software Engineer' } },
  { prompt: true, text: 'role' },
  { prompt: false, text: { fr: 'Développeuse Full-Stack', en: 'Full-Stack Developer' } },
  { prompt: true, text: 'currently-building' },
  { prompt: false, text: { fr: 'Des produits qui résolvent de vrais problèmes', en: 'Products that solve real problems' } },
  { prompt: true, text: 'stack' },
  { prompt: false, text: 'React · Django · PostgreSQL' },
]

const visibleLines = ref([])
const done = ref(false)
const bodyRef = ref(null)

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    visibleLines.value = lines
    done.value = true
    return
  }
  let i = 0
  const interval = setInterval(() => {
    visibleLines.value.push(lines[i])
    i++
    if (i >= lines.length) {
      clearInterval(interval)
      done.value = true
    }
  }, 320)
})
</script>

<style scoped>
.terminal {
  overflow: hidden;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

.terminal__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal__bar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.terminal__title {
  margin-left: 10px;
  font-size: 0.75rem;
  color: var(--ink-2);
  font-family: var(--font-body);
}

.terminal__body {
  padding: 22px 24px;
  min-height: 220px;
  font-size: 0.88rem;
  line-height: 1.9;
  color: var(--ink-1);
}

.terminal__prompt {
  color: var(--accent-blue);
}

.terminal__cursor {
  color: var(--accent-blue);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
</style>