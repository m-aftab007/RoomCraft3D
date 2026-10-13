// The editor workspace: top bar, sidebar, work area and status bar.
// This file only arranges the four parts on the screen.

import TopBar from '../components/editor/TopBar.jsx'
import Sidebar from '../components/editor/Sidebar.jsx'
import CanvasArea from '../components/editor/CanvasArea.jsx'
import StatusBar from '../components/editor/StatusBar.jsx'

const EditorPage = () => {
  return (
    // h-screen makes the editor exactly as tall as the window, like a desktop
    // app, so the page itself never scrolls
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <TopBar />
      {/* min-h-0 lets this row shrink, otherwise a long sidebar list would push the status bar off screen */}
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <CanvasArea />
      </div>
      <StatusBar />
    </div>
  )
}

export default EditorPage
