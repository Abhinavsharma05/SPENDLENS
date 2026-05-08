import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Audit from "./pages/Audit"
import Result from "./pages/Result"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/r/:id" element={<Result />} />
      </Routes>
    </Router>
  )
}

export default App
