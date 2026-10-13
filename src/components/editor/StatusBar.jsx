// Thin bar at the bottom of the editor with the mouse position and the zoom.
// Both values come from the editor store, this component only displays them.

import useEditorStore from '../../store/useEditorStore.js'

const StatusBar = () => {
  const cursor = useEditorStore((state) => state.cursor)
  const zoom = useEditorStore((state) => state.zoom)

  return (
    <footer className="flex h-8 shrink-0 items-center justify-end gap-4 border-t border-slate-700 bg-slate-900 px-4 font-mono text-xs text-slate-400">
      {/* toFixed(2) always shows two decimals, so the text does not change width */}
      <span>
        X: {cursor.x.toFixed(2)} Y: {cursor.y.toFixed(2)}
      </span>
      <span className="text-slate-700">|</span>
      <span>{Math.round(zoom * 100)}%</span>
    </footer>
  )
}

export default StatusBar
