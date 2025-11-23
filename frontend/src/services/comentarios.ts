import axios from 'axios';
import type { Comentario } from '../Types/Types';
import axiosSecure from "../utils/axiosSecure"

// const baseUrl = 'http://localhost:3001';
const baseUrl = '/api/comments';

// Función para obtener comentarios de un ramo específico
const getComentariosByRamo = (id: string): Promise<Comentario[]> => {
  const request = axios.get<Comentario[]>(`${baseUrl}/course/${id}`);
  return request.then(response => response.data);
};

interface DataCreateComentario {
  author : string | null;
  content : string;
  course : string;
}

const createComment = (newCourse: DataCreateComentario) => {
  return axios.post<Comentario>(baseUrl, newCourse).then(res => res.data);
};

const deleteComment = (id: string) => {
  return axiosSecure.delete(`${baseUrl}/${id}`).then(res => res.data);
};

export default {
  getComentariosByRamo,
  createComment,
  deleteComment
};