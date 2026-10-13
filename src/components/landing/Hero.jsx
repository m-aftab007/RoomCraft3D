// First section of the landing page: the headline, the two main buttons
// and a preview of the editor.

import { Link } from 'react-router'
import Icon from '../Icon.jsx'
import EditorPreview from './EditorPreview.jsx'

const Hero = () => {
  return (
    <section className="bg-slate-950 text-white">
      {/* one column on small screens, text and preview side by side on large ones */}
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl leading-tight font-bold md:text-5xl">
            Design your room in 3D.
            <span className="block text-blue-500">Right in your browser.</span>
          </h1>
          <p className="mt-5 max-w-md text-slate-400">
            Draw your floor plan, drag in furniture, and switch between 2D and 3D instantly.
            Built for precise spatial planning.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/start"
              className="rounded bg-blue-500 px-5 py-2.5 text-sm font-semibold hover:bg-blue-400"
            >
              Start Designing Free
            </Link>
            <a
              href="#"
              className="flex items-center gap-2 rounded border border-slate-700 px-5 py-2.5 text-sm font-semibold hover:border-slate-500"
            >
              <Icon name="play" className="h-4 w-4" />
              Watch Demo
            </a>
          </div>
        </div>

        <div className="relative">
          <EditorPreview />
          {/* dimension tag sitting on the corner of the preview, like a label in the editor */}
          <span className="absolute -top-3 right-4 rounded border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-xs text-slate-300">
            W: 85cm H: 102cm
          </span>
        </div>
      </div>

      <p className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Built for Pakistan's furniture retail industry
      </p>
    </section>
  )
}

export default Hero
