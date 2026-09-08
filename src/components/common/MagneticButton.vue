<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="href && external ? '_blank' : undefined"
    :rel="href && external ? 'noopener noreferrer' : undefined"
    class="btn"
    :class="primary ? 'btn--primary' : ''"
    ref="btnRef"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <slot />
  </component>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

defineProps({
  href: { type: String, default: '' },
  external: { type: Boolean, default: false },
  primary: { type: Boolean, default: false },
})

const btnRef = ref(null)

function onMove(e) {
  const el = btnRef.value
  if (!el || window.matchMedia('(pointer: coarse)').matches) return
  const rect = el.getBoundingClientRect()
  const relX = e.clientX - rect.left - rect.width / 2
  const relY = e.clientY - rect.top - rect.height / 2
  gsap.to(el, { x: relX * 0.25, y: relY * 0.35, duration: 0.4, ease: 'power3.out' })
}

function onLeave() {
  gsap.to(btnRef.value, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
}
</script>
