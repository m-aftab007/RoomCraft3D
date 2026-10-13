// Placeholder shown where a screenshot of the editor will go.
//
// The editor does not exist yet, so instead of a fake screenshot we draw an
// empty app window with a blueprint grid. Once the real editor is built this
// component can be swapped for an actual screenshot in one place.

const EditorPreview = () => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
      {/* window title bar with the three dots */}
      <div className="flex gap-1.5 border-b border-slate-700 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
      </div>

      {/* aspect-video keeps the box at 16:9 whatever its width is */}
      <div className="blueprint-grid flex aspect-video items-center justify-center">
        <span className="font-mono text-sm uppercase tracking-widest text-slate-400">
          Editor preview
        </span>
      </div>
    </div>
  )
}

export default EditorPreview
