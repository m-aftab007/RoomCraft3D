// The Orbit / Walk switch in the corner of the 3D view.
// Like the 2D / 3D switch, it only writes the choice to the editor store.
// The 3D scene reads it and changes how the camera is controlled.

import useEditorStore from '../../store/useEditorStore.jsx'

const modes = [
  { id: 'orbit', label: 'Orbit' },
  { id: 'walk', label: 'Walk' },
]

const CameraToggle = () => {
  const cameraMode = useEditorStore((state) => state.cameraMode)
  const setCameraMode = useEditorStore((state) => state.setCameraMode)

  return (
    <div className="absolute top-3 right-3 flex rounded border border-slate-700 bg-slate-800 p-1 text-sm">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => setCameraMode(mode.id)}
          className={
            mode.id === cameraMode
              ? 'rounded-sm bg-blue-500 px-3 py-1 text-white'
              : 'px-3 py-1 text-slate-400 hover:text-white'
          }
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}

export default CameraToggle
