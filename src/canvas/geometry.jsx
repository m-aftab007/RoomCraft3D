// Measurements and small maths helpers for the 2D plan.
//
// Nothing in this file touches React or the canvas. The functions take plain
// points, walls and furniture and return plain values, so they are easy to
// test and the 3D view can reuse them later.

export const PIXELS_PER_METRE = 80 // at 100% zoom
export const GRID = 0.25 // one grid cell is 25 cm
export const OPENING_WIDTH = { door: 0.9, window: 1.2 }

// Decimal numbers are not stored exactly (0.1 + 0.2 is 0.30000000000000004),
// so "does it fit" checks allow this tiny amount of slack.
const SLACK = 1e-9

// moves a value to the nearest grid line
export const snap = (value) => Math.round(value / GRID) * GRID

export const samePoint = (a, b) => a.x === b.x && a.y === b.y

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

// Is there room on the wall for an opening of this width at this offset?
// It has to stay between the wall's ends and must not touch another door or
// window. ignoreId is the opening being moved, which may overlap itself.
const openingFits = (wall, offset, width, openings, ignoreId) => {
  const half = width / 2
  if (offset - half < -SLACK || offset + half > wallLength(wall) + SLACK) return false

  // two openings overlap when their middles are closer than half of each width added up
  return openings.every(
    (o) =>
      o.wallId !== wall.id ||
      o.id === ignoreId ||
      Math.abs(o.offset - offset) >= (o.width + width) / 2 - SLACK
  )
}

// the offset nearest to `along` that keeps the whole opening on the wall
const clampOffset = (wall, along, width) =>
  Math.min(Math.max(snap(along), width / 2), wallLength(wall) - width / 2)

// Works out where a door or window would go for a mouse position.
// Returns the opening (without an id) or null when there is no wall nearby,
// the wall is too short, or another opening is in the way.
export const placeOpening = (type, point, walls, openings) => {
  const hit = findWallAt(point, walls, 0.5)
  if (!hit) return null

  const width = OPENING_WIDTH[type]
  const offset = clampOffset(hit.wall, hit.offset, width)
  if (!openingFits(hit.wall, offset, width, openings)) return null

  // side is the side of the wall the mouse is on, the door swings open that way
  return { type, wallId: hit.wall.id, offset, width, side: hit.side }
}

// Where an existing door or window ends up when it is dragged to `point`.
// It can only slide along its own wall. Returns the new offset, or null if
// another opening is in the way, in which case it should stay where it is.
export const slideOpening = (opening, point, walls, openings) => {
  const wall = walls.find((w) => w.id === opening.wallId)
  const offset = clampOffset(wall, toWallSpace(point, wall).along, opening.width)
  return openingFits(wall, offset, opening.width, openings, opening.id) ? offset : null
}

// The wall corner within `reach` metres of a point, or null.
export const findCornerAt = (point, walls, reach) => {
  for (const wall of walls) {
    for (const corner of [wall.start, wall.end]) {
      if (Math.hypot(point.x - corner.x, point.y - corner.y) <= reach) return corner
    }
  }
  return null
}

// May the corner at `from` be moved to `to`? Every wall that ends at `from`
// moves with it, which is what keeps a closed room closed.
export const canMoveCorner = (from, to, walls, openings) => {
  // Landing on another corner is refused: the two would sit on the same
  // point and move as one from then on, with no way to pull them apart.
  // This also rules out a wall with no length.
  if (walls.some((wall) => samePoint(wall.start, to) || samePoint(wall.end, to))) return false

  return walls.every((wall) => {
    const movesStart = samePoint(wall.start, from)
    const movesEnd = samePoint(wall.end, from)
    if (!movesStart && !movesEnd) return true

    // the wall may not get shorter than its doors and windows need
    const start = movesStart ? to : wall.start
    const end = movesEnd ? to : wall.end
    const length = Math.hypot(end.x - start.x, end.y - start.y)
    return openings.every(
      (o) => o.wallId !== wall.id || o.offset + o.width / 2 <= length + SLACK
    )
  })
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
