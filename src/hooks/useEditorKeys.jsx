// Keyboard shortcuts of the editor.
//
//   Esc                 stop drawing a wall, or put the tool down
//   Delete, Backspace   remove the selected item
//   R                   rotate the selected furniture
//   Ctrl+Z, Ctrl+Y      undo and redo
//
// The listener is on the window because a <canvas> does not receive key
// presses unless it has focus.

import { useEffect } from 'react'
import useRoomStore from '../store/useRoomStore.jsx'
import useEditorStore from '../store/useEditorStore.jsx'

const useEditorKeys = () => {
  useEffect(() => {
    const onKeyDown = (e) => {
      // leave the keys alone while the project name is being typed
      if (e.target.tagName === 'INPUT') return

      // getState() reads the newest values at the moment the key is pressed.
      // The listener is added only once, so values taken from the hooks
      // would be the old ones from the first render.
      const editor = useEditorStore.getState()
      const room = useRoomStore.getState()
      const id = editor.selectedId

      if (e.key === 'Escape') {
        editor.cancel()
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && id) {
        room.remove(id)
        editor.setSelectedId(null)
      } else if (e.key === 'r' && room.furniture.some((piece) => piece.id === id)) {
        room.rotateFurniture(id)
      } else if (e.ctrlKey && e.key === 'z') {
        room.undo()
      } else if (e.ctrlKey && e.key === 'y') {
        room.redo()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}

export default useEditorKeys
