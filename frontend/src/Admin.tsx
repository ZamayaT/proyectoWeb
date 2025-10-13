import { useEffect, useState } from 'react';
import axios from 'axios';
import { ramos } from './ramos';

type Course = {
  _id: string;
  code: string;
  name: string;
  difficulty: number;
  required: boolean;
}

export default function Admin() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  // Traemos los cursos estaticos por ahora
  const getCourses = async () => {
    try {
      setLoading(true);
      const mapped = ramos.map(r => ({
        _id: r.id,
        code: r.codigo,
        name: r.nombre,
        difficulty: r.dificultad,
        required: false,
      }));
      setCourses(mapped);
    } finally { setLoading(false); }
  }

  useEffect(() => {
    getCourses();
  }, []);

  // Eliminar ramo (localmente por ahora)
  const deleteCourse = async (id: string) => {
    setCourses(prev => prev.filter(c => c._id !== id));
    setMessage('Ramo eliminado (localmente por ahora)');
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
              <button onClick={() => {
                if (!newName.trim() || !newCode.trim()) { setMessage('Nombre y codigo requeridos'); return; }
                const id = Date.now().toString();
                const newCourse = { _id: id, code: newCode.trim(), name: newName.trim(), difficulty: 0, required: false };
                setCourses(prev => [newCourse, ...prev]);
                setNewName(''); setNewCode(''); setShowAdd(false); setMessage('Ramo agregado (localmente por ahora)');
              }} style={{background:'#2563eb'}}>Crear ramo</button>
            </div>
          </div>
        )}
        {loading ? <p>Cargando...</p> : (
          <div>
            {courses.length === 0 && <p>No hay ramos</p>}
            <ul>
              {courses.map(c => (
                <li key={c._id} style={{ marginBottom: 8 }}>
                  <strong>{c.code}</strong> — {c.name} {' '}
                  <button onClick={() => deleteCourse(c._id)} style={{ marginLeft: 8, background:'#2563eb' }}>Eliminar</button>
                </li>
              ))}
            </ul>
            <button onClick={getCourses} style={{background:'#2563eb'}}>Refrescar ramos</button>
          </div>
        )}
      </section>
    </div>
  )
}
