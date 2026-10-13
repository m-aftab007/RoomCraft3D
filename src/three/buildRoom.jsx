// Turns the room from the store into Three.js objects.
//
// This is the 3D twin of drawPlan: it gets the same walls, openings and
// furniture and builds a picture of them, only as meshes instead of canvas
// lines. It reads no store and knows nothing about React.
//
// The plan's x and y become x and z in 3D, because in Three.js the y axis
// points up. Sizes stay in metres, so no numbers have to be converted.

import * as THREE from 'three'
import { wallLength, getBounds } from '../canvas/geometry.jsx'

const WALL_HEIGHT = 2.7
const WALL_THICKNESS = 0.15
const DOOR_HEIGHT = 2.1
const WINDOW_BOTTOM = 0.9
const WINDOW_TOP = 2.1

// A wall with a door or window in it is not one box. It is cut into solid
// blocks around the openings: the wall before each opening, the piece above
// a door, the pieces below and above a window, and the wall after the last
// opening. Each block is { from, to, bottom, top }, with from and to
// measured along the wall and bottom and top measured from the floor.
const wallBlocks = (wall, openings) => {
  const blocks = []
  // the wall is made half a thickness longer at both ends to fill the corners
  let from = -WALL_THICKNESS / 2

  const onThisWall = openings
    .filter((o) => o.wallId === wall.id)
    .sort((a, b) => a.offset - b.offset)

  for (const opening of onThisWall) {
    const left = opening.offset - opening.width / 2
    const right = opening.offset + opening.width / 2

    blocks.push({ from, to: left, bottom: 0, top: WALL_HEIGHT })
    if (opening.type === 'door') {
      blocks.push({ from: left, to: right, bottom: DOOR_HEIGHT, top: WALL_HEIGHT })
    } else {
      blocks.push({ from: left, to: right, bottom: 0, top: WINDOW_BOTTOM })
      blocks.push({ from: left, to: right, bottom: WINDOW_TOP, top: WALL_HEIGHT })
    }
    from = right
  }

  blocks.push({ from, to: wallLength(wall) + WALL_THICKNESS / 2, bottom: 0, top: WALL_HEIGHT })
  // two openings placed over each other would give a block with no length
  return blocks.filter((block) => block.to > block.from)
}

// Makes a box for one block and stands it on the wall's line.
const boxOnWall = (wall, block, thickness, material) => {
  const length = wallLength(wall)
  const ux = (wall.end.x - wall.start.x) / length
  const uy = (wall.end.y - wall.start.y) / length
  const middle = (block.from + block.to) / 2

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(block.to - block.from, block.top - block.bottom, thickness),
    material
  )
  // a box is placed by its centre
  mesh.position.set(
    wall.start.x + ux * middle,
    (block.bottom + block.top) / 2,
    wall.start.y + uy * middle
  )
  // The box is made lying along x, then turned to the wall's direction. The
  // minus is there because the plan's y axis points down the screen.
  mesh.rotation.y = -Math.atan2(uy, ux)
  return mesh
}

const buildRoom = ({ walls, openings, furniture }) => {
  const room = new THREE.Group()

  // MeshStandardMaterial is Three.js's PBR material, it reacts to light the
  // way real surfaces do
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#f1f5f9' })
  const floorMaterial = new THREE.MeshStandardMaterial({ color: '#d6d3d1' })
  const furnitureMaterial = new THREE.MeshStandardMaterial({ color: '#b08968' })
  const glassMaterial = new THREE.MeshStandardMaterial({
    color: '#7dd3fc',
    transparent: true,
    opacity: 0.35,
  })

  // the floor is a flat sheet a little larger than the room
  const box = getBounds({ walls, furniture })
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(box.maxX - box.minX + 2, box.maxY - box.minY + 2),
    floorMaterial
  )
  floor.rotation.x = -Math.PI / 2 // a plane is made standing up, this lays it down
  floor.position.set((box.minX + box.maxX) / 2, 0, (box.minY + box.maxY) / 2)
  floor.receiveShadow = true
  room.add(floor)

  for (const wall of walls) {
    for (const block of wallBlocks(wall, openings)) {
      const mesh = boxOnWall(wall, block, WALL_THICKNESS, wallMaterial)
      mesh.castShadow = true
      mesh.receiveShadow = true
      room.add(mesh)
    }
  }

  // a thin sheet of glass in every window
  for (const opening of openings) {
    if (opening.type !== 'window') continue
    const wall = walls.find((w) => w.id === opening.wallId)
    const pane = {
      from: opening.offset - opening.width / 2,
      to: opening.offset + opening.width / 2,
      bottom: WINDOW_BOTTOM,
      top: WINDOW_TOP,
    }
    room.add(boxOnWall(wall, pane, 0.02, glassMaterial))
  }

  // Furniture is a plain box of the right size for now. GLTF models will
  // replace the boxes later, placed with the same position and rotation.
  for (const piece of furniture) {
    const height = piece.height || 0.8
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(piece.width, height, piece.depth),
      furnitureMaterial
    )
    mesh.position.set(piece.x, height / 2, piece.y)
    mesh.rotation.y = (-piece.rotation * Math.PI) / 180
    mesh.castShadow = true
    mesh.receiveShadow = true
    room.add(mesh)
  }

  return room
}

// Three.js keeps geometry and materials in graphics memory until told to
// let go, so a room that is replaced has to be cleaned up by hand.
export const disposeRoom = (room) => {
  room.traverse((object) => {
    if (!object.isMesh) return
    object.geometry.dispose()
    object.material.dispose()
  })
}

export default buildRoom
