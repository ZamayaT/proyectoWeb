import { useState } from 'react';
// import axios from 'axios';
import loginService from "../services/login"
import type {User} from "../Types/Types"

interface propLogin {
  setUser: (user: User | null) => void,
  user : User | null,
}

export default function Login( props : propLogin) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const { setUser, user} = props;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      // Consultamos api/login con username y password para hacer login
      const loginUser = {
        username,
        password
      }
      const res = await loginService.login(loginUser)

      if (res) {
        setMessage('Login exitoso');
        setUser(res)
      } else {
        setMessage('Error en el login');
      }
      setUsername("");
      setPassword("");
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
      const newUser = {
        username,
        password
      }
      const res = await loginService.register(newUser)

      if (res) {
        setMessage('Usuario registrado correctamente.');
      } else {
        setMessage('Error al registrar usuario');
      }

      setUsername("");
      setPassword("");

    } catch (err: any) {
        // Error de backend
      if (err.response && err.response.data && err.response.data.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage('Error al registrar usuario');
      }
    }
  }

  const handleLogout = async () => {
    await loginService.logout()
    setUser(null);
    setUsername('');
    setPassword('');
    setMessage('Sesión cerrada 👋');
  };

  return (
    <>
      <div style={{ maxWidth: 480, margin: '20px auto', padding: 20, background: 'white', borderRadius: 8, color: 'black' }}>
      {!user ? (
        <>
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
        </>
      ) : (
        <>
          <h2>Bienvenido 👋</h2>
          <p>Usuario  <b>{user.username || 'Usuario activo'}</b> logueado</p>
          <br></br>
          <button onClick={handleLogout} style={{ padding: '8px 12px', background: 'red', color: 'white' }}>
            Logout
          </button>
        </>
      )
    }
    </div>
    </>
  )
}
