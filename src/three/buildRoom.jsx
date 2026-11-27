// Turns the room from the store into Three.js objects.
//
// This is the 3D twin of drawPlan: it gets the same walls, openings and
// furniture and builds a picture of them, only as meshes instead of canvas
// lines. It reads no store and knows nothing about React.
//
// The work is done by the files next to this one:
//   buildWalls      walls with door and window gaps
//   buildFurniture  one piece of furniture (model, simple shape or box)
//   loadModel       loading and fitting GLTF models
//   dispose         giving graphics memory back

import * as THREE from 'three'
import { getBounds } from '../canvas/geometry.jsx'
import buildWalls from './buildWalls.jsx'
import buildFurniture from './buildFurniture.jsx'
import dispose from './dispose.jsx'

// onChange is called when a furniture model has finished loading and has
// been put in the room, so the caller knows the picture needs to be made again.
const buildRoom = ({ walls, openings, furniture, wallColor, floorColor }, onChange) => {
  const room = new THREE.Group()

  // MeshStandardMaterial is Three.js's PBR material, it reacts to light the
  // way real surfaces do. All walls share one material and the floor has its
  // own. They are kept on the room, so a colour change only has to set the
  // material's colour instead of building the whole room again.
  const wallMaterial = new THREE.MeshStandardMaterial({ color: wallColor })
  const floorMaterial = new THREE.MeshStandardMaterial({ color: floorColor })
  room.userData.wallMaterial = wallMaterial
  room.userData.floorMaterial = floorMaterial

  // the floor is a flat sheet a little larger than the room
  const box = getBounds({ walls, furniture })
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(box.maxX - box.minX + 2, box.maxY - box.minY + 2),
    floorMaterial
  )
  floor.rotation.x = -Math.PI / 2 // a plane is made standing up, this lays it down
  floor.position.set((box.minX + box.maxX) / 2, 0, (box.minY + box.maxY) / 2)
  floor.receiveShadow = true
  room.add(floor)

  room.add(buildWalls(walls, openings, wallMaterial))
  for (const piece of furniture) room.add(buildFurniture(piece, room, onChange))

  return room
}

// Called when a room is replaced or the 3D view is closed. The flag tells
// models that are still loading not to add themselves to a room that is gone.
export const disposeRoom = (room) => {
  room.userData.disposed = true
  dispose(room)
}

export default buildRoom
