// The large work area in the middle of the editor.
// It shows the 2D plan or the 3D scene, and on top of it a hint for what to do.

import { lazy, Suspense } from 'react'
import Icon from '../Icon.jsx'
import PlanCanvas from './PlanCanvas.jsx'
import SelectionBar from './SelectionBar.jsx'
import useEditorStore from '../../store/useEditorStore.jsx'
import useRoomStore from '../../store/useRoomStore.jsx'

// Three.js is a large library. lazy() keeps it out of the first download and
// only fetches it when the 3D view is opened for the first time.
const Scene3D = lazy(() => import('./Scene3D.jsx'))

// one line of help for the tool in use
const hints = {
  select: 'Click to select. Drag furniture, doors, windows or wall corners to move them.',
  hand: 'Drag to move around the plan. The mouse wheel and the middle button work with every tool.',
  wall: 'Click corner to corner, or drag. Right-click, Esc or double-click to finish.',
  door: 'Click on a wall to place a door. It opens to the side your mouse is on.',
  window: 'Click on a wall to place a window.',
  furniture: 'Click on the plan to place the piece. Right-click or Esc to stop.',
}

// the card in the middle of the area
const Message = ({ icon, title, text }) => {
  return (
    // pointer-events-none lets the mouse go through the card to the canvas below
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
      <div className="max-w-md rounded-lg border border-slate-800 bg-slate-900/60 px-10 py-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-blue-300">
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-slate-100">{title}</h2>
        <p className="mt-3 text-slate-400">{text}</p>
      </div>
    </div>
  )
}

// the small line of help at the top
const Hint = ({ children }) => {
  return (
    <p className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded bg-slate-900/80 px-3 py-1.5 text-xs whitespace-nowrap text-slate-400">
      {children}
    </p>
  )
}

const CanvasArea = () => {
  const view = useEditorStore((state) => state.view)
  const tool = useEditorStore((state) => state.tool)
  // the selector returns true or false, so this component only renders again
  // when the room goes from empty to not empty, not on every change
  const isEmpty = useRoomStore((state) => state.walls.length === 0 && state.furniture.length === 0)

  // relative, so the canvas and the hints can be placed on top of each other.
  // min-w-0 lets the area shrink when the window gets narrow.
  const area = 'relative min-w-0 flex-1 bg-slate-950'

  if (view === '3d') {
    return (
      <main className={area}>
        {isEmpty ? (
          <Message
            icon="cube"
            title="Nothing to show in 3D yet"
            text="Switch to 2D View, draw some walls or add furniture, then come back."
          />
        ) : (
          // Suspense shows nothing for the moment Three.js is being downloaded
          <Suspense fallback={null}>
            <Scene3D />
            <Hint>Drag to look around. Scroll to zoom. Right-drag to move.</Hint>
          </Suspense>
        )}
      </main>
    )
  }

  // the start card is only shown until a tool is picked, so it never covers the drawing
  const showStart = isEmpty && tool === 'select'

  return (
    <main className={area}>
      <PlanCanvas />

      {showStart ? (
        <Message
          icon="compass"
          title="Start by drawing your room"
          text="Select the Wall tool and click to place your first wall on the grid."
        />
      ) : (
        <Hint>{hints[tool]}</Hint>
      )}

      <SelectionBar />
    </main>
  )
}

export default CanvasArea
