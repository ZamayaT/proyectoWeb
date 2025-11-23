import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import type { Comentario } from '../Types/Types';
import comentariosService from '../services/comentarios';
import ramosServices from "../services/courses";
import type { Ramo, User } from "../Types/Types";

import { Container, Card, CardContent, Typography, Button, Box, Stack, Alert, TextField, Switch, FormControlLabel, Collapse, IconButton, Chip, Paper } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";


interface propDetalleRamo {
  setUser: (user: User | null) => void,
  user : User | null,
}

const DetalleRamo = (props : propDetalleRamo) => {
  const { id } = useParams<{ id: string }>();
  
  // Estados para comentarios
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [ramo, setRamo] = useState<Ramo>();

  // Estados para nuevo comentario
  const [anonimo, setAnonimo] = useState<boolean>(false);
  const [nuevoTexto, setNuevoTexto] = useState<string>('');
  const [nuevaDificultad, setNuevaDificultad] = useState<number>(0);

  // User
  const { user} = props;

  // Manejar la sección de agregar un comentario
  const [isOpen, setIsOpen] = useState(false);
  
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
    loadComentarios();
  }, [id]);

  const handleAddComentario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!ramo) return;

    if (nuevaDificultad === 0) {
      alert("Por favor, selecciona una dificultad antes de publicar tu comentario.");
      return;
    }

    const nuevoComentario = {
      author: user?.id || null,
      content: nuevoTexto,
      course: ramo.id,
      isAnonimo : !user ? true : anonimo,
      votes: nuevaDificultad
    };

    try {
      const creado = await comentariosService.createComment(nuevoComentario);

      setRamo(creado.course as Ramo);
      setComentarios([creado, ...comentarios]);
      setNuevaDificultad(0);
      setNuevoTexto('');
      setAnonimo(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComentario = async (id : string) => {
    try {
      const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este comentario  ?");
      if (!confirmar) return;

      const eliminado = await comentariosService.deleteComment(id);
      // refrescar lista
      setRamo(eliminado.course as Ramo)
      setComentarios(prev => prev.filter(c => c.id !== id))
      // alert("Curso eliminado correctamente ✅}");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  } 

  const [hover, setHover] = useState<number | null>(null);

  const getColorForLevel = (level: number) => {
    const colors = [
      '#d9f99d', // 1 - verde lima claro
      '#bef264', // 2
      '#a3e635', // 3
      '#facc15', // 4 - amarillo
      '#f59e0b', // 5 - naranja
      '#f87171', // 6 - rojo claro
      '#dc2626', // 7 - rojo intenso
    ];
    return colors[level - 1] || '#e5e7eb';
  };

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

  // Si no se encuentra el ramo
  if (!ramo) {
    return (
      <Container sx={{ py: 4 }}>
        <Button component={Link} to="/" sx={{ mb: 2 }}> ← Volver </Button>
        <Typography variant="h4" align='center' sx={{fontWeight: 'bold', color: "#333", marginBottom: 4}}>
          Ramo no encontrado
        </Typography>
      </Container>
    );
  }

  const typeOfCourse = () => {
    if(ramo.required){
      return "Obligatorio"
    } else {
      return "Electivo"
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>

      <Button component={Link} to="/" sx={{ mb: 2 }}> ← Volver </Button>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={700}>{ramo.name}</Typography>

          <Typography variant="h5" color="primary">{ramo.code}</Typography>

          <Chip
            label={typeOfCourse()}
            color="primary"
            sx={{ mt: 1, mb: 1 }}
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">
              Nivel de dificultad 
              {ramo.difficulty > 0 && ` (${ramo.difficulty.toFixed()}/7)`}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {[...Array(7)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: 1,
                      backgroundColor:
                        i < ramo.difficulty
                          ? getColorForLevel(Number(ramo.difficulty.toFixed()))
                          : "#e5e7eb"
                    }}
                  />
                ))}
              </Box>

              <Typography
                sx={{
                  ml: 2,
                  color: getColorForLevel(Number(ramo.difficulty.toFixed())),
                  fontWeight: "bold"
                }}
              >
                {ramo.difficulty > 0
                  ? getLabelForLevel(Number(ramo.difficulty.toFixed()))
                  : "Sin datos"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}
            onClick={() => setIsOpen(isOpen => !isOpen)}
          >
            <Typography variant="h5">Agregar comentario</Typography>
            <ExpandMoreIcon
              sx={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease"
              }}
            />
          </Box>

          <Collapse in={isOpen}>
            <Box component="form" onSubmit={handleAddComentario} sx={{ mt: 2 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}> Dificultad * </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", gap: 0.6 }}>
                  {[...Array(7)].map((_, index) => {
                    const level = index + 1;
                    const isActive = level <= (hover || nuevaDificultad);
                    return (
                      <Box
                        key={index}
                        onMouseEnter={() => setHover(level)}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => setNuevaDificultad(level)}
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: 1,
                          cursor: "pointer",
                          backgroundColor: isActive
                            ? getColorForLevel(hover || nuevaDificultad || 1)
                            : "#e5e7eb",
                          transition: "0.2s"
                        }}
                      />
                    );
                  })}
                </Box>

                <Typography sx={{ fontWeight: "bold", color: hover || nuevaDificultad ? getColorForLevel(hover || nuevaDificultad ) : 'inherit' }}>
                  {((hover && hover > 0) || nuevaDificultad > 0)
                    ? getLabelForLevel(hover || nuevaDificultad)
                    : "Sin seleccionar"}
                </Typography>
              </Box>

              <FormControlLabel
                control={<Switch checked={anonimo} onChange={() => setAnonimo(a => !a)} />}
                label="Comentar como anónimo"
                sx={{ mt: 2 }}
              />

              <TextField
                label="Tu comentario"
                multiline
                rows={4}
                value={nuevoTexto}
                onChange={(e) => setNuevoTexto(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />

              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Publicar comentario
              </Button>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}> Comentarios ({comentarios.length})</Typography>

          {loading && <Typography>Cargando comentarios…</Typography>}
          {error && <Alert severity="error">{error}</Alert>}

          {!loading && comentarios.length === 0 && (
            <Typography fontStyle="italic">Sin comentarios aún.</Typography>
          )}

          <Stack spacing={2} sx={{ mt: 2 }}>
            {comentarios.map(c => (
              <Paper key={c.id} sx={{p: 2,position: "relative","&:hover .deleteIcon": {opacity: 1}}}>
                { user && (user?.role === "admin" || user?.username === c.author?.username) &&    (
                  <IconButton
                    className="deleteIcon"
                    size="small"
                    onClick={() => deleteComentario(c.id)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>
                    {c.isAnonimo ? "Anónimo" : c.author?.username }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography sx={{ mt: 1 }}>{c.content}</Typography>

                {c.votes > 0 && (
                  <Typography
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                      color: getColorForLevel(c.votes)
                    }}
                  >
                    {getLabelForLevel(c.votes)} ({c.votes}/7)
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>

    </Container>
  );
};

export default DetalleRamo;