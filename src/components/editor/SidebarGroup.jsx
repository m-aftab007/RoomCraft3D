// One collapsible group in the sidebar, for example "The Furniture".
// Whatever is placed between its tags is shown when the group is open.
//
// Open or closed is kept in useState: it only matters to this one group and
// has nothing to do with the room, so it stays out of the stores.

import { useState } from 'react'
import Icon from '../Icon.jsx'

const SidebarGroup = ({ icon, title, children }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={
          // the closed group has a transparent border so opening it does not move anything
          'flex w-full items-center gap-3 rounded border px-3 py-2 ' +
          (open
            ? 'border-slate-700 bg-slate-800 text-blue-300'
            : 'border-transparent text-slate-400 hover:text-white')
        }
      >
        <Icon name={icon} />
        <span className="flex-1 text-left font-mono text-xs tracking-wider uppercase">{title}</span>
        {/* the same arrow, turned upside down while the group is open */}
        <Icon name="chevronDown" className={open ? 'h-3.5 w-3.5 rotate-180' : 'h-3.5 w-3.5'} />
      </button>

      {/* the left border draws the thin guide line beside the items */}
      {open && <div className="mt-1 ml-5 border-l border-slate-700 pl-2">{children}</div>}
    </div>
  )
}

export default SidebarGroup
