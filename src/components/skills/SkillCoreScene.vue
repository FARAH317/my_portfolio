<template>
  <canvas
    ref="canvasRef"
    class="core-scene"
    @pointermove="handlePointerMove"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointerleave="handlePointerUp"
  ></canvas>
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
let core, coreGlow, modulesGroup
const modules = [] // { mesh, label, line, category, angle, radius, yOffset, phase }

let autoRotate = true
let hoveredId = null
let mouseNDCx = 0, mouseNDCy = 0 // for camera parallax
let isDragging = false
let dragStartX = 0
let dragStartRotY = 0
let interactionTimeout

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---- helpers -------------------------------------------------

function createTextSprite(text, { color = '#eaf6ff', size = 64, weight = 700, glow = null } = {}) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const scale = 4
  canvas.width = 256 * scale
  canvas.height = 96 * scale
  ctx.scale(scale, scale)
  ctx.font = `${weight} ${size}px 'Space Grotesk', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (glow) {
    ctx.shadowColor = glow
    ctx.shadowBlur = 18
  }
  ctx.fillStyle = color
  ctx.fillText(text, 128, 48)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(1.3, 0.5, 1)
  return sprite
}

function createGlowSprite(colorHex, size = 3.2, opacity = 0.35) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  const c = new THREE.Color(colorHex)
  const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`
  gradient.addColorStop(0, `rgba(${rgb},${opacity})`)
  gradient.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)

  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(size, size, 1)
  return sprite
}

// ---- scene construction ---------------------------------------

function buildScene(width, height) {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0.4, 9)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // --- Central core ---
  const coreWireGeo = new THREE.IcosahedronGeometry(0.85, 1)
  const coreWireMat = new THREE.MeshBasicMaterial({ color: 0x4fd1ff, wireframe: true, transparent: true, opacity: 0.85 })
  core = new THREE.Mesh(coreWireGeo, coreWireMat)
  scene.add(core)

  const coreFillGeo = new THREE.IcosahedronGeometry(0.82, 1)
  const coreFillMat = new THREE.MeshBasicMaterial({ color: 0x4fd1ff, transparent: true, opacity: 0.05 })
  core.add(new THREE.Mesh(coreFillGeo, coreFillMat))

  coreGlow = createGlowSprite(0x4fd1ff, 4.2, 0.4)
  scene.add(coreGlow)

  const identity = createTextSprite('</>', { color: '#eaf6ff', size: 46, glow: '#4fd1ff' })
  identity.scale.set(1.1, 0.55, 1)
  scene.add(identity)

  // --- Floating category modules ---
  modulesGroup = new THREE.Group()
  scene.add(modulesGroup)

  const n = props.categories.length
  props.categories.forEach((cat, i) => {
    const angle = (i / n) * Math.PI * 2
    const radius = 2.9
    const yBase = Math.sin(i * 1.7) * 0.5

    const group = new THREE.Group()

    // Glass panel
    const panelGeo = new THREE.PlaneGeometry(1.05, 0.62)
    const panelMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(cat.color),
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    })
    const panel = new THREE.Mesh(panelGeo, panelMat)
    group.add(panel)

    // Panel border (edges)
    const edges = new THREE.EdgesGeometry(panelGeo)
    const borderMat = new THREE.LineBasicMaterial({ color: new THREE.Color(cat.color), transparent: true, opacity: 0.7 })
    const border = new THREE.LineSegments(edges, borderMat)
    group.add(border)

    // Label
    const label = createTextSprite(cat.label, { color: '#f4f6fb', size: 30 })
    label.position.set(0, 0, 0.02)
    label.scale.set(1.0, 0.4, 1)
    group.add(label)

    // Small indicator dot
    const dotGeo = new THREE.CircleGeometry(0.04, 16)
    const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(cat.color) })
    const dot = new THREE.Mesh(dotGeo, dotMat)
    dot.position.set(-0.42, 0.19, 0.02)
    group.add(dot)

    modulesGroup.add(group)

    // Energy connection line (core -> module), updated per frame
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)])
    const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(cat.color), transparent: true, opacity: 0.28 })
    const line = new THREE.Line(lineGeo, lineMat)
    scene.add(line)

    modules.push({
      group,
      panel,
      border,
      dot,
      line,
      category: cat,
      angle,
      radius,
      yBase,
      phase: i * 1.3,
      hitMeshes: [panel],
    })
  })

  // --- Ambient particles ---
  if (!reduced) {
    const count = 140
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.018, transparent: true, opacity: 0.3 })
    scene.add(new THREE.Points(geo, mat))
  }
}

// ---- animation loop --------------------------------------------

function updateModules(t) {
  modules.forEach((m) => {
    const bob = Math.sin(t * 0.6 + m.phase) * 0.18
    const angle = m.angle + modulesGroup.rotation.y
    const worldX = Math.cos(angle) * m.radius
    const worldZ = Math.sin(angle) * m.radius
    const worldY = m.yBase + bob

    m.group.position.set(worldX, worldY, worldZ)
    // billboard toward camera
    m.group.quaternion.copy(camera.quaternion)

    const isActive = m.category.id === props.activeId
    const isHovered = m.category.id === hoveredId
    const targetScale = isActive ? 1.35 : isHovered ? 1.18 : 1
    const targetOpacity = isActive ? 0.32 : isHovered ? 0.22 : 0.12
    m.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
    m.panel.material.opacity += (targetOpacity - m.panel.material.opacity) * 0.15
    m.border.material.opacity += ((isActive || isHovered ? 1 : 0.6) - m.border.material.opacity) * 0.15

    // update connection line endpoints (world space, since line is a scene child)
    const positions = m.line.geometry.attributes.position
    positions.setXYZ(0, 0, 0, 0)
    positions.setXYZ(1, worldX, worldY, worldZ)
    positions.needsUpdate = true

    const pulse = 0.2 + Math.abs(Math.sin(t * 1.4 + m.phase)) * 0.18
    m.line.material.opacity = isActive || isHovered ? 0.6 : pulse
  })
}

function animate() {
  animId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  if (core) {
    core.rotation.y = t * 0.25
    core.rotation.x = Math.sin(t * 0.3) * 0.08
  }
  if (coreGlow) {
    const pulse = 1 + Math.sin(t * 1.2) * 0.06
    coreGlow.scale.set(4.2 * pulse, 4.2 * pulse, 1)
  }

  if (modulesGroup && autoRotate && !isDragging) {
    modulesGroup.rotation.y += 0.0016
  }

  // subtle camera parallax
  camera.position.x += (mouseNDCx * 1.1 - camera.position.x) * 0.04
  camera.position.y += (0.4 + mouseNDCy * 0.5 - camera.position.y) * 0.04
  camera.lookAt(0, 0, 0)

  updateModules(t)
  renderer.render(scene, camera)
}

// ---- interaction -------------------------------------------------

function getNDC(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  return mouse
}

function pickModule(e) {
  getNDC(e)
  raycaster.setFromCamera(mouse, camera)
  const allHitMeshes = modules.flatMap((m) => m.hitMeshes)
  const hits = raycaster.intersectObjects(allHitMeshes)
  if (!hits.length) return null
  return modules.find((m) => m.hitMeshes.includes(hits[0].object))
}

function handlePointerMove(e) {
  mouseNDCx = ((e.clientX / window.innerWidth) * 2 - 1)
  mouseNDCy = -((e.clientY / window.innerHeight) * 2 - 1)

  if (isDragging) {
    const deltaX = e.clientX - dragStartX
    modulesGroup.rotation.y = dragStartRotY + deltaX * 0.008
    canvasRef.value.style.cursor = 'grabbing'
    return
  }

  const hit = pickModule(e)
  hoveredId = hit ? hit.category.id : null
  canvasRef.value.style.cursor = hit ? 'pointer' : 'grab'
}

function handlePointerDown(e) {
  const hit = pickModule(e)
  if (hit) {
    emit('select', hit.category.id)
    pauseAutoRotate()
    return
  }
  isDragging = true
  dragStartX = e.clientX
  dragStartRotY = modulesGroup.rotation.y
  pauseAutoRotate()
}

function handlePointerUp() {
  isDragging = false
}

function pauseAutoRotate() {
  autoRotate = false
  clearTimeout(interactionTimeout)
  interactionTimeout = setTimeout(() => (autoRotate = true), 4000)
}

// ---- lifecycle -----------------------------------------------

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
.core-scene {
  width: 100%;
  height: 100%;
  display: block;
  touch-action: none;
}
</style>