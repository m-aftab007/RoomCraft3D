// Thin bar at the bottom of the editor. On the left a short message when
// there is one ("Share link copied"), on the right the mouse position and zoom.
// All values come from the editor store, this component only displays them.

import useEditorStore from '../../store/useEditorStore.jsx'

const StatusBar = () => {
  const cursor = useEditorStore((state) => state.cursor)
  const zoom = useEditorStore((state) => state.zoom)
  const notice = useEditorStore((state) => state.notice)

  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t border-slate-700 bg-slate-900 px-4 font-mono text-xs text-slate-400">
      <span className="text-blue-300">{notice}</span>

      <div className="flex gap-4">
        {/* toFixed(2) always shows two decimals, so the text does not change width */}
        <span>
          X: {cursor.x.toFixed(2)} Y: {cursor.y.toFixed(2)}
        </span>
        <span className="text-slate-700">|</span>
        <span>{Math.round(zoom * 100)}%</span>
      </div>
    </footer>
  )
}

export default StatusBar
