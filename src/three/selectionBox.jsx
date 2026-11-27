// The blue box drawn around the selected piece of furniture in 3D.
//
// The box is put inside the piece's holder, so it turns with the piece and
// follows it while it is dragged. It is drawn from the piece's catalogue
// size, which is also the size its model is fitted to.

import * as THREE from 'three'

const PADDING = 0.04 // a little larger than the piece, so the lines are not hidden in it

// Shows the box around the piece with this id, and removes the old one.
// With an id that is not a piece (null, or a wall), no box is shown.
const showSelection = (room, id) => {
  const old = room.userData.selectionBox
  if (old) {
    old.removeFromParent()
    old.geometry.dispose()
    old.material.dispose()
    room.userData.selectionBox = null
  }

  const holder = room.children.find((child) => child.userData.pieceId === id)
  if (!holder) return

  const { width, depth, height } = holder.userData.piece
  const edges = new THREE.EdgesGeometry(
    new THREE.BoxGeometry(width + PADDING, height + PADDING, depth + PADDING)
  )
  // depthTest off draws the lines on top of everything, so the box can be
  // seen even when a wall or the piece itself is in front of part of it
  const box = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: '#3b82f6', depthTest: false })
  )
  box.renderOrder = 1
  box.position.y = height / 2 // a box is made around its middle, this stands it on the floor
  holder.add(box)
  room.userData.selectionBox = box
}

export default showSelection
