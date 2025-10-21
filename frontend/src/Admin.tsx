import { useEffect, useState } from 'react';
import type { Ramo } from './Types';
import ramosServices from "./services/courses"

export default function Admin() {
  const [courses, setCourses] = useState<Ramo[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  // Traemos los cursos estaticos por ahora
  const init = async () => {
    try {
      const ramosList = await ramosServices.getAll();

      setLoading(true);
      const mapped = ramosList.map(r => ({
        id: r.id,
        code: r.code,
        name: r.name,
        difficulty: r.difficulty,
        required: false,
      }));

      setCourses(mapped);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    init();
  }, []);

  // Eliminar ramo (localmente por ahora)
  const deleteCourse = async (id: string) => {
    try {
      await ramosServices.deleteCourse(id);
      alert("Curso eliminado correctamente ✅");
      // refrescar lista
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }

  const addCourse = () => {
    if (!newName.trim() || !newCode.trim()) { setMessage('Nombre y codigo requeridos'); return; }

    const id = Date.now().toString();
    const newCourse = { 
      id: id,
      code: newCode.trim(), 
      name: newName.trim(), 
      difficulty: 0, 
      required: false 
    };
    ramosServices.createCourse(newCourse)
    .then( course => {
      setCourses(prev => [course, ...prev]);
      setNewName(''); setNewCode(''); setShowAdd(false); setMessage('Ramo agregado');
    })
  }


  return (
    <div style={{ padding: 20, color: 'black', maxWidth: 800, margin: '0 auto' }}>
      <h2>Panel de administración</h2>
      {message && <p>{message}</p>}
      <section style={{ marginTop: 20 }}>
        <h3>Ramos</h3>
        <div style={{ marginBottom: 12 }}>
          <button style={{ background: '#2563eb' }} onClick={() => setShowAdd(s => !s)}>{showAdd ? 'Cancelar' : 'Agregar ramo'} </button>
        </div>
        {showAdd && (
          <div style={{ marginBottom: 12, padding: 10, border: '1px solid #ddd' }}>
            <div style={{ marginBottom: 8 }}>
              <label>Nombre</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} style={{ marginLeft: 8, background:'#2563eb' }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Codigo</label>
              <input value={newCode} onChange={e => setNewCode(e.target.value)} style={{ marginLeft: 8, background:'#2563eb' }} />
            </div>
            <div>
              <button onClick={() => addCourse()} style={{background:'#2563eb'}}>Crear ramo</button>
            </div>
          </div>
        )}
        {loading ? <p>Cargando...</p> : (
          <div>
            {courses.length === 0 && <p>No hay ramos</p>}
            <ul>
              {courses.map(c => (
                <li key={c.id} style={{ marginBottom: 8 }}>
                  <strong>{c.code}</strong> — {c.name} {' '}
                  <button onClick={() => deleteCourse(c.id)} style={{ marginLeft: 8, background:'#2563eb' }}>Eliminar</button>
                </li>
              ))}
            </ul>
            <button onClick={init} style={{background:'#2563eb'}}>Refrescar ramos</button>
          </div>
        )}
      </section>
    </div>
  )
}
