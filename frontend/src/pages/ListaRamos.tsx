import { useNavigate } from 'react-router-dom';
import ramosServices from "../services/courses"
import type { Ramo } from '../Types/Types';
import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Grid from "@mui/material/Grid";

const ListaRamos = () => {
  const [ramos, setRamos] = useState<Ramo[]>([]);
  const [filter, setFilter] = useState<'all' | 'elective' | 'required'>('all');

  const navigate = useNavigate();

  const handleRamoClick = (ramoId: string) => {
    navigate(`/ramo/${ramoId}`);
  };  

  useEffect(() => {
    const init = async () => {
      handleFilterChange('all');
    };
    init();
  }, []);

  // Manejamos el filtro de ramos
  const handleFilterChange = async (value: 'all' | 'elective' | 'required') => {
    setFilter(value);
    console.log("Filtro seleccionado:", value);

    if (value === 'all') {
      const data = await ramosServices.getAll();
      setRamos(data);
    } else if (value === 'elective') {
      const data = await ramosServices.getOnlyElectives();
      setRamos(data)
    } else if (value === 'required') {
      const data = await ramosServices.getOnlyRequired();
      setRamos(data);
    }
    console.log("Cursos recibidos:", ramos);
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

  const typeOfCourse = (required: boolean) => {
    if(required){
      return "Obligatorio"
    } else {
      return "Electivo"
    }
  }

  return (
    <Container sx={{paddingTop: 4, paddingBottom: 4}}>
      <Typography variant="h4" align='center' sx={{fontWeight: 'bold', color: "#333", marginBottom: 4}}>
        Ramos disponibles
      </Typography>

      <FormControl fullWidth sx={{ marginBottom: 3 }}>
        <InputLabel>Filtrar</InputLabel>
        <Select
          value={filter}
          label="Filtrar"
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="elective">Electivos</MenuItem>
          <MenuItem value="required">Obligatorios</MenuItem>
        </Select>
      </FormControl>
      
      <Grid container spacing={3}>
        {ramos.map((ramo) => (
          <Grid size={6} key={ramo.code}>
            <Card
              onClick={() => handleRamoClick(ramo.id)}
              sx={{
                cursor: 'pointer',
                borderRadius: 3,
                transition: '0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2563eb', mb: 1 }}>
                  {ramo.name}
                </Typography>

                <Typography variant="body2" sx={{ color: '#555', mb: 2 }}>
                  {ramo.code} — {typeOfCourse(ramo.required)}
                </Typography>
                
                {ramo.difficulty === 0 ? (
                  <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic' }}>
                    Aún no hay comentarios ...
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: '#555', fontWeight: 600 }}>
                    Dificultad: {ramo.difficulty.toFixed()}/7 — {getLabelForLevel(Number(ramo.difficulty.toFixed()))}
                  </Typography>
                )}

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ListaRamos;