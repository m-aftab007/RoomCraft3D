// Panel in the corner of the 3D view for choosing the wall paint and the
// floor colour. It only writes the colours to the room store, the 3D scene
// repaints itself from there. Because the colours are part of the design,
// they are saved and shared along with it.

import useRoomStore from '../../store/useRoomStore.jsx'

const wallColors = [
  { name: 'Warm White', color: '#e7e0d6' },
  { name: 'Pure White', color: '#f8fafc' },
  { name: 'Beige', color: '#d6c3a5' },
  { name: 'Sage Green', color: '#a3b18a' },
  { name: 'Sky Blue', color: '#a7c4d9' },
  { name: 'Grey', color: '#9ca3af' },
  { name: 'Terracotta', color: '#c2775a' },
  { name: 'Navy', color: '#3b4a6b' },
]

const floorColors = [
  { name: 'Light Oak', color: '#b98b5e' },
  { name: 'Walnut', color: '#6b4a33' },
  { name: 'Grey Tile', color: '#9ca3af' },
  { name: 'Marble', color: '#e5e7eb' },
  { name: 'Dark Slate', color: '#374151' },
]

// One row: a label, the ready-made colours, and a picker for any other colour.
const ColorRow = ({ label, colors, value, onChange }) => {
  return (
    <div>
      <p className="mb-1.5 text-xs text-slate-400">{label}</p>
      <div className="flex items-center gap-1.5">
        {colors.map((item) => (
          <button
            key={item.color}
            type="button"
            title={item.name}
            onClick={() => onChange(item.color)}
            style={{ backgroundColor: item.color }}
            className={
              'h-6 w-6 rounded-full border-2 ' +
              (item.color === value ? 'border-blue-400' : 'border-slate-700 hover:border-slate-400')
            }
          />
        ))}
        {/* the browser's own colour picker, for a colour not in the list */}
        <input
          type="color"
          title="Other colour"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-8 cursor-pointer rounded border border-slate-700 bg-transparent"
        />
      </div>
    </div>
  )
}

const ColorPanel = () => {
  const wallColor = useRoomStore((state) => state.wallColor)
  const floorColor = useRoomStore((state) => state.floorColor)
  const setWallColor = useRoomStore((state) => state.setWallColor)
  const setFloorColor = useRoomStore((state) => state.setFloorColor)

  return (
    <div className="absolute bottom-3 left-3 space-y-3 rounded-lg border border-slate-700 bg-slate-900/90 p-3 shadow-xl">
      <ColorRow label="Wall colour" colors={wallColors} value={wallColor} onChange={setWallColor} />
      <ColorRow label="Floor colour" colors={floorColors} value={floorColor} onChange={setFloorColor} />
    </div>
  )
}

export default ColorPanel
