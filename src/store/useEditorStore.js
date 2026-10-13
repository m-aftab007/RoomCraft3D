// State of the editor screen itself, not of the room.
//
// This is kept apart from useRoomStore because none of it belongs to the
// design: which view is open or how far we are zoomed in should not be saved
// with a layout or shared in a link. It is still a store (and not useState)
// because several components need the same values, for example the zoom is
// changed in the sidebar and shown again in the status bar.

import { create } from 'zustand'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 4
const ZOOM_STEP = 0.25

const useEditorStore = create((set) => ({
  view: '2d', // '2d' or '3d'
  tool: 'select', // 'select', 'wall', 'door' or 'window'
  zoom: 1, // 1 means 100%
  cursor: { x: 0, y: 0 }, // mouse position on the plan, set by the canvas later

  setView: (view) => set({ view }),
  setTool: (tool) => set({ tool }),

  // Math.min and Math.max keep the zoom inside its limits
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + ZOOM_STEP, MAX_ZOOM) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - ZOOM_STEP, MIN_ZOOM) })),
  resetZoom: () => set({ zoom: 1 }),
}))

export default useEditorStore
