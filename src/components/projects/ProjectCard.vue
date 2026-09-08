<template>
  <article class="project" :class="{ 'project--featured': project.featured, 'project--reverse': reverse }" ref="rootRef">
    <div class="project__visual">
      <div class="project__browser glass-panel">
        <div class="project__browser-bar">
          <span></span><span></span><span></span>
        </div>
        <div class="project__screen">
          <template v-if="project.images?.length">
            <Transition name="project-image" mode="out-in">
              <img
                :key="project.images[activeImage]"
                :src="project.images[activeImage]"
                :alt="`${project.title} - capture ${activeImage + 1}`"
              />
            </Transition>

            <template v-if="project.images.length > 1">
              <div class="project__carousel-dots" aria-label="Progression des captures">
                <span
                  v-for="(_, imageIndex) in project.images"
                  :key="imageIndex"
                  class="project__carousel-dot"
                  :class="{ 'project__carousel-dot--active': imageIndex === activeImage }"
                ></span>
              </div>
            </template>
          </template>
          <div v-else class="project__placeholder">
            <span>{{ project.title }}</span>
            <small>{{ tr(ui.projects.screenshotSoon) }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="project__body">
      <span class="project__category">{{ tr(project.category) }}</span>
      <h3>{{ project.title }}</h3>
      <p>{{ tr(project.description) }}</p>
      <p class="project__long">{{ tr(project.longDescription) }}</p>

      <div class="project__stack">
        <span class="pill" v-for="t in project.stack" :key="t">{{ t }}</span>
      </div>

      <div class="project__links">
        <MagneticButton v-if="project.github" :href="project.github" external>{{ tr(ui.projects.viewCode) }}</MagneticButton>
        <MagneticButton v-if="project.demo" :href="project.demo" external primary>{{ tr(ui.projects.liveDemo) }}</MagneticButton>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import MagneticButton from '../common/MagneticButton.vue'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

gsap.registerPlugin(ScrollTrigger)

const { tr } = useLocale()

const props = defineProps({
  project: { type: Object, required: true },
  reverse: { type: Boolean, default: false },
})

const rootRef = ref(null)
const activeImage = ref(0)
let carouselInterval

function nextImage() {
  activeImage.value = (activeImage.value + 1) % props.project.images.length
}

onMounted(() => {
  const el = rootRef.value
  const visual = el.querySelector('.project__visual')
  const body = el.querySelector('.project__body')

  if (props.project.images?.length > 1) {
    carouselInterval = setInterval(nextImage, 4000)
  }

  gsap.fromTo(
    visual,
    { opacity: 0, y: 60, rotateY: props.reverse ? -6 : 6, scale: 0.96 },
    {
      opacity: 1, y: 0, rotateY: 0, scale: 1,
      duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    }
  )
  gsap.fromTo(
    body.children,
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 78%' },
    }
  )
})

onBeforeUnmount(() => {
  clearInterval(carouselInterval)
})
</script>

<style scoped>
.project {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 64px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  perspective: 1400px;
}

.project:last-child {
  border-bottom: none;
}

.project--reverse {
  direction: rtl;
}
.project--reverse > * {
  direction: ltr;
}

.project--featured {
  grid-template-columns: 1.3fr 1fr;
}

@media (max-width: 860px) {
  .project, .project--reverse {
    grid-template-columns: 1fr;
    direction: ltr;
    padding: 44px 0;
  }
}

.project__browser {
  overflow: hidden;
  transform-style: preserve-3d;
}

.project__browser-bar {
  display: flex;
  gap: 6px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.project__browser-bar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.project__screen {
  position: relative;
  aspect-ratio: 16 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(79, 209, 255, 0.08), rgba(139, 124, 255, 0.08));
}

.project__screen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.project-image-enter-active,
.project-image-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.project-image-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.project-image-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.project__carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  display: flex;
  gap: 7px;
  transform: translateX(-50%);
}

.project__carousel-dot {
  display: block;
  width: 7px;
  height: 7px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  background: transparent;
  transition: background 0.25s, transform 0.25s;
}

.project__carousel-dot--active {
  background: var(--accent-blue);
  transform: scale(1.25);
}

.project__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--ink-2);
  text-align: center;
  padding: 20px;
}

.project__placeholder span {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--ink-1);
}

.project__placeholder small {
  font-size: 0.75rem;
}

.project__category {
  font-size: 0.78rem;
  color: var(--accent-blue);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.project__body h3 {
  margin-top: 10px;
  font-size: 1.7rem;
}

.project__body p {
  margin-top: 14px;
}

.project__long {
  color: var(--ink-2);
  font-size: 0.92rem;
}

.project__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 22px;
}

.project__links {
  display: flex;
  gap: 14px;
  margin-top: 26px;
}
</style>
