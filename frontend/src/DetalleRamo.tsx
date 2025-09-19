import { useParams, Link } from 'react-router-dom';
import { ramos } from './ramos';

const DetalleRamo = () => {
  const { id } = useParams<{ id: string }>();
  
  // Buscar el ramo por id
  const ramo = ramos.find(r => r.id === id);

  // Si no se encuentra el ramo
  if (!ramo) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Ramo no encontrado</h2>
        <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>
          ← Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Botón para volver */}
      <Link 
        to="/" 
        style={{ 
          color: '#2563eb', 
          textDecoration: 'none',
          fontSize: '1rem',
          marginBottom: '20px',
          display: 'inline-block'
        }}
      >
        ← Volver a la lista
      </Link>

      {/* Información del ramo */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '10px',
          color: '#333'
        }}>
          {ramo.nombre}
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#2563eb',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          {ramo.codigo}
        </p>

        <div style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#333' }}>
            Nivel de Dificultad
          </h3>
          
          {/* Barra visual de dificultad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: index < ramo.dificultad ? '#2563eb' : '#e5e7eb',
                    borderRadius: '3px'
                  }}
                />
              ))}
            </div>
            <span style={{ fontWeight: '600', color: '#333' }}>
              {ramo.dificultad}/7
            </span>
          </div>
        </div>
      </div>

      {/* Sección de comentarios (placeholder por ahora) */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>
          Comentarios de estudiantes
        </h2>
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Los comentarios se cargarán en el siguiente paso...
        </p>
      </div>
    </div>
  );
};

export default DetalleRamo;