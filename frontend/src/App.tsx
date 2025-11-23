import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ListaRamos from './pages/ListaRamos';
import DetalleRamo from './pages/DetalleRamo';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './App.css';
import { useAppDispatch } from './store/hooks'
import { restoreLogin } from './store/thunks/authThunks'
import { fetchCourses } from './store/thunks/coursesThunks'
import { useEffect, useState } from 'react';
import loginService from "./services/login";
import type { User } from "./Types/Types";
import { AppBar, Toolbar, Typography, Box, Link as MuiLink, IconButton } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Para correr, npm run dev en frontend y npx json-server --port 3001 db.json

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(restoreLogin())
    dispatch(fetchCourses())
  }, [dispatch])
  
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => { 
    const init = async () => {
      const storedUser = await loginService.restoreLogin()
      if (storedUser) {
        setUser(storedUser);
      }
    }
    init()
  }, []);

  return (
    <Router>
      <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', width: '100%' }}>
        <AppBar position="sticky">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <MuiLink to="/" component={Link} sx={{ color: 'white', textDecoration: 'none', marginRight: 2, '&:hover': { color: 'white' }, }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Dificultad de Ramos DCC
              </Typography>
            </MuiLink>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MuiLink to="/" component={Link} sx={{ color: 'white', textDecoration: 'none', marginRight: 2, '&:hover': { color: '#ffbc14ff' }, }}>
                <IconButton color="inherit">
                  <FormatListBulletedIcon />
                </IconButton>
                Lista de Ramos
              </MuiLink>
              {(user?.role === "admin") && (
                <MuiLink to="/admin" component={Link} sx={{ color: 'white', textDecoration: 'none', marginRight: 2, '&:hover': { color: '#e7a80aff' }, }}>
                  <IconButton color="inherit">
                    <AdminPanelSettingsIcon />
                  </IconButton>
                  Panel de administrador
                </MuiLink>
              )}
              <MuiLink to="/login" component={Link} sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: '#e7a80aff' }, }}>
                <IconButton color="inherit">
                  <AccountCircleIcon />
                </IconButton>
                Sesión
              </MuiLink>
            </Box>
          </Toolbar>
        </AppBar>

        <main>
          <Routes>
            <Route path="/" element={<ListaRamos />} />
            <Route path="/ramo/:id" element={<DetalleRamo setUser={(u) => setUser(u)} user={user}/>} />
            <Route path="/login" element={<Login setUser={(u) => setUser(u)} user={user}/>} />
            <Route 
              path="/admin" 
              element={
                (user && user.role === "admin") 
                  ? <Admin /> 
                  : <Navigate to={user ? "/" : "/login"} replace />
              } 
            />
          </Routes>
        </main>
      </Box>
    </Router>
  );
}

export default App;