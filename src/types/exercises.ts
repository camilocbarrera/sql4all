import { SQLResult } from './database'

export interface ExpectedOutput {
  type: 'exact' | 'partial' | 'count' | 'custom';
  conditions: {
    rows?: number;
    columns?: string[];
    values?: any[];
    customValidation?: (result: SQLResult) => boolean;
  };
}

export interface Ejercicio {
  id: number;
  titulo: string;
  dificultad: string;
  descripcion: string;
  detalles: string;
  ejemplo: {
    entrada: string;
    salida: string;
  };
  pista: string;
  validacion: ExpectedOutput;
  mensajeExito: string;
}
