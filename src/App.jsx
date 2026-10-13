import { Routes, Route } from 'react-router'
import LandingPage from './pages/LandingPage.jsx'
import EditorPage from './pages/EditorPage.jsx'

// App only decides which screen is shown for which address.
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  )
}

export default App
