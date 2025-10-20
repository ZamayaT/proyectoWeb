import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListaRamos from './ListaRamos';
import DetalleRamo from './DetalleRamo';
import Login from './Login';
import Admin from './Admin';
import './App.css';

// Para correr, npm run dev en frontend y npx json-server --port 3001 db.json

function App() {
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
            <Link to="/admin" style={{ color: 'white', marginLeft: '12px', textDecoration: 'underline' }}>Admin</Link>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<ListaRamos />} />
            <Route path="/ramo/:id" element={<DetalleRamo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;