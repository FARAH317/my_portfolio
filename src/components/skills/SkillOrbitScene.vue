<template>
  <canvas ref="canvasRef" class="orbit-scene" @click="handleClick" @mousemove="handleHover"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  categories: { type: Array, required: true },
  activeId: { type: String, default: null },
})
const emit = defineEmits(['select'])

const canvasRef = ref(null)
let renderer, scene, camera, animId, resizeObserver
let raycaster, mouse
const planetMeshes = []
let autoRotate = true
let userInteracting = false
let interactionTimeout

function buildScene(width, height) {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 1.6, 8)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Central core — strongest overall focus area
  const coreGeo = new THREE.SphereGeometry(0.7, 32, 32)
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 })
  scene.add(new THREE.Mesh(coreGeo, coreMat))

  const glowGeo = new THREE.SphereGeometry(0.9, 32, 32)
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x4fd1ff, transparent: true, opacity: 0.06 })
  scene.add(new THREE.Mesh(glowGeo, glowMat))

  // Orbiting category planets
  const orbitGroup = new THREE.Group()
  scene.add(orbitGroup)

  props.categories.forEach((cat, i) => {
    const angle = (i / props.categories.length) * Math.PI * 2
    const radius = 2.6 + (i % 2 === 0 ? 0 : 0.5)

    // Orbit ring (visual)
    const ringGeo = new THREE.RingGeometry(radius - 0.004, radius + 0.004, 128)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.15 : -0.1)
    orbitGroup.add(ring)

    const planetGeo = new THREE.IcosahedronGeometry(0.26, 1)
    const planetMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(cat.color), wireframe: true, transparent: true, opacity: 0.9 })
    const planet = new THREE.Mesh(planetGeo, planetMat)
    planet.userData = { id: cat.id, radius, angle, speed: 0.12 + i * 0.015, tiltAxis: i % 2 === 0 ? 0.15 : -0.1 }
    orbitGroup.add(planet)
    planetMeshes.push(planet)
  })

  scene.userData.orbitGroup = orbitGroup
}

function updatePositions(t) {
  planetMeshes.forEach((planet) => {
    const { radius, angle, speed, tiltAxis } = planet.userData
    const a = angle + t * speed
    planet.position.set(Math.cos(a) * radius, Math.sin(a * 0.6) * 0.3, Math.sin(a) * radius)
    planet.rotation.x = tiltAxis
    const isActive = planet.userData.id === props.activeId
    const targetScale = isActive ? 1.6 : 1
    planet.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })
}

function animate() {
  animId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  if (scene?.userData.orbitGroup && autoRotate) {
    scene.userData.orbitGroup.rotation.y += 0.0009
  }
  updatePositions(t)
  renderer.render(scene, camera)
}

function getMouseNDC(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
}

function handleClick(e) {
  getMouseNDC(e)
  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(planetMeshes)
  if (hits.length) {
    emit('select', hits[0].object.userData.id)
    pauseAutoRotate()
  }
}

function handleHover(e) {
  getMouseNDC(e)
  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObjects(planetMeshes)
  canvasRef.value.style.cursor = hits.length ? 'pointer' : 'grab'
}

function pauseAutoRotate() {
  autoRotate = false
  clearTimeout(interactionTimeout)
  interactionTimeout = setTimeout(() => (autoRotate = true), 4000)
}

function handleResize() {
  const el = canvasRef.value?.parentElement
  if (!el || !renderer || !camera) return
  const { width, height } = el.getBoundingClientRect()
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  const el = canvasRef.value.parentElement
  const { width, height } = el.getBoundingClientRect()
  buildScene(width, height)
  animate()

  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(el)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  clearTimeout(interactionTimeout)
  resizeObserver?.disconnect()
  renderer?.dispose()
})
</script>

<style scoped>
.orbit-scene {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
