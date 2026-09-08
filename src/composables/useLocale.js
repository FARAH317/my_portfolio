import { ref } from 'vue'

const STORAGE_KEY = 'portfolio-locale'

function detectDefault() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'fr' || saved === 'en') return saved
  } catch (e) {
    // localStorage unavailable — fall through to browser language detection
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

// Single shared reactive locale across the whole app.
const locale = ref(detectDefault())

function setLocale(l) {
  if (l !== 'fr' && l !== 'en') return
  locale.value = l
  try {
    localStorage.setItem(STORAGE_KEY, l)
  } catch (e) {
    // ignore write failures (private browsing, etc.)
  }
  document.documentElement.setAttribute('lang', l)
}

// Translate a bilingual value. Accepts either:
// - a plain string (returned as-is, for content that doesn't need translation
//   such as proper nouns, official certificate titles, tech names)
// - an object { fr: '...', en: '...' }
function tr(value) {
  if (value == null) return value
  if (typeof value === 'string') return value
  return value[locale.value] ?? value.fr ?? value.en ?? ''
}

export function useLocale() {
  return { locale, setLocale, tr }
}
