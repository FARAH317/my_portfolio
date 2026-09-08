import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  // Normalized -1..1 range, centered on viewport
  const x = ref(0)
  const y = ref(0)

  function handleMove(e) {
    x.value = (e.clientX / window.innerWidth) * 2 - 1
    y.value = -(e.clientY / window.innerHeight) * 2 + 1
  }

  onMounted(() => window.addEventListener('mousemove', handleMove, { passive: true }))
  onUnmounted(() => window.removeEventListener('mousemove', handleMove))

  return { x, y }
}
