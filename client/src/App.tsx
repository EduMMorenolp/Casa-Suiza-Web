import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Admin from './pages/Admin/Admin.tsx';
import Login from './pages/Auth/Login.tsx';
import NotFound from './pages/NotFound.tsx';
// import ProtectedRoute from './pages/Auth/components/ProtectedRoute.tsx';

function App() {

  return (
    <Router basename="/Casa-Suiza-Web">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            // <ProtectedRoute>
            <Admin />
            // </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
