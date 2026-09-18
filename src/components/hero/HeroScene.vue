<template>
  <canvas ref="canvasRef" class="hero-scene" @pointermove="handleCanvasPointerMove" @pointerleave="handleCanvasLeave"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'

const canvasRef = ref(null)
let renderer, scene, camera, animId, resizeObserver
let workspaceGroup, screenMesh, glassPanels = []
let dataTube, dataCurve
const dataParticles = []
let statusLight, statusMat
let raycaster, pointer
let pmremGenerator

let mouseX = 0, mouseY = 0
let canvasHovering = false

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile = window.innerWidth < 760

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function buildEnvironment(renderer) {
  const envScene = new THREE.Scene()
  const colors = [0x0b1a2a, 0x1a1230, 0x0b1a2a, 0x14202f, 0x2a3f55, 0x120a1e]
  const mats = colors.map((c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.BackSide }))
  const box = new THREE.Mesh(new THREE.BoxGeometry(14, 14, 14), mats)
  envScene.add(box)

  // a couple of bright accent panels for specular highlights
  const cyanPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshBasicMaterial({ color: 0x4fd1ff, side: THREE.BackSide })
  )
  cyanPanel.position.set(3, 2, -3)
  cyanPanel.lookAt(0, 0, 0)
  envScene.add(cyanPanel)

  const purplePanel = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 5),
    new THREE.MeshBasicMaterial({ color: 0x8b7cff, side: THREE.BackSide })
  )
  purplePanel.position.set(-4, -1, -2)
  purplePanel.lookAt(0, 0, 0)
  envScene.add(purplePanel)

  pmremGenerator = new THREE.PMREMGenerator(renderer)
  const rt = pmremGenerator.fromScene(envScene, 0.04, 0.1, 50)
  return rt.texture
}

function buildAppScreenTexture() {
  const W = 1024, H = 680
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // base
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#0d1220')
  bg.addColorStop(1, '#0a0e18')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // top navbar
  ctx.fillStyle = 'rgba(255,255,255,0.045)'
  roundRectPath(ctx, 28, 26, W - 56, 56, 14)
  ctx.fill()
  ctx.fillStyle = '#4fd1ff'
  ctx.beginPath(); ctx.arc(60, 54, 9, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  roundRectPath(ctx, 84, 46, 120, 16, 8)
  ctx.fill()
  ;[0, 1, 2].forEach((i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.16)'
    roundRectPath(ctx, W - 300 + i * 90, 42, 66, 24, 12)
    ctx.fill()
  })

  // hero card with shadow
  const cardX = 28, cardY = 106, cardW = W - 56, cardH = 260
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 18
  ctx.fillStyle = 'rgba(255,255,255,0.05)'
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 20)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  roundRectPath(ctx, cardX + 36, cardY + 40, 360, 22, 8)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  roundRectPath(ctx, cardX + 36, cardY + 74, 260, 14, 6)
  ctx.fill()

  const btnGrad = ctx.createLinearGradient(cardX + 36, 0, cardX + 220, 0)
  btnGrad.addColorStop(0, '#4fd1ff')
  btnGrad.addColorStop(1, '#8b7cff')
  ctx.fillStyle = btnGrad
  roundRectPath(ctx, cardX + 36, cardY + 106, 184, 42, 21)
  ctx.fill()

  // decorative chart panel on the right of hero card
  const chartX = cardX + cardW - 340, chartY = cardY + 30, chartW = 300, chartH = 200
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  roundRectPath(ctx, chartX, chartY, chartW, chartH, 16)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  for (let i = 1; i <= 3; i++) {
    const y = chartY + (chartH / 4) * i
    ctx.beginPath(); ctx.moveTo(chartX + 16, y); ctx.lineTo(chartX + chartW - 16, y); ctx.stroke()
  }
  const pts = [0.75, 0.55, 0.62, 0.4, 0.46, 0.25, 0.32, 0.15]
  const grad2 = ctx.createLinearGradient(chartX, 0, chartX + chartW, 0)
  grad2.addColorStop(0, '#4fd1ff')
  grad2.addColorStop(1, '#5ce1b8')
  ctx.strokeStyle = grad2
  ctx.lineWidth = 4
  ctx.lineJoin = 'round'
  ctx.beginPath()
  pts.forEach((p, i) => {
    const x = chartX + 16 + ((chartW - 32) / (pts.length - 1)) * i
    const y = chartY + 16 + (chartH - 32) * p
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  // stat cards row
  const statY = cardY + cardH + 26
  const statH = 120
  const gap = 20
  const statW = (cardW - gap * 2) / 3
  const statLabels = [['1.2k', 'Active users'], ['98.7%', 'Uptime'], ['v3.1', 'Latest release']]
  statLabels.forEach(([big, small], i) => {
    const x = cardX + i * (statW + gap)
    ctx.fillStyle = 'rgba(255,255,255,0.045)'
    roundRectPath(ctx, x, statY, statW, statH, 16)
    ctx.fill()
    ctx.fillStyle = '#eaf6ff'
    ctx.font = '700 40px "Space Grotesk", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(big, x + 24, statY + 56)
    ctx.fillStyle = '#8890a3'
    ctx.font = '500 18px Manrope, sans-serif'
    ctx.fillText(small, x + 24, statY + 84)
  })

  // bottom content list rows
  const listY = statY + statH + 26
  for (let i = 0; i < 3; i++) {
    const y = listY + i * 46
    ctx.fillStyle = 'rgba(255,255,255,0.035)'
    roundRectPath(ctx, cardX, y, cardW, 34, 10)
    ctx.fill()
    ctx.fillStyle = i === 0 ? '#4fd1ff' : 'rgba(255,255,255,0.25)'
    ctx.beginPath(); ctx.arc(cardX + 22, y + 17, 5, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    roundRectPath(ctx, cardX + 40, y + 11, 200 - i * 30, 12, 5)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return { texture, W, H }
}

function createGlowSprite(colorHex, size, opacity) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  const c = new THREE.Color(colorHex)
  const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`
  grad.addColorStop(0, `rgba(${rgb},${opacity})`)
  grad.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(size, size, 1)
  return sprite
}

// ---------------------------------------------------------------
// Scene construction
// ---------------------------------------------------------------

function buildScene(width, height) {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
  camera.position.set(0.6, 0.85, 8.4)
  camera.lookAt(0, -0.1, 0)

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
  renderer.setSize(width, height)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.shadowMap.enabled = !isMobile
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  scene.environment = buildEnvironment(renderer)

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  // ---- Lights ----
  const hemi = new THREE.HemisphereLight(0x2a3f55, 0x05060a, 0.7)
  scene.add(hemi)

  const key = new THREE.DirectionalLight(0xcfeeff, 1.4)
  key.position.set(3.2, 4, 4.5)
  if (!isMobile) {
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 14
    key.shadow.camera.left = -4
    key.shadow.camera.right = 4
    key.shadow.camera.top = 4
    key.shadow.camera.bottom = -4
    key.shadow.bias = -0.002
  }
  scene.add(key)

  const cyanFill = new THREE.PointLight(0x4fd1ff, 6, 10, 2)
  cyanFill.position.set(-1.6, 0.6, 2.4)
  scene.add(cyanFill)

  const purpleRim = new THREE.PointLight(0x8b7cff, 5, 10, 2)
  purpleRim.position.set(2.4, -0.4, -2.2)
  scene.add(purpleRim)

  // ---- Workspace group ----
  workspaceGroup = new THREE.Group()
  workspaceGroup.rotation.y = -0.32
  scene.add(workspaceGroup)

  // ---- Contact shadow catcher (invisible floor) ----
  if (!isMobile) {
    const floorGeo = new THREE.PlaneGeometry(12, 12)
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -1.75
    floor.receiveShadow = true
    workspaceGroup.add(floor)
  }

  // ---- Monitor ----
  const monitorGroup = new THREE.Group()
  monitorGroup.position.set(0.35, 0.15, 0)

  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x11141c, roughness: 0.35, metalness: 0.7 })
  const bezelGeo = new THREE.BoxGeometry(3.5, 2.15, 0.12)
  const bezel = new THREE.Mesh(bezelGeo, bezelMat)
  bezel.castShadow = true
  bezel.receiveShadow = true
  monitorGroup.add(bezel)

  const { texture: screenTex } = buildAppScreenTexture()
  const screenGeo = new THREE.PlaneGeometry(3.22, 1.9)
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissive: 0xffffff,
    emissiveMap: screenTex,
    emissiveIntensity: 1.05,
    roughness: 0.4,
    metalness: 0,
  })
  screenMesh = new THREE.Mesh(screenGeo, screenMat)
  screenMesh.position.set(0, 0, 0.065)
  monitorGroup.add(screenMesh)

  // thin glass front layer over the screen for reflective sheen
  if (!isMobile) {
    const glassScreenMat = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      thickness: 0.05,
      roughness: 0.08,
      ior: 1.4,
      clearcoat: 1,
      transparent: true,
      opacity: 0.25,
    })
    const glassScreen = new THREE.Mesh(new THREE.PlaneGeometry(3.24, 1.92), glassScreenMat)
    glassScreen.position.set(0, 0, 0.072)
    monitorGroup.add(glassScreen)
  }

  // stand
  const standMat = new THREE.MeshStandardMaterial({ color: 0x181c26, roughness: 0.3, metalness: 0.75 })
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.75, 16), standMat)
  neck.position.set(0, -1.32, -0.05)
  neck.castShadow = true
  monitorGroup.add(neck)

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.05, 32), standMat)
  base.position.set(0, -1.7, -0.05)
  base.castShadow = true
  base.receiveShadow = true
  monitorGroup.add(base)

  // small status light on bezel corner (no text — colour-coded pulse only)
  const statusGeo = new THREE.SphereGeometry(0.035, 16, 16)
  statusMat = new THREE.MeshStandardMaterial({ color: 0x4fd1ff, emissive: 0x4fd1ff, emissiveIntensity: 2 })
  statusLight = new THREE.Mesh(statusGeo, statusMat)
  statusLight.position.set(1.55, -0.92, 0.09)
  monitorGroup.add(statusLight)

  monitorGroup.rotation.y = -0.18
  monitorGroup.rotation.x = 0.03
  workspaceGroup.add(monitorGroup)

  // ---- Keyboard ----
  const deskY = -1.68
  const kbGroup = new THREE.Group()
  const kbMat = new THREE.MeshStandardMaterial({ color: 0x14171f, roughness: 0.5, metalness: 0.3 })
  const kbBase = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.62), kbMat)
  kbBase.castShadow = true
  kbBase.receiveShadow = true
  kbGroup.add(kbBase)

  const keyGeo = new THREE.BoxGeometry(0.1, 0.03, 0.1)
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x232838, roughness: 0.6, metalness: 0.2 })
  const cols = 12, rows = 4
  const keyMesh = new THREE.InstancedMesh(keyGeo, keyMat, cols * rows)
  const dummy = new THREE.Object3D()
  let idx = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dummy.position.set(-0.72 + c * 0.132, 0.05, -0.2 + r * 0.135)
      dummy.updateMatrix()
      keyMesh.setMatrixAt(idx++, dummy.matrix)
    }
  }
  keyMesh.castShadow = true
  kbGroup.add(keyMesh)

  kbGroup.position.set(0.05, deskY, 1.15)
  kbGroup.rotation.x = -0.06
  kbGroup.rotation.y = -0.18
  workspaceGroup.add(kbGroup)

  // ---- Mouse ----
  const mouseMat = new THREE.MeshStandardMaterial({ color: 0x1c2130, roughness: 0.35, metalness: 0.4 })
  const mouseMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.16, 4, 12), mouseMat)
  mouseMesh.rotation.z = Math.PI / 2
  mouseMesh.rotation.y = 0.3
  mouseMesh.position.set(1.05, deskY + 0.09, 1.25)
  mouseMesh.castShadow = true
  workspaceGroup.add(mouseMesh)

  // ---- Floating glass panels ----
  if (!isMobile) {
    const panelGeo = new THREE.BoxGeometry(0.85, 0.55, 0.02)
    const panelMat = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      thickness: 0.3,
      roughness: 0.12,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      color: 0x1a2233,
      transparent: true,
      opacity: 0.5,
    })
    const panel1 = new THREE.Mesh(panelGeo, panelMat)
    panel1.position.set(-1.9, 0.95, -0.4)
    panel1.rotation.set(0.1, 0.5, 0.05)
    panel1.castShadow = true
    workspaceGroup.add(panel1)
    glassPanels.push(panel1)

    const panel2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.02), panelMat.clone())
    panel2.position.set(-1.55, 0.35, 0.35)
    panel2.rotation.set(-0.08, 0.65, -0.05)
    panel2.castShadow = true
    workspaceGroup.add(panel2)
    glassPanels.push(panel2)
  }

  // ---- Server / database module ----
  const serverGroup = new THREE.Group()
  const serverMat = new THREE.MeshStandardMaterial({ color: 0x161a24, roughness: 0.4, metalness: 0.6 })
  const serverBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.85, 0.5), serverMat)
  serverBody.castShadow = true
  serverBody.receiveShadow = true
  serverGroup.add(serverBody)

  const slitMat = new THREE.MeshStandardMaterial({ color: 0x8b7cff, emissive: 0x8b7cff, emissiveIntensity: 1.6 })
  for (let i = 0; i < 3; i++) {
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.02), slitMat)
    slit.position.set(0, 0.26 - i * 0.22, 0.26)
    serverGroup.add(slit)
  }
  const serverGlow = createGlowSprite(0x8b7cff, 1.6, 0.35)
  serverGroup.add(serverGlow)

  serverGroup.position.set(2.05, -0.85, -1.3)
  serverGroup.rotation.y = 0.4
  workspaceGroup.add(serverGroup)

  // ---- Data tube connecting monitor to server ----
  const start = new THREE.Vector3(1.0, -0.55, 0.15)
  const end = serverGroup.position.clone().add(new THREE.Vector3(0, 0.35, 0.2))
  const mid1 = new THREE.Vector3(1.5, -0.3, -0.3)
  const mid2 = new THREE.Vector3(1.9, -0.5, -0.9)
  dataCurve = new THREE.CatmullRomCurve3([start, mid1, mid2, end])

  const tubeGeo = new THREE.TubeGeometry(dataCurve, 48, 0.012, 8, false)
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0x4fd1ff, transparent: true, opacity: 0.35 })
  dataTube = new THREE.Mesh(tubeGeo, tubeMat)
  workspaceGroup.add(dataTube)

  const particleCount = isMobile ? 2 : 3
  for (let i = 0; i < particleCount; i++) {
    const p = createGlowSprite(i % 2 === 0 ? 0x4fd1ff : 0x8b7cff, 0.16, 1)
    p.userData.phase = i / particleCount
    workspaceGroup.add(p)
    dataParticles.push(p)
  }

  // ---- Ambient particles ----
  if (!reduced) {
    const count = isMobile ? 24 : 70
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.014, transparent: true, opacity: 0.22 })
    scene.add(new THREE.Points(geo, mat))
  }

  if (!reduced) startStatusLoop()
}

// ---------------------------------------------------------------
// Status light cycle (colour only — no text, per spec)
// ---------------------------------------------------------------

const cleanupFns = []

function startStatusLoop() {
  const states = [
    { color: 0x4fd1ff, duration: 1800 }, // build
    { color: 0x8b7cff, duration: 1800 }, // connect
    { color: 0xffc15c, duration: 1800 }, // deploy
    { color: 0x5ce1b8, duration: 3200 }, // live
  ]
  let i = 0
  function step() {
    const s = states[i]
    gsap.to(statusMat.color, { r: new THREE.Color(s.color).r, g: new THREE.Color(s.color).g, b: new THREE.Color(s.color).b, duration: 0.5 })
    gsap.to(statusMat.emissive, { r: new THREE.Color(s.color).r, g: new THREE.Color(s.color).g, b: new THREE.Color(s.color).b, duration: 0.5 })
    i = (i + 1) % states.length
    const timeout = setTimeout(step, s.duration)
    cleanupFns.push(() => clearTimeout(timeout))
  }
  const initial = setTimeout(step, 1200)
  cleanupFns.push(() => clearTimeout(initial))
}

// ---------------------------------------------------------------
// Animation loop
// ---------------------------------------------------------------

function animate() {
  animId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  if (workspaceGroup) {
    const targetRotY = -0.32 + mouseX * 0.22
    const targetRotX = mouseY * 0.1
    workspaceGroup.rotation.y += (targetRotY - workspaceGroup.rotation.y) * 0.045
    workspaceGroup.rotation.x += (targetRotX - workspaceGroup.rotation.x) * 0.045

    if (!reduced) {
      workspaceGroup.position.y = Math.sin(t * 0.45) * 0.09
    }
  }

  glassPanels.forEach((p, i) => {
    if (!reduced) p.rotation.z = Math.sin(t * 0.3 + i) * 0.04
  })

  if (!reduced) {
    dataParticles.forEach((p) => {
      const speed = 0.16
      const localT = (t * speed + p.userData.phase) % 1
      const pos = dataCurve.getPoint(localT)
      p.position.copy(pos)
      p.material.opacity = Math.sin(localT * Math.PI)
    })
  }

  if (dataTube) {
    dataTube.material.opacity = 0.22 + Math.sin(t * 1.4) * 0.08
  }

  const screenTarget = canvasHovering ? 1.25 : 1.05
  if (screenMesh) {
    screenMesh.material.emissiveIntensity += (screenTarget - screenMesh.material.emissiveIntensity) * 0.08
  }

  renderer.render(scene, camera)
}

// ---------------------------------------------------------------
// Interaction
// ---------------------------------------------------------------

function onWindowMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1
  mouseY = -((e.clientY / window.innerHeight) * 2 - 1)
}

function handleCanvasPointerMove(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const hits = screenMesh ? raycaster.intersectObject(screenMesh) : []
  canvasHovering = hits.length > 0
}

function handleCanvasLeave() {
  canvasHovering = false
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

  window.addEventListener('mousemove', onWindowMouseMove, { passive: true })
  resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(el)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('mousemove', onWindowMouseMove)
  resizeObserver?.disconnect()
  cleanupFns.forEach((fn) => fn())
  pmremGenerator?.dispose()
  renderer?.dispose()
})
</script>

<style scoped>
.hero-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>