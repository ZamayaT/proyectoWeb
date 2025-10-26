import { useNavigate } from 'react-router-dom';
import ramosServices from "../services/courses"
import type { Ramo } from '../Types/Types';
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
        setRamos(data);
      });
    };
    init();
  }, []);

  const getLabelForLevel = (level: number) => {
    const labels = [
      'Muy fácil',
      'Fácil',
      'Algo fácil',
      'Moderado',
      'Algo difícil',
      'Difícil',
      'Muy difícil',
    ];
    return labels[level - 1] || '';
  };

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
            
            {ramo.difficulty === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Aún no hay comentarios para este ramo. ¡Sé el primero en compartir tu experiencia!
              </p>
            ) : (
              <div style={{ 
                fontSize: '0.9rem', 
                color: '#555',
                fontWeight: '600'
              }}>
                Dificultad: {ramo.difficulty.toFixed()}/7 - {getLabelForLevel(Number(ramo.difficulty.toFixed()))}
              </div>
            )
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaRamos;