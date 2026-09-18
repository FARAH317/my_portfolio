<template>
  <div class="carousel">
    <div class="carousel__stage" @wheel.prevent="onWheel" @pointerdown="onPointerDown">
      <div
        v-for="(cert, i) in certificates"
        :key="cert.title + i"
        class="carousel__card glass-panel"
        :style="cardStyle(i)"
      >
        <div class="carousel__image" v-if="cert.image" @click="openLightbox(cert)">
          <img :src="cert.image" :alt="cert.title" draggable="false" />
          <span class="carousel__zoom">{{ tr(ui.certificates.zoom) }}</span>
        </div>
        <div class="carousel__image carousel__image--placeholder" v-else>
          <span>{{ cert.organization }}</span>
        </div>
        <div class="carousel__info">
          <h3>{{ cert.title }}</h3>
          <p class="carousel__org">{{ cert.organization }} · {{ tr(cert.date) }}</p>
          <div class="carousel__skills">
            <span class="pill" v-for="(s, si) in cert.skills" :key="si">{{ tr(s) }}</span>
          </div>
          <a v-if="cert.credentialUrl" :href="cert.credentialUrl" target="_blank" rel="noopener noreferrer" class="carousel__link">
            {{ tr(ui.certificates.viewCredential) }}
          </a>
        </div>
      </div>
    </div>

    <div class="carousel__controls">
      <button @click="prev" aria-label="Précédent">←</button>
      <span class="carousel__progress">{{ String(active + 1).padStart(2, '0') }} / {{ String(certificates.length).padStart(2, '0') }}</span>
      <button @click="next" aria-label="Suivant">→</button>
    </div>

    <div class="carousel__dots">
      <button
        v-for="(c, i) in certificates"
        :key="i"
        class="carousel__dot"
        :class="{ active: i === active }"
        @click="goTo(i)"
      ></button>
    </div>

    <Teleport to="body">
      <div v-if="lightboxCert" class="lightbox" @click.self="closeLightbox">
        <button class="lightbox__close" @click="closeLightbox" aria-label="Fermer">✕</button>
        <figure class="lightbox__figure">
          <img :src="lightboxCert.image" :alt="lightboxCert.title" />
          <figcaption>{{ lightboxCert.title }} — {{ lightboxCert.organization }}</figcaption>
        </figure>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()

const props = defineProps({
  certificates: { type: Array, required: true },
})

const active = ref(0)
const lightboxCert = ref(null)
let wheelLock = false

function openLightbox(cert) {
  if (dragSuppressClick) return
  lightboxCert.value = cert
}
function closeLightbox() {
  lightboxCert.value = null
}
function handleKeydown(e) {
  if (e.key === 'Escape') closeLightbox()
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})


function next() {
  active.value = (active.value + 1) % props.certificates.length
}
function prev() {
  active.value = (active.value - 1 + props.certificates.length) % props.certificates.length
}
function goTo(i) {
  active.value = i
}

function onWheel(e) {
  if (wheelLock) return
  wheelLock = true
  if (e.deltaY > 0 || e.deltaX > 0) next()
  else prev()
  setTimeout(() => (wheelLock = false), 400)
}

// Drag-to-swipe (mouse + touch, via unified Pointer Events).
let dragging = false
let dragStartX = 0
let dragDelta = 0
let dragSuppressClick = false

function onPointerDown(e) {
  dragging = true
  dragDelta = 0
  dragStartX = e.clientX
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e) {
  if (!dragging) return
  dragDelta = e.clientX - dragStartX
}

function onPointerUp() {
  if (!dragging) return
  dragging = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)

  const threshold = 50
  if (dragDelta > threshold) prev()
  else if (dragDelta < -threshold) next()

  // Avoid the drag release being interpreted as a click on the certificate image.
  if (Math.abs(dragDelta) > 10) {
    dragSuppressClick = true
    setTimeout(() => (dragSuppressClick = false), 200)
  }
  dragDelta = 0
}

function cardStyle(i) {
  const total = props.certificates.length
  let offset = i - active.value
  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total

  const abs = Math.abs(offset)
  const translateX = offset * 62
  const rotateY = offset * -18
  const scale = 1 - abs * 0.14
  const blur = abs === 0 ? 0 : Math.min(abs * 3, 8)
  const opacity = abs > 2 ? 0 : 1 - abs * 0.28
  const z = 100 - abs

  return {
    transform: `translateX(${translateX}%) translateZ(${-abs * 120}px) rotateY(${rotateY}deg) scale(${scale})`,
    filter: `blur(${blur}px)`,
    opacity,
    zIndex: z,
    pointerEvents: abs === 0 ? 'auto' : 'none',
  }
}

defineExpose({ next, prev })
</script>

<style scoped>
.carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.carousel__stage {
  position: relative;
  width: 100%;
  height: 540px;
  perspective: 1400px;
  touch-action: none;
  cursor: grab;
  user-select: none;
}

.carousel__stage:active {
  cursor: grabbing;
}

@media (max-width: 600px) {
  .carousel__stage {
    height: 460px;
  }
}

.carousel__card {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(560px, 88%);
  height: 100%;
  margin-left: calc(min(560px, 88%) / -2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease, filter 0.7s ease;
  transform-style: preserve-3d;
}

.carousel__image {
  position: relative;
  height: 66%;
  background: #05070a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
  overflow: hidden;
}

.carousel__image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.carousel__zoom {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  color: var(--ink-0);
  background: rgba(5, 7, 10, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.15);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.carousel__image:hover .carousel__zoom {
  opacity: 1;
}

.carousel__image--placeholder {
  background: linear-gradient(135deg, rgba(79, 209, 255, 0.1), rgba(139, 124, 255, 0.1));
  cursor: default;
}

.carousel__image--placeholder span {
  color: var(--ink-2);
  font-family: var(--font-display);
}

.carousel__info {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.carousel__info h3 {
  font-size: 1.15rem;
}

.carousel__org {
  color: var(--ink-2);
  font-size: 0.85rem;
}

.carousel__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.carousel__link {
  margin-top: 8px;
  font-size: 0.85rem;
  color: var(--accent-blue);
}

.carousel__controls {
  display: flex;
  align-items: center;
  gap: 22px;
}

.carousel__controls button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
  color: var(--ink-0);
}

.carousel__progress {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--ink-2);
  letter-spacing: 0.05em;
}

.carousel__dots {
  display: flex;
  gap: 8px;
}

.carousel__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
}

.carousel__dot.active {
  background: var(--accent-blue);
  width: 18px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(3, 4, 6, 0.88);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  cursor: zoom-out;
}

.lightbox__figure {
  margin: 0;
  max-width: min(900px, 92vw);
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  cursor: default;
}

.lightbox__figure img {
  max-width: 100%;
  max-height: 78vh;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

.lightbox__figure figcaption {
  font-size: 0.85rem;
  color: var(--ink-1);
  text-align: center;
}

.lightbox__close {
  position: absolute;
  top: 24px;
  right: 28px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: var(--ink-0);
  font-size: 1rem;
}
</style>