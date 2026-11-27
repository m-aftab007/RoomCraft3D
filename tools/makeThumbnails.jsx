// Renders a small picture of every catalogue item, for the hover preview in
// the sidebar. It runs in a browser page (tools/thumbnails.html), and
// tools/saveThumbnails.js collects the pictures and writes them to
// public/thumbnails.
//
// Why pictures made in advance instead of drawing the model on hover:
// the 2D view does not load Three.js or any model, so a live preview would
// download both just to show a 160 pixel image. A ready image appears at once.
//
// The pieces are built with the same code as the 3D view (fitModel for
// models, buildFurniture for simple shapes), so the picture shows exactly
// what will be placed.

import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import furniture from '../src/data/furniture.jsx'
import loadModel, { fitModel } from '../src/three/loadModel.jsx'
import buildFurniture from '../src/three/buildFurniture.jsx'

const SIZE = 320 // shown at 160 pixels, so this stays sharp on high-DPI screens

// alpha: true gives a see-through background, so the picture sits on any card
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(SIZE, SIZE)
renderer.setClearColor(0x000000, 0)
renderer.toneMapping = THREE.ACESFilmicToneMapping
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment()).texture
scene.environmentIntensity = 0.6
scene.add(new THREE.AmbientLight('#ffffff', 0.5))
const sun = new THREE.DirectionalLight('#fff4e5', 2)
sun.position.set(3, 5, 4)
scene.add(sun)

const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100)

// a piece the way the room store would hold it, standing at the origin
const toPiece = (item) => ({ ...item, itemId: item.id, x: 0, y: 0, rotation: 0, lift: 0 })

const buildPiece = async (item) => {
  const piece = toPiece(item)
  if (item.model) {
    try {
      return fitModel(await loadModel(item.model), piece)
    } catch {
      // a missing model falls back to the shape, like in the 3D view
    }
  }
  // without a model, buildFurniture returns the simple shape straight away
  return buildFurniture({ ...piece, model: undefined }, { userData: {} }, () => {})
}

// Look at the piece from the front, a little to the right and above, and
// move back just far enough for the whole piece to fit the picture.
const frame = (object) => {
  const box = new THREE.Box3().setFromObject(object, true)
  const centre = box.getCenter(new THREE.Vector3())
  const radius = box.getBoundingSphere(new THREE.Sphere()).radius
  const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))
  const direction = new THREE.Vector3(0.7, 0.55, 1).normalize()
  camera.position.copy(centre).addScaledVector(direction, distance)
  camera.lookAt(centre)
}

const run = async () => {
  const pictures = {}
  for (const category of furniture) {
    for (const item of category.items) {
      const object = await buildPiece(item)
      scene.add(object)
      frame(object)
      renderer.render(scene, camera)
      // read the picture straight after drawing, before the canvas is cleared
      pictures[item.id] = renderer.domElement.toDataURL('image/webp', 0.85)
      scene.remove(object)
    }
  }
  window.pictures = pictures
  document.title = 'done'
}

run().catch((error) => {
  document.title = 'error: ' + error.message
})
