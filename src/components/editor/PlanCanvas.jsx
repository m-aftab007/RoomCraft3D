// The 2D plan: a <canvas> that shows the room and turns mouse actions into
// changes in the stores.
//
// The data only moves one way. The mouse never draws anything itself, it
// calls a store action (addWall, addOpening, moveFurniture...). The store
// changes, this component renders again and repaints the canvas from the
// store. The 3D view listens to the same store, which is what keeps the two
// views in sync.

import { useEffect, useRef, useState } from 'react'
import { useDrop } from 'react-dnd'
import useRoomStore from '../../store/useRoomStore.jsx'
import useEditorStore from '../../store/useEditorStore.jsx'
import drawPlan from '../../canvas/drawPlan.jsx'
import {
  PIXELS_PER_METRE,
  snap,
  samePoint,
  findItemAt,
  findCornerAt,
  placeOpening,
  slideOpening,
  canMoveCorner,
} from '../../canvas/geometry.jsx'

const cursors = { select: 'cursor-default', hand: 'cursor-grab' }

const PlanCanvas = () => {
  const canvasRef = useRef(null)
  // Size of the canvas on screen. This is about the browser window, not the
  // room, so it is fine as local state.
  const [size, setSize] = useState({ width: 0, height: 0 })

  const walls = useRoomStore((state) => state.walls)
  const openings = useRoomStore((state) => state.openings)
  const furniture = useRoomStore((state) => state.furniture)
  const addWall = useRoomStore((state) => state.addWall)
  const addOpening = useRoomStore((state) => state.addOpening)
  const addFurniture = useRoomStore((state) => state.addFurniture)
  const moveFurniture = useRoomStore((state) => state.moveFurniture)
  const moveOpening = useRoomStore((state) => state.moveOpening)
  const moveCorner = useRoomStore((state) => state.moveCorner)
  const checkpoint = useRoomStore((state) => state.checkpoint)

  const tool = useEditorStore((state) => state.tool)
  const zoom = useEditorStore((state) => state.zoom)
  const pan = useEditorStore((state) => state.pan)
  const cursor = useEditorStore((state) => state.cursor)
  const draftStart = useEditorStore((state) => state.draftStart)
  const placingItem = useEditorStore((state) => state.placingItem)
  const selectedId = useEditorStore((state) => state.selectedId)
  const dragging = useEditorStore((state) => state.dragging)
  const setTool = useEditorStore((state) => state.setTool)
  const setCursor = useEditorStore((state) => state.setCursor)
  const setDraftStart = useEditorStore((state) => state.setDraftStart)
  const setSelectedId = useEditorStore((state) => state.setSelectedId)
  const setDragging = useEditorStore((state) => state.setDragging)
  const panBy = useEditorStore((state) => state.panBy)
  const cancel = useEditorStore((state) => state.cancel)

  const scale = PIXELS_PER_METRE * zoom // pixels per metre right now

  // previews of what the next click would add
  const snapPoint = tool === 'wall' ? { x: snap(cursor.x), y: snap(cursor.y) } : null
  const draft = snapPoint && draftStart ? { start: draftStart, end: snapPoint } : null
  const ghost =
    tool === 'door' || tool === 'window' ? placeOpening(tool, cursor, walls, openings) : null
  const ghostPiece = placingItem ? { ...placingItem, x: cursor.x, y: cursor.y, rotation: 0 } : null

  // keep the canvas the same size as the space it is given
  useEffect(() => {
    const canvas = canvasRef.current
    const observer = new ResizeObserver(() => {
      setSize({ width: canvas.clientWidth, height: canvas.clientHeight })
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  // Repaint after every render. There is no dependency list on purpose: the
  // component only renders when a value it reads above has changed, and
  // every one of those values affects the picture.
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    drawPlan(ctx, size, {
      walls,
      openings,
      furniture,
      zoom,
      center: pan,
      selectedId,
      draft,
      ghost,
      ghostPiece,
      snapPoint,
      showCorners: tool === 'select',
    })
  })

  // Turns a position on the screen into a position on the plan, in metres.
  // The middle of the canvas shows the point `pan`, so we measure from the
  // middle and add pan.
  const toPlan = (clientX, clientY) => {
    const box = canvasRef.current.getBoundingClientRect()
    return {
      x: (clientX - box.left - box.width / 2) / scale + pan.x,
      y: (clientY - box.top - box.height / 2) / scale + pan.y,
    }
  }

  // Furniture dragged from the sidebar is dropped here. react-dnd tells us
  // where the mouse was let go, and the piece is added with its centre there.
  const [, drop] = useDrop({
    accept: 'furniture',
    drop: (item, monitor) => {
      const mouse = monitor.getClientOffset()
      const point = toPlan(mouse.x, mouse.y)
      addFurniture(item, point.x, point.y)
      // back to the select tool, so the new piece can be moved straight away
      setTool('select')
    },
  })

  // A wall can be drawn in two ways, and both work at the same time:
  //   click, click, click   each press adds a wall from the last corner
  //   press, drag, release  one wall from where the button went down to where it came up
  // Pressing the button places a corner at once, there is nothing to wait for.
  const handleMouseDown = (e) => {
    // the middle button moves the view, so stop the browser's own scroll mode
    if (e.button === 1) e.preventDefault()
    if (e.button !== 0) return // everything below is for the left button
    const point = toPlan(e.clientX, e.clientY)

    if (tool === 'wall') {
      const corner = { x: snap(point.x), y: snap(point.y) }
      if (draftStart && !samePoint(corner, draftStart)) addWall(draftStart, corner)
      // the next wall starts at this corner, so a room is drawn in one go
      setDraftStart(corner)
    } else if (tool === 'select') {
      // Pressing on something also picks it up. What is being dragged is
      // written to `dragging`, and handleMouseMove moves it.
      // Wall corners are checked first. 10 / scale is ten pixels in metres,
      // so a corner is as easy to hit when zoomed out as when zoomed in.
      const corner = findCornerAt(point, walls, 10 / scale)
      if (corner) {
        setSelectedId(null)
        setDragging({ kind: 'corner', point: corner, saved: false })
        return
      }

      const id = findItemAt(point, { walls, openings, furniture })
      setSelectedId(id)
      const piece = furniture.find((p) => p.id === id)
      if (piece) {
        // dx and dy remember where on the piece it was grabbed
        const grab = { dx: point.x - piece.x, dy: point.y - piece.y }
        setDragging({ kind: 'furniture', id, ...grab, saved: false })
      } else if (openings.some((o) => o.id === id)) {
        setDragging({ kind: 'opening', id, saved: false })
      }
    } else if (tool === 'door' || tool === 'window') {
      const opening = placeOpening(tool, point, walls, openings)
      if (opening) addOpening(opening)
    } else if (tool === 'furniture') {
      // the item stays in hand, so the same piece can be placed again and again
      addFurniture(placingItem, point.x, point.y)
    }
    // the hand tool does nothing on press, it moves the view in handleMouseMove
  }

  const handleMouseMove = (e) => {
    // e.buttons tells which buttons are held down right now: 1 is left, 4 is middle
    const leftHeld = (e.buttons & 1) !== 0
    const middleHeld = (e.buttons & 4) !== 0

    // Moving the view: movementX and movementY are how many pixels the mouse
    // moved since the last event. The view goes the opposite way, so the
    // plan follows the mouse like a sheet of paper being pushed around.
    if ((tool === 'hand' && leftHeld) || middleHeld) {
      panBy(-e.movementX / scale, -e.movementY / scale)
      return
    }

    const point = toPlan(e.clientX, e.clientY)
    setCursor(point)
    if (!dragging) return

    // on the first movement of a drag, remember the room for undo (once)
    let drag = dragging
    if (!drag.saved) {
      checkpoint()
      drag = { ...drag, saved: true }
      setDragging(drag)
    }

    if (drag.kind === 'furniture') {
      // taking dx and dy off keeps the piece under the mouse where it was grabbed
      moveFurniture(drag.id, point.x - drag.dx, point.y - drag.dy)
    } else if (drag.kind === 'opening') {
      // a door or window slides along its wall, and stops at another opening
      const opening = openings.find((o) => o.id === drag.id)
      const offset = slideOpening(opening, point, walls, openings)
      if (offset !== null) moveOpening(drag.id, offset)
    } else {
      // A corner jumps from grid point to grid point. The drag keeps the
      // corner's current position, because that is how its walls are found.
      const target = { x: snap(point.x), y: snap(point.y) }
      if (!samePoint(target, drag.point) && canMoveCorner(drag.point, target, walls, openings)) {
        moveCorner(drag.point, target)
        setDragging({ ...drag, point: target })
      }
    }
  }

  const handleMouseUp = (e) => {
    if (e.button !== 0) return
    setDragging(null)

    // The button came up on a different corner than it went down on, so the
    // wall was drawn by dragging. That wall is finished and the chain ends.
    if (tool === 'wall' && draftStart) {
      const point = toPlan(e.clientX, e.clientY)
      const corner = { x: snap(point.x), y: snap(point.y) }
      if (!samePoint(corner, draftStart)) {
        addWall(draftStart, corner)
        setDraftStart(null)
      }
    }
  }

  const dpr = window.devicePixelRatio || 1

  return (
    // react-dnd needs an element to watch for drops. The arrow function is
    // there because React 19 expects a ref function to return nothing.
    <div
      ref={(node) => {
        drop(node)
      }}
      className="absolute inset-0"
    >
      <canvas
        ref={canvasRef}
        // the real pixel size, see the note about sharp screens in drawPlan
        width={size.width * dpr}
        height={size.height * dpr}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setDragging(null)}
        // the mouse wheel (or two fingers on a touchpad) also moves the view
        onWheel={(e) => panBy(e.deltaX / scale, e.deltaY / scale)}
        // a double click ends the chain of walls
        onDoubleClick={() => setDraftStart(null)}
        // the right button cancels, like Esc, instead of opening the browser menu
        onContextMenu={(e) => {
          e.preventDefault()
          cancel()
        }}
        className={
          'h-full w-full ' + (dragging ? 'cursor-move' : cursors[tool] || 'cursor-crosshair')
        }
      />
    </div>
  )
}

export default PlanCanvas
