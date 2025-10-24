import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListaRamos from './pages/ListaRamos';
import DetalleRamo from './pages/DetalleRamo';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './App.css';
import { useEffect, useState } from 'react';
import loginService from "./services/login"
import type { User } from "./Types/Types"

// Para correr, npm run dev en frontend y npx json-server --port 3001 db.json

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => { 
    const init = async () => {
      const storedUser = await loginService.restoreLogin()
      if (storedUser) {
        setUser(storedUser);
      }
    }
    init()
  }, []);

  return (
    <Router>
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
        <header style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#2563eb',
          color: 'white',
          marginBottom: '20px',
          width: '100%'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '10px', 
            fontWeight: 'bold' 
          }}>
            Dificultad de Ramos DCC
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
            Descubre qué tan difíciles son los ramos del Departamento de Ciencias de la Computación
          </p>
          <nav style={{ marginTop: '12px' }}>
            <Link to="/" style={{ color: 'white', marginRight: '12px', textDecoration: 'underline' }}>Inicio</Link>
            <Link to="/login" style={{ color: 'white', textDecoration: 'underline' }}>Login</Link>
            {(user?.role === "admin") && 
              <Link to="/admin" style={{ color: 'white', marginLeft: '12px', textDecoration: 'underline' }}>Admin</Link>
            }
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<ListaRamos />} />
            <Route path="/ramo/:id" element={<DetalleRamo setUser={ (u) => setUser(u)} user={user}/>} />
            <Route path="/login" element={<Login setUser={ (u) => setUser(u)} user={user}/>} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;