import ListaRamos from './ListaRamos';
import './App.css';

function App() {
  return (
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
      </header>
      
      <main>
        <ListaRamos />
      </main>
    </div>
  );
}

export default App;