// Three.js keeps geometry and materials in graphics memory until told to let
// go, so anything taken out of the scene has to be cleaned up by hand.
//
// The parts of loaded GLTF models are marked as shared (see loadModel) and
// are left alone, because every copy of a model uses the same ones and the
// next room will want them again.

const dispose = (object) => {
  object.traverse((child) => {
    if (!child.isMesh || child.userData.shared) return
    child.geometry.dispose()
    // a mesh has either one material or a list of them (one per side)
    for (const material of [child.material].flat()) material.dispose()
  })
}

export default dispose
