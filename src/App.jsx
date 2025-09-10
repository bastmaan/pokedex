import './App.css'
import HomePage from './pages/HomePage'
import PokemonPage from './pages/PokemonPage'
import PokemonDetailPage from './pages/PokemonDetailPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemonpage" element={<PokemonPage />} />
        <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
