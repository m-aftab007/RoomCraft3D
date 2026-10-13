// "Built for everyone who plans a room" section with two tabs,
// one for homeowners and one for designers and retailers.
//
// Which tab is open is kept in useState. This is only a display choice of
// this one section, not room data, so it does not belong in the Zustand store.

import { useState } from 'react'
import Icon from '../Icon.jsx'
import EditorPreview from './EditorPreview.jsx'

const audiences = [
  {
    tab: 'For Homeowners',
    title: 'Visualize your dream space before buying a single item.',
    text: 'Stop guessing if that sofa will fit. RoomCraft3D gives you the confidence to design your space accurately, helping you avoid costly mistakes and endless returns.',
    points: [
      'Measure twice, buy once with exact dimensional modeling.',
      'Try different layouts without moving heavy furniture.',
      'See the room in 3D with real-time shadows before you buy.',
    ],
  },
  {
    tab: 'For Designers & Retailers',
    title: 'Give your clients a plan they can open in a browser.',
    text: 'Replace separate drawing and rendering tools with one web page. Plan the room with your client and send them the result, with nothing to install on either side.',
    points: [
      'Share a layout as a link that opens on any device.',
      'Swap fabrics, wood finishes, and wall colors on the spot.',
      'Wall lengths and total floor area are shown as you draw.',
    ],
  },
]

const Audience = () => {
  // index of the open tab in the audiences array
  const [active, setActive] = useState(0)
  const audience = audiences[active]

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Built for everyone who plans a room
        </h2>

        <div className="mt-6 flex justify-center">
          <div className="flex rounded-md border border-slate-200 bg-white p-1">
            {audiences.map((item, i) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => setActive(i)}
                className={
                  i === active
                    ? 'rounded bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white'
                    : 'rounded px-4 py-1.5 text-sm text-slate-500 hover:text-slate-900'
                }
              >
                {item.tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{audience.title}</h3>
            <p className="mt-4 text-sm text-slate-500">{audience.text}</p>

            <ul className="mt-6 space-y-3">
              {audience.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <EditorPreview />
        </div>
      </div>
    </section>
  )
}

export default Audience
