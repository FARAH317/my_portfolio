import { ref, onMounted, onUnmounted } from 'vue'

export function useReducedMotion() {
  const prefersReduced = ref(false)

  let mql
  const handler = (e) => (prefersReduced.value = e.matches)

  onMounted(() => {
    mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReduced.value = mql.matches
    mql.addEventListener('change', handler)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', handler)
  })

  return { prefersReduced }
}
