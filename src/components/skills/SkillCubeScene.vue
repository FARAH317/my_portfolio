<template>
  <canvas
    ref="canvasRef"
    class="cube-scene"
    @pointermove="handlePointerMove"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerUp"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'
import { useLocale } from '../../composables/useLocale'

const { tr, locale } = useLocale()

const props = defineProps({
  categories: { type: Array, required: true }, // expects exactly 5 categories
  activeId: { type: String, default: null },
})
const emit = defineEmits(['select'])

const canvasRef = ref(null)
let renderer, scene, camera, animId, resizeObserver
let raycaster, mouse
let cubeGroup, cubeMesh
const faces = [] // { id, category, materialIndex, overlay, targetEuler }

let autoRotate = true
let isDragging = false
let dragMoved = false
let dragStartX = 0, dragStartY = 0
let dragStartRotX = 0, dragStartRotY = 0
let hoveredIndex = null
let interactionTimeout
let mouseNDCx = 0, mouseNDCy = 0

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// BoxGeometry material group order: [+x, -x, +y, -y, +z, -z]
const FACE_NORMALS = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
]

// Absolute (not relative) target euler that brings each face to front (+z, facing camera)
const FACE_TARGET_EULER = [
  { x: 0, y: -Math.PI / 2, z: 0 }, // +x
  { x: 0, y: Math.PI / 2, z: 0 }, // -x
  { x: Math.PI / 2, y: 0, z: 0 }, // +y
  { x: -Math.PI / 2, y: 0, z: 0 }, // -y
  { x: 0, y: 0, z: 0 }, // +z
  { x: 0, y: Math.PI, z: 0 }, // -z
]

function createFaceCanvas(category, isIdentity = false) {
  const canvas = document.createElement('canvas')
  const size = 512
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // background
  ctx.fillStyle = '#0b0e14'
  ctx.fillRect(0, 0, size, size)

  // subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  for (let i = 0; i <= size; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(size, i); ctx.stroke()
  }

  const color = category?.color || '#4fd1ff'

  // border
  ctx.strokeStyle = color
  ctx.lineWidth = 6
  ctx.strokeRect(10, 10, size - 20, size - 20)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.strokeRect(22, 22, size - 44, size - 44)

  if (isIdentity) {
    ctx.textAlign = 'center'
    ctx.fillStyle = '#eaf6ff'
    ctx.font = '700 96px "Space Grotesk", sans-serif'
    ctx.shadowColor = color
    ctx.shadowBlur = 30
    ctx.fillText('</>', size / 2, size / 2 - 20)
    ctx.shadowBlur = 0
    ctx.font = '500 26px "Manrope", sans-serif'
    ctx.fillStyle = '#8890a3'
    ctx.fillText('Lahcine Farah', size / 2, size / 2 + 60)
    ctx.font = '400 20px "Manrope", sans-serif'
    ctx.fillText(tr({ fr: 'Ingénieure Logicielle', en: 'Software Engineer' }), size / 2, size / 2 + 92)
  } else {
    ctx.textAlign = 'left'
    ctx.fillStyle = color
    ctx.font = '700 40px "Space Grotesk", sans-serif'
    ctx.fillText(tr(category.label), 48, 100)

    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(48, 122); ctx.lineTo(180, 122); ctx.stroke()

    ctx.font = '500 30px "Manrope", sans-serif'
    ctx.fillStyle = '#eaf6ff'
    category.items.slice(0, 5).forEach((item, i) => {
      const y = 190 + i * 56
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(58, y - 10, 5, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#eaf6ff'
      ctx.fillText(item.name, 80, y)
    })
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function buildScene(width, height) {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0, 7.5)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  cubeGroup = new THREE.Group()
  scene.add(cubeGroup)

  // Map: face slot 0..4 = categories, slot 5 = identity.
  // Order assigned to BoxGeometry groups [+x,-x,+y,-y,+z,-z]:
  // +x Databases, -x Automation, +y Identity, -y Tools, +z Frontend, -z Backend
  const byId = Object.fromEntries(props.categories.map((c) => [c.id, c]))
  const slotCategory = [
    byId.databases, // +x
    byId.automation, // -x
    null, // +y -> identity
    byId.tools, // -y
    byId.frontend, // +z (front, initial view)
    byId.backend, // -z
  ]

  const materials = slotCategory.map((cat, i) => {
    const isIdentity = cat === null
    const texture = createFaceCanvas(cat, isIdentity)
    return new THREE.MeshBasicMaterial({ map: texture })
  })

  const geo = new THREE.BoxGeometry(2.6, 2.6, 2.6)
  cubeMesh = new THREE.Mesh(geo, materials)
  cubeGroup.add(cubeMesh)

  // highlight overlays (one thin plane per face, slightly offset outward)
  const overlayGeo = new THREE.PlaneGeometry(2.62, 2.62)
  slotCategory.forEach((cat, i) => {
    const isIdentity = cat === null
    const color = isIdentity ? 0xffffff : cat.color
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const overlay = new THREE.Mesh(overlayGeo, mat)
    const normal = FACE_NORMALS[i]
    overlay.position.copy(normal.clone().multiplyScalar(1.31))
    overlay.lookAt(normal.clone().multiplyScalar(2.62))
    cubeGroup.add(overlay)

    faces.push({
      id: isIdentity ? '__identity__' : cat.id,
      category: cat,
      materialIndex: i,
      overlay,
      targetEuler: FACE_TARGET_EULER[i],
    })
  })

  // ambient particles
  if (!reduced) {
    const count = 120
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3
    }
    const pgeo = new THREE.BufferGeometry()
    pgeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const pmat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.016, transparent: true, opacity: 0.28 })
    scene.add(new THREE.Points(pgeo, pmat))
  }

  // gentle initial tilt so more than one face is visible at rest
  cubeGroup.rotation.x = -0.18
  cubeGroup.rotation.y = 0.35
}

function rebuildFaceTextures() {
  if (!cubeMesh) return
  faces.forEach((f) => {
    const isIdentity = f.id === '__identity__'
    const texture = createFaceCanvas(f.category, isIdentity)
    const mat = cubeMesh.material[f.materialIndex]
    mat.map?.dispose()
    mat.map = texture
    mat.needsUpdate = true
  })
}

function normalizeAngle(a) {
  const twoPi = Math.PI * 2
  return ((a % twoPi) + twoPi) % twoPi > Math.PI ? ((a % twoPi) - twoPi) : (a % twoPi)
}

function snapToFace(face) {
  // normalize current rotation to avoid huge multi-turn tweens
  cubeGroup.rotation.x = normalizeAngle(cubeGroup.rotation.x)
  cubeGroup.rotation.y = normalizeAngle(cubeGroup.rotation.y)

  gsap.to(cubeGroup.rotation, {
    x: face.targetEuler.x,
    y: face.targetEuler.y,
    z: face.targetEuler.z,
    duration: 0.9,
    ease: 'power3.inOut',
  })
}

function animate() {
  animId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  if (autoRotate && !isDragging) {
    cubeGroup.rotation.y += 0.0032
  }

  // subtle parallax
  camera.position.x += (mouseNDCx * 0.6 - camera.position.x) * 0.04
  camera.position.y += (mouseNDCy * 0.4 - camera.position.y) * 0.04
  camera.lookAt(0, 0, 0)

  // update overlays opacity toward target
  faces.forEach((f) => {
    const isActive = f.id === props.activeId || (f.id === '__identity__' && false)
    const isHovered = faces.indexOf(f) === hoveredIndex
    const target = isActive ? 0.22 : isHovered ? 0.14 : 0
    f.overlay.material.opacity += (target - f.overlay.material.opacity) * 0.15
  })

  renderer.render(scene, camera)
}

function getNDC(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  return mouse
}

function pickFace(e) {
  getNDC(e)
  raycaster.setFromCamera(mouse, camera)
  const hits = raycaster.intersectObject(cubeMesh)
  if (!hits.length) return null
  const materialIndex = hits[0].face.materialIndex
  return faces.find((f) => f.materialIndex === materialIndex) || null
}

function handlePointerMove(e) {
  mouseNDCx = (e.clientX / window.innerWidth) * 2 - 1
  mouseNDCy = -((e.clientY / window.innerHeight) * 2 - 1)

  if (isDragging) {
    const dx = e.clientX - dragStartX
    const dy = e.clientY - dragStartY
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragMoved = true
    cubeGroup.rotation.y = dragStartRotY + dx * 0.008
    cubeGroup.rotation.x = dragStartRotX + dy * 0.008
    canvasRef.value.style.cursor = 'grabbing'
    return
  }

  const hit = pickFace(e)
  hoveredIndex = hit ? faces.indexOf(hit) : null
  canvasRef.value.style.cursor = hit ? 'pointer' : 'grab'
}

function handlePointerDown(e) {
  isDragging = true
  dragMoved = false
  dragStartX = e.clientX
  dragStartY = e.clientY
  dragStartRotX = cubeGroup.rotation.x
  dragStartRotY = cubeGroup.rotation.y
  pauseAutoRotate()
}

function handlePointerUp(e) {
  if (isDragging && !dragMoved) {
    const hit = pickFace(e)
    if (hit && hit.id !== '__identity__') {
      emit('select', hit.id)
      snapToFace(hit)
      pauseAutoRotate()
    }
  }
  isDragging = false
}

function pauseAutoRotate() {
  autoRotate = false
  clearTimeout(interactionTimeout)
  interactionTimeout = setTimeout(() => (autoRotate = true), 5000)
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

const stopLocaleWatch = watch(locale, () => rebuildFaceTextures())

onUnmounted(() => {
  cancelAnimationFrame(animId)
  clearTimeout(interactionTimeout)
  resizeObserver?.disconnect()
  stopLocaleWatch()
  renderer?.dispose()
})
</script>

<style scoped>
.cube-scene {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}
</style>
