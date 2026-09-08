<template>
  <LoadingScreen @done="onLoaded" />

  <div class="app" :class="{ 'app--ready': ready }">
    <Navbar />

    <main>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <CertificatesSection />
      <GithubSection />
      <PhilosophySection />
      <ContactSection />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingScreen from './components/common/LoadingScreen.vue'
import Navbar from './components/navigation/Navbar.vue'
import HeroSection from './components/hero/HeroSection.vue'
import AboutSection from './components/about/AboutSection.vue'
import ExperienceSection from './components/experience/ExperienceSection.vue'
import SkillsSection from './components/skills/SkillsSection.vue'
import ProjectsSection from './components/projects/ProjectsSection.vue'
import CertificatesSection from './components/certificates/CertificatesSection.vue'
import GithubSection from './components/github/GithubSection.vue'
import PhilosophySection from './components/philosophy/PhilosophySection.vue'
import ContactSection from './components/contact/ContactSection.vue'
import Footer from './components/Footer.vue'
import { initLenis } from './composables/useLenis'
import { useLocale } from './composables/useLocale'

const { locale } = useLocale()
const ready = ref(false)

function onLoaded() {
  ready.value = true
  initLenis()
}

onMounted(() => {
  document.documentElement.setAttribute('lang', locale.value)

  // Fallback safety: if the loader event is somehow missed, still init scroll.
  setTimeout(() => {
    if (!ready.value) onLoaded()
  }, 4000)
})
</script>

<style>
.app {
  opacity: 0;
  transition: opacity 0.6s ease;
}

.app--ready {
  opacity: 1;
}

main {
  position: relative;
}
</style>
