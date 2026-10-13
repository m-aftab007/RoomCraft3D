// The 2D View / 3D View switch in the middle of the top bar.
// It only writes the chosen view to the editor store. The canvas area reads
// the same value and decides what to show.

import useEditorStore from '../../store/useEditorStore.js'

const views = [
  { id: '2d', label: '2D View' },
  { id: '3d', label: '3D View' },
]

const ViewToggle = () => {
  const view = useEditorStore((state) => state.view)
  const setView = useEditorStore((state) => state.setView)

  return (
    <div className="flex rounded bg-slate-800 p-1 text-sm">
      {views.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setView(item.id)}
          className={
            // both buttons have a bottom border so the text does not jump when it turns blue
            item.id === view
              ? 'rounded-sm border-b-2 border-blue-400 bg-slate-900 px-4 py-1 text-blue-300'
              : 'border-b-2 border-transparent px-4 py-1 text-slate-400 hover:text-white'
          }
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default ViewToggle
