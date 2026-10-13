// The shared room model.
//
// This store is the single source of truth for the design itself: everything
// that is saved or sent in a share link lives here. The 2D canvas and the 3D
// scene both read from it and write to it, which is how the two views stay
// in sync without talking to each other directly.
//
// All sizes are in metres, not pixels. The canvas converts to pixels only
// when it draws, and Three.js also works in metres, so the same numbers can
// be used by both views.
//
//   wall:      { id, start: { x, y }, end: { x, y } }
//   opening:   { id, type: 'door' or 'window', wallId, offset, width, side }
//              offset is the distance from the wall's start to the middle of
//              the opening. Storing it this way keeps a door attached to its
//              wall instead of floating at its own x and y.
//   furniture: { id, itemId, name, width, depth, height, x, y, rotation }
//              x and y are the centre of the piece, rotation is in degrees.
//              height is only used by the 3D view.

import { create } from 'zustand'
import { samePoint } from '../canvas/geometry.jsx'

// the part of the state that undo and redo put back
const snapshot = (state) => ({
  walls: state.walls,
  openings: state.openings,
  furniture: state.furniture,
})

// Called at the start of every change: it stores how the room looked before.
// The arrays are never edited in place (we always build new ones), so a
// snapshot is only three references and costs almost nothing.
const remember = (state) => ({ past: [...state.past, snapshot(state)], future: [] })

const useRoomStore = create((set) => ({
  projectName: 'Untitled Project',
  roomName: 'My Room',
  walls: [],
  openings: [],
  furniture: [],

  // undo history, not part of the design and never saved with it
  past: [],
  future: [],

  setProjectName: (name) => set({ projectName: name }),

  // starts an empty room with the names typed on the start screen
  newProject: (projectName, roomName) =>
    set({ projectName, roomName, walls: [], openings: [], furniture: [], past: [], future: [] }),

  // Replaces the room with a saved one. The || fallbacks are there because
  // the data comes from outside (browser storage or a link) and may be incomplete.
  loadDesign: (design) =>
    set({
      projectName: design.projectName || 'Untitled Project',
      roomName: design.roomName || 'My Room',
      walls: design.walls || [],
      openings: design.openings || [],
      furniture: design.furniture || [],
      past: [],
      future: [],
    }),

  addWall: (start, end) =>
    set((state) => ({
      ...remember(state),
      walls: [...state.walls, { id: crypto.randomUUID(), start, end }],
    })),

  addOpening: (opening) =>
    set((state) => ({
      ...remember(state),
      openings: [...state.openings, { id: crypto.randomUUID(), ...opening }],
    })),

  // item is an entry of the catalogue. Its name and size are copied into the
  // piece, so a saved room still opens if the catalogue changes later.
  addFurniture: (item, x, y) =>
    set((state) => ({
      ...remember(state),
      furniture: [
        ...state.furniture,
        {
          id: crypto.randomUUID(),
          itemId: item.id,
          name: item.name,
          width: item.width,
          depth: item.depth,
          height: item.height,
          x,
          y,
          rotation: 0,
        },
      ],
    })),

  // Dragging calls the move actions below many times a second. If each call
  // was remembered, one drag would fill the undo history. So moving does not
  // remember, and the canvas calls checkpoint() once when a drag begins.
  checkpoint: () => set((state) => remember(state)),

  // Moves a wall corner. Every wall that starts or ends at `from` gets the
  // new point, so walls that share a corner stay joined.
  moveCorner: (from, to) =>
    set((state) => ({
      walls: state.walls.map((wall) => ({
        ...wall,
        start: samePoint(wall.start, from) ? to : wall.start,
        end: samePoint(wall.end, from) ? to : wall.end,
      })),
    })),

  // slides a door or window to a new place on its wall
  moveOpening: (id, offset) =>
    set((state) => ({
      openings: state.openings.map((o) => (o.id === id ? { ...o, offset } : o)),
    })),

  moveFurniture: (id, x, y) =>
    set((state) => ({
      furniture: state.furniture.map((piece) => (piece.id === id ? { ...piece, x, y } : piece)),
    })),

  // turns a piece a quarter turn
  rotateFurniture: (id) =>
    set((state) => ({
      ...remember(state),
      furniture: state.furniture.map((piece) =>
        piece.id === id ? { ...piece, rotation: (piece.rotation + 90) % 360 } : piece
      ),
    })),

  // Removes a wall, opening or piece of furniture by id. When a wall goes,
  // the doors and windows on it go too (the o.wallId check).
  remove: (id) =>
    set((state) => ({
      ...remember(state),
      walls: state.walls.filter((wall) => wall.id !== id),
      openings: state.openings.filter((o) => o.id !== id && o.wallId !== id),
      furniture: state.furniture.filter((piece) => piece.id !== id),
    })),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state
      return {
        ...state.past.at(-1),
        past: state.past.slice(0, -1),
        future: [snapshot(state), ...state.future],
      }
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state
      return {
        ...state.future[0],
        past: [...state.past, snapshot(state)],
        future: state.future.slice(1),
      }
    }),
}))

export default useRoomStore
