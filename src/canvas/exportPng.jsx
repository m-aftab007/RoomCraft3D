// Downloads the floor plan as a PNG image.
//
// The image is not a copy of what is on screen. It is painted on a second,
// hidden canvas that is sized to fit the whole room, so the export always
// shows the complete plan whatever the zoom is, and without the selection
// colour or tool previews.

import drawPlan from './drawPlan.jsx'
import { PIXELS_PER_METRE, getBounds } from './geometry.jsx'
import useRoomStore from '../store/useRoomStore.jsx'

const MARGIN = 1 // metres of empty space around the room

const exportPng = () => {
  const { projectName, walls, openings, furniture } = useRoomStore.getState()
  const box = getBounds({ walls, furniture })

  const size = {
    width: (box.maxX - box.minX + MARGIN * 2) * PIXELS_PER_METRE,
    height: (box.maxY - box.minY + MARGIN * 2) * PIXELS_PER_METRE,
  }
  const center = { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 }

  const dpr = window.devicePixelRatio || 1
  const canvas = document.createElement('canvas')
  canvas.width = size.width * dpr
  canvas.height = size.height * dpr
  drawPlan(canvas.getContext('2d'), size, { walls, openings, furniture, zoom: 1, center })

  // a link with the download attribute saves its target as a file when clicked
  const link = document.createElement('a')
  link.download = `${projectName || 'floor-plan'}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export default exportPng
