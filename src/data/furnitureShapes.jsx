// Simple 3D shapes for the catalogue items that have no GLTF model file.
//
// Instead of one plain box, such an item is put together from a few boxes
// and cylinders, enough to tell a fridge from a wardrobe. The key is the
// item's id in the catalogue.
//
// Every part is described in fractions of the piece's own size, so the same
// description works whatever the item's measurements are:
//   at     middle of the part: [x, y, z]
//          x and z run from -0.5 to 0.5 (left to right, back to front)
//          y runs from 0 (the floor) to 1 (the top of the piece)
//   size   [width, height, depth] of the part, 1 being the whole piece
//   color  the part's colour
//   round  true for a cylinder instead of a box
//   opacity  below 1 for glass
//   shiny  true for a mirror-like surface

const WHITE = '#f8fafc'
const STEEL = '#94a3b8'
const DARK = '#334155'
const WOOD = '#b08968'
const DARK_WOOD = '#7f5539'
const STONE = '#e7e5e4'
const WATER = '#7dd3fc'

const furnitureShapes = {
  fridge: [
    { at: [0, 0.5, 0], size: [1, 1, 1], color: STONE },
    { at: [0, 0.62, 0.5], size: [1, 0.008, 0.02], color: DARK }, // gap between the two doors
    { at: [0.38, 0.8, 0.52], size: [0.04, 0.2, 0.04], color: STEEL },
    { at: [0.38, 0.4, 0.52], size: [0.04, 0.25, 0.04], color: STEEL },
  ],
  stove: [
    { at: [0, 0.5, 0], size: [1, 1, 1], color: WHITE },
    { at: [0, 1, 0], size: [1, 0.02, 1], color: DARK },
    { at: [-0.22, 1.02, -0.22], size: [0.3, 0.02, 0.3], color: STEEL, round: true },
    { at: [0.22, 1.02, -0.22], size: [0.3, 0.02, 0.3], color: STEEL, round: true },
    { at: [-0.22, 1.02, 0.22], size: [0.3, 0.02, 0.3], color: STEEL, round: true },
    { at: [0.22, 1.02, 0.22], size: [0.3, 0.02, 0.3], color: STEEL, round: true },
    { at: [0, 0.45, 0.5], size: [0.8, 0.5, 0.02], color: DARK }, // oven door
  ],
  'sink-unit': [
    { at: [0, 0.47, 0], size: [1, 0.94, 1], color: WOOD },
    { at: [0, 0.97, 0], size: [1, 0.06, 1], color: STEEL },
    { at: [0, 1, 0.05], size: [0.5, 0.02, 0.6], color: DARK }, // the basin
    { at: [0, 1.1, -0.38], size: [0.04, 0.2, 0.06], color: STEEL }, // the tap
  ],
  counter: [
    { at: [0, 0.47, 0], size: [1, 0.94, 1], color: WOOD },
    { at: [0, 0.97, 0], size: [1.02, 0.06, 1.02], color: STONE },
  ],

  toilet: [
    { at: [0, 0.7, -0.36], size: [0.9, 0.6, 0.28], color: WHITE }, // tank
    { at: [0, 0.27, 0.12], size: [0.85, 0.54, 0.7], color: WHITE, round: true },
    { at: [0, 0.56, 0.12], size: [0.9, 0.05, 0.74], color: STONE, round: true }, // seat
  ],
  basin: [
    { at: [0, 0.4, 0], size: [0.3, 0.8, 0.4], color: WHITE, round: true },
    { at: [0, 0.9, 0], size: [1, 0.2, 1], color: WHITE, round: true },
    { at: [0, 1.06, -0.35], size: [0.06, 0.12, 0.1], color: STEEL },
  ],
  bathtub: [
    { at: [0, 0.5, 0], size: [1, 1, 1], color: WHITE },
    { at: [0, 1, 0], size: [0.9, 0.02, 0.82], color: WATER },
  ],
  shower: [
    { at: [0, 0.03, 0], size: [1, 0.06, 1], color: WHITE }, // tray
    { at: [0, 0.52, 0.48], size: [1, 0.94, 0.03], color: WATER, opacity: 0.25 },
    { at: [0.48, 0.52, 0], size: [0.03, 0.94, 1], color: WATER, opacity: 0.25 },
    { at: [-0.4, 0.5, -0.4], size: [0.04, 1, 0.04], color: STEEL },
    { at: [-0.28, 0.98, -0.28], size: [0.25, 0.02, 0.25], color: STEEL, round: true },
  ],
  'bath-cabinet': [
    { at: [0, 0.5, 0], size: [1, 1, 1], color: WHITE },
    { at: [0, 0.5, 0.5], size: [0.015, 0.9, 0.02], color: DARK },
    { at: [-0.06, 0.5, 0.53], size: [0.03, 0.15, 0.05], color: STEEL },
    { at: [0.06, 0.5, 0.53], size: [0.03, 0.15, 0.05], color: STEEL },
  ],

  wardrobe: [
    { at: [0, 0.5, 0], size: [1, 1, 1], color: DARK_WOOD },
    { at: [0, 0.5, 0.5], size: [0.008, 0.96, 0.02], color: DARK },
    { at: [-0.04, 0.5, 0.52], size: [0.012, 0.12, 0.03], color: STEEL },
    { at: [0.04, 0.5, 0.52], size: [0.012, 0.12, 0.03], color: STEEL },
  ],
  'bedside-table': [
    { at: [0, 0.5, 0], size: [1, 1, 1], color: WOOD },
    { at: [0, 0.5, 0.5], size: [0.9, 0.02, 0.02], color: DARK }, // gap between the drawers
    { at: [0, 0.74, 0.52], size: [0.12, 0.06, 0.05], color: STEEL },
    { at: [0, 0.26, 0.52], size: [0.12, 0.06, 0.05], color: STEEL },
  ],

  'office-desk': [
    { at: [0, 0.97, 0], size: [1, 0.06, 1], color: WOOD },
    { at: [-0.46, 0.47, -0.42], size: [0.04, 0.94, 0.08], color: DARK },
    { at: [0.46, 0.47, -0.42], size: [0.04, 0.94, 0.08], color: DARK },
    { at: [-0.46, 0.47, 0.42], size: [0.04, 0.94, 0.08], color: DARK },
    { at: [0.46, 0.47, 0.42], size: [0.04, 0.94, 0.08], color: DARK },
  ],
  // an L shaped top made of two boards
  'corner-desk': [
    { at: [0, 0.97, -0.25], size: [1, 0.06, 0.5], color: WOOD },
    { at: [-0.25, 0.97, 0.25], size: [0.5, 0.06, 0.5], color: WOOD },
    { at: [-0.46, 0.47, -0.46], size: [0.05, 0.94, 0.05], color: DARK },
    { at: [0.46, 0.47, -0.46], size: [0.05, 0.94, 0.05], color: DARK },
    { at: [0.46, 0.47, -0.04], size: [0.05, 0.94, 0.05], color: DARK },
    { at: [-0.46, 0.47, 0.46], size: [0.05, 0.94, 0.05], color: DARK },
    { at: [-0.04, 0.47, 0.46], size: [0.05, 0.94, 0.05], color: DARK },
  ],
  'office-chair': [
    { at: [0, 0.03, 0], size: [0.9, 0.06, 0.9], color: DARK, round: true },
    { at: [0, 0.26, 0], size: [0.1, 0.42, 0.1], color: STEEL, round: true },
    { at: [0, 0.5, 0.05], size: [0.8, 0.08, 0.75], color: DARK },
    { at: [0, 0.8, -0.35], size: [0.75, 0.45, 0.1], color: DARK }, // back rest
  ],

  rug: [
    { at: [0, 0.5, 0], size: [1, 1, 1], color: '#9f1239' },
    { at: [0, 1, 0], size: [0.85, 0.2, 0.8], color: '#fecdd3' },
  ],
  'floor-lamp': [
    { at: [0, 0.01, 0], size: [0.7, 0.02, 0.7], color: DARK, round: true },
    { at: [0, 0.44, 0], size: [0.08, 0.84, 0.08], color: DARK, round: true },
    { at: [0, 0.92, 0], size: [1, 0.16, 1], color: '#fef3c7', round: true }, // shade
  ],
  'side-table': [
    { at: [0, 0.02, 0], size: [0.6, 0.04, 0.6], color: DARK_WOOD, round: true },
    { at: [0, 0.48, 0], size: [0.14, 0.88, 0.14], color: DARK_WOOD, round: true },
    { at: [0, 0.96, 0], size: [1, 0.08, 1], color: WOOD, round: true },
  ],
  mirror: [
    { at: [0, 0.5, 0], size: [1, 1, 0.6], color: DARK_WOOD },
    { at: [0, 0.5, 0.32], size: [0.88, 0.93, 0.05], color: '#e2e8f0', shiny: true },
  ],
}

export default furnitureShapes
