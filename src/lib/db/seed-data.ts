export type ExerciseData = {
  title: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  description: string;
  details: string;
  hint: string;
  successMessage: string;
  example: { entrada?: string; salida?: string };
  type?: "dml" | "ddl";
  validation: {
    type: "exact" | "partial" | "ddl_schema";
    conditions: Record<string, unknown>;
  };
};

export const exercisesData: ExerciseData[] = [
  {
    title: "Consulta Básica de Selección",
    difficulty: "Principiante",
    description:
      "Selecciona todas las columnas de la tabla usuarios, limitando a 5 resultados.",
    details: `En este ejercicio, practicarás:
1. La consulta SELECT básica
2. Uso de LIMIT para restringir resultados
3. Los resultados se ordenarán automáticamente por ID`,
    hint: "Estructura: SELECT * FROM tabla LIMIT número",
    successMessage:
      "¡Excelente trabajo! Has demostrado un buen entendimiento de cómo usar SELECT y limitar la cantidad de registros con LIMIT.",
    example: {
      entrada:
        "La tabla 'usuarios' con columnas: id, nombre, email, fecha_registro, edad, ciudad, activo",
      salida: "5 registros (ordenados automáticamente por ID)",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        rows: 5,
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        values: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
      },
    },
  },
  {
    title: "Selección de Columnas Específicas",
    difficulty: "Principiante",
    description: "Selecciona solo el nombre y email de todos los usuarios.",
    details: `Aprenderás a:
1. Seleccionar columnas específicas en lugar de usar *
2. Optimizar consultas solicitando solo los datos necesarios`,
    hint: "Usa SELECT columna1, columna2 FROM tabla",
    successMessage:
      "¡Muy bien! Seleccionar columnas específicas es una práctica importante para optimizar consultas.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Listado con nombre y email de todos los usuarios",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        columns: ["nombre", "email"],
      },
    },
  },
  {
    title: "Filtrado con WHERE",
    difficulty: "Principiante",
    description: "Selecciona todos los usuarios que tienen más de 30 años.",
    details: `Este ejercicio te enseñará a usar la cláusula WHERE para filtrar resultados basándote en condiciones numéricas.`,
    hint: "Usa WHERE columna > valor",
    successMessage:
      "¡Excelente! Has aprendido a filtrar datos usando condiciones numéricas con WHERE.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'edad'",
      salida: "Usuarios con edad mayor a 30",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        minAge: 30,
      },
    },
  },
  {
    title: "Ordenamiento con ORDER BY",
    difficulty: "Principiante",
    description:
      "Selecciona todos los usuarios ordenados por nombre de forma alfabética.",
    details: `Aprenderás a ordenar los resultados de tus consultas usando ORDER BY.`,
    hint: "Usa ORDER BY columna ASC (o DESC para orden descendente)",
    successMessage:
      "¡Perfecto! El ordenamiento es fundamental para presentar datos de forma organizada.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Usuarios ordenados alfabéticamente por nombre",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        orderBy: "nombre",
        orderDirection: "ASC",
      },
    },
  },
  {
    title: "Filtrado con Fechas",
    difficulty: "Intermedio",
    description:
      "Selecciona usuarios que se registraron después del '2023-05-10'.",
    details: `Este ejercicio te enseñará a usar la cláusula WHERE para filtrar resultados basándote en fechas.`,
    hint: "Usa WHERE fecha_registro > '2023-05-10'",
    successMessage:
      "¡Muy bien! Has dominado el uso de la cláusula WHERE con comparaciones de fechas.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'fecha_registro'",
      salida: "Registros de usuarios con fecha_registro > '2023-05-10'",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        values: [
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
        ],
      },
    },
  },
  {
    title: "Conteo con COUNT",
    difficulty: "Intermedio",
    description: "Cuenta cuántos usuarios hay en total en la tabla usuarios.",
    details: `Aprenderás a usar funciones de agregación como COUNT para obtener estadísticas de tus datos.`,
    hint: "Usa SELECT COUNT(*) FROM tabla",
    successMessage:
      "¡Excelente! Las funciones de agregación son esenciales para análisis de datos.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Un número representando el total de usuarios",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        rows: 1,
        hasCount: true,
      },
    },
  },
  {
    title: "Operador LIKE",
    difficulty: "Intermedio",
    description: "Encuentra todos los usuarios cuyo email contenga 'gmail'.",
    details: `Aprenderás a buscar patrones en texto usando el operador LIKE con comodines (%).`,
    hint: "Usa WHERE columna LIKE '%patron%'",
    successMessage:
      "¡Muy bien! El operador LIKE es muy útil para búsquedas de texto parciales.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'email'",
      salida: "Usuarios con emails que contengan 'gmail'",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        emailPattern: "gmail",
      },
    },
  },
  {
    title: "Agrupamiento con GROUP BY",
    difficulty: "Intermedio",
    description: "Cuenta cuántos usuarios hay por cada ciudad.",
    details: `Aprenderás a agrupar datos y aplicar funciones de agregación por grupos usando GROUP BY.`,
    hint: "Usa SELECT ciudad, COUNT(*) FROM usuarios GROUP BY ciudad",
    successMessage:
      "¡Perfecto! GROUP BY es fundamental para crear reportes y estadísticas agrupadas.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'ciudad'",
      salida: "Lista de ciudades con el conteo de usuarios en cada una",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["ciudad", "count"],
        hasGroupBy: true,
      },
    },
  },
  {
    title: "JOIN Básico",
    difficulty: "Avanzado",
    description:
      "Obtén el nombre del usuario y el monto de cada pedido usando un JOIN entre usuarios y pedidos.",
    details: `Aprenderás a combinar datos de múltiples tablas usando JOIN.`,
    hint: "Usa SELECT ... FROM usuarios JOIN pedidos ON usuarios.id = pedidos.usuario_id",
    successMessage:
      "¡Excelente! Los JOINs son fundamentales para trabajar con bases de datos relacionales.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos' relacionadas por usuario_id",
      salida: "Listado con nombre de usuario y monto de cada pedido",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "monto"],
        hasJoin: true,
      },
    },
  },
  {
    title: "Suma con SUM",
    difficulty: "Avanzado",
    description: "Calcula el monto total de todos los pedidos.",
    details: `Aprenderás a usar la función de agregación SUM para calcular totales.`,
    hint: "Usa SELECT SUM(columna) FROM tabla",
    successMessage:
      "¡Muy bien! SUM es esencial para cálculos financieros y reportes.",
    example: {
      entrada: "Tabla 'pedidos' con columna 'monto'",
      salida: "Un número representando la suma total de todos los montos",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        rows: 1,
        hasSum: true,
      },
    },
  },
  {
    title: "Total de Pedidos por Usuario",
    difficulty: "Avanzado",
    description:
      "Obtén el nombre de cada usuario junto con el número total de pedidos que ha realizado. Ordena por nombre.",
    details: `Combinarás JOIN, COUNT y GROUP BY para crear un reporte completo de pedidos por usuario.`,
    hint: "Usa LEFT JOIN para incluir usuarios sin pedidos, COUNT para contar y GROUP BY para agrupar.",
    successMessage:
      "¡Impresionante! Has combinado múltiples conceptos avanzados de SQL.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida:
        "Lista de usuarios con el total de sus pedidos (nombre, email, total_pedidos)",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "email", "total_pedidos"],
        hasJoin: true,
        hasGroupBy: true,
        hasCount: true,
      },
    },
  },
  {
    title: "Subconsulta Básica",
    difficulty: "Avanzado",
    description:
      "Encuentra los usuarios que han realizado pedidos con monto mayor al promedio de todos los pedidos.",
    details: `Aprenderás a usar subconsultas para crear condiciones más complejas.`,
    hint: "Usa una subconsulta con SELECT AVG(monto) FROM pedidos en el WHERE",
    successMessage:
      "¡Excelente! Las subconsultas permiten resolver problemas complejos de manera elegante.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: "Usuarios con pedidos superiores al promedio",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        hasSubquery: true,
        hasAvg: true,
      },
    },
  },

  // New DML Exercises - Principiante
  {
    title: "Uso de Alias (AS)",
    difficulty: "Principiante",
    description:
      'Selecciona el nombre y email de los usuarios, renombrando las columnas como "nombre_usuario" y "correo" respectivamente.',
    details: `Aprenderás a:
1. Usar AS para renombrar columnas en el resultado
2. Mejorar la legibilidad de los resultados
3. Crear nombres más descriptivos para tus datos`,
    hint: "Usa SELECT columna AS nuevo_nombre FROM tabla",
    successMessage:
      "¡Muy bien! Los alias hacen tus consultas más legibles y profesionales.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Listado con columnas renombradas a nombre_usuario y correo",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        columns: ["nombre_usuario", "correo"],
      },
    },
  },
  {
    title: "Manejo de NULL",
    difficulty: "Principiante",
    description:
      "Selecciona todos los usuarios que NO tienen ciudad registrada (ciudad es NULL).",
    details: `Este ejercicio te enseñará:
1. Cómo funciona NULL en SQL
2. Usar IS NULL para encontrar valores vacíos
3. La diferencia entre NULL y cadena vacía`,
    hint: "Usa WHERE columna IS NULL (no uses = NULL)",
    successMessage:
      "¡Excelente! Entender NULL es fundamental para manejar datos incompletos.",
    example: {
      entrada: "Tabla 'usuarios' con algunos valores NULL en ciudad",
      salida: "Usuarios sin ciudad registrada",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        hasNullCheck: true,
        columnToCheck: "ciudad",
      },
    },
  },
  {
    title: "Ordenamiento Descendente",
    difficulty: "Principiante",
    description:
      "Selecciona todos los usuarios ordenados por edad de mayor a menor.",
    details: `Aprenderás a:
1. Usar ORDER BY con DESC para orden descendente
2. Entender la diferencia entre ASC y DESC
3. Ordenar datos numéricos de mayor a menor`,
    hint: "Usa ORDER BY columna DESC",
    successMessage:
      "¡Muy bien! ORDER BY DESC es útil para ver primero los valores más altos.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Usuarios ordenados de mayor a menor edad",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        orderBy: "edad",
        orderDirection: "DESC",
      },
    },
  },
  {
    title: "Operadores Lógicos (AND/OR)",
    difficulty: "Principiante",
    description:
      "Selecciona todos los usuarios que tienen más de 25 años Y viven en 'Madrid'.",
    details: `Aprenderás a:
1. Combinar múltiples condiciones con AND
2. Entender la diferencia entre AND y OR
3. Crear filtros más precisos`,
    hint: "Usa WHERE condicion1 AND condicion2",
    successMessage:
      "¡Muy bien! Los operadores lógicos te permiten crear filtros muy específicos.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Usuarios mayores de 25 años que viven en Madrid",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        hasAnd: true,
      },
    },
  },
  {
    title: "Operador NOT",
    difficulty: "Principiante",
    description:
      "Selecciona todos los usuarios que NO están activos (activo = false).",
    details: `Este ejercicio te enseñará:
1. Usar NOT para negar condiciones
2. Filtrar por valores booleanos
3. Excluir registros específicos`,
    hint: "Usa WHERE NOT activo o WHERE activo = false",
    successMessage:
      "¡Excelente! NOT es útil para excluir registros que cumplen ciertas condiciones.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'activo'",
      salida: "Usuarios que no están activos",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        checkInactive: true,
      },
    },
  },

  // New DML Exercises - Intermedio
  {
    title: "DISTINCT - Valores Únicos",
    difficulty: "Intermedio",
    description:
      "Selecciona todas las ciudades únicas (sin repetir) de la tabla usuarios.",
    details: `Aprenderás a:
1. Usar DISTINCT para eliminar duplicados
2. Obtener valores únicos de una columna
3. Identificar la variedad de datos en tu tabla`,
    hint: "Usa SELECT DISTINCT columna FROM tabla",
    successMessage:
      "¡Perfecto! DISTINCT es muy útil para analizar la variedad de datos.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'ciudad'",
      salida: "Lista de ciudades únicas sin repeticiones",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["ciudad"],
        hasDistinct: true,
      },
    },
  },
  {
    title: "Operador IN",
    difficulty: "Intermedio",
    description:
      "Selecciona todos los usuarios que viven en 'Madrid', 'Barcelona' o 'Valencia'.",
    details: `Este ejercicio te enseñará:
1. Usar IN para filtrar por múltiples valores
2. Simplificar consultas con múltiples OR
3. Mejorar la legibilidad de tus filtros`,
    hint: "Usa WHERE columna IN ('valor1', 'valor2', 'valor3')",
    successMessage: "¡Muy bien! IN es más limpio que múltiples condiciones OR.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Usuarios de Madrid, Barcelona o Valencia",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        hasIn: true,
        inValues: ["Madrid", "Barcelona", "Valencia"],
      },
    },
  },
  {
    title: "BETWEEN - Rango de Valores",
    difficulty: "Intermedio",
    description:
      "Selecciona todos los usuarios con edad entre 25 y 35 años (inclusive).",
    details: `Aprenderás a:
1. Filtrar valores dentro de un rango con BETWEEN
2. Entender que BETWEEN incluye los límites
3. Simplificar condiciones de rango`,
    hint: "Usa WHERE columna BETWEEN valor1 AND valor2",
    successMessage:
      "¡Excelente! BETWEEN es ideal para filtrar rangos de números o fechas.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'edad'",
      salida: "Usuarios con edad entre 25 y 35",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        hasBetween: true,
        betweenColumn: "edad",
        betweenMin: 25,
        betweenMax: 35,
      },
    },
  },
  {
    title: "HAVING - Filtrar Agregaciones",
    difficulty: "Intermedio",
    description:
      "Cuenta los usuarios por ciudad y muestra solo las ciudades con más de 1 usuario.",
    details: `Este ejercicio te enseñará:
1. Usar HAVING para filtrar resultados agrupados
2. La diferencia entre WHERE y HAVING
3. Combinar GROUP BY con filtros de agregación`,
    hint: "Usa GROUP BY ciudad HAVING COUNT(*) > 1",
    successMessage:
      "¡Perfecto! HAVING filtra después de agrupar, a diferencia de WHERE.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Ciudades con más de 1 usuario y su conteo",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["ciudad", "count"],
        hasGroupBy: true,
        hasHaving: true,
      },
    },
  },
  {
    title: "LOWER y UPPER - Transformar Texto",
    difficulty: "Intermedio",
    description:
      "Selecciona el nombre en mayúsculas y el email en minúsculas de todos los usuarios.",
    details: `Aprenderás a:
1. Usar UPPER() para convertir texto a mayúsculas
2. Usar LOWER() para convertir texto a minúsculas
3. Transformar datos de texto en consultas`,
    hint: "Usa SELECT UPPER(nombre), LOWER(email) FROM tabla",
    successMessage:
      "¡Perfecto! Las funciones de texto son muy útiles para normalizar datos.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Nombres en MAYÚSCULAS y emails en minúsculas",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        hasUpper: true,
        hasLower: true,
      },
    },
  },
  {
    title: "ROUND - Redondear Números",
    difficulty: "Intermedio",
    description:
      "Calcula el promedio de los montos de pedidos y redondéalo a 2 decimales.",
    details: `Este ejercicio te enseñará:
1. Usar ROUND() para redondear números
2. Especificar la cantidad de decimales
3. Combinar funciones de agregación con ROUND`,
    hint: "Usa SELECT ROUND(AVG(columna), 2) FROM tabla",
    successMessage:
      "¡Muy bien! ROUND es esencial para presentar números de forma legible.",
    example: {
      entrada: "Tabla 'pedidos'",
      salida: "Promedio de montos redondeado a 2 decimales",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        rows: 1,
        hasRound: true,
        hasAvg: true,
      },
    },
  },
  {
    title: "Promedio con AVG",
    difficulty: "Intermedio",
    description: "Calcula la edad promedio de todos los usuarios.",
    details: `Aprenderás a:
1. Usar la función de agregación AVG
2. Calcular promedios de columnas numéricas
3. Obtener estadísticas básicas de tus datos`,
    hint: "Usa SELECT AVG(columna) FROM tabla",
    successMessage:
      "¡Muy bien! AVG es fundamental para análisis estadísticos básicos.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'edad'",
      salida: "Un número decimal representando la edad promedio",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        rows: 1,
        hasAvg: true,
      },
    },
  },
  {
    title: "MIN y MAX",
    difficulty: "Intermedio",
    description:
      "Obtén la edad mínima y máxima de los usuarios en una sola consulta.",
    details: `Este ejercicio te enseñará:
1. Usar MIN para encontrar el valor más pequeño
2. Usar MAX para encontrar el valor más grande
3. Combinar múltiples funciones de agregación`,
    hint: "Usa SELECT MIN(columna), MAX(columna) FROM tabla",
    successMessage:
      "¡Excelente! MIN y MAX son muy útiles para encontrar extremos en tus datos.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Dos valores: la edad mínima y la edad máxima",
    },
    validation: {
      type: "exact" as const,
      conditions: {
        rows: 1,
        hasMin: true,
        hasMax: true,
      },
    },
  },
  {
    title: "COALESCE - Valores por Defecto",
    difficulty: "Intermedio",
    description:
      "Selecciona el nombre y ciudad de cada usuario, mostrando 'Sin ciudad' cuando la ciudad sea NULL.",
    details: `Aprenderás a:
1. Usar COALESCE para manejar valores NULL
2. Proporcionar valores por defecto
3. Mejorar la presentación de datos incompletos`,
    hint: "Usa COALESCE(columna, 'valor_por_defecto')",
    successMessage:
      "¡Perfecto! COALESCE es muy útil para manejar datos faltantes de forma elegante.",
    example: {
      entrada: "Tabla 'usuarios' con algunos NULL en ciudad",
      salida: "Usuarios con 'Sin ciudad' en lugar de NULL",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "ciudad"],
        hasCoalesce: true,
      },
    },
  },
  {
    title: "Concatenación de Texto",
    difficulty: "Intermedio",
    description:
      "Crea una columna llamada 'info_usuario' que combine el nombre y email en formato: 'Nombre (email)'.",
    details: `Este ejercicio te enseñará:
1. Concatenar columnas de texto con ||
2. Agregar texto literal entre columnas
3. Crear campos calculados de texto`,
    hint: "Usa columna1 || ' (' || columna2 || ')' AS info_usuario",
    successMessage:
      "¡Muy bien! La concatenación es útil para crear campos personalizados.",
    example: {
      entrada: "Tabla 'usuarios' con nombre y email",
      salida: "Columna con formato 'Juan García (juan@email.com)'",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["info_usuario"],
        hasConcat: true,
      },
    },
  },

  // New DML Exercises - Avanzado
  {
    title: "Múltiples JOINs",
    difficulty: "Avanzado",
    description:
      "Obtén el nombre del usuario, el monto de cada pedido y el nombre del producto. Une las tablas usuarios, pedidos y productos.",
    details: `Este ejercicio avanzado te enseñará:
1. Unir más de dos tablas en una consulta
2. Seguir las relaciones entre múltiples tablas
3. Construir consultas complejas paso a paso`,
    hint: "Encadena los JOINs: FROM usuarios JOIN pedidos ON ... JOIN productos ON ...",
    successMessage:
      "¡Impresionante! Dominar múltiples JOINs te permite crear reportes muy completos.",
    example: {
      entrada: "Tablas 'usuarios', 'pedidos' y 'productos'",
      salida:
        "Listado con nombre de usuario, monto del pedido y nombre del producto",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "monto", "producto"],
        hasMultipleJoins: true,
        minJoins: 2,
      },
    },
  },
  {
    title: "LEFT JOIN con NULL",
    difficulty: "Avanzado",
    description:
      "Encuentra todos los usuarios que NO han realizado ningún pedido usando LEFT JOIN.",
    details: `Aprenderás a:
1. Usar LEFT JOIN para incluir registros sin coincidencias
2. Identificar registros huérfanos con IS NULL
3. Patrones comunes de análisis de datos`,
    hint: "Usa LEFT JOIN y filtra WHERE pedidos.id IS NULL",
    successMessage:
      "¡Excelente! Este patrón es muy útil para encontrar datos faltantes.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: "Usuarios sin ningún pedido registrado",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "email"],
        hasLeftJoin: true,
        hasNullCheck: true,
      },
    },
  },
  {
    title: "UNION - Combinar Resultados",
    difficulty: "Avanzado",
    description:
      'Combina en una sola lista los nombres de todos los usuarios y los nombres de todos los productos, en una columna llamada "nombre".',
    details: `Este ejercicio te enseñará:
1. Usar UNION para combinar resultados de múltiples consultas
2. Entender que UNION elimina duplicados
3. La diferencia entre UNION y UNION ALL`,
    hint: "SELECT nombre FROM tabla1 UNION SELECT nombre FROM tabla2",
    successMessage:
      "¡Muy bien! UNION es poderoso para combinar datos de diferentes fuentes.",
    example: {
      entrada: "Tablas 'usuarios' y 'productos'",
      salida: "Lista combinada de nombres de usuarios y productos",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre"],
        hasUnion: true,
      },
    },
  },
  {
    title: "CASE WHEN - Expresiones Condicionales",
    difficulty: "Avanzado",
    description:
      "Selecciona el nombre de cada usuario y una columna 'categoria_edad' que muestre 'Joven' si edad < 30, 'Adulto' si edad entre 30 y 50, y 'Senior' si edad > 50.",
    details: `Aprenderás a:
1. Crear columnas calculadas con CASE WHEN
2. Implementar lógica condicional en SQL
3. Categorizar datos dinámicamente`,
    hint: "Usa CASE WHEN condicion THEN 'valor' WHEN ... ELSE 'valor' END AS columna",
    successMessage:
      "¡Impresionante! CASE WHEN te permite crear análisis muy sofisticados.",
    example: {
      entrada: "Tabla 'usuarios' con columna 'edad'",
      salida: "Usuarios con su categoría de edad calculada",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "categoria_edad"],
        hasCaseWhen: true,
      },
    },
  },
  {
    title: "Self JOIN - Auto-unión",
    difficulty: "Avanzado",
    description:
      "Encuentra pares de usuarios que viven en la misma ciudad (cada par debe aparecer una sola vez).",
    details: `Aprenderás a:
1. Unir una tabla consigo misma (Self JOIN)
2. Usar alias para diferenciar las instancias
3. Evitar duplicados en los resultados`,
    hint: "Usa FROM usuarios u1 JOIN usuarios u2 ON u1.ciudad = u2.ciudad WHERE u1.id < u2.id",
    successMessage:
      "¡Impresionante! Self JOIN es útil para comparar registros dentro de la misma tabla.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Pares de usuarios que comparten ciudad",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        hasSelfJoin: true,
      },
    },
  },
  {
    title: "NOT IN con Subconsulta",
    difficulty: "Avanzado",
    description:
      "Selecciona todos los usuarios que NO han realizado ningún pedido usando NOT IN.",
    details: `Este ejercicio te enseñará:
1. Usar NOT IN con una subconsulta
2. Excluir registros basándose en otra tabla
3. Comparar NOT IN vs LEFT JOIN con NULL`,
    hint: "Usa WHERE id NOT IN (SELECT usuario_id FROM pedidos)",
    successMessage:
      "¡Excelente! NOT IN es otra forma de encontrar registros sin coincidencias.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: "Usuarios sin pedidos",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        hasNotIn: true,
        hasSubquery: true,
      },
    },
  },
  {
    title: "EXISTS - Verificar Existencia",
    difficulty: "Avanzado",
    description:
      "Selecciona los usuarios que tienen al menos un pedido usando EXISTS.",
    details: `Aprenderás a:
1. Usar EXISTS para verificar si existen registros relacionados
2. Entender cuándo usar EXISTS vs JOIN
3. Crear subconsultas correlacionadas simples`,
    hint: "Usa WHERE EXISTS (SELECT 1 FROM pedidos WHERE pedidos.usuario_id = usuarios.id)",
    successMessage:
      "¡Excelente! EXISTS es muy eficiente para verificar la existencia de registros.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: "Solo usuarios que han realizado al menos un pedido",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: [
          "id",
          "nombre",
          "email",
          "fecha_registro",
          "edad",
          "ciudad",
          "activo",
        ],
        hasExists: true,
      },
    },
  },
  {
    title: "Subconsulta Correlacionada",
    difficulty: "Avanzado",
    description:
      "Para cada usuario, muestra su nombre y el monto total de sus pedidos usando una subconsulta en el SELECT.",
    details: `Este ejercicio avanzado te enseñará:
1. Crear subconsultas correlacionadas en SELECT
2. Calcular valores por cada fila del resultado
3. Entender la diferencia con JOINs y GROUP BY`,
    hint: "Usa SELECT nombre, (SELECT SUM(monto) FROM pedidos WHERE usuario_id = usuarios.id) FROM usuarios",
    successMessage:
      "¡Impresionante! Las subconsultas correlacionadas son poderosas para cálculos por fila.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: "Cada usuario con el total de sus pedidos",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "total"],
        hasCorrelatedSubquery: true,
      },
    },
  },
  {
    title: "ROW_NUMBER - Funciones de Ventana",
    difficulty: "Avanzado",
    description:
      "Asigna un número de fila a cada usuario ordenado por fecha de registro, mostrando nombre, fecha_registro y el número de fila.",
    details: `Aprenderás a:
1. Usar funciones de ventana (window functions)
2. Numerar filas con ROW_NUMBER()
3. Usar OVER() para definir el orden`,
    hint: "Usa ROW_NUMBER() OVER (ORDER BY fecha_registro) AS numero_fila",
    successMessage:
      "¡Muy bien! Las funciones de ventana son herramientas muy poderosas en SQL avanzado.",
    example: {
      entrada: "Tabla 'usuarios'",
      salida: "Usuarios con su número de fila según orden de registro",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "fecha_registro", "numero_fila"],
        hasRowNumber: true,
      },
    },
  },
  {
    title: "Pedido Máximo por Usuario",
    difficulty: "Avanzado",
    description:
      "Muestra el nombre de cada usuario junto con el monto de su pedido más alto.",
    details: `Este ejercicio práctico combina:
1. JOINs con subconsultas
2. Funciones de agregación en subconsultas
3. Correlación entre consulta principal y subconsulta`,
    hint: "Usa una subconsulta con MAX(monto) correlacionada por usuario_id",
    successMessage:
      "¡Excelente! Has dominado la combinación de múltiples técnicas avanzadas de SQL.",
    example: {
      entrada: "Tablas 'usuarios' y 'pedidos'",
      salida: "Nombre de usuario y su pedido de mayor monto",
    },
    validation: {
      type: "partial" as const,
      conditions: {
        columns: ["nombre", "max_monto"],
        hasMax: true,
        hasJoin: true,
      },
    },
  },

  // DDL Exercises - Principiante
  {
    title: "CREATE TABLE - Tabla Básica",
    difficulty: "Principiante",
    description:
      'Crea una tabla llamada "productos" con columnas: id (SERIAL), nombre (VARCHAR(100)) y precio (DECIMAL(10,2)).',
    details: `En este ejercicio aprenderás:
1. La sintaxis básica de CREATE TABLE
2. Definir columnas con diferentes tipos de datos
3. Usar SERIAL para auto-incremento`,
    hint: "CREATE TABLE nombre_tabla (columna1 tipo1, columna2 tipo2, ...)",
    successMessage:
      "¡Excelente! Has creado tu primera tabla. CREATE TABLE es fundamental para diseñar bases de datos.",
    example: {
      entrada: "Esquema vacío",
      salida: 'Tabla "productos" con 3 columnas',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        schemaInspection: {
          table: "productos",
          columns: [
            { name: "id", type: "integer" },
            { name: "nombre", type: "character varying" },
            { name: "precio", type: "numeric" },
          ],
        },
        testQueries: [
          {
            query:
              "INSERT INTO productos (nombre, precio) VALUES ('Test', 9.99)",
            shouldSucceed: true,
          },
          { query: "SELECT * FROM productos", shouldSucceed: true },
        ],
      },
    },
  },
  {
    title: "DROP TABLE - Eliminar Tabla",
    difficulty: "Principiante",
    description: 'Elimina la tabla "temporal" que ya existe en el esquema.',
    details: `Aprenderás a:
1. Eliminar tablas existentes con DROP TABLE
2. Usar IF EXISTS para evitar errores si la tabla no existe`,
    hint: "DROP TABLE nombre_tabla o DROP TABLE IF EXISTS nombre_tabla",
    successMessage:
      "¡Muy bien! Has eliminado la tabla correctamente. DROP TABLE es útil para limpiar estructuras no necesarias.",
    example: {
      entrada: 'Tabla "temporal" existente',
      salida: "Tabla eliminada del esquema",
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE temporal (id SERIAL PRIMARY KEY, dato TEXT);`,
        schemaInspection: {
          table: "temporal",
          shouldExist: false,
        },
      },
    },
  },
  {
    title: "ALTER TABLE - Agregar Columna",
    difficulty: "Principiante",
    description:
      'Agrega una columna "email" de tipo VARCHAR(255) a la tabla "clientes" existente.',
    details: `Este ejercicio te enseñará:
1. Modificar tablas existentes con ALTER TABLE
2. Agregar nuevas columnas con ADD COLUMN`,
    hint: "ALTER TABLE nombre_tabla ADD COLUMN nombre_columna tipo",
    successMessage:
      "¡Perfecto! Has agregado una columna exitosamente. ALTER TABLE es esencial para evolucionar el esquema.",
    example: {
      entrada: 'Tabla "clientes" con columnas id y nombre',
      salida: 'Tabla "clientes" ahora incluye columna "email"',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE clientes (id SERIAL PRIMARY KEY, nombre VARCHAR(100));`,
        schemaInspection: {
          table: "clientes",
          columns: [
            { name: "id", type: "integer" },
            { name: "nombre", type: "character varying" },
            { name: "email", type: "character varying" },
          ],
        },
      },
    },
  },
  {
    title: "ALTER TABLE - Eliminar Columna",
    difficulty: "Principiante",
    description: 'Elimina la columna "obsoleto" de la tabla "inventario".',
    details: `Aprenderás a:
1. Eliminar columnas existentes con DROP COLUMN
2. Entender el impacto de eliminar columnas en datos existentes`,
    hint: "ALTER TABLE nombre_tabla DROP COLUMN nombre_columna",
    successMessage:
      "¡Excelente! Has eliminado la columna correctamente. Recuerda que esta operación es irreversible.",
    example: {
      entrada: 'Tabla "inventario" con columna "obsoleto"',
      salida: 'Tabla "inventario" sin la columna "obsoleto"',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE inventario (id SERIAL PRIMARY KEY, producto VARCHAR(100), cantidad INTEGER, obsoleto BOOLEAN DEFAULT false);`,
        schemaInspection: {
          table: "inventario",
          columns: [
            { name: "id", type: "integer" },
            { name: "producto", type: "character varying" },
            { name: "cantidad", type: "integer" },
          ],
        },
      },
    },
  },

  // DDL Exercises - Intermedio
  {
    title: "CREATE TABLE con PRIMARY KEY",
    difficulty: "Intermedio",
    description:
      'Crea una tabla "empleados" con id (INTEGER PRIMARY KEY), nombre (VARCHAR(100) NOT NULL) y departamento (VARCHAR(50)).',
    details: `Aprenderás a:
1. Definir PRIMARY KEY en la creación de tabla
2. Usar NOT NULL para campos requeridos
3. Entender la importancia de las claves primarias`,
    hint: "Puedes definir PRIMARY KEY inline: columna tipo PRIMARY KEY",
    successMessage:
      "¡Muy bien! Las claves primarias garantizan la unicidad de cada registro.",
    example: {
      entrada: "Esquema vacío",
      salida: 'Tabla "empleados" con PRIMARY KEY en id',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        schemaInspection: {
          table: "empleados",
          columns: [
            { name: "id", type: "integer", nullable: false },
            { name: "nombre", type: "character varying", nullable: false },
            { name: "departamento", type: "character varying" },
          ],
          constraints: [{ type: "PRIMARY KEY", columns: ["id"] }],
        },
        testQueries: [
          {
            query:
              "INSERT INTO empleados (id, nombre, departamento) VALUES (1, 'Juan', 'IT')",
            shouldSucceed: true,
          },
          {
            query:
              "INSERT INTO empleados (id, nombre, departamento) VALUES (1, 'Maria', 'HR')",
            shouldSucceed: false,
          },
        ],
      },
    },
  },
  {
    title: "ALTER TABLE - Agregar PRIMARY KEY",
    difficulty: "Intermedio",
    description:
      'Agrega una constraint PRIMARY KEY a la columna "codigo" de la tabla "categorias".',
    details: `Este ejercicio te enseñará:
1. Agregar constraints a tablas existentes
2. Usar ADD CONSTRAINT para definir claves primarias`,
    hint: "ALTER TABLE tabla ADD CONSTRAINT nombre_constraint PRIMARY KEY (columna)",
    successMessage:
      "¡Perfecto! Has agregado una clave primaria a una tabla existente.",
    example: {
      entrada: 'Tabla "categorias" sin PRIMARY KEY',
      salida: 'Tabla "categorias" con PRIMARY KEY en "codigo"',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE categorias (codigo INTEGER NOT NULL, nombre VARCHAR(100), descripcion TEXT);`,
        schemaInspection: {
          table: "categorias",
          constraints: [{ type: "PRIMARY KEY", columns: ["codigo"] }],
        },
        testQueries: [
          {
            query:
              "INSERT INTO categorias (codigo, nombre) VALUES (1, 'Electrónica')",
            shouldSucceed: true,
          },
          {
            query: "INSERT INTO categorias (codigo, nombre) VALUES (1, 'Ropa')",
            shouldSucceed: false,
          },
        ],
      },
    },
  },
  {
    title: "ALTER TABLE - Agregar FOREIGN KEY",
    difficulty: "Intermedio",
    description:
      'Agrega una FOREIGN KEY en la columna "categoria_id" de la tabla "articulos" que referencia a "categorias(id)".',
    details: `Aprenderás a:
1. Crear relaciones entre tablas con FOREIGN KEY
2. Entender la integridad referencial
3. Usar REFERENCES para definir la relación`,
    hint: "ALTER TABLE tabla ADD CONSTRAINT nombre FOREIGN KEY (columna) REFERENCES otra_tabla(columna)",
    successMessage:
      "¡Excelente! Las claves foráneas mantienen la integridad de las relaciones entre tablas.",
    example: {
      entrada: 'Tablas "categorias" y "articulos" sin relación',
      salida: "Relación establecida entre las tablas",
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `
          CREATE TABLE categorias (id SERIAL PRIMARY KEY, nombre VARCHAR(100));
          CREATE TABLE articulos (id SERIAL PRIMARY KEY, nombre VARCHAR(100), categoria_id INTEGER);
          INSERT INTO categorias (nombre) VALUES ('Electrónica');
        `,
        schemaInspection: {
          table: "articulos",
          constraints: [{ type: "FOREIGN KEY", columns: ["categoria_id"] }],
        },
        testQueries: [
          {
            query:
              "INSERT INTO articulos (nombre, categoria_id) VALUES ('Laptop', 1)",
            shouldSucceed: true,
          },
          {
            query:
              "INSERT INTO articulos (nombre, categoria_id) VALUES ('Phone', 999)",
            shouldSucceed: false,
          },
        ],
      },
    },
  },
  {
    title: "CREATE TABLE con NOT NULL",
    difficulty: "Intermedio",
    description:
      'Crea una tabla "ordenes" con id (SERIAL PRIMARY KEY), cliente (VARCHAR(100) NOT NULL), total (DECIMAL(10,2) NOT NULL) y fecha (DATE).',
    details: `Este ejercicio te enseñará:
1. Definir múltiples columnas NOT NULL
2. Combinar diferentes tipos de datos
3. Entender la importancia de los campos requeridos`,
    hint: "Usa NOT NULL después del tipo de dato para campos requeridos",
    successMessage:
      "¡Muy bien! NOT NULL previene datos incompletos en campos críticos.",
    example: {
      entrada: "Esquema vacío",
      salida: 'Tabla "ordenes" con campos requeridos',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        schemaInspection: {
          table: "ordenes",
          columns: [
            { name: "id", type: "integer", nullable: false },
            { name: "cliente", type: "character varying", nullable: false },
            { name: "total", type: "numeric", nullable: false },
            { name: "fecha", type: "date" },
          ],
        },
        testQueries: [
          {
            query:
              "INSERT INTO ordenes (cliente, total, fecha) VALUES ('Cliente 1', 100.00, '2024-01-15')",
            shouldSucceed: true,
          },
          {
            query:
              "INSERT INTO ordenes (cliente, fecha) VALUES ('Cliente 2', '2024-01-15')",
            shouldSucceed: false,
          },
          {
            query:
              "INSERT INTO ordenes (total, fecha) VALUES (50.00, '2024-01-15')",
            shouldSucceed: false,
          },
        ],
      },
    },
  },

  // DDL Exercises - Avanzado
  {
    title: "ALTER TABLE - Agregar UNIQUE",
    difficulty: "Avanzado",
    description:
      'Agrega una constraint UNIQUE a la columna "email" de la tabla "usuarios_app".',
    details: `Aprenderás a:
1. Garantizar unicidad en columnas específicas
2. Usar UNIQUE para prevenir duplicados
3. Diferencia entre PRIMARY KEY y UNIQUE`,
    hint: "ALTER TABLE tabla ADD CONSTRAINT nombre UNIQUE (columna)",
    successMessage:
      "¡Perfecto! UNIQUE garantiza que no haya valores duplicados en la columna.",
    example: {
      entrada: 'Tabla "usuarios_app" sin constraint UNIQUE',
      salida: 'Columna "email" con constraint UNIQUE',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE usuarios_app (id SERIAL PRIMARY KEY, nombre VARCHAR(100), email VARCHAR(255));`,
        schemaInspection: {
          table: "usuarios_app",
          constraints: [{ type: "UNIQUE", columns: ["email"] }],
        },
        testQueries: [
          {
            query:
              "INSERT INTO usuarios_app (nombre, email) VALUES ('Ana', 'ana@test.com')",
            shouldSucceed: true,
          },
          {
            query:
              "INSERT INTO usuarios_app (nombre, email) VALUES ('Ana 2', 'ana@test.com')",
            shouldSucceed: false,
          },
        ],
      },
    },
  },
  {
    title: "ALTER TABLE - Agregar CHECK",
    difficulty: "Avanzado",
    description:
      'Agrega una constraint CHECK a la tabla "productos_venta" para que el precio sea siempre mayor a 0.',
    details: `Este ejercicio te enseñará:
1. Validar datos con CHECK constraints
2. Definir reglas de negocio a nivel de base de datos
3. Prevenir datos inválidos automáticamente`,
    hint: "ALTER TABLE tabla ADD CONSTRAINT nombre CHECK (condición)",
    successMessage:
      "¡Excelente! CHECK constraints validan datos antes de insertarlos.",
    example: {
      entrada: 'Tabla "productos_venta" sin validación de precio',
      salida: "Constraint que impide precios negativos o cero",
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE productos_venta (id SERIAL PRIMARY KEY, nombre VARCHAR(100), precio DECIMAL(10,2));`,
        schemaInspection: {
          table: "productos_venta",
          constraints: [{ type: "CHECK", columns: [] }],
        },
        testQueries: [
          {
            query:
              "INSERT INTO productos_venta (nombre, precio) VALUES ('Producto A', 25.99)",
            shouldSucceed: true,
          },
          {
            query:
              "INSERT INTO productos_venta (nombre, precio) VALUES ('Producto B', 0)",
            shouldSucceed: false,
          },
          {
            query:
              "INSERT INTO productos_venta (nombre, precio) VALUES ('Producto C', -5.00)",
            shouldSucceed: false,
          },
        ],
      },
    },
  },
  {
    title: "CREATE INDEX - Índice Simple",
    difficulty: "Avanzado",
    description:
      'Crea un índice llamado "idx_ventas_fecha" en la columna "fecha" de la tabla "ventas".',
    details: `Aprenderás a:
1. Crear índices para optimizar consultas
2. Entender cuándo usar índices
3. La sintaxis de CREATE INDEX`,
    hint: "CREATE INDEX nombre_indice ON tabla (columna)",
    successMessage:
      "¡Muy bien! Los índices mejoran significativamente el rendimiento de las consultas.",
    example: {
      entrada: 'Tabla "ventas" sin índice en fecha',
      salida: "Índice creado para búsquedas por fecha",
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE ventas (id SERIAL PRIMARY KEY, producto VARCHAR(100), cantidad INTEGER, fecha DATE, total DECIMAL(10,2));`,
        schemaInspection: {
          table: "ventas",
          indexes: [{ name: "idx_ventas_fecha", columns: ["fecha"] }],
        },
      },
    },
  },
  {
    title: "CREATE INDEX - Índice Compuesto",
    difficulty: "Avanzado",
    description:
      'Crea un índice compuesto llamado "idx_logs_usuario_fecha" en las columnas "usuario_id" y "fecha" de la tabla "logs".',
    details: `Este ejercicio avanzado te enseñará:
1. Crear índices en múltiples columnas
2. El orden de las columnas en índices compuestos
3. Cuándo usar índices compuestos`,
    hint: "CREATE INDEX nombre ON tabla (columna1, columna2)",
    successMessage:
      "¡Impresionante! Los índices compuestos optimizan consultas que filtran por múltiples columnas.",
    example: {
      entrada: 'Tabla "logs" sin índices',
      salida: "Índice compuesto en usuario_id y fecha",
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE logs (id SERIAL PRIMARY KEY, usuario_id INTEGER, accion VARCHAR(100), fecha TIMESTAMP);`,
        schemaInspection: {
          table: "logs",
          indexes: [
            {
              name: "idx_logs_usuario_fecha",
              columns: ["usuario_id", "fecha"],
            },
          ],
        },
      },
    },
  },
  {
    title: "ALTER TABLE - Renombrar Columna",
    difficulty: "Avanzado",
    description:
      'Renombra la columna "nombre_completo" a "nombre" en la tabla "contactos".',
    details: `Aprenderás a:
1. Renombrar columnas existentes
2. Usar RENAME COLUMN
3. Mantener la compatibilidad al cambiar nombres`,
    hint: "ALTER TABLE tabla RENAME COLUMN nombre_viejo TO nombre_nuevo",
    successMessage:
      "¡Perfecto! Renombrar columnas es útil para refactorizar el esquema de la base de datos.",
    example: {
      entrada: 'Tabla "contactos" con columna "nombre_completo"',
      salida: 'Columna renombrada a "nombre"',
    },
    type: "ddl",
    validation: {
      type: "ddl_schema" as const,
      conditions: {
        setupSQL: `CREATE TABLE contactos (id SERIAL PRIMARY KEY, nombre_completo VARCHAR(200), telefono VARCHAR(20), email VARCHAR(100));`,
        schemaInspection: {
          table: "contactos",
          columns: [
            { name: "id", type: "integer" },
            { name: "nombre", type: "character varying" },
            { name: "telefono", type: "character varying" },
            { name: "email", type: "character varying" },
          ],
        },
      },
    },
  },
];
