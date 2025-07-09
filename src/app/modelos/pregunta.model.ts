export interface Pregunta {
  _id?: string;
  pregunta: string; 
  opciones: string[];
  respuestaCorrecta: string;
  categoria?: string;
}

export enum CategoriaPregunta {
  MATEMATICAS = 'Matematicas',
  HISTORIA = 'Historia',
  CIENCIAS = 'Ciencias',
  GEOGRAFIA = 'Geografia',
  LITERATURA = 'Literatura',
  DEPORTES = 'Deportes',
  ARTE = 'Arte',
  TECNOLOGIA = 'Tecnologia',
  RANDOM = 'Random'
}