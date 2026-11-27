// The controls in the top corner of the 3D view: the Orbit / Walk switch
// and the button that shows or hides the wall measurements.
// Like the 2D / 3D switch, they only write the choice to the editor store.
// The 3D scene reads it and changes the camera or the labels.

import useEditorStore from '../../store/useEditorStore.jsx'

const modes = [
  { id: 'orbit', label: 'Orbit' },
  { id: 'walk', label: 'Walk' },
]

const box = 'flex rounded border border-slate-700 bg-slate-800 p-1 text-sm'
const on = 'rounded-sm bg-blue-500 px-3 py-1 text-white'
const off = 'px-3 py-1 text-slate-400 hover:text-white'

const CameraToggle = () => {
  const cameraMode = useEditorStore((state) => state.cameraMode)
  const setCameraMode = useEditorStore((state) => state.setCameraMode)
  const showMeasurements = useEditorStore((state) => state.showMeasurements)
  const toggleMeasurements = useEditorStore((state) => state.toggleMeasurements)

  return (
    <div className="absolute top-3 right-3 flex gap-2">
      {/* the labels float above the walls, so they are only offered in orbit view */}
      {cameraMode === 'orbit' && (
        <div className={box}>
          <button
            type="button"
            title="Show wall lengths"
            onClick={toggleMeasurements}
            className={showMeasurements ? on : off}
          >
            Measurements
          </button>
        </div>
      )}

      <div className={box}>
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            onClick={() => setCameraMode(mode.id)}
            className={mode.id === cameraMode ? on : off}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CameraToggle
