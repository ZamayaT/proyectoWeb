import { useNavigate } from 'react-router-dom';
import ramosServices from "./services/courses"
import type { Ramo } from './Types';
import { useEffect, useState } from 'react';

const ListaRamos = () => {
  const [ramos, setRamos] = useState<Ramo[]>([]);
  const navigate = useNavigate();

  const handleRamoClick = (ramoId: string) => {
    navigate(`/ramo/${ramoId}`);
  };

  useEffect(() => {
    const init = async () => {
      await ramosServices.getAll().then((data) => {
        console.log(data)
        setRamos(data);
      });
    };
    init();
  }, []);

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
            key={ramo.code}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s, boxShadow 0.2s'
            }}
            onClick={() => handleRamoClick(ramo.id)}
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
              {ramo.name}
            </h3>
            
            <p style={{ 
              fontSize: '1rem', 
              color: '#666', 
              marginBottom: '15px',
              lineHeight: '1.4'
            }}>
              {ramo.code}
            </p>
            
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#555',
              fontWeight: '600'
            }}>
              Dificultad: {ramo.difficulty}/7
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaRamos;