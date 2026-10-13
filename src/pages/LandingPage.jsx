// The landing page: every section stacked in the order it appears on screen.
// Each section is its own component, so this file reads like a table of contents.

import Navbar from '../components/landing/Navbar.jsx'
import Hero from '../components/landing/Hero.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import Features from '../components/landing/Features.jsx'
import Audience from '../components/landing/Audience.jsx'
import CallToAction from '../components/landing/CallToAction.jsx'
import Footer from '../components/landing/Footer.jsx'

const LandingPage = () => {
  return (
    // id="top" is the target of the logo and the "Product" link
    <div id="top">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Audience />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
