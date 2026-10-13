// Dark panel near the end of the page that repeats the main action.

import { Link } from 'react-router'
import Icon from '../Icon.jsx'

const CallToAction = () => {
  return (
    <section className="bg-slate-50 px-6 pb-20">
      <div className="mx-auto max-w-6xl rounded-xl bg-slate-950 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">Start planning your room today</h2>
        <Link
          to="/editor"
          className="mt-8 inline-flex items-center gap-2 rounded bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400"
        >
          Get Started Free
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

export default CallToAction
