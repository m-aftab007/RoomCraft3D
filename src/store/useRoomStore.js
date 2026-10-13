// The shared room model.
//
// This store is the single source of truth for the design itself: everything
// that would be saved to a file or sent in a share link lives here. The 2D
// canvas and the 3D scene will both read from it and write to it, which is
// how the two views stay in sync without talking to each other directly.
//
// It starts small on purpose. Doors, windows and furniture are added to this
// store when the features that use them are built.

import { create } from 'zustand'

const useRoomStore = create((set) => ({
  projectName: 'Untitled Project',
  walls: [],

  setProjectName: (name) => set({ projectName: name }),
}))

export default useRoomStore
