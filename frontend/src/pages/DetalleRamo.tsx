import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Comentario } from '../Types/Types';
import comentariosService from '../services/comentarios';
import ramosServices from "../services/courses"
import type { Ramo, User } from "../Types/Types"
import loginService from "../services/login"

const DetalleRamo = () => {
  const { id } = useParams<{ id: string }>();
  
  // Estados para comentarios
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [ramo, setRamo] = useState<Ramo>();

  // Estados para nuevo comentario
  const [nuevoTexto, setNuevoTexto] = useState<string>('');

  // User
  const [user, setUser] = useState<User | null>(null);
  
  // Cargar comentarios cuando cambie el id
  useEffect(() => {
    const loadComentarios = async () => {

      const data = await ramosServices.getCourse(id || "")
      
      if (!data) {
        return;
      }
      else{
        try {
          setRamo(data);
          setLoading(true);
          setError('');
          const comentariosData = await comentariosService.getComentariosByRamo(data.id);
          setComentarios(comentariosData);
        } catch (err) {
          setError('Error al cargar comentarios');
          console.error('Error:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    const initUser = async () => {
      const storedUser = await loginService.restoreLogin()
      if (storedUser) {
        setUser(storedUser);
      }
    }

    initUser();
    loadComentarios();
  }, [id]);

  const handleAddComentario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nuevoTexto.trim() || !ramo) return;

    // fecha: new Date().toLocaleDateString('es-CL'),
    const nuevoComentario = {
      author: user?.id || null,
      content: nuevoTexto,
      course: ramo.id
    };

    console.log(nuevoComentario);

    try {
      const creado = await comentariosService.createComment(nuevoComentario);

      setComentarios([creado, ...comentarios]);
      setNuevoTexto('');
    } catch (err) {
      console.error(err);
    }
  };

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
          {ramo.name}
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#2563eb',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          {ramo.code}
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
                    backgroundColor: index < ramo.difficulty ? '#2563eb' : '#e5e7eb',
                    borderRadius: '3px'
                  }}
                />
              ))}
            </div>
            <span style={{ fontWeight: '600', color: '#333' }}>
              {ramo.difficulty}/7
            </span>
          </div>
        </div>
      </div>

      {/* Sección para crear comentario */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>
            Agregar un nuevo comentario
          </h2>

          <form onSubmit={handleAddComentario}>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }}>
                Tu comentario
              </label>
              <textarea
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
                placeholder="Comparte tu experiencia sobre este ramo..."
                rows={4}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  color: '#1e293b',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '600',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8')}
              onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb')}
            >
              Publicar comentario
            </button>
          </form>
      </div>

      {/* Sección de comentarios */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>
          Comentarios de estudiantes ({comentarios.length})
        </h2>

        {loading && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Cargando comentarios...
          </p>
        )}

        {error && (
          <p style={{ color: '#dc2626', marginBottom: '20px' }}>
            {error}
          </p>
        )}

        {!loading && !error && comentarios.length === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Aún no hay comentarios para este ramo. ¡Sé el primero en compartir tu experiencia!
          </p>
        )}

        {!loading && !error && comentarios.length > 0 && (
          <div>
            {comentarios.map((comentario) => (
              <div 
                key={comentario.id} 
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '20px',
                  marginBottom: '15px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '10px' 
                }}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>
                    {comentario.author?.username || "Anónimo"}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    {new Date(comentario.createdAt).getDate().toString().padStart(2, '0')}-
                    {(new Date(comentario.createdAt).getMonth() + 1).toString().padStart(2, '0')}-
                    {new Date(comentario.createdAt).getFullYear()}
                  </span>
                </div>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {comentario.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetalleRamo;