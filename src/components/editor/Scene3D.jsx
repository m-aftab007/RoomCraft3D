// The 3D view of the room.
//
// It reads the same walls, openings and furniture from the room store as the
// 2D plan does. The two views never talk to each other: whatever is drawn in
// 2D lands in the store, and this component rebuilds the 3D room from the
// store. That is the sync between the views.
//
// The work is split in six effects:
//   1. set up Three.js once (renderer, camera, lights, mouse controls)
//   2. rebuild the room and its wall labels when walls, openings or furniture change
//   3. repaint walls and floor when their colour changes
//   4. switch between the orbit camera and walk mode
//   5. draw the box around the selected piece
//   6. show or hide the wall measurements

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'
import useRoomStore from '../../store/useRoomStore.jsx'
import useEditorStore from '../../store/useEditorStore.jsx'
import startWalking from '../../three/walkControls.jsx'
import startSelecting from '../../three/selectControls.jsx'
import showSelection from '../../three/selectionBox.jsx'
import buildRoom, { disposeRoom } from '../../three/buildRoom.jsx'
import buildLabels, { createLabelGroup } from '../../three/buildLabels.jsx'
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
  const cameraMode = useEditorStore((state) => state.cameraMode)
  const wallColor = useRoomStore((state) => state.wallColor)
  const floorColor = useRoomStore((state) => state.floorColor)
  const selectedId = useEditorStore((state) => state.selectedId)
  const showMeasurements = useEditorStore((state) => state.showMeasurements)

  // 1. set up, once
  useEffect(() => {
    const box = boxRef.current

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0f172a')

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    // Tone mapping squeezes bright light into the range a screen can show,
    // the way a camera does. Without it, light walls under a strong sun all
    // turn the same flat white and the rooms cannot be told apart.
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // PCF shadow maps, which blur shadow edges a little so they are not jagged
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    box.appendChild(renderer.domElement)

    // A second renderer for the wall labels. It draws no pixels: it moves
    // HTML elements to where their points in the scene appear on screen. Its
    // layer lies over the canvas and lets the mouse through to it, so
    // clicking and dragging still reach the 3D view.
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.domElement.className = 'pointer-events-none absolute inset-0'
    box.appendChild(labelRenderer.domElement)

    // The furniture models use PBR materials, and shiny or metal surfaces
    // only look right when they have surroundings to reflect. RoomEnvironment
    // is a simple ready-made studio that Three.js turns into that reflection.
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment()).texture
    scene.environmentIntensity = 0.3
    pmrem.dispose()

    // An ambient light fills in the shadows so nothing is black, and a
    // directional light acts as the sun and is the one that casts shadows.
    // The sun is kept moderate, so walls facing it and walls facing away get
    // clearly different shades.
    scene.add(new THREE.AmbientLight('#ffffff', 0.4))
    const sun = new THREE.DirectionalLight('#fff4e5', 2)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    // these two stop a surface from casting striped shadows onto itself
    sun.shadow.bias = -0.0005
    sun.shadow.normalBias = 0.02
    scene.add(sun, sun.target)

    // Start by looking at the room steeply from above and in front, so the
    // camera sees into the rooms instead of mostly at the outside walls.
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200)
    const { x, z, size } = measure(useRoomStore.getState())
    camera.position.set(x, size * 1.2, z + size * 0.8)

    // OrbitControls: drag to turn around the room, wheel to zoom, right drag to move
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(x, 1, z)
    controls.maxPolarAngle = Math.PI / 2 - 0.05 // do not let the camera go under the floor
    controls.update()

    // Nothing moves by itself in the scene, so there is no animation loop.
    // A new picture is only made when the camera moves or the room changes.
    // The labels are placed again with every picture, so they follow the camera.
    const render = () => {
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    controls.addEventListener('change', render)

    // the labels live in their own group, outside the room, see effect 2
    const labels = createLabelGroup()
    scene.add(labels)

    // keep the picture the same size as the space it is given
    const observer = new ResizeObserver(() => {
      renderer.setSize(box.clientWidth, box.clientHeight)
      labelRenderer.setSize(box.clientWidth, box.clientHeight)
      camera.aspect = box.clientWidth / box.clientHeight
      camera.updateProjectionMatrix()
      render()
    })
    observer.observe(box)

    three.current = { scene, sun, camera, controls, render, labels, room: null }

    // clicking and dragging furniture. getRoom is a function because the
    // room is replaced on every rebuild.
    const stopSelecting = startSelecting({
      camera,
      canvas: renderer.domElement,
      getRoom: () => three.current?.room,
      render,
    })

    // leaving the 3D view: give the graphics memory back
    return () => {
      stopSelecting()
      observer.disconnect()
      controls.dispose()
      if (three.current.room) disposeRoom(three.current.room)
      renderer.dispose()
      renderer.domElement.remove()
      labelRenderer.domElement.remove() // takes all the label elements with it
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
    // The colours are read with getState() instead of from the hooks above.
    // That way a colour change does not rebuild the room (effect 3 below
    // handles it), but a rebuilt room still gets the current colours.
    // render is passed along so the picture is made again each time a
    // furniture model finishes loading.
    const { wallColor, floorColor } = useRoomStore.getState()
    const room = buildRoom({ walls, openings, furniture, wallColor, floorColor }, render)
    scene.add(room)
    three.current.room = room
    // the new room has no selection box yet, so give the selected piece its box again
    showSelection(room, useEditorStore.getState().selectedId)
    // A wall may have been moved or added, so the labels are made again too.
    // They are kept outside the room group, because the room is thrown away
    // on every rebuild and a label's HTML element only leaves the page when
    // the label itself is removed (see buildLabels).
    buildLabels(three.current.labels, walls)

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

  // 3. a new wall or floor colour only repaints the shared materials, which
  //    is instant, instead of building every wall and model again
  useEffect(() => {
    const { room, render } = three.current
    room.userData.wallMaterial.color.set(wallColor)
    room.userData.floorMaterial.color.set(floorColor)
    render()
  }, [wallColor, floorColor])

  // 4. walk mode: hand the camera from the mouse to the keyboard, and back
  useEffect(() => {
    if (cameraMode !== 'walk') return
    const { camera, controls } = three.current

    // remember the orbit view, so leaving walk mode returns to it
    const orbitPosition = camera.position.clone()
    const orbitFov = camera.fov
    controls.enabled = false
    const stopWalking = startWalking(camera, three.current.render)

    return () => {
      stopWalking()
      // the whole 3D view may be closing, then there is nothing to put back
      if (!three.current) return
      camera.position.copy(orbitPosition)
      camera.fov = orbitFov
      camera.updateProjectionMatrix()
      controls.enabled = true
      controls.update() // points the camera at the room again, and redraws
    }
  }, [cameraMode])

  // 5. a new selection moves the blue box, without rebuilding the room
  useEffect(() => {
    const { room, render } = three.current
    showSelection(room, selectedId)
    render()
  }, [selectedId])

  // 6. the measurements button, and walk mode, where labels above the walls
  //    would only get in the way of the view
  useEffect(() => {
    const { labels, render } = three.current
    labels.visible = showMeasurements && cameraMode === 'orbit'
    render()
  }, [showMeasurements, cameraMode])

  return <div ref={boxRef} className="absolute inset-0" />
}

export default Scene3D
