// Selecting and moving furniture in the 3D view with the mouse.
//
//   click a piece          select it (the same selection as in the 2D plan)
//   drag a piece           slide it across the floor
//   click empty space      clear the selection
//   drag empty space       turn the camera, as before (OrbitControls)
//
// Finding what is under the mouse is called raycasting: a ray is shot from
// the camera through the mouse point, and Three.js lists every mesh it hits,
// nearest first.
//
// While a piece is dragged only its Three.js object moves. The store is
// written once, when the mouse is let go. Writing on every mouse move would
// rebuild the whole room (and fit every model again) many times a second,
// and would also fill the undo history with tiny steps.

import * as THREE from 'three'
import useRoomStore from '../store/useRoomStore.jsx'
import useEditorStore from '../store/useEditorStore.jsx'

const CLICK_DISTANCE = 4 // pixels the mouse may move and still count as a click

// Starts listening to the mouse and returns a function that stops it.
// getRoom returns the room group being shown, which changes on every rebuild.
const startSelecting = ({ camera, canvas, getRoom, render }) => {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  // the floor as an endless flat surface, for working out where a drag is
  const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const floorPoint = new THREE.Vector3()

  let press = null // where the mouse went down on empty space
  let drag = null // the piece being moved: { holder, dx, dz, moved }

  // Point the ray from the camera through the mouse. The ray wants the mouse
  // position from -1 to 1 across the canvas, with up being positive.
  const aim = (e) => {
    const box = canvas.getBoundingClientRect()
    pointer.set(
      ((e.clientX - box.left) / box.width) * 2 - 1,
      -((e.clientY - box.top) / box.height) * 2 + 1
    )
    raycaster.setFromCamera(pointer, camera)
  }

  // The piece under the mouse, or null. A hit is usually a small mesh deep
  // inside a model, so the search climbs up to the holder that carries the
  // piece's id (set in buildFurniture).
  const findPiece = () => {
    const room = getRoom()
    if (!room) return null
    const holders = room.children.filter((child) => child.userData.pieceId)
    // only meshes count, not the lines of the selection box
    const hit = raycaster.intersectObjects(holders, true).find((h) => h.object.isMesh)
    let object = hit?.object
    while (object && !object.userData.pieceId) object = object.parent
    return object || null
  }

  const onPointerDown = (e) => {
    // left button only, and not in walk mode where the keyboard is in charge
    if (e.button !== 0 || useEditorStore.getState().cameraMode === 'walk') return
    aim(e)
    const holder = findPiece()

    if (!holder) {
      // empty space: let OrbitControls turn the camera, and remember the
      // spot in case this turns out to be a click
      press = { x: e.clientX, y: e.clientY }
      return
    }

    // A piece: this press is ours. stopPropagation keeps OrbitControls from
    // also seeing it, so the camera stays still while the piece moves.
    e.stopPropagation()
    useEditorStore.getState().setSelectedId(holder.userData.pieceId)

    // dx and dz remember where on the piece it was grabbed, so it does not
    // jump to put its centre under the mouse
    raycaster.ray.intersectPlane(floor, floorPoint)
    drag = {
      holder,
      dx: holder.position.x - floorPoint.x,
      dz: holder.position.z - floorPoint.z,
      moved: false,
    }
    canvas.style.cursor = 'grabbing'
  }

  const onPointerMove = (e) => {
    aim(e)

    if (drag) {
      if (!raycaster.ray.intersectPlane(floor, floorPoint)) return // pointing at the sky
      drag.holder.position.x = floorPoint.x + drag.dx
      drag.holder.position.z = floorPoint.z + drag.dz
      drag.moved = true
      render()
      return
    }

    // no button held: show a hand over furniture, so it is clear it can be picked up
    if (e.buttons === 0 && e.target === canvas) {
      const overPiece = useEditorStore.getState().cameraMode !== 'walk' && findPiece()
      canvas.style.cursor = overPiece ? 'grab' : ''
    }
  }

  const onPointerUp = (e) => {
    if (drag) {
      // now the move goes to the store: checkpoint() first, so undo puts
      // the piece back where the drag started
      if (drag.moved) {
        const { checkpoint, moveFurniture } = useRoomStore.getState()
        checkpoint()
        moveFurniture(drag.holder.userData.pieceId, drag.holder.position.x, drag.holder.position.z)
      }
      drag = null
      canvas.style.cursor = 'grab'
    } else if (press) {
      // the mouse hardly moved, so it was a click on empty space, not a camera turn
      const distance = Math.hypot(e.clientX - press.x, e.clientY - press.y)
      if (distance < CLICK_DISTANCE) useEditorStore.getState().setSelectedId(null)
    }
    press = null
  }

  // The press is listened to on the canvas's parent, in the capture phase,
  // so this code sees it before OrbitControls (which listens on the canvas)
  // and can stop it. Moves and releases are listened to on the window, so a
  // drag carries on even when the mouse leaves the canvas.
  const parent = canvas.parentElement
  parent.addEventListener('pointerdown', onPointerDown, { capture: true })
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)

  return () => {
    parent.removeEventListener('pointerdown', onPointerDown, { capture: true })
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }
}

export default startSelecting
