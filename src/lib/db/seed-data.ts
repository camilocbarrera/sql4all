export const exercisesData = [
  {
    title: 'Consulta Básica de Selección',
    difficulty: 'Principiante',
    description: 'Selecciona todas las columnas de la tabla usuarios, limitando a 5 resultados.',
    details: `En este ejercicio, practicarás:
1. La consulta SELECT básica
2. Uso de LIMIT para restringir resultados
3. Los resultados se ordenarán automáticamente por ID`,
    hint: 'Estructura: SELECT * FROM tabla LIMIT número',
    successMessage: '¡Excelente trabajo! Has demostrado un buen entendimiento de cómo usar SELECT y limitar la cantidad de registros con LIMIT.',
    example: {
      entrada: "La tabla 'usuarios' con columnas: id, nombre, email, fecha_registro, edad, ciudad, activo",
      salida: '5 registros (ordenados automáticamente por ID)',
    },
    validation: {
      type: 'exact' as const,
      conditions: {
        rows: 5,
        columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
        values: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      },
    },
  },
  {
    title: 'Selección de Columnas Específicas',
    difficulty: 'Principiante',
    description: 'Selecciona solo el nombre y email de todos los usuarios.',
    details: `Aprenderás a:
1. Seleccionar columnas específicas en lugar de usar *
2. Optimizar consultas solicitando solo los datos necesarios`,
    hint: 'Usa SELECT columna1, columna2 FROM tabla',
    successMessage: '¡Muy bien! Seleccionar columnas específicas es una práctica importante para optimizar consultas.',
    example: {
      entrada: "Tabla 'usuarios'",
      salida: 'Listado con nombre y email de todos los usuarios',
    },
    validation: {
      type: 'exact' as const,
      conditions: {
        columns: ['nombre', 'email'],
      },
    },
  },
  {
    title: 'Filtrado con WHERE',
    difficulty: 'Principiante',
    description: 'Selecciona todos los usuarios que tienen más de 30 años.',
    details: `Este ejercicio te enseñará a usar la cláusula WHERE para filtrar resultados basándote en condiciones numéricas.`,
    hint: 'Usa WHERE columna > valor',
    successMessage: '¡Excelente! Has aprendido a filtrar datos usando condiciones numéricas con WHERE.',
    example: {
      entrada: "Tabla 'usuarios' con columna 'edad'",
      salida: 'Usuarios con edad mayor a 30',
    },
    validation: {
      type: 'partial' as const,
      conditions: {
        columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
        minAge: 30,
      },
    },
  },
  {
    title: 'Ordenamiento con ORDER BY',
    difficulty: 'Principiante',
    description: 'Selecciona todos los usuarios ordenados por nombre de forma alfabética.',
    details: `Aprenderás a ordenar los resultados de tus consultas usando ORDER BY.`,
    hint: 'Usa ORDER BY columna ASC (o DESC para orden descendente)',
    successMessage: '¡Perfecto! El ordenamiento es fundamental para presentar datos de forma organizada.',
    example: {
      entrada: "Tabla 'usuarios'",
      salida: 'Usuarios ordenados alfabéticamente por nombre',
    },
    validation: {
      type: 'partial' as const,
      conditions: {
        columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
        orderBy: 'nombre',
        orderDirection: 'ASC',
      },
    },
  },
  {
    title: 'Filtrado con Fechas',
    difficulty: 'Intermedio',
    description: "Selecciona usuarios que se registraron después del '2023-05-10'.",
    details: `Este ejercicio te enseñará a usar la cláusula WHERE para filtrar resultados basándote en fechas.`,
    hint: "Usa WHERE fecha_registro > '2023-05-10'",
    successMessage: '¡Muy bien! Has dominado el uso de la cláusula WHERE con comparaciones de fechas.',
    example: {
      entrada: "Tabla 'usuarios' con columna 'fecha_registro'",
      salida: "Registros de usuarios con fecha_registro > '2023-05-10'",
    },
    validation: {
      type: 'exact' as const,
      conditions: {
        columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
        values: [{ id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }],
      },
    },
  },
  {
    title: 'Conteo con COUNT',
    difficulty: 'Intermedio',
    description: 'Cuenta cuántos usuarios hay en total en la tabla usuarios.',
    details: `Aprenderás a usar funciones de agregación como COUNT para obtener estadísticas de tus datos.`,
    hint: 'Usa SELECT COUNT(*) FROM tabla',
    successMessage: '¡Excelente! Las funciones de agregación son esenciales para análisis de datos.',
    example: {
      entrada: "Tabla 'usuarios'",
      salida: 'Un número representando el total de usuarios',
    },
    validation: {
      type: 'exact' as const,
      conditions: {
        rows: 1,
        hasCount: true,
      },
    },
  },
  {
    title: 'Operador LIKE',
    difficulty: 'Intermedio',
    description: "Encuentra todos los usuarios cuyo email contenga 'gmail'.",
    details: `Aprenderás a buscar patrones en texto usando el operador LIKE con comodines (%).`,
    hint: "Usa WHERE columna LIKE '%patron%'",
    successMessage: '¡Muy bien! El operador LIKE es muy útil para búsquedas de texto parciales.',
    example: {
      entrada: "Tabla 'usuarios' con columna 'email'",
      salida: "Usuarios con emails que contengan 'gmail'",
    },
    validation: {
      type: 'partial' as const,
      conditions: {
        columns: ['id', 'nombre', 'email', 'fecha_registro', 'edad', 'ciudad', 'activo'],
        emailPattern: 'gmail',
      },
    },
  },
  {
    title: 'Agrupamiento con GROUP BY',
    difficulty: 'Intermedio',
    description: 'Cuenta cuántos usuarios hay por cada ciudad.',
    details: `Aprenderás a agrupar datos y aplicar funciones de agregación por grupos usando GROUP BY.`,
    hint: 'Usa SELECT ciudad, COUNT(*) FROM usuarios GROUP BY ciudad',
    successMessage: '¡Perfecto! GROUP BY es fundamental para crear reportes y estadísticas agrupadas.',
    example: {
      entrada: "Tabla 'usuarios' con columna 'ciudad'",
      salida: 'Lista de ciudades con el conteo de usuarios en cada una',
    },
    validation: {
      type: 'partial' as const,
      conditions: {
        columns: ['ciudad', 'count'],
        hasGroupBy: true,
      },
    },
  },
  {
    title: 'JOIN Básico',
    difficulty: 'Avanzado',
    description: 'Obtén el nombre del usuario y el monto de cada pedido usando un JOIN entre usuarios y pedidos.',
    details: `Aprenderás a combinar datos de múltiples tablas usando JOIN.`,
    hint: 'Usa SELECT ... FROM usuarios JOIN pedidos ON usuarios.id = pedidos.usuario_id',
    successMessage: '¡Excelente! Los JOINs son fundamentales para trabajar con bases de datos relacionales.',
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos' relacionadas por usuario_id",
      salida: 'Listado con nombre de usuario y monto de cada pedido',
    },
    validation: {
      type: 'partial' as const,
      conditions: {
        columns: ['nombre', 'monto'],
        hasJoin: true,
      },
    },
  },
  {
    title: 'Suma con SUM',
    difficulty: 'Avanzado',
    description: 'Calcula el monto total de todos los pedidos.',
    details: `Aprenderás a usar la función de agregación SUM para calcular totales.`,
    hint: 'Usa SELECT SUM(columna) FROM tabla',
    successMessage: '¡Muy bien! SUM es esencial para cálculos financieros y reportes.',
    example: {
      entrada: "Tabla 'pedidos' con columna 'monto'",
      salida: 'Un número representando la suma total de todos los montos',
    },
    validation: {
      type: 'exact' as const,
      conditions: {
        rows: 1,
        hasSum: true,
      },
    },
  },
  {
    title: 'Total de Pedidos por Usuario',
    difficulty: 'Avanzado',
    description: 'Obtén el nombre de cada usuario junto con el número total de pedidos que ha realizado. Ordena por nombre.',
    details: `Combinarás JOIN, COUNT y GROUP BY para crear un reporte completo de pedidos por usuario.`,
    hint: 'Usa LEFT JOIN para incluir usuarios sin pedidos, COUNT para contar y GROUP BY para agrupar.',
    successMessage: '¡Impresionante! Has combinado múltiples conceptos avanzados de SQL.',
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: 'Lista de usuarios con el total de sus pedidos (nombre, email, total_pedidos)',
    },
    validation: {
      type: 'partial' as const,
      conditions: {
        columns: ['nombre', 'email', 'total_pedidos'],
        hasJoin: true,
        hasGroupBy: true,
        hasCount: true,
      },
    },
  },
  {
    title: 'Subconsulta Básica',
    difficulty: 'Avanzado',
    description: 'Encuentra los usuarios que han realizado pedidos con monto mayor al promedio de todos los pedidos.',
    details: `Aprenderás a usar subconsultas para crear condiciones más complejas.`,
    hint: 'Usa una subconsulta con SELECT AVG(monto) FROM pedidos en el WHERE',
    successMessage: '¡Excelente! Las subconsultas permiten resolver problemas complejos de manera elegante.',
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: 'Usuarios con pedidos superiores al promedio',
    },
    validation: {
      type: 'partial' as const,
      conditions: {
        hasSubquery: true,
        hasAvg: true,
      },
    },
  },
]

