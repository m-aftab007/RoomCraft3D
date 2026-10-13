// The 3D view of the room.
//
// It reads the same walls, openings and furniture from the room store as the
// 2D plan does. The two views never talk to each other: whatever is drawn in
// 2D lands in the store, and this component rebuilds the 3D room from the
// store. That is the sync between the views.
//
// The work is split in two effects:
//   1. set up Three.js once (renderer, camera, lights, mouse controls)
//   2. rebuild the room every time the store changes

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import useRoomStore from '../../store/useRoomStore.jsx'
import buildRoom, { disposeRoom } from '../../three/buildRoom.jsx'
import { getBounds } from '../../canvas/geometry.jsx'

// the middle of the room and the length of its longer side
const measure = (room) => {
  const box = getBounds(room)
  return {
    x: (box.minX + box.maxX) / 2,
    z: (box.minY + box.maxY) / 2,
    size: Math.max(box.maxX - box.minX, box.maxY - box.minY, 4),
  }
}

const Scene3D = () => {
  const boxRef = useRef(null)
  // the Three.js objects that both effects need. A ref, not state, because
  // changing them must not make React render again.
  const three = useRef(null)

  const walls = useRoomStore((state) => state.walls)
  const openings = useRoomStore((state) => state.openings)
  const furniture = useRoomStore((state) => state.furniture)

  // 1. set up, once
  useEffect(() => {
    const box = boxRef.current

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0f172a')

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    // PCF shadow maps with soft edges
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    box.appendChild(renderer.domElement)

    // An ambient light fills in the shadows so nothing is black, and a
    // directional light acts as the sun and is the one that casts shadows.
    scene.add(new THREE.AmbientLight('#ffffff', 1))
    const sun = new THREE.DirectionalLight('#ffffff', 2.5)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    // these two stop a surface from casting striped shadows onto itself
    sun.shadow.bias = -0.0005
    sun.shadow.normalBias = 0.02
    scene.add(sun, sun.target)

    // start by looking at the room from above and in front
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200)
    const { x, z, size } = measure(useRoomStore.getState())
    camera.position.set(x, size * 0.9, z + size * 1.1)

    // OrbitControls: drag to turn around the room, wheel to zoom, right drag to move
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(x, 1, z)
    controls.maxPolarAngle = Math.PI / 2 - 0.05 // do not let the camera go under the floor
    controls.update()

    // Nothing moves by itself in the scene, so there is no animation loop.
    // A new picture is only made when the camera moves or the room changes.
    const render = () => renderer.render(scene, camera)
    controls.addEventListener('change', render)

    // keep the picture the same size as the space it is given
    const observer = new ResizeObserver(() => {
      renderer.setSize(box.clientWidth, box.clientHeight)
      camera.aspect = box.clientWidth / box.clientHeight
      camera.updateProjectionMatrix()
      render()
    })
    observer.observe(box)

    three.current = { scene, sun, render, room: null }

    // leaving the 3D view: give the graphics memory back
    return () => {
      observer.disconnect()
      controls.dispose()
      if (three.current.room) disposeRoom(three.current.room)
      renderer.dispose()
      renderer.domElement.remove()
      three.current = null
    }
  }, [])

  // 2. rebuild the room whenever the store changes
  useEffect(() => {
    const { scene, sun, render } = three.current

    // Throw the old room away and build a new one. Rebuilding everything is
    // simpler than finding out what changed, and fast enough for one room.
    if (three.current.room) {
      scene.remove(three.current.room)
      disposeRoom(three.current.room)
    }
    const room = buildRoom({ walls, openings, furniture })
    scene.add(room)
    three.current.room = room

    // Put the sun high above one corner, pointing at the middle. A sun's
    // shadow is only worked out inside a box around its target, so that box
    // is made large enough to hold the whole room.
    const { x, z, size } = measure({ walls, furniture })
    sun.position.set(x + size * 0.6, size * 1.5, z + size * 0.4)
    sun.target.position.set(x, 0, z)
    const reach = size / 2 + 2
    sun.shadow.camera.left = -reach
    sun.shadow.camera.right = reach
    sun.shadow.camera.top = reach
    sun.shadow.camera.bottom = -reach
    sun.shadow.camera.far = size * 4
    sun.shadow.camera.updateProjectionMatrix()

    render()
  }, [walls, openings, furniture])

  return <div ref={boxRef} className="absolute inset-0" />
}

export default Scene3D
