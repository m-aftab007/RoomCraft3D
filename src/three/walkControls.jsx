// Walk mode: a first-person view of the room.
//
// The camera is put at eye height and moved with the keyboard, the way a
// person would walk through the room:
//   Up, Down     (or W, S)  walk forward and back
//   Left, Right  (or A, D)  turn
// Walls stop you, doorways let you through.

import useRoomStore from '../store/useRoomStore.jsx'
import { getBounds, isInsideWall } from '../canvas/geometry.jsx'

const EYE_HEIGHT = 1.6 // metres above the floor
const WALK_SPEED = 2 // metres per second
const TURN_SPEED = 1.8 // radians per second, about 100 degrees
const BODY = 0.2 // how close to a wall a person can get, in metres
const FIELD_OF_VIEW = 70 // wider than the orbit camera, closer to what an eye sees

// Starts walk mode and returns a function that stops it.
const startWalking = (camera, render) => {
  // the keys that are held down right now
  const keys = new Set()
  const held = (a, b) => (keys.has(a) || keys.has(b) ? 1 : 0)

  // The direction the person faces, as an angle. A person only turns left
  // and right, so one number is enough.
  let angle = 0
  let last = performance.now()
  let frame

  // start in the middle of the room
  const box = getBounds(useRoomStore.getState())
  camera.position.set((box.minX + box.maxX) / 2, EYE_HEIGHT, (box.minY + box.maxY) / 2)
  camera.fov = FIELD_OF_VIEW
  camera.updateProjectionMatrix()

  const onKeyDown = (e) => {
    // leave the keys alone while the project name is being typed
    if (e.target.tagName === 'INPUT') return
    // stop the arrow keys from scrolling the page
    if (e.key.startsWith('Arrow')) e.preventDefault()
    keys.add(e.key)
  }
  const onKeyUp = (e) => keys.delete(e.key)

  // Runs once for every frame the screen shows, about 60 times a second.
  const step = (now) => {
    // dt is the time since the last frame. Multiplying speeds by it makes
    // the walk equally fast on a slow and on a fast computer.
    const dt = Math.min((now - last) / 1000, 0.1)
    last = now

    const turn = held('ArrowLeft', 'a') - held('ArrowRight', 'd')
    const walk = held('ArrowUp', 'w') - held('ArrowDown', 's')
    angle += turn * TURN_SPEED * dt

    // one step in the direction faced. The plan's y is the scene's z.
    const distance = walk * WALK_SPEED * dt
    const here = { x: camera.position.x, y: camera.position.z }
    const next = { x: here.x - Math.sin(angle) * distance, y: here.y - Math.cos(angle) * distance }

    // Take the step unless it would end inside a wall. If we are somehow
    // already inside one (the room's middle can be a wall), let us walk out.
    const { walls, openings } = useRoomStore.getState()
    const blocked = isInsideWall(next, walls, openings, BODY)
    if (!blocked || isInsideWall(here, walls, openings, BODY)) {
      camera.position.x = next.x
      camera.position.z = next.y
    }

    camera.rotation.set(0, angle, 0)
    render()
    frame = requestAnimationFrame(step)
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  frame = requestAnimationFrame(step)

  return () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  }
}

export default startWalking
