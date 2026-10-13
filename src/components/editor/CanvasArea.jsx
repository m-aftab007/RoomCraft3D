// The large work area in the middle of the editor.
//
// The drawing canvas itself is the next step. For now this area shows the
// right message for the current state: a hint while the room has no walls,
// or a notice when the 3D view is chosen.

import Icon from '../Icon.jsx'
import useEditorStore from '../../store/useEditorStore.js'
import useRoomStore from '../../store/useRoomStore.js'

// the card in the middle of the area, used for both messages
const Message = ({ icon, title, text }) => {
  return (
    <div className="max-w-md rounded-lg border border-slate-800 bg-slate-900/60 px-10 py-8 text-center shadow-xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-blue-300">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h2 className="mt-6 text-3xl font-semibold text-slate-100">{title}</h2>
      <p className="mt-3 text-slate-400">{text}</p>
    </div>
  )
}

const CanvasArea = () => {
  const view = useEditorStore((state) => state.view)
  // the selector returns true or false, so this component only renders again
  // when the room goes from empty to not empty, not on every new wall
  const hasWalls = useRoomStore((state) => state.walls.length > 0)

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-950 p-6">
      {view === '3d' && (
        <Message
          icon="cube"
          title="3D view is coming soon"
          text="The 3D scene is added in the next phase. Switch back to 2D View to draw your room."
        />
      )}

      {view === '2d' && !hasWalls && (
        <Message
          icon="compass"
          title="Start by drawing your room"
          text="Select the Wall tool and click to place your first wall on the grid."
        />
      )}
    </main>
  )
}

export default CanvasArea
