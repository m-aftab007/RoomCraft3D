// Small bar at the bottom of the plan, shown while something is selected.
// It gives the selected item its actions as buttons, so deleting or rotating
// does not depend on knowing the keyboard shortcuts.

import Icon from '../Icon.jsx'
import useRoomStore from '../../store/useRoomStore.jsx'
import useEditorStore from '../../store/useEditorStore.jsx'

const button = 'flex items-center gap-2 rounded px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700'

const SelectionBar = () => {
  const selectedId = useEditorStore((state) => state.selectedId)
  const setSelectedId = useEditorStore((state) => state.setSelectedId)
  const remove = useRoomStore((state) => state.remove)
  const rotateFurniture = useRoomStore((state) => state.rotateFurniture)
  // only furniture can be rotated, walls and openings cannot
  const isFurniture = useRoomStore((state) => state.furniture.some((p) => p.id === selectedId))

  if (!selectedId) return null

  const handleDelete = () => {
    remove(selectedId)
    setSelectedId(null)
  }

  return (
    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-xl">
      {isFurniture && (
        <button type="button" onClick={() => rotateFurniture(selectedId)} className={button}>
          <Icon name="rotate" className="h-4 w-4" />
          Rotate
        </button>
      )}
      <button type="button" onClick={handleDelete} className={button}>
        <Icon name="trash" className="h-4 w-4" />
        Delete
      </button>
    </div>
  )
}

export default SelectionBar
