// The wall length labels of the 3D view.
//
// The labels are CSS2DObjects: ordinary HTML elements that CSS2DRenderer
// keeps on top of the 3D picture, at the screen position of a point in the
// scene. Text made this way stays sharp at any zoom and always faces the
// camera, which text drawn as a 3D mesh would not.
//
// Each label floats a little above the middle of its wall and shows the
// length the same way as the 2D plan does (drawPlan), so both views agree.

import * as THREE from 'three'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { wallLength } from '../canvas/geometry.jsx'
import { WALL_HEIGHT } from './buildWalls.jsx'

const ABOVE_WALL = 0.25 // metres between the top of a wall and its label

const makeLabel = (text) => {
  const element = document.createElement('div')
  element.textContent = text
  element.className = 'rounded bg-slate-900/85 px-1.5 py-0.5 font-mono text-xs text-slate-100'
  return new CSS2DObject(element)
}

// Fills the group with one label per wall. The group is cleared first, and
// clear() matters here: a CSS2DObject only takes its HTML element off the
// page when the object itself is removed, not when a group above it is.
const buildLabels = (group, walls) => {
  group.clear()
  for (const wall of walls) {
    const label = makeLabel(`${wallLength(wall).toFixed(2)} m`)
    label.position.set(
      (wall.start.x + wall.end.x) / 2,
      WALL_HEIGHT + ABOVE_WALL,
      (wall.start.y + wall.end.y) / 2
    )
    group.add(label)
  }
}

export const createLabelGroup = () => new THREE.Group()

export default buildLabels
