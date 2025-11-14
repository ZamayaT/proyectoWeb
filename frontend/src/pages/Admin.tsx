import { useEffect, useState } from 'react';
import type { Ramo } from '../Types/Types';
import ramosServices from "../services/courses";
import { Container, Alert, Typography, Button, TextField, Checkbox, FormControlLabel, Card, CardContent, Stack, List, ListItem, ListItemText, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import ModalAdmin from "../components/ModalAdmin"

export default function Admin() {
  const [courses, setCourses] = useState<Ramo[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [courseSelected, setCourseSelected] = useState<Ramo | null>(null)

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
        required: r.required,
        totalComments: r.totalComments
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
      const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este curso?");

      if (!confirmar) return;
      await ramosServices.deleteCourse(id);
      alert("Curso eliminado correctamente ✅}");
      // refrescar lista
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }

  const viewModal = (course : Ramo) => {
    setCourseSelected(course)
    setOpenModal(true)
  }

  const closeModal = () => {
    setOpenModal(false)
  }

  const updateCourses = (course : Ramo) => {
    setCourses(courses.map(c => (c.id === course.id) ? course : c));
  }

  const addCourse = () => {
    if (!newName.trim() || !newCode.trim()) { setMessage('Nombre y codigo requeridos'); return; }

    const id = Date.now().toString();
    const newCourse = { 
      id: id,
      code: newCode.trim(), 
      name: newName.trim(), 
      difficulty: 0, 
      required: isRequired,
      totalComments: 0,
    };
    
    ramosServices.createCourse(newCourse)
    .then( course => {
      setCourses(prev => [course, ...prev]);
      setNewName(''); setNewCode(''); setShowAdd(false); setIsRequired(true); setMessage('Ramo agregado');
    })
  }


  return (
    <Container maxWidth="md" sx={{ p: 4 }}>
      <Typography variant="h4" align='center' sx={{fontWeight: 'bold', color: "#333", marginBottom: 4}}>
        Administrar Ramos
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}> {message} </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setShowAdd(s => !s)}> {showAdd ? "Cancelar" : "Agregar ramo"} </Button>
      </Box>

      {showAdd && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Nombre" value={newName} onChange={(e) => setNewName(e.target.value)} fullWidth/>
              <TextField label="Código" value={newCode} onChange={(e) => setNewCode(e.target.value)} fullWidth/>

              <FormControlLabel
                control={ <Checkbox checked={isRequired} onChange={() => setIsRequired(!isRequired)} /> }
                label="Obligatorio"
              />

              <Button variant="contained" onClick={addCourse}> Crear ramo </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Typography>Cargando...</Typography>
      ) : (
        <Box>
          {courses.length === 0 ? (
            <Typography>No hay ramos</Typography>
          ) : (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <List>
                  {courses.map((c) => (
                    <ListItem
                      key={c.id}
                      secondaryAction={
                        <Stack direction="row" spacing={1}>
                          <Button 
                            color="error" 
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            size="small"
                            onClick={() => deleteCourse(c.id)}
                          >
                            Eliminar
                          </Button>

                          <Button 
                            variant="outlined"
                            startIcon={<EditIcon />}
                            size="small"
                            onClick={() => viewModal(c)}
                          >
                            Editar
                          </Button>
                        </Stack>
                      }
                    >
                      <ListItemText primary={`${c.code} — ${c.name}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
      {openModal && courseSelected && <ModalAdmin course={courseSelected} openModal={openModal} setCourseSelected={() => setCourseSelected} setCourses={(c) => updateCourses(c)} closedModal={closeModal}/>}
    </Container>
  );
}