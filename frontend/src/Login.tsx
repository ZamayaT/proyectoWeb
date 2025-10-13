import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
        // Consultamos api/login con username y password para hacer login
      const res = await axios.post('/api/login', { username, password });
      if (res.status === 200) {
        setMessage('Login exitoso');
      } else {
        setMessage('Error en el login');
      }
    } catch (err: any) {
      if (err.response.status === 404) {
        setMessage('No se encuentra el endpoint /api/login');
      } else {
        setMessage('Error al contactar el servidor');
      }
    }
  }

  const handleRegister = async () => {
    setMessage(null);
    try {
        // Intentamos crear usuario en /api/user con username y password
      const res = await axios.post('/api/user', { username, password });
      if (res.status === 201) {
        setMessage('Usuario registrado correctamente.');
      } else {
        setMessage('Error al registrar usuario');
      }
    } catch (err: any) {
        // Error de backend
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Error al registrar usuario');
      }
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '20px auto', padding: 20, background: 'white', borderRadius: 8, color: 'black' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Usuario</label>
          <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: 8, background: "#2563eb" }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, background: "#2563eb" }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" style={{ padding: '8px 12px', background: '#2563eb' }}>Entrar</button>
          <button type="button" onClick={handleRegister} style={{ padding: '8px 12px', background:'#2563eb' }}>Registrar</button>
        </div>
      </form>
      {message && <p style={{ marginTop: 12, color: 'black' }}>{message}</p>}
    </div>
  )
}
