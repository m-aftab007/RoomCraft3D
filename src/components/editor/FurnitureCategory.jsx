// One furniture category in the sidebar, for example "Bedroom".
// Clicking it shows its items. An item can be put on the plan in two ways:
// click it and then click on the plan (as often as needed), or drag it there.

import { useState } from 'react'
import { useDrag } from 'react-dnd'
import Icon from '../Icon.jsx'
import useEditorStore from '../../store/useEditorStore.jsx'

// One row of the list. useDrag makes react-dnd carry `item` along with the
// mouse. The plan accepts the same type ('furniture') and receives the item
// when it is dropped. The row and the canvas never have to know each other.
const FurnitureItem = ({ item }) => {
  const [, drag] = useDrag({ type: 'furniture', item })
  const startPlacing = useEditorStore((state) => state.startPlacing)
  // true for the item that is in hand right now, so it can be highlighted
  const active = useEditorStore((state) => state.placingItem?.id === item.id)

  return (
    <div
      ref={(node) => {
        drag(node)
      }}
      onClick={() => startPlacing(item)}
      className={
        'flex cursor-pointer items-center justify-between rounded px-3 py-1.5 text-sm ' +
        (active ? 'bg-blue-500/15 text-blue-300' : 'text-slate-300 hover:bg-slate-800')
      }
    >
      {item.name}
      <span className="font-mono text-xs text-slate-500">
        {item.width} × {item.depth} m
      </span>
    </div>
  )
}

const FurnitureCategory = ({ category }) => {
  // open or closed only matters to this row, so it is local state
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={
          'flex w-full items-center justify-between rounded px-3 py-2 text-sm hover:text-white ' +
          (open ? 'text-white' : 'text-slate-400')
        }
      >
        {category.name}
        {/* the arrow points down while the list is open */}
        <Icon name="chevronRight" className={open ? 'h-3 w-3 rotate-90' : 'h-3 w-3'} />
      </button>

      {open && category.items.map((item) => <FurnitureItem key={item.id} item={item} />)}
    </div>
  )
}

export default FurnitureCategory
