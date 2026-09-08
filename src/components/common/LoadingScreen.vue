<template>
  <div class="loader" ref="loaderRef" v-if="visible">
    <svg class="loader__mark" viewBox="0 0 120 120" width="72" height="72">
      <polygon
        ref="polyRef"
        points="60,10 105,35 105,85 60,110 15,85 15,35"
        fill="none"
        stroke="url(#grad)"
        stroke-width="1.4"
      />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4fd1ff" />
          <stop offset="100%" stop-color="#8b7cff" />
        </linearGradient>
      </defs>
    </svg>
    <p class="loader__text" ref="textRef">{{ tr(ui.loader.line1) }}</p>
    <button class="loader__skip" @click="skip">{{ tr(ui.loader.skip) }}</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()

const emit = defineEmits(['done'])
const visible = ref(true)
const loaderRef = ref(null)
const polyRef = ref(null)
const textRef = ref(null)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const seenBefore = sessionStorage.getItem('portfolio-intro-seen')

function finish() {
  gsap.to(loaderRef.value, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    onComplete: () => {
      visible.value = false
      emit('done')
    },
  })
}

function skip() {
  gsap.killTweensOf('*')
  finish()
}

onMounted(() => {
  sessionStorage.setItem('portfolio-intro-seen', '1')

  if (reduced || seenBefore) {
    finish()
    return
  }

  const length = polyRef.value.getTotalLength()
  gsap.set(polyRef.value, { strokeDasharray: length, strokeDashoffset: length })

  const tl = gsap.timeline({ onComplete: finish })
  tl.to(polyRef.value, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
    .to(textRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
    .to({}, { duration: 0.6 })
    .call(() => (textRef.value.textContent = tr(ui.loader.line2)))
    .fromTo(textRef.value, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 })
    .to({}, { duration: 0.5 })
})
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  background: var(--bg-0);
}

.loader__text {
  opacity: 0;
  transform: translateY(6px);
  font-family: var(--font-display);
  font-size: 0.9rem;
  letter-spacing: 0.04em;
  color: var(--ink-2);
}

.loader__skip {
  position: absolute;
  bottom: 32px;
  right: 32px;
  background: transparent;
  border: none;
  color: var(--ink-2);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.loader__skip:hover {
  color: var(--ink-0);
}
</style>
