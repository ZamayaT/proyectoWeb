// Tipo para los ramos del DCC
export interface Ramo {
  id: string;
  code: string;
  name: string;
  difficulty: number; // De 1 a 7
  required : boolean;
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