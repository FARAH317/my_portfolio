<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <a class="navbar__logo" href="#hero" @click.prevent="go('hero')">LF</a>

    <ul class="navbar__links">
      <li v-for="item in items" :key="item.id">
        <a
          href="#"
          :class="{ active: activeId === item.id }"
          @click.prevent="go(item.id)"
        >{{ tr(item.label) }}</a>
      </li>
    </ul>

    <div class="navbar__lang">
      <button :class="{ active: locale === 'fr' }" @click="setLocale('fr')">FR</button>
      <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
    </div>

    <button class="navbar__burger" @click="mobileOpen = true" aria-label="Ouvrir le menu">
      <span></span><span></span><span></span>
    </button>

    <transition name="fade">
      <div v-if="mobileOpen" class="navbar__mobile glass-panel">
        <button class="navbar__close" @click="mobileOpen = false" aria-label="Fermer">✕</button>
        <a
          v-for="item in items"
          :key="item.id"
          href="#"
          :class="{ active: activeId === item.id }"
          @click.prevent="go(item.id)"
        >{{ tr(item.label) }}</a>
        <div class="navbar__lang navbar__lang--mobile">
          <button :class="{ active: locale === 'fr' }" @click="setLocale('fr')">FR</button>
          <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { scrollTo } from '../../composables/useLenis'
import { useLocale } from '../../composables/useLocale'
import { ui } from '../../composables/i18n/ui'

const { locale, setLocale, tr } = useLocale()

const items = [
  { id: 'hero', label: ui.nav.home },
  { id: 'about', label: ui.nav.about },
  { id: 'experience', label: ui.nav.experience },
  { id: 'skills', label: ui.nav.skills },
  { id: 'projects', label: ui.nav.projects },
  { id: 'certificates', label: ui.nav.certificates },
  { id: 'contact', label: ui.nav.contact },
]

const scrolled = ref(false)
const activeId = ref('hero')
const mobileOpen = ref(false)
let observer

function go(id) {
  mobileOpen.value = false
  const el = document.getElementById(id)
  if (el) scrollTo(el)
}

function handleScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeId.value = entry.target.id
      })
    },
    { rootMargin: '-45% 0px -45% 0px' }
  )
  sections.forEach((s) => observer.observe(s))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  observer?.disconnect()
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 12px 22px;
  border-radius: 999px;
  background: rgba(8, 10, 15, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: background 0.5s ease, box-shadow 0.5s ease, padding 0.5s ease;
}

.navbar--scrolled {
  background: rgba(8, 10, 15, 0.75);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  padding: 10px 22px;
}

.navbar__logo {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.02em;
  font-size: 0.95rem;
  color: var(--ink-0);
}

.navbar__links {
  display: flex;
  gap: 26px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__links a {
  font-size: 0.85rem;
  color: var(--ink-2);
  position: relative;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

.navbar__links a:hover {
  color: var(--ink-0);
}

.navbar__links a.active {
  color: var(--ink-0);
}

.navbar__links a.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-violet));
}

.navbar__lang {
  display: flex;
  gap: 4px;
  padding: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.navbar__lang button {
  border: none;
  background: transparent;
  color: var(--ink-2);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 5px 10px;
  border-radius: 999px;
  transition: all 0.25s ease;
}

.navbar__lang button.active {
  color: var(--bg-0);
  background: linear-gradient(120deg, var(--accent-blue), var(--accent-violet));
}

.navbar__burger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
}

.navbar__burger span {
  width: 18px;
  height: 1.5px;
  background: var(--ink-0);
}

@media (max-width: 768px) {
  .navbar__links {
    display: none;
  }
  .navbar__lang:not(.navbar__lang--mobile) {
    display: none;
  }
  .navbar__burger {
    display: flex;
  }
}

.navbar__mobile {
  position: fixed;
  top: 76px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px 24px;
}

.navbar__mobile a {
  font-size: 1.05rem;
  color: var(--ink-1);
}

.navbar__mobile a.active {
  color: var(--accent-blue);
}

.navbar__lang--mobile {
  align-self: flex-start;
  margin-top: 6px;
}

.navbar__close {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  color: var(--ink-2);
  font-size: 1rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
