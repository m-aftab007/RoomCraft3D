// Loads the GLTF furniture models from public/models.
//
// The models are Draco compressed, which makes the files much smaller but
// means the geometry has to be unpacked in the browser. DRACOLoader does
// that with the decoder files in public/draco (copied from the three package).

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

const draco = new DRACOLoader()
draco.setDecoderPath('/draco/')
const loader = new GLTFLoader()
loader.setDRACOLoader(draco)

// Every model is downloaded only once. The cache holds the promise, not the
// finished model, so two sofas asked for at the same moment share a single
// download instead of starting two.
const cache = {}

const loadModel = (name) => {
  if (!cache[name]) {
    cache[name] = loader.loadAsync(`/models/${name}.glb`).then((gltf) => gltf.scene)
  }
  return cache[name]
}

// Makes a copy of a loaded model that is exactly as large as the piece.
//
// Models come in all states: some are not centred, one floats above the
// floor, some face sideways, some were exported in centimetres. So the copy
// is turned, measured, moved to stand on the floor around its own middle,
// and then scaled to the width, height and depth the catalogue gives for it.
export const fitModel = (template, piece) => {
  // A copy shares the heavy parts (geometry and textures) with the original,
  // so ten chairs cost little more than one. SkeletonUtils.clone is used
  // instead of a plain clone() because some models are skinned meshes (built
  // on a skeleton, like animated characters). A plain copy of those stays tied
  // to the original's skeleton and is drawn where the original stands, not
  // where the piece was placed.
  const model = SkeletonUtils.clone(template)
  model.traverse((object) => {
    // marks the shared parts, so that clearing a room does not delete them
    object.userData.shared = true
    if (object.isMesh) {
      object.castShadow = true
      object.receiveShadow = true
    }
  })

  // turn the model first if it was made facing the wrong way, so it is
  // measured the way it will stand
  model.rotation.y = ((piece.turn || 0) * Math.PI) / 180

  // A skinned mesh gets its shape from its skeleton, and the skeleton is
  // normally only worked out when the model is first drawn. Working it out
  // now lets the model be measured before that.
  model.updateMatrixWorld(true)
  model.traverse((object) => {
    if (object.isSkinnedMesh) object.skeleton.update()
  })

  // true asks for an exact measurement from every point of the model. The
  // quick one is loose for parts that are turned inside the file, which left
  // some models a little off centre and smaller than their footprint.
  const box = new THREE.Box3().setFromObject(model, true)
  const size = box.getSize(new THREE.Vector3())
  const centre = box.getCenter(new THREE.Vector3())
  model.position.set(-centre.x, -box.min.y, -centre.z)

  // the scale goes on a group around the model, so it is applied after the move
  const fitted = new THREE.Group()
  fitted.add(model)
  fitted.scale.set(piece.width / size.x, piece.height / size.y, piece.depth / size.z)
  return fitted
}

export default loadModel
