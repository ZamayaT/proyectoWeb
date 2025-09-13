// Tipo para los ramos del DCC
export interface Ramo {
  id: string;
  codigo: string;
  nombre: string;
  dificultad: number; // De 1 a 7
}

// Tipo para los comentarios sobre los ramos
export interface Comentario {
  id: string;
  ramoId: string;
  autor: string;
  texto: string;
  fecha: string; // Formato: "YYYY-MM-DD"
}

// Tipo para crear un comentario nuevo (sin id)
export interface NuevoComentario {
  ramoId: string;
  autor: string;
  texto: string;
  fecha: string;
}