<template>
  <section id="hero" class="hero">
    <div class="hero__scene-wrap">
      <HeroScene />
    </div>

    <div class="hero__content">
      <p class="hero__hi" ref="hiRef">{{ tr(ui.hero.hi) }} {{ profile.firstName }}.</p>
      <h1 class="hero__title" ref="titleRef">
        <span class="line">{{ tr(ui.hero.titleLine1) }}</span>
        <span class="line hero__title--accent">{{ tr(ui.hero.titleLine2) }}</span>
      </h1>
      <p class="hero__tagline" ref="taglineRef">{{ tr(profile.tagline) }}</p>

      <div class="hero__ctas" ref="ctaRef">
        <MagneticButton primary @click="scrollToProjects">{{ tr(ui.hero.ctaExplore) }}</MagneticButton>
        <MagneticButton href="/CV_Lahcine_Farah.pdf" external>{{ tr(ui.hero.ctaResume) }}</MagneticButton>
      </div>

      <div class="hero__social" ref="socialRef">
        <a :href="profile.github" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span class="dot"></span>
        <a v-if="profile.linkedin" :href="profile.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <span class="dot" v-if="profile.linkedin"></span>
        <a :href="`mailto:${profile.email}`">Email</a>
      </div>
    </div>

    <div class="hero__scroll-cue">
      <span></span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import HeroScene from './HeroScene.vue'
import MagneticButton from '../common/MagneticButton.vue'
import { profile } from '../../data/profile'
import { scrollTo } from '../../composables/useLenis'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { tr } = useLocale()

const hiRef = ref(null)
const titleRef = ref(null)
const taglineRef = ref(null)
const ctaRef = ref(null)
const socialRef = ref(null)

function scrollToProjects() {
  const el = document.getElementById('projects')
  if (el) scrollTo(el)
}

onMounted(() => {
  const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })
  tl.fromTo(hiRef.value, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
    .fromTo(titleRef.value.children, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, '-=0.4')
    .fromTo(taglineRef.value, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
    .fromTo(ctaRef.value, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
    .fromTo(socialRef.value, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 0 24px;
}

.hero__scene-wrap {
  position: absolute;
  top: 0;
  right: -5%;
  width: 65%;
  height: 100%;
  pointer-events: none;
  mask-image: linear-gradient(90deg, transparent, black 30%);
}

@media (max-width: 900px) {
  .hero__scene-wrap {
    width: 100%;
    right: 0;
    opacity: 0.5;
    mask-image: linear-gradient(180deg, transparent, black 40%, black 70%, transparent);
  }
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
  padding-left: 2%;
}

.hero__hi {
  font-family: var(--font-display);
  color: var(--accent-blue);
  font-size: 1rem;
  margin-bottom: 18px;
}

.hero__title {
  display: flex;
  flex-direction: column;
  font-size: clamp(3rem, 9vw, 6.2rem);
  line-height: 0.95;
  font-weight: 700;
}

.hero__title .line {
  overflow: hidden;
}

.hero__title--accent {
  background: linear-gradient(120deg, var(--accent-blue), var(--accent-violet));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__tagline {
  margin-top: 28px;
  max-width: 480px;
  font-size: 1.05rem;
  color: var(--ink-1);
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
}

.hero__social {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 44px;
  font-size: 0.85rem;
  color: var(--ink-2);
}

.hero__social a:hover {
  color: var(--ink-0);
}

.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--ink-2);
}

.hero__scroll-cue {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
}

.hero__scroll-cue span {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 6px;
  border-radius: 2px;
  background: var(--accent-blue);
  animation: scroll-cue 1.8s ease-in-out infinite;
}

@keyframes scroll-cue {
  0% { opacity: 1; top: 6px; }
  70% { opacity: 0; top: 18px; }
  100% { opacity: 0; top: 6px; }
}
</style>
