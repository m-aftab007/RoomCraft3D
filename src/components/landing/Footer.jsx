// Page footer: logo, copyright line and links to the page sections.
// It only links to things that exist, so there are no dead pages.

import Logo from './Logo.jsx'

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-slate-500">
            © 2026 RoomCraft3D. All rights reserved.
            <br />
            Precision-built for the web.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-white">Product</p>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li>
              <a href="#top" className="hover:text-white">
                Overview
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-white">
                Features
              </a>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-white">Project</p>
          <p className="mt-3 text-slate-400">
            Final Year Project
            <br />
            Department of Computer Science
            <br />
            University of Mianwali
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
