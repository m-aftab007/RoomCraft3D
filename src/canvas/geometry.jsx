// Measurements and small maths helpers for the 2D plan.
//
// Nothing in this file touches React or the canvas. The functions take plain
// points, walls and furniture and return plain values, so they are easy to
// test and the 3D view can reuse them later.

export const PIXELS_PER_METRE = 80 // at 100% zoom
export const GRID = 0.25 // one grid cell is 25 cm
export const OPENING_WIDTH = { door: 0.9, window: 1.2 }

// moves a value to the nearest grid line
export const snap = (value) => Math.round(value / GRID) * GRID

export const wallLength = (wall) =>
  Math.hypot(wall.end.x - wall.start.x, wall.end.y - wall.start.y)

// the point that lies `offset` metres along the wall from its start
export const pointOnWall = (wall, offset) => {
  const t = offset / wallLength(wall)
  return {
    x: wall.start.x + (wall.end.x - wall.start.x) * t,
    y: wall.start.y + (wall.end.y - wall.start.y) * t,
  }
}

// Describes a point the way the wall "sees" it:
//   along   how far it is from the wall's start, measured along the wall
//   across  how far it is to the side. The sign tells which side.
// (ux, uy) is the wall's direction with length 1. The dot product with it
// gives `along`, the cross product gives `across`.
const toWallSpace = (point, wall) => {
  const length = wallLength(wall)
  const ux = (wall.end.x - wall.start.x) / length
  const uy = (wall.end.y - wall.start.y) / length
  const px = point.x - wall.start.x
  const py = point.y - wall.start.y
  return { along: px * ux + py * uy, across: ux * py - uy * px }
}

// The nearest wall within `reach` metres of a point, or null.
// Also tells where on the wall (offset) and on which side the point is.
export const findWallAt = (point, walls, reach) => {
  let best = null
  for (const wall of walls) {
    const { along, across } = toWallSpace(point, wall)
    // the closest spot on the wall, kept between its two ends
    const offset = Math.min(Math.max(along, 0), wallLength(wall))
    const distance = Math.hypot(along - offset, across)

    if (distance <= reach && (!best || distance < best.distance)) {
      best = { wall, offset, distance, side: across >= 0 ? 1 : -1 }
    }
  }
  return best
}

// Works out where a door or window would go for a mouse position.
// Returns the opening (without an id) or null when there is no wall nearby
// or the wall is too short for it.
export const placeOpening = (type, point, walls) => {
  const hit = findWallAt(point, walls, 0.5)
  if (!hit) return null

  const width = OPENING_WIDTH[type]
  const length = wallLength(hit.wall)
  if (length < width) return null

  // keep the whole opening on the wall, half its width away from both ends
  const offset = Math.min(Math.max(snap(hit.offset), width / 2), length - width / 2)
  // side is the side of the wall the mouse is on, the door swings open that way
  return { type, wallId: hit.wall.id, offset, width, side: hit.side }
}

// Is the point on a door or window? The area is larger than the opening
// itself so it is easy to click: a band around the gap in the wall, and for
// a door also the square its swing covers.
const isOnOpening = (point, wall, opening) => {
  const { along, across } = toWallSpace(point, wall)
  if (Math.abs(along - opening.offset) > opening.width / 2 + 0.1) return false
  if (Math.abs(across) <= 0.2) return true

  const onSwingSide = across * opening.side > 0
  return opening.type === 'door' && onSwingSide && Math.abs(across) <= opening.width + 0.1
}

// Is the point inside a piece of furniture? The point is turned back by the
// piece's rotation first, after that it is a plain rectangle check.
const isOnFurniture = (point, piece) => {
  const angle = (-piece.rotation * Math.PI) / 180
  const dx = point.x - piece.x
  const dy = point.y - piece.y
  const x = dx * Math.cos(angle) - dy * Math.sin(angle)
  const y = dx * Math.sin(angle) + dy * Math.cos(angle)
  return Math.abs(x) <= piece.width / 2 && Math.abs(y) <= piece.depth / 2
}

// The id of whatever is under the mouse, or null.
// The order matters: furniture is checked first, then doors and windows,
// and walls last, because the smaller things sit on top of the bigger ones.
export const findItemAt = (point, { walls, openings, furniture }) => {
  // the piece added last is drawn on top, so look from the end of the list
  const piece = furniture.findLast((p) => isOnFurniture(point, p))
  if (piece) return piece.id

  const opening = openings.find((o) =>
    isOnOpening(point, walls.find((wall) => wall.id === o.wallId), o)
  )
  if (opening) return opening.id

  const hit = findWallAt(point, walls, 0.2)
  return hit ? hit.wall.id : null
}

// The smallest rectangle that contains the whole room, used for the PNG export.
export const getBounds = ({ walls, furniture }) => {
  const xs = []
  const ys = []
  for (const wall of walls) {
    xs.push(wall.start.x, wall.end.x)
    ys.push(wall.start.y, wall.end.y)
  }
  for (const piece of furniture) {
    // half of the longer side is enough room whichever way the piece is turned
    const half = Math.max(piece.width, piece.depth) / 2
    xs.push(piece.x - half, piece.x + half)
    ys.push(piece.y - half, piece.y + half)
  }

  // an empty room still exports as an 8 by 6 metre sheet
  if (xs.length === 0) return { minX: -4, maxX: 4, minY: -3, maxY: 3 }
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}
