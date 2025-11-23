import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { login as loginThunk, logout as logoutThunk, restoreLogin } from './store/thunks/authThunks'
import loginService from './services/login'
import type { User } from './Types'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)
  const loading = useAppSelector(state => state.auth.loading)
  const error = useAppSelector(state => state.auth.error)

  useEffect(() => {
    dispatch(restoreLogin())
  }, [dispatch])

  useEffect(() => {
    if (error) setMessage(error)
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    await dispatch(loginThunk({ username, password }))
    setUsername('')
    setPassword('')
  }

  const handleRegister = async () => {
    setMessage(null)
    try {
      await loginService.register({ username, password })
      setMessage('Usuario registrado correctamente.')
      setUsername('')
      setPassword('')
    } catch (err: any) {
      setMessage(err?.response?.data?.error || 'Error al registrar usuario')
    }
  }

  const handleLogout = async () => {
    await dispatch(logoutThunk())
  }

  return (
    <div style={{ maxWidth: 480, margin: '20px auto', padding: 20, background: 'white', borderRadius: 8, color: 'black' }}>
      {!user ? (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label>Usuario</label>
              <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: 8, background: '#2563eb' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, background: '#2563eb' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '8px 12px', background: '#2563eb' }} disabled={loading}>Entrar</button>
              <button type="button" onClick={handleRegister} style={{ padding: '8px 12px', background: '#2563eb' }}>Registrar</button>
            </div>
          </form>
          {message && <p style={{ marginTop: 12, color: 'black' }}>{message}</p>}
        </>
      ) : (
        <>
          <h2>Bienvenido 👋</h2>
          <p>Usuario  <b>{(user as User).username || 'Usuario activo'}</b> logueado</p>
          <br />
          <button onClick={handleLogout} style={{ padding: '8px 12px', background: 'red', color: 'white' }}>Logout</button>
        </>
      )}
    </div>
  )
}
