import { useState } from 'react';
import loginService from "../services/login";
import type {User} from "../Types/Types";
import { Container, Paper, TextField, Button, Typography, Stack, Alert, Box } from '@mui/material';

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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        
        {!user ? (
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Iniciar Sesión
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Usuario"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained" fullWidth>
                    Entrar
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleRegister}
                  >
                    Registrar
                  </Button>
                </Stack>

                {message && <Alert severity="info">{message}</Alert>}
              </Stack>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Bienvenido 👋
            </Typography>

            <Typography>
              Sesión de usuario <b>{user.username}</b> iniciada correctamente
            </Typography>

            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>

            {message && <Alert sx={{ mt: 2 }} severity="info">{message}</Alert>}
          </>
        )}

      </Paper>
    </Container>
  );
}