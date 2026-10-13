// Top bar of the editor: logo, project name, view switch and the actions.
//
// Undo, redo, theme, Share, Export and Save are only drawn here. They get
// their behaviour when the features behind them are built.

import { Link } from 'react-router'
import Icon from '../Icon.jsx'
import ViewToggle from './ViewToggle.jsx'
import useRoomStore from '../../store/useRoomStore.js'

const iconButton = 'rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-white'

const TopBar = () => {
  const projectName = useRoomStore((state) => state.projectName)
  const setProjectName = useRoomStore((state) => state.setProjectName)

  return (
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4">
      {/* the three parts each take flex-1, which keeps the view switch in the exact centre */}
      <div className="flex flex-1 items-center gap-4">
        <Link to="/" className="text-xl font-bold text-white">
          RoomCraft3D
        </Link>

        <div className="hidden items-center gap-2 border-l border-slate-700 pl-4 text-sm md:flex">
          <span className="text-slate-400">Living Room</span>
          <Icon name="chevronRight" className="h-3 w-3 text-slate-500" />
          {/* The name is an input that looks like plain text, so it can be
              renamed by clicking on it. size makes the box as wide as the name. */}
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size={Math.max(projectName.length, 1)}
            aria-label="Project name"
            className="rounded bg-transparent px-1 text-white outline-none focus:bg-slate-800"
          />
          <Icon name="pencil" className="h-3.5 w-3.5 text-slate-500" />
        </div>
      </div>

      <ViewToggle />

      <div className="flex flex-1 items-center justify-end gap-1">
        <button type="button" title="Undo" className={iconButton}>
          <Icon name="undo" className="h-4 w-4" />
        </button>
        <button type="button" title="Redo" className={iconButton}>
          <Icon name="redo" className="h-4 w-4" />
        </button>
        <button type="button" title="Theme" className={`${iconButton} ml-3 border-l border-slate-700`}>
          <Icon name="moon" className="h-4 w-4" />
        </button>

        <button type="button" className="px-3 py-1.5 text-sm text-slate-300 hover:text-white">
          Share
        </button>
        <button
          type="button"
          className="rounded border border-slate-700 px-3 py-1.5 text-sm text-white hover:border-slate-500"
        >
          Export
        </button>
        <button
          type="button"
          className="ml-1 flex items-center gap-2 rounded bg-amber-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-amber-400"
        >
          <Icon name="cloud" className="h-4 w-4" />
          Save & Share
        </button>
      </div>
    </header>
  )
}

export default TopBar
