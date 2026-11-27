// Builds one piece of furniture for the 3D view.
//
// A piece is shown in one of three ways, best first:
//   1. its GLTF model, if the catalogue names one
//   2. a simple shape made of a few boxes and cylinders (data/furnitureShapes)
//   3. a plain box of its size, for anything else
// A piece with a model starts as 2 or 3 and is swapped when the model arrives.

import * as THREE from 'three'
import furnitureShapes from '../data/furnitureShapes.jsx'
import loadModel, { fitModel } from './loadModel.jsx'
import dispose from './dispose.jsx'

const plainBox = [{ at: [0, 0.5, 0], size: [1, 1, 1], color: '#b08968' }]

// Puts the parts of a simple shape together. Each part is given in
// fractions of the piece, so it is multiplied by the piece's real size here.
const buildShape = (piece) => {
  const shape = new THREE.Group()

  for (const part of furnitureShapes[piece.itemId] || plainBox) {
    const width = part.size[0] * piece.width
    const height = part.size[1] * piece.height
    const depth = part.size[2] * piece.depth

    const material = new THREE.MeshStandardMaterial({
      color: part.color,
      transparent: part.opacity !== undefined,
      opacity: part.opacity ?? 1,
      // a mirror is fully metal and perfectly smooth, everything else is matt
      metalness: part.shiny ? 1 : 0,
      roughness: part.shiny ? 0.05 : 0.8,
    })

    let mesh
    if (part.round) {
      // a cylinder one metre across, stretched to the part's width and depth
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, height, 24), material)
      mesh.scale.set(width, 1, depth)
    } else {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
    }

    mesh.position.set(
      part.at[0] * piece.width,
      part.at[1] * piece.height,
      part.at[2] * piece.depth
    )
    mesh.castShadow = part.opacity === undefined // glass casts no shadow
    mesh.receiveShadow = true
    shape.add(mesh)
  }

  return shape
}

// room is the group the piece will live in. onChange is called when the
// piece's model has arrived, so the picture can be made again.
const buildFurniture = (piece, room, onChange) => {
  // pieces saved before heights existed get a sensible one
  const sized = { ...piece, height: piece.height || 0.8 }

  // The holder carries the piece's place in the room. Whatever is put
  // inside it only has to stand at the holder's own centre.
  const holder = new THREE.Group()
  holder.position.set(piece.x, piece.lift || 0, piece.y)
  holder.rotation.y = (-piece.rotation * Math.PI) / 180

  const shape = buildShape(sized)
  holder.add(shape)

  if (piece.model) {
    // Loading takes a moment, so the model arrives later and takes the
    // shape's place. If loading fails the shape simply stays.
    loadModel(piece.model)
      .then((template) => {
        // the room may have been replaced while the model was on its way
        if (room.userData.disposed) return
        holder.remove(shape)
        dispose(shape)
        holder.add(fitModel(template, sized))
        onChange()
      })
      .catch(() => {})
  }

  return holder
}

export default buildFurniture
