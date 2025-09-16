import { ramos } from './ramos';

const ListaRamos = () => {
  return (
    <div className="lista-ramos">
      <h2>Ramos disponibles</h2>
      <div className="ramos-grid">
        {ramos.map((ramo) => (
          <div key={ramo.id} className="ramo-card">
            <h3 className="ramo-codigo">{ramo.codigo}</h3>
            <p className="ramo-nombre">{ramo.nombre}</p>
            <div className="dificultad-info">
              <span>Dificultad: {ramo.dificultad}/7</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaRamos;