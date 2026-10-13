// Left panel of the editor, the "Project Explorer".
// It has two groups: The Structure holds the drawing tools and The Furniture
// holds the furniture categories. The zoom buttons sit at the bottom.

import { useState } from 'react'
import Icon from '../Icon.jsx'
import SidebarGroup from './SidebarGroup.jsx'
import ZoomControl from './ZoomControl.jsx'
import useEditorStore from '../../store/useEditorStore.js'

const tools = [
  { id: 'wall', label: 'Wall' },
  { id: 'door', label: 'Door' },
  { id: 'window', label: 'Window' },
]

const categories = ['Kitchen', 'Bathroom', 'Living Room', 'Bedroom', 'Desks', 'Accessories - Deco']

const Sidebar = () => {
  // whether the whole panel is shown, only this component cares about it
  const [open, setOpen] = useState(true)

  const tool = useEditorStore((state) => state.tool)
  const setTool = useEditorStore((state) => state.setTool)

  // collapsed: a thin strip with just the button that opens the panel again
  if (!open) {
    return (
      <aside className="shrink-0 border-r border-slate-700 bg-slate-900 p-2">
        <button
          type="button"
          title="Open panel"
          onClick={() => setOpen(true)}
          className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Icon name="chevronRight" className="h-4 w-4" />
        </button>
      </aside>
    )
  }

  return (
    <aside className="flex w-62 shrink-0 flex-col border-r border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <span className="font-mono text-xs tracking-wider text-slate-300 uppercase">
          Project Explorer
        </span>
        <button
          type="button"
          title="Close panel"
          onClick={() => setOpen(false)}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Icon name="chevronLeft" className="h-4 w-4" />
        </button>
      </div>

      {/* flex-1 fills the space above the zoom buttons, and scrolls if the lists get long */}
      <div className="flex-1 overflow-y-auto p-2">
        <SidebarGroup icon="home" title="The Structure">
          {tools.map((item) => (
            <button
              key={item.id}
              type="button"
              // clicking the tool that is already active puts it down again
              onClick={() => setTool(tool === item.id ? 'select' : item.id)}
              className={
                'flex w-full items-center gap-3 rounded px-3 py-2 text-sm ' +
                (tool === item.id
                  ? 'bg-blue-500/15 text-blue-300'
                  : 'text-slate-400 hover:text-white')
              }
            >
              <Icon name={item.id} className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </SidebarGroup>

        <SidebarGroup icon="sofa" title="The Furniture">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-slate-400 hover:text-white"
            >
              {name}
              <Icon name="chevronRight" className="h-3 w-3" />
            </button>
          ))}
        </SidebarGroup>
      </div>

      <ZoomControl />
    </aside>
  )
}

export default Sidebar
