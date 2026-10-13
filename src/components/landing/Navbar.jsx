// Top navigation bar of the landing page.
//
// The landing page is a single long page, so the menu links are plain anchor
// links that scroll to a section id. Only "Get Started" leaves the page, so
// it is a router Link, which opens the editor without reloading the site.

import { Link } from 'react-router'
import Logo from './Logo.jsx'

const links = [
  { label: 'Product', href: '#top' },
  { label: 'Features', href: '#features' },
]

const Navbar = () => {
  return (
    // sticky keeps the bar visible while scrolling, z-50 keeps it above the hero
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Logo />

        {/* hidden on phones, there is no room for the links next to the buttons */}
        <ul className="hidden gap-8 text-sm md:flex">
          {links.map((link, i) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={
                  // the first link is the page we are on, so it gets the blue underline
                  i === 0
                    ? 'border-b-2 border-blue-500 pb-1 font-semibold text-blue-500'
                    : 'text-slate-400 hover:text-white'
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5 text-sm">
          <a href="#" className="text-slate-300 hover:text-white">
            Log In
          </a>
          <Link
            to="/editor"
            className="rounded bg-amber-500 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-400"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
