// The three steps a user goes through: draw, furnish, view in 3D.
// The steps are kept in an array so the JSX below is written once.

import Icon from '../Icon.jsx'

const steps = [
  {
    icon: 'pencil',
    title: 'Draw Your Room',
    text: 'Quickly map out walls, doors, and windows using our intuitive 2D canvas.',
  },
  {
    icon: 'sofa',
    title: 'Drag In Furniture',
    text: 'Browse the furniture library and drop items right into your plan.',
  },
  {
    icon: 'cube',
    title: 'Switch to 3D Instantly',
    text: 'Hit toggle and instantly walk through your newly designed room in full 3D.',
  },
]

const HowItWorks = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          From empty room to finished design in minutes
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                <Icon name={step.icon} />
              </div>
              {/* i starts at 0, so step one is shown as 01 */}
              <p className="mt-4 font-mono text-xs text-blue-500">0{i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
