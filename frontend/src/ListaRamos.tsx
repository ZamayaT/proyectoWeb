import { ramos } from './ramos';

const ListaRamos = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Ramos disponibles
      </h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '20px'
      }}>
        {ramos.map((ramo) => (
          <div 
            key={ramo.id} 
            style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, boxShadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: 'bold', 
              color: '#2563eb', 
              marginBottom: '10px' 
            }}>
              {ramo.codigo}
            </h3>
            
            <p style={{ 
              fontSize: '1rem', 
              color: '#666', 
              marginBottom: '15px',
              lineHeight: '1.4'
            }}>
              {ramo.nombre}
            </p>
            
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#555',
              fontWeight: '600'
            }}>
              Dificultad: {ramo.dificultad}/7
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaRamos;