// Builds the 3D walls, with real gaps for doors and windows.
//
// The plan's x and y become x and z in 3D, because in Three.js the y axis
// points up. Sizes stay in metres, so no numbers have to be converted.

import * as THREE from 'three'
import { wallLength } from '../canvas/geometry.jsx'

export const WALL_HEIGHT = 2.7
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
  // an opening right at the wall's end would leave a block with no length
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

// wallMaterial is made by buildRoom, so the wall colour can later be changed
// in one place without building the walls again.
const buildWalls = (walls, openings, wallMaterial) => {
  const group = new THREE.Group()

  // The top of a wall is painted dark, the way plans draw walls in black.
  // Seen from above, the dark lines make every room's outline easy to read.
  const topMaterial = new THREE.MeshStandardMaterial({ color: '#334155' })
  // A box can have one material per side, in the order +x, -x, +y (top),
  // -y (bottom), +z, -z. Only the top gets the dark one.
  const fullHeight = [wallMaterial, wallMaterial, topMaterial, wallMaterial, wallMaterial, wallMaterial]

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: '#7dd3fc',
    transparent: true,
    opacity: 0.35,
  })

  for (const wall of walls) {
    for (const block of wallBlocks(wall, openings)) {
      // the low block under a window keeps the wall colour on top, it is a sill
      const material = block.top === WALL_HEIGHT ? fullHeight : wallMaterial
      const mesh = boxOnWall(wall, block, WALL_THICKNESS, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      group.add(mesh)
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
    group.add(boxOnWall(wall, pane, 0.02, glassMaterial))
  }

  return group
}

export default buildWalls
