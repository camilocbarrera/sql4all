import { Ejercicio } from '@/types/exercises'
import { SQLResult } from '@/types/database'

export const ejercicios: Ejercicio[] = [
  {
    id: 1,
    titulo: "Consulta Básica de Selección",
    dificultad: "Principiante",
    descripcion: "Selecciona todas las columnas de la tabla usuarios, limitando a 5 resultados ordenados por ID.",
    detalles: `En este ejercicio, practicarás:
    1. La consulta SELECT básica
    2. Uso de LIMIT para restringir resultados
    3. Ordenamiento con ORDER BY`,
    ejemplo: {
      entrada: "La tabla 'usuarios' con columnas: id, nombre, email, fecha_registro, edad, ciudad, activo",
      salida: "5 registros ordenados por ID"
    },
    pista: "Estructura: SELECT * FROM tabla ORDER BY columna LIMIT número",
    mensajeExito: "¡Excelente trabajo! Has demostrado un buen entendimiento de cómo ordenar resultados con ORDER BY y limitar la cantidad de registros con LIMIT. Estas son operaciones fundamentales en SQL que te permitirán controlar mejor los datos que obtienes de tus consultas.",
    validacion: {
      type: 'exact',
      conditions: {
        rows: 5,
        columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
        values: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 }
        ]
      }
    }
  },
  {
    id: 2,
    titulo: "Filtrado con WHERE",
    dificultad: "Intermedio",
    descripcion: "Selecciona usuarios que se registraron después del '2023-01-01'.",
    detalles: `Este ejercicio te enseñará a usar la cláusula WHERE para filtrar resultados. 
    Deberás seleccionar usuarios basándote en su fecha de registro.`,
    ejemplo: {
      entrada: "La tabla 'usuarios' con columnas: id, nombre, email, fecha_registro",
      salida: "Registros de usuarios con fecha_registro > '2023-01-01'"
    },
    pista: "Usa la cláusula WHERE con un operador de comparación para fechas.",
    mensajeExito: "¡Muy bien! Has dominado el uso de la cláusula WHERE para filtrar datos y el manejo de fechas en SQL. Estas habilidades son esenciales para crear consultas precisas y obtener exactamente los datos que necesitas.",
    validacion: {
      type: 'custom',
      conditions: {
        customValidation: (result: SQLResult) => {
          return result.rows.every((row) => {
            const fecha = new Date(row.fecha_registro as string);
            return fecha > new Date('2023-01-01');
          });
        }
      }
    }
  },
  {
    id: 3,
    titulo: "Joins Avanzados",
    dificultad: "Avanzado",
    descripcion: "Realiza un JOIN entre las tablas 'usuarios' y 'pedidos' para obtener el total de pedidos por usuario.",
    detalles: `En este ejercicio avanzado, practicarás cómo unir dos tablas y realizar cálculos agregados. 
    Deberás combinar la información de usuarios con sus pedidos y calcular el total de pedidos para cada usuario.`,
    ejemplo: {
      entrada: `Tablas:
      - 'usuarios' (id, nombre, email)
      - 'pedidos' (id, usuario_id, monto, fecha)`,
      salida: "Lista de usuarios con el total de sus pedidos (nombre, email, total_pedidos)"
    },
    pista: "Utiliza LEFT JOIN para incluir todos los usuarios y COUNT() para contar los pedidos.",
    mensajeExito: "¡Impresionante! Has logrado dominar conceptos avanzados de SQL como JOINs, funciones de agregación (COUNT) y agrupamiento (GROUP BY). Esta combinación de habilidades es fundamental para análisis de datos y generación de reportes en bases de datos relacionales.",
    validacion: {
      type: 'partial',
      conditions: {
        columns: ['nombre', 'email', 'total_pedidos'],
        customValidation: (result: SQLResult) => {
          const expectedTotals = new Map([
            ['Ana García', 2],
            ['Carlos López', 1],
            ['María Rodríguez', 1],
          ]);

          return result.rows.every((row) => {
            const expectedTotal = expectedTotals.get(row.nombre as string);
            return expectedTotal === Number(row.total_pedidos);
          });
        }
      }
    }
  }
]
