// Tipo para los ramos del DCC
export interface Ramo {
  id: string;
  code: string;
  name: string;
  difficulty: number; // De 1 a 7
  totalComments: number;
  required : boolean;
}

// Tipo para los comentarios sobre los ramos
export interface Comentario {
  id: string;
  course: Ramo;
  author: User | null;
  content: string;
  votes: number;
  isAnonimo : boolean;
  createdAt: string
  updatedAt: string // Formato: "YYYY-MM-DD"
}

// Tipo para crear un comentario nuevo (sin id)
export interface NuevoComentario {
  ramoId: string;
  autor: string;
  texto: string;
  fecha: string;
}

// Tipo para usuarios
export interface User {
  id : string;
  username: string;
  role: string;
}