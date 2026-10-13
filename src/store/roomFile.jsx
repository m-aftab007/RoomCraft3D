// Saving, loading and sharing a room.
//
// A room is turned into JSON text. The same text is used two ways:
//   - Save keeps it in the browser's localStorage, so it is still there the
//     next time the site is opened on this computer.
//   - Share puts it inside a link. Whoever opens the link gets the complete
//     room rebuilt from the text, with no server involved.
// Later the JSON can be stored in Supabase instead, and the link would then
// only carry a short id.

import useRoomStore from './useRoomStore.jsx'

const STORAGE_KEY = 'roomcraft3d-design'
const LINK_PREFIX = '#design='

// only the design itself, not the undo history or the store's functions
const getDesign = () => {
  const { projectName, roomName, walls, openings, furniture } = useRoomStore.getState()
  return { projectName, roomName, walls, openings, furniture }
}

// Returns false if the browser refused, which can happen in private windows.
export const saveDesign = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getDesign()))
    return true
  } catch {
    return false
  }
}

export const getSavedDesign = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

// The design goes after the # of the address. That part of a link is never
// sent to the server, the browser keeps it for the page. encodeURIComponent
// makes the JSON safe to put in a link.
export const makeShareLink = () =>
  window.location.origin + '/editor' + LINK_PREFIX + encodeURIComponent(JSON.stringify(getDesign()))

// The design carried by the current address, or null if there is none.
export const readShareLink = () => {
  const hash = window.location.hash
  if (!hash.startsWith(LINK_PREFIX)) return null
  try {
    return JSON.parse(decodeURIComponent(hash.slice(LINK_PREFIX.length)))
  } catch {
    return null
  }
}
