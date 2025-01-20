// import { Ejercicio } from '@/types/exercises'
// import { SQLResult } from '@/types/database'

// export const ejercicios: Ejercicio[] = [
//   {
//     id: 1,
//     titulo: "Consulta Básica de Selección",
//     dificultad: "Principiante",
//     descripcion: "Selecciona todas las columnas de la tabla usuarios, limitando a 5 resultados.",
//     detalles: `En este ejercicio, practicarás:
//     1. La consulta SELECT básica
//     2. Uso de LIMIT para restringir resultados
//     3. Los resultados se ordenarán automáticamente por ID`,
//     ejemplo: {
//       entrada: "La tabla 'usuarios' con columnas: id, nombre, email, fecha_registro, edad, ciudad, activo",
//       salida: "5 registros (ordenados automáticamente por ID)"
//     },
//     pista: "Estructura: SELECT * FROM tabla LIMIT número",
//     mensajeExito: "¡Excelente trabajo! Has demostrado un buen entendimiento de cómo usar SELECT y limitar la cantidad de registros con LIMIT. Estas son operaciones fundamentales en SQL que te permitirán controlar mejor los datos que obtienes de tus consultas.",
//     validacion: {
//       type: 'exact',
//       conditions: {
//         rows: 5,
//         columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
//         values: [
//           { id: 1 },
//           { id: 2 },
//           { id: 3 },
//           { id: 4 },
//           { id: 5 }
//         ]
//       }
//     }
//   },
//   {
//     id: 2,
//     titulo: "Filtrado con WHERE",
//     dificultad: "Intermedio",
//     descripcion: "Selecciona usuarios que se registraron después del '2023-05-10'.",
//     detalles: `Este ejercicio te enseñará a usar la cláusula WHERE para filtrar resultados. 
//     Deberás seleccionar usuarios basándote en su fecha de registro.`,
//     ejemplo: {
//       entrada: "La tabla 'usuarios' con columnas: id, nombre, email, fecha_registro",
//       salida: "Registros de usuarios con fecha_registro >= '2023-05-10'"
//     },
//     pista: "Usa la cláusula WHERE con un operador de comparación para fechas.",
//     mensajeExito: "¡Muy bien! Has dominado el uso de la cláusula WHERE para filtrar datos y el manejo de fechas en SQL. Estas habilidades son esenciales para crear consultas precisas y obtener exactamente los datos que necesitas.",
//     validacion: {
//       type: 'exact',
//       conditions: {
//         columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
//         values: [
//           { id: 5 },
//           { id: 6 },
//           { id: 7 },
//           { id: 8 },
//           { id: 9 },
//           { id: 10 }
//         ]
//       }
//     }
//   },
//   {
//     id: 3,
//     titulo: "Joins Avanzados",
//     dificultad: "Avanzado",
//     descripcion: "Realiza un JOIN entre las tablas 'usuarios' y 'pedidos' para obtener el total de pedidos por usuario. Ordena los resultados por nombre de usuario.",
//     detalles: `En este ejercicio avanzado, practicarás cómo unir dos tablas y realizar cálculos agregados. 
//     Deberás combinar la información de usuarios con sus pedidos y calcular el total de pedidos para cada usuario.`,
//     ejemplo: {
//       entrada: `Tablas:
//       - 'usuarios' (id, nombre, email)
//       - 'pedidos' (id, usuario_id, monto, fecha)`,
//       salida: "Lista de usuarios con el total de sus pedidos (nombre, email, total_pedidos)"
//     },
//     pista: "Utiliza LEFT JOIN para incluir todos los usuarios y COUNT() para contar los pedidos.",
//     mensajeExito: "¡Impresionante! Has logrado dominar conceptos avanzados de SQL como JOINs, funciones de agregación (COUNT) y agrupamiento (GROUP BY). Esta combinación de habilidades es fundamental para análisis de datos y generación de reportes en bases de datos relacionales.",
//     validacion: {
//       type: 'partial',
//       conditions: {
//         columns: ['nombre', 'email', 'total_pedidos'],
//         customValidation: (result: SQLResult) => {
//           const expectedResults = [
//             { nombre: 'Ana García', email: 'ana.garcia@email.com', total_pedidos: 2 },
//             { nombre: 'Carlos López', email: 'carlos.lopez@email.com', total_pedidos: 1 },
//             { nombre: 'Carmen Ruiz', email: 'carmen.ruiz@email.com', total_pedidos: 1 },
//             { nombre: 'Diego Herrera', email: 'diego.herrera@email.com', total_pedidos: 1 },
//             { nombre: 'Juan Martínez', email: 'juan.martinez@email.com', total_pedidos: 2 },
//             { nombre: 'Laura Sánchez', email: 'laura.sanchez@email.com', total_pedidos: 1 },
//             { nombre: 'María Rodríguez', email: 'maria.rodriguez@email.com', total_pedidos: 1 },
//             { nombre: 'Miguel Flores', email: 'miguel.flores@email.com', total_pedidos: 2 },
//             { nombre: 'Pedro Ramírez', email: 'pedro.ramirez@email.com', total_pedidos: 1 },
//             { nombre: 'Sofia Torres', email: 'sofia.torres@email.com', total_pedidos: 2 }
//           ];

//           // Verificar que el número de filas coincida
//           if (result.rows.length !== expectedResults.length) {
//             return false;
//           }

//           // Verificar que cada fila coincida con los resultados esperados
//           return result.rows.every(row => {
//             return expectedResults.some(expected => 
//               expected.nombre === row.nombre &&
//               expected.email === row.email &&
//               Number(row.total_pedidos) === expected.total_pedidos
//             );
//           });
//         }
//       }
//     }
//   }
// ]
