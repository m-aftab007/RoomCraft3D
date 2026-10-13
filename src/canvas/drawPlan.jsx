// Draws the whole 2D plan onto a canvas.
//
// The canvas is redrawn from scratch every time something changes. That is
// the normal way to work with the Canvas API: it has no objects to move
// around, only pixels, so we clear it and paint the current state again.
//
// drawPlan gets everything it needs as arguments and reads no store. The
// React component decides when to draw, this file only knows how. Because of
// that the same function also paints the PNG export.

import { GRID, PIXELS_PER_METRE, pointOnWall, wallLength } from './geometry.jsx'

const BACKGROUND = '#020617' // same as Tailwind slate-950
const GRID_MINOR = 'rgb(148 163 184 / 0.10)'
const GRID_MAJOR = 'rgb(148 163 184 / 0.28)'
const WALL = '#e2e8f0'
const PREVIEW = '#60a5fa'
const OPENING = '#7dd3fc'
const FURNITURE = '#94a3b8'
const FURNITURE_FILL = 'rgb(148 163 184 / 0.12)'
const SELECTED = '#f59e0b'
const LABEL = '#94a3b8'

// In every function below, `px` is the size of one screen pixel in metres.
// Line widths are given as a number of px, so a wall is the same thin line
// on screen at every zoom level.

const drawLine = (ctx, from, to) => {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.stroke()
}

// Every grid line is a line that walls snap to: one each 25 cm, and a
// brighter one each full metre. i counts whole cells, which avoids the small
// rounding errors of adding 0.25 again and again.
const drawGrid = (ctx, size, scale, center) => {
  const halfW = size.width / 2 / scale
  const halfH = size.height / 2 / scale
  const left = center.x - halfW
  const right = center.x + halfW
  const top = center.y - halfH
  const bottom = center.y + halfH
  const cellsPerMetre = 1 / GRID

  // picks the colour for line number i, or says to skip it
  const pickLine = (i) => {
    const major = i % cellsPerMetre === 0
    // when zoomed far out the 25 cm lines get too close, so only draw the metre lines
    if (!major && GRID * scale < 8) return false
    ctx.strokeStyle = major ? GRID_MAJOR : GRID_MINOR
    return true
  }

  ctx.lineWidth = 1 / scale
  for (let i = Math.floor(left / GRID); i <= Math.ceil(right / GRID); i++) {
    if (pickLine(i)) drawLine(ctx, { x: i * GRID, y: top }, { x: i * GRID, y: bottom })
  }
  for (let i = Math.floor(top / GRID); i <= Math.ceil(bottom / GRID); i++) {
    if (pickLine(i)) drawLine(ctx, { x: left, y: i * GRID }, { x: right, y: i * GRID })
  }
}

const drawWall = (ctx, wall, color, px) => {
  ctx.strokeStyle = color
  ctx.lineWidth = 3 * px
  // round ends make the corner where two walls meet look joined
  ctx.lineCap = 'round'
  drawLine(ctx, wall.start, wall.end)
}

const drawOpening = (ctx, wall, opening, color, px) => {
  const from = pointOnWall(wall, opening.offset - opening.width / 2)
  const to = pointOnWall(wall, opening.offset + opening.width / 2)
  const angle = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x)
  ctx.lineCap = 'butt'

  // first cut a gap in the wall by painting over it with the background
  ctx.strokeStyle = BACKGROUND
  ctx.lineWidth = 6 * px
  drawLine(ctx, from, to)

  ctx.strokeStyle = color
  ctx.lineWidth = 1.5 * px

  if (opening.type === 'window') {
    // A window is a narrow box with a line through the middle. Moving and
    // turning the canvas to the wall lets us draw it as a simple flat box.
    ctx.save()
    ctx.translate(from.x, from.y)
    ctx.rotate(angle)
    ctx.strokeRect(0, -4 * px, opening.width, 8 * px)
    drawLine(ctx, { x: 0, y: 0 }, { x: opening.width, y: 0 })
    ctx.restore()
    return
  }

  // A door is drawn the way architects do: the open door leaf at a right
  // angle to the wall, and a quarter circle showing the path it swings
  // through. opening.side (1 or -1) decides which side of the wall that is.
  const open = angle + (opening.side * Math.PI) / 2
  const leafEnd = {
    x: from.x + Math.cos(open) * opening.width,
    y: from.y + Math.sin(open) * opening.width,
  }
  drawLine(ctx, from, leafEnd)
  ctx.lineWidth = 1 * px
  ctx.beginPath()
  ctx.arc(from.x, from.y, opening.width, Math.min(angle, open), Math.max(angle, open))
  ctx.stroke()
}

const drawFurniture = (ctx, piece, color, px) => {
  const w = piece.width
  const d = piece.depth

  // move to the piece's centre and turn, then draw it as if it were not rotated
  ctx.save()
  ctx.translate(piece.x, piece.y)
  ctx.rotate((piece.rotation * Math.PI) / 180)

  ctx.fillStyle = FURNITURE_FILL
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5 * px
  ctx.fillRect(-w / 2, -d / 2, w, d)
  ctx.strokeRect(-w / 2, -d / 2, w, d)

  // a line near one edge marks the back, so you can see which way it faces
  const back = -d / 2 + Math.min(0.1, d * 0.2)
  drawLine(ctx, { x: -w / 2, y: back }, { x: w / 2, y: back })
  ctx.restore()
}

// Writes the wall's length above its middle, turned to run along the wall.
const drawLength = (ctx, wall, toScreen) => {
  const length = wallLength(wall)
  if (length === 0) return

  const a = toScreen(wall.start)
  const b = toScreen(wall.end)
  let angle = Math.atan2(b.y - a.y, b.x - a.x)
  // flip text that would be upside down
  if (angle > Math.PI / 2 || angle <= -Math.PI / 2) angle += Math.PI

  ctx.save()
  ctx.translate((a.x + b.x) / 2, (a.y + b.y) / 2)
  ctx.rotate(angle)
  ctx.font = '12px monospace'
  ctx.fillText(`${length.toFixed(2)} m`, 0, -10)
  ctx.restore()
}

const drawName = (ctx, piece, toScreen, scale) => {
  // a piece turned 90 degrees is as wide on screen as it is deep
  const sideways = piece.rotation % 180 !== 0
  const room = (sideways ? piece.depth : piece.width) * scale
  if (room < 30) return

  const centre = toScreen(piece)
  ctx.font = '11px sans-serif'
  // the last argument squeezes a long name to fit inside the piece
  ctx.fillText(piece.name, centre.x, centre.y, room - 8)
}

// scene = { walls, openings, furniture, zoom } plus these optional parts:
//   center      the plan position shown in the middle of the canvas
//   selectedId  id of the item to highlight
//   draft       the wall being drawn right now
//   ghost       the door or window that a click would place
//   ghostPiece  the furniture that a click would place
//   snapPoint   the grid point the next wall corner would land on
//   showCorners true to draw the grab rings on the wall corners
const drawPlan = (ctx, size, scene) => {
  const { walls, openings, furniture, zoom, selectedId, draft, ghost, ghostPiece, snapPoint, showCorners } =
    scene
  const center = scene.center || { x: 0, y: 0 }
  const scale = PIXELS_PER_METRE * zoom
  const px = 1 / scale
  // On sharp screens one CSS pixel is 2 or 3 real pixels. The canvas is made
  // that much bigger and everything is scaled up, otherwise lines look blurry.
  const dpr = window.devicePixelRatio || 1

  const colorOf = (item, normal) => (item.id === selectedId ? SELECTED : normal)
  const wallOf = (opening) => walls.find((wall) => wall.id === opening.wallId)

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, size.width, size.height)

  // From here we draw in metres. The canvas does the conversion to pixels
  // for us, so zooming is just a different scale and no drawing code has to
  // know about it.
  ctx.translate(size.width / 2, size.height / 2)
  ctx.scale(scale, scale)
  ctx.translate(-center.x, -center.y)

  drawGrid(ctx, size, scale, center)

  // furniture first, so walls are drawn over it where they touch
  for (const piece of furniture) drawFurniture(ctx, piece, colorOf(piece, FURNITURE), px)
  for (const wall of walls) drawWall(ctx, wall, colorOf(wall, WALL), px)
  if (draft) drawWall(ctx, draft, PREVIEW, px)

  // openings come after the walls because they paint a gap over them
  for (const opening of openings) {
    drawOpening(ctx, wallOf(opening), opening, colorOf(opening, OPENING), px)
  }
  if (ghost) drawOpening(ctx, wallOf(ghost), ghost, PREVIEW, px)
  if (ghostPiece) drawFurniture(ctx, ghostPiece, PREVIEW, px)

  // a small ring on every wall corner shows that it can be grabbed and moved
  if (showCorners) {
    ctx.fillStyle = BACKGROUND
    ctx.strokeStyle = PREVIEW
    ctx.lineWidth = 1.5 * px
    for (const wall of walls) {
      for (const corner of [wall.start, wall.end]) {
        ctx.beginPath()
        ctx.arc(corner.x, corner.y, 4 * px, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
    }
  }

  if (snapPoint) {
    ctx.fillStyle = PREVIEW
    ctx.beginPath()
    ctx.arc(snapPoint.x, snapPoint.y, 4 * px, 0, Math.PI * 2)
    ctx.fill()
  }

  // Back to pixels for the text, so it stays the same size at every zoom.
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const toScreen = (point) => ({
    x: size.width / 2 + (point.x - center.x) * scale,
    y: size.height / 2 + (point.y - center.y) * scale,
  })

  ctx.fillStyle = LABEL
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const wall of walls) drawLength(ctx, wall, toScreen)
  if (draft) drawLength(ctx, draft, toScreen)
  for (const piece of furniture) drawName(ctx, piece, toScreen, scale)
}

export default drawPlan
