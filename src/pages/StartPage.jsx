// The screen between the landing page and the editor.
// It asks for the project and room name, the way a sign in screen asks for
// an email, and then opens the editor with an empty room.

import { Link, useNavigate } from 'react-router'
import useRoomStore from '../store/useRoomStore.jsx'
import { getSavedDesign } from '../store/roomFile.jsx'

const label = 'block text-sm text-slate-300'
const input =
  'mt-1.5 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none placeholder:text-slate-600 focus:border-blue-500'

const StartPage = () => {
  const navigate = useNavigate()
  const newProject = useRoomStore((state) => state.newProject)
  const loadDesign = useRoomStore((state) => state.loadDesign)
  // the room saved in this browser earlier, if there is one
  const saved = getSavedDesign()

  // The two fields keep their own text, the way plain HTML inputs do. We
  // only read them once, when the form is sent, so no state is needed while
  // the user types. The names go straight into the room store.
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    newProject(form.get('projectName').trim(), form.get('roomName').trim())
    navigate('/editor')
  }

  const handleContinue = () => {
    loadDesign(saved)
    navigate('/editor')
  }

  return (
    <div className="blueprint-grid flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center text-2xl font-bold text-white">
          RoomCraft3D
        </Link>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-slate-800 bg-slate-900 p-8 shadow-xl"
        >
          <h1 className="text-xl font-semibold text-white">Name your project</h1>
          <p className="mt-1 text-sm text-slate-400">The project name can be changed later in the editor.</p>

          <label className={`${label} mt-6`}>
            Project name
            {/* required stops the form from being sent while a field is empty */}
            <input name="projectName" required autoFocus placeholder="My New Home" className={input} />
          </label>

          <label className={`${label} mt-4`}>
            Room name
            <input name="roomName" required placeholder="Living Room" className={input} />
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
          >
            Start Designing
          </button>

          {saved && (
            <button
              type="button"
              onClick={handleContinue}
              className="mt-3 w-full rounded border border-slate-700 py-2.5 text-sm text-slate-200 hover:border-slate-500"
            >
              Continue "{saved.projectName}"
            </button>
          )}
        </form>

        <Link to="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-white">
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default StartPage
