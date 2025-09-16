import ListaRamos from './ListaRamos';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Dificultad de Ramos DCC</h1>
        <p>Descubre qué tan difíciles son los ramos del Departamento de Ciencias de la Computación</p>
      </header>
      
      <main>
        <ListaRamos />
      </main>
    </div>
  );
}

export default App;