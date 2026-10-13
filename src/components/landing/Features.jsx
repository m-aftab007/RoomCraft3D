// Grid of the six main features.
// Every card describes something the proposal commits to, so the page does
// not promise more than the project delivers.

import Icon from '../Icon.jsx'

const features = [
  {
    icon: 'sync',
    title: 'Real-Time 2D/3D Sync',
    text: 'Changes in the top-down blueprint immediately update the fully rendered 3D space.',
  },
  {
    icon: 'grid',
    title: 'Furniture Library',
    text: 'A categorised library of furniture models, including sofas, beds, dining sets, storage, and lighting.',
  },
  {
    icon: 'drop',
    title: 'Material & Color Swap',
    text: 'Instantly switch between wood grains, fabric textures, and paint colors on any surface.',
  },
  {
    icon: 'sun',
    title: 'Realistic Shadows',
    text: 'A directional sun light and ambient fill with real-time shadow maps.',
  },
  {
    icon: 'share',
    title: 'Save & Share Instantly',
    text: 'Generate a link that opens your complete design on any device.',
  },
  {
    icon: 'download',
    title: 'Export Your Floor Plan',
    text: 'Download a top-down PNG of your layout.',
  },
]

const Features = () => {
  return (
    // the id is what the "Features" link in the navbar scrolls to
    <section id="features" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-bold text-slate-900">Everything you need to plan a room</h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-500">
                <Icon name={feature.icon} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
