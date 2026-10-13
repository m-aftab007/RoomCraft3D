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
  tool: 'select', // 'select', 'hand', 'wall', 'door', 'window' or 'furniture'
  zoom: 1, // 1 means 100%
  // The point of the plan (in metres) shown in the middle of the canvas.
  // Moving the view only changes this point. The plan itself has no edges,
  // so a room can be drawn anywhere.
  pan: { x: 0, y: 0 },
  cursor: { x: 0, y: 0 }, // mouse position on the plan, in metres
  draftStart: null, // first corner of the wall being drawn, or null
  placingItem: null, // the catalogue item the furniture tool places, or null
  selectedId: null, // id of the selected wall, opening or furniture, or null
  // the piece of furniture being dragged: { id, dx, dy, saved }
  // dx and dy are how far from its centre it was grabbed
  dragging: null,
  notice: '', // short message in the status bar, for example "Link copied"

  setView: (view) => set({ view }),
  // changing tool also drops a half drawn wall, the selection and the furniture in hand
  setTool: (tool) =>
    set({ tool, draftStart: null, placingItem: null, selectedId: null, dragging: null }),
  // picks a catalogue item up, every click on the plan then places one
  startPlacing: (item) =>
    set({ tool: 'furniture', placingItem: item, draftStart: null, selectedId: null }),
  setCursor: (cursor) => set({ cursor }),
  setDraftStart: (point) => set({ draftStart: point }),
  setSelectedId: (id) => set({ selectedId: id }),
  setDragging: (dragging) => set({ dragging }),

  // What Esc and the right mouse button do: stop the wall being drawn, or if
  // there is none, put the tool down.
  cancel: () =>
    set((state) =>
      state.draftStart
        ? { draftStart: null }
        : { tool: 'select', placingItem: null, selectedId: null }
    ),

  // shows a message and takes it away again after three seconds
  showNotice: (text) => {
    set({ notice: text })
    setTimeout(() => set({ notice: '' }), 3000)
  },

  // moves the view by dx and dy metres
  panBy: (dx, dy) => set((state) => ({ pan: { x: state.pan.x + dx, y: state.pan.y + dy } })),

  // Math.min and Math.max keep the zoom inside its limits
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + ZOOM_STEP, MAX_ZOOM) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - ZOOM_STEP, MIN_ZOOM) })),
  // back to 100% with the starting point in the middle
  resetView: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),
}))

export default useEditorStore
