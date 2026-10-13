// Zoom buttons at the bottom of the sidebar.
// The zoom value lives in the editor store, so the status bar shows the same
// number and the canvas will use it for drawing.

import Icon from '../Icon.jsx'
import useEditorStore from '../../store/useEditorStore.js'

const button = 'rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white'

const ZoomControl = () => {
  const zoom = useEditorStore((state) => state.zoom)
  const zoomIn = useEditorStore((state) => state.zoomIn)
  const zoomOut = useEditorStore((state) => state.zoomOut)
  const resetZoom = useEditorStore((state) => state.resetZoom)

  return (
    <div className="flex items-center gap-2 border-t border-slate-800 px-3 py-3">
      <button type="button" title="Zoom out" onClick={zoomOut} className={button}>
        <Icon name="minus" className="h-3.5 w-3.5" />
      </button>
      {/* fixed width so the buttons stay in place between 50% and 100% */}
      <span className="w-10 text-center font-mono text-xs text-slate-200">
        {Math.round(zoom * 100)}%
      </span>
      <button type="button" title="Zoom in" onClick={zoomIn} className={button}>
        <Icon name="plus" className="h-3.5 w-3.5" />
      </button>

      <button type="button" title="Reset zoom" onClick={resetZoom} className={`${button} ml-auto`}>
        <Icon name="fit" className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default ZoomControl
