import axios from 'axios';
import type { Comentario } from '../Types/Types';

const baseUrl = 'http://localhost:3001';

// Función para obtener comentarios de un ramo específico
const getComentariosByRamo = (ramoId: string): Promise<Comentario[]> => {
  const request = axios.get(`${baseUrl}/comentarios?ramoId=${ramoId}`);
  return request.then(response => response.data);
};

export default {
  getComentariosByRamo
};