// Top bar of the editor: logo, room and project name, view switch and the actions.

import { Link } from 'react-router'
import Icon from '../Icon.jsx'
import ViewToggle from './ViewToggle.jsx'
import useRoomStore from '../../store/useRoomStore.jsx'
import useEditorStore from '../../store/useEditorStore.jsx'
import { saveDesign, makeShareLink } from '../../store/roomFile.jsx'
import exportPng from '../../canvas/exportPng.jsx'

// disabled:... greys a button out and switches its hover effect off
const iconButton =
  'rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:pointer-events-none disabled:opacity-40'

const TopBar = () => {
  const projectName = useRoomStore((state) => state.projectName)
  const roomName = useRoomStore((state) => state.roomName)
  const setProjectName = useRoomStore((state) => state.setProjectName)
  const undo = useRoomStore((state) => state.undo)
  const redo = useRoomStore((state) => state.redo)
  // true or false, so the bar only renders again when a button has to switch on or off
  const canUndo = useRoomStore((state) => state.past.length > 0)
  const canRedo = useRoomStore((state) => state.future.length > 0)
  const showNotice = useEditorStore((state) => state.showNotice)

  // Puts the share link on the clipboard and reports it in the status bar.
  // The browser can refuse clipboard access, that is what the catch is for.
  const copyLink = async (message) => {
    try {
      await navigator.clipboard.writeText(makeShareLink())
      showNotice(message)
    } catch {
      showNotice('Could not copy the link')
    }
  }

  const handleSave = () => {
    if (saveDesign()) copyLink('Saved in this browser. Share link copied.')
    else showNotice('Could not save in this browser')
  }

  return (
    <header className="flex h-13 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4">
      {/* the three parts each take flex-1, which keeps the view switch in the exact centre */}
      <div className="flex flex-1 items-center gap-4">
        <Link to="/" className="text-xl font-bold text-white">
          RoomCraft3D
        </Link>

        <div className="hidden items-center gap-2 border-l border-slate-700 pl-4 text-sm md:flex">
          <span className="text-slate-400">{roomName}</span>
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
        <button type="button" title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo} className={iconButton}>
          <Icon name="undo" className="h-4 w-4" />
        </button>
        <button type="button" title="Redo (Ctrl+Y)" onClick={redo} disabled={!canRedo} className={iconButton}>
          <Icon name="redo" className="h-4 w-4" />
        </button>

        <button
          type="button"
          title="Copy a link to this design"
          onClick={() => copyLink('Share link copied')}
          className="ml-3 border-l border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:text-white"
        >
          Share
        </button>
        <button
          type="button"
          title="Download the floor plan as a PNG"
          onClick={exportPng}
          className="rounded border border-slate-700 px-3 py-1.5 text-sm text-white hover:border-slate-500"
        >
          Export
        </button>
        <button
          type="button"
          onClick={handleSave}
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
