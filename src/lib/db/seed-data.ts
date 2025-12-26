export type ExerciseData = {
  title: string
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado'
  description: string
  details: string
  hint: string
  successMessage: string
  example: { entrada?: string; salida?: string }
  type?: 'dml' | 'ddl'
  validation: {
    type: 'exact' | 'partial' | 'ddl_schema'
    conditions: Record<string, unknown>
  }
}

export const exercisesData: ExerciseData[] = [
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

  // DDL Exercises - Principiante
  {
    title: 'CREATE TABLE - Tabla Básica',
    difficulty: 'Principiante',
    description: 'Crea una tabla llamada "productos" con columnas: id (SERIAL), nombre (VARCHAR(100)) y precio (DECIMAL(10,2)).',
    details: `En este ejercicio aprenderás:
1. La sintaxis básica de CREATE TABLE
2. Definir columnas con diferentes tipos de datos
3. Usar SERIAL para auto-incremento`,
    hint: 'CREATE TABLE nombre_tabla (columna1 tipo1, columna2 tipo2, ...)',
    successMessage: '¡Excelente! Has creado tu primera tabla. CREATE TABLE es fundamental para diseñar bases de datos.',
    example: {
      entrada: 'Esquema vacío',
      salida: 'Tabla "productos" con 3 columnas',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        schemaInspection: {
          table: 'productos',
          columns: [
            { name: 'id', type: 'integer' },
            { name: 'nombre', type: 'character varying' },
            { name: 'precio', type: 'numeric' },
          ],
        },
        testQueries: [
          { query: "INSERT INTO productos (nombre, precio) VALUES ('Test', 9.99)", shouldSucceed: true },
          { query: 'SELECT * FROM productos', shouldSucceed: true },
        ],
      },
    },
  },
  {
    title: 'DROP TABLE - Eliminar Tabla',
    difficulty: 'Principiante',
    description: 'Elimina la tabla "temporal" que ya existe en el esquema.',
    details: `Aprenderás a:
1. Eliminar tablas existentes con DROP TABLE
2. Usar IF EXISTS para evitar errores si la tabla no existe`,
    hint: 'DROP TABLE nombre_tabla o DROP TABLE IF EXISTS nombre_tabla',
    successMessage: '¡Muy bien! Has eliminado la tabla correctamente. DROP TABLE es útil para limpiar estructuras no necesarias.',
    example: {
      entrada: 'Tabla "temporal" existente',
      salida: 'Tabla eliminada del esquema',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE temporal (id SERIAL PRIMARY KEY, dato TEXT);`,
        schemaInspection: {
          table: 'temporal',
          shouldExist: false,
        },
      },
    },
  },
  {
    title: 'ALTER TABLE - Agregar Columna',
    difficulty: 'Principiante',
    description: 'Agrega una columna "email" de tipo VARCHAR(255) a la tabla "clientes" existente.',
    details: `Este ejercicio te enseñará:
1. Modificar tablas existentes con ALTER TABLE
2. Agregar nuevas columnas con ADD COLUMN`,
    hint: 'ALTER TABLE nombre_tabla ADD COLUMN nombre_columna tipo',
    successMessage: '¡Perfecto! Has agregado una columna exitosamente. ALTER TABLE es esencial para evolucionar el esquema.',
    example: {
      entrada: 'Tabla "clientes" con columnas id y nombre',
      salida: 'Tabla "clientes" ahora incluye columna "email"',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE clientes (id SERIAL PRIMARY KEY, nombre VARCHAR(100));`,
        schemaInspection: {
          table: 'clientes',
          columns: [
            { name: 'id', type: 'integer' },
            { name: 'nombre', type: 'character varying' },
            { name: 'email', type: 'character varying' },
          ],
        },
      },
    },
  },
  {
    title: 'ALTER TABLE - Eliminar Columna',
    difficulty: 'Principiante',
    description: 'Elimina la columna "obsoleto" de la tabla "inventario".',
    details: `Aprenderás a:
1. Eliminar columnas existentes con DROP COLUMN
2. Entender el impacto de eliminar columnas en datos existentes`,
    hint: 'ALTER TABLE nombre_tabla DROP COLUMN nombre_columna',
    successMessage: '¡Excelente! Has eliminado la columna correctamente. Recuerda que esta operación es irreversible.',
    example: {
      entrada: 'Tabla "inventario" con columna "obsoleto"',
      salida: 'Tabla "inventario" sin la columna "obsoleto"',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE inventario (id SERIAL PRIMARY KEY, producto VARCHAR(100), cantidad INTEGER, obsoleto BOOLEAN DEFAULT false);`,
        schemaInspection: {
          table: 'inventario',
          columns: [
            { name: 'id', type: 'integer' },
            { name: 'producto', type: 'character varying' },
            { name: 'cantidad', type: 'integer' },
          ],
        },
      },
    },
  },

  // DDL Exercises - Intermedio
  {
    title: 'CREATE TABLE con PRIMARY KEY',
    difficulty: 'Intermedio',
    description: 'Crea una tabla "empleados" con id (INTEGER PRIMARY KEY), nombre (VARCHAR(100) NOT NULL) y departamento (VARCHAR(50)).',
    details: `Aprenderás a:
1. Definir PRIMARY KEY en la creación de tabla
2. Usar NOT NULL para campos requeridos
3. Entender la importancia de las claves primarias`,
    hint: 'Puedes definir PRIMARY KEY inline: columna tipo PRIMARY KEY',
    successMessage: '¡Muy bien! Las claves primarias garantizan la unicidad de cada registro.',
    example: {
      entrada: 'Esquema vacío',
      salida: 'Tabla "empleados" con PRIMARY KEY en id',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        schemaInspection: {
          table: 'empleados',
          columns: [
            { name: 'id', type: 'integer', nullable: false },
            { name: 'nombre', type: 'character varying', nullable: false },
            { name: 'departamento', type: 'character varying' },
          ],
          constraints: [
            { type: 'PRIMARY KEY', columns: ['id'] },
          ],
        },
        testQueries: [
          { query: "INSERT INTO empleados (id, nombre, departamento) VALUES (1, 'Juan', 'IT')", shouldSucceed: true },
          { query: "INSERT INTO empleados (id, nombre, departamento) VALUES (1, 'Maria', 'HR')", shouldSucceed: false },
        ],
      },
    },
  },
  {
    title: 'ALTER TABLE - Agregar PRIMARY KEY',
    difficulty: 'Intermedio',
    description: 'Agrega una constraint PRIMARY KEY a la columna "codigo" de la tabla "categorias".',
    details: `Este ejercicio te enseñará:
1. Agregar constraints a tablas existentes
2. Usar ADD CONSTRAINT para definir claves primarias`,
    hint: 'ALTER TABLE tabla ADD CONSTRAINT nombre_constraint PRIMARY KEY (columna)',
    successMessage: '¡Perfecto! Has agregado una clave primaria a una tabla existente.',
    example: {
      entrada: 'Tabla "categorias" sin PRIMARY KEY',
      salida: 'Tabla "categorias" con PRIMARY KEY en "codigo"',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE categorias (codigo INTEGER NOT NULL, nombre VARCHAR(100), descripcion TEXT);`,
        schemaInspection: {
          table: 'categorias',
          constraints: [
            { type: 'PRIMARY KEY', columns: ['codigo'] },
          ],
        },
        testQueries: [
          { query: "INSERT INTO categorias (codigo, nombre) VALUES (1, 'Electrónica')", shouldSucceed: true },
          { query: "INSERT INTO categorias (codigo, nombre) VALUES (1, 'Ropa')", shouldSucceed: false },
        ],
      },
    },
  },
  {
    title: 'ALTER TABLE - Agregar FOREIGN KEY',
    difficulty: 'Intermedio',
    description: 'Agrega una FOREIGN KEY en la columna "categoria_id" de la tabla "articulos" que referencia a "categorias(id)".',
    details: `Aprenderás a:
1. Crear relaciones entre tablas con FOREIGN KEY
2. Entender la integridad referencial
3. Usar REFERENCES para definir la relación`,
    hint: 'ALTER TABLE tabla ADD CONSTRAINT nombre FOREIGN KEY (columna) REFERENCES otra_tabla(columna)',
    successMessage: '¡Excelente! Las claves foráneas mantienen la integridad de las relaciones entre tablas.',
    example: {
      entrada: 'Tablas "categorias" y "articulos" sin relación',
      salida: 'Relación establecida entre las tablas',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `
          CREATE TABLE categorias (id SERIAL PRIMARY KEY, nombre VARCHAR(100));
          CREATE TABLE articulos (id SERIAL PRIMARY KEY, nombre VARCHAR(100), categoria_id INTEGER);
          INSERT INTO categorias (nombre) VALUES ('Electrónica');
        `,
        schemaInspection: {
          table: 'articulos',
          constraints: [
            { type: 'FOREIGN KEY', columns: ['categoria_id'] },
          ],
        },
        testQueries: [
          { query: "INSERT INTO articulos (nombre, categoria_id) VALUES ('Laptop', 1)", shouldSucceed: true },
          { query: "INSERT INTO articulos (nombre, categoria_id) VALUES ('Phone', 999)", shouldSucceed: false },
        ],
      },
    },
  },
  {
    title: 'CREATE TABLE con NOT NULL',
    difficulty: 'Intermedio',
    description: 'Crea una tabla "ordenes" con id (SERIAL PRIMARY KEY), cliente (VARCHAR(100) NOT NULL), total (DECIMAL(10,2) NOT NULL) y fecha (DATE).',
    details: `Este ejercicio te enseñará:
1. Definir múltiples columnas NOT NULL
2. Combinar diferentes tipos de datos
3. Entender la importancia de los campos requeridos`,
    hint: 'Usa NOT NULL después del tipo de dato para campos requeridos',
    successMessage: '¡Muy bien! NOT NULL previene datos incompletos en campos críticos.',
    example: {
      entrada: 'Esquema vacío',
      salida: 'Tabla "ordenes" con campos requeridos',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        schemaInspection: {
          table: 'ordenes',
          columns: [
            { name: 'id', type: 'integer', nullable: false },
            { name: 'cliente', type: 'character varying', nullable: false },
            { name: 'total', type: 'numeric', nullable: false },
            { name: 'fecha', type: 'date' },
          ],
        },
        testQueries: [
          { query: "INSERT INTO ordenes (cliente, total, fecha) VALUES ('Cliente 1', 100.00, '2024-01-15')", shouldSucceed: true },
          { query: "INSERT INTO ordenes (cliente, fecha) VALUES ('Cliente 2', '2024-01-15')", shouldSucceed: false },
          { query: "INSERT INTO ordenes (total, fecha) VALUES (50.00, '2024-01-15')", shouldSucceed: false },
        ],
      },
    },
  },

  // DDL Exercises - Avanzado
  {
    title: 'ALTER TABLE - Agregar UNIQUE',
    difficulty: 'Avanzado',
    description: 'Agrega una constraint UNIQUE a la columna "email" de la tabla "usuarios_app".',
    details: `Aprenderás a:
1. Garantizar unicidad en columnas específicas
2. Usar UNIQUE para prevenir duplicados
3. Diferencia entre PRIMARY KEY y UNIQUE`,
    hint: 'ALTER TABLE tabla ADD CONSTRAINT nombre UNIQUE (columna)',
    successMessage: '¡Perfecto! UNIQUE garantiza que no haya valores duplicados en la columna.',
    example: {
      entrada: 'Tabla "usuarios_app" sin constraint UNIQUE',
      salida: 'Columna "email" con constraint UNIQUE',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE usuarios_app (id SERIAL PRIMARY KEY, nombre VARCHAR(100), email VARCHAR(255));`,
        schemaInspection: {
          table: 'usuarios_app',
          constraints: [
            { type: 'UNIQUE', columns: ['email'] },
          ],
        },
        testQueries: [
          { query: "INSERT INTO usuarios_app (nombre, email) VALUES ('Ana', 'ana@test.com')", shouldSucceed: true },
          { query: "INSERT INTO usuarios_app (nombre, email) VALUES ('Ana 2', 'ana@test.com')", shouldSucceed: false },
        ],
      },
    },
  },
  {
    title: 'ALTER TABLE - Agregar CHECK',
    difficulty: 'Avanzado',
    description: 'Agrega una constraint CHECK a la tabla "productos_venta" para que el precio sea siempre mayor a 0.',
    details: `Este ejercicio te enseñará:
1. Validar datos con CHECK constraints
2. Definir reglas de negocio a nivel de base de datos
3. Prevenir datos inválidos automáticamente`,
    hint: 'ALTER TABLE tabla ADD CONSTRAINT nombre CHECK (condición)',
    successMessage: '¡Excelente! CHECK constraints validan datos antes de insertarlos.',
    example: {
      entrada: 'Tabla "productos_venta" sin validación de precio',
      salida: 'Constraint que impide precios negativos o cero',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE productos_venta (id SERIAL PRIMARY KEY, nombre VARCHAR(100), precio DECIMAL(10,2));`,
        schemaInspection: {
          table: 'productos_venta',
          constraints: [
            { type: 'CHECK', columns: [] },
          ],
        },
        testQueries: [
          { query: "INSERT INTO productos_venta (nombre, precio) VALUES ('Producto A', 25.99)", shouldSucceed: true },
          { query: "INSERT INTO productos_venta (nombre, precio) VALUES ('Producto B', 0)", shouldSucceed: false },
          { query: "INSERT INTO productos_venta (nombre, precio) VALUES ('Producto C', -5.00)", shouldSucceed: false },
        ],
      },
    },
  },
  {
    title: 'CREATE INDEX - Índice Simple',
    difficulty: 'Avanzado',
    description: 'Crea un índice llamado "idx_ventas_fecha" en la columna "fecha" de la tabla "ventas".',
    details: `Aprenderás a:
1. Crear índices para optimizar consultas
2. Entender cuándo usar índices
3. La sintaxis de CREATE INDEX`,
    hint: 'CREATE INDEX nombre_indice ON tabla (columna)',
    successMessage: '¡Muy bien! Los índices mejoran significativamente el rendimiento de las consultas.',
    example: {
      entrada: 'Tabla "ventas" sin índice en fecha',
      salida: 'Índice creado para búsquedas por fecha',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE ventas (id SERIAL PRIMARY KEY, producto VARCHAR(100), cantidad INTEGER, fecha DATE, total DECIMAL(10,2));`,
        schemaInspection: {
          table: 'ventas',
          indexes: [
            { name: 'idx_ventas_fecha', columns: ['fecha'] },
          ],
        },
      },
    },
  },
  {
    title: 'CREATE INDEX - Índice Compuesto',
    difficulty: 'Avanzado',
    description: 'Crea un índice compuesto llamado "idx_logs_usuario_fecha" en las columnas "usuario_id" y "fecha" de la tabla "logs".',
    details: `Este ejercicio avanzado te enseñará:
1. Crear índices en múltiples columnas
2. El orden de las columnas en índices compuestos
3. Cuándo usar índices compuestos`,
    hint: 'CREATE INDEX nombre ON tabla (columna1, columna2)',
    successMessage: '¡Impresionante! Los índices compuestos optimizan consultas que filtran por múltiples columnas.',
    example: {
      entrada: 'Tabla "logs" sin índices',
      salida: 'Índice compuesto en usuario_id y fecha',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE logs (id SERIAL PRIMARY KEY, usuario_id INTEGER, accion VARCHAR(100), fecha TIMESTAMP);`,
        schemaInspection: {
          table: 'logs',
          indexes: [
            { name: 'idx_logs_usuario_fecha', columns: ['usuario_id', 'fecha'] },
          ],
        },
      },
    },
  },
  {
    title: 'ALTER TABLE - Renombrar Columna',
    difficulty: 'Avanzado',
    description: 'Renombra la columna "nombre_completo" a "nombre" en la tabla "contactos".',
    details: `Aprenderás a:
1. Renombrar columnas existentes
2. Usar RENAME COLUMN
3. Mantener la compatibilidad al cambiar nombres`,
    hint: 'ALTER TABLE tabla RENAME COLUMN nombre_viejo TO nombre_nuevo',
    successMessage: '¡Perfecto! Renombrar columnas es útil para refactorizar el esquema de la base de datos.',
    example: {
      entrada: 'Tabla "contactos" con columna "nombre_completo"',
      salida: 'Columna renombrada a "nombre"',
    },
    type: 'ddl',
    validation: {
      type: 'ddl_schema' as const,
      conditions: {
        setupSQL: `CREATE TABLE contactos (id SERIAL PRIMARY KEY, nombre_completo VARCHAR(200), telefono VARCHAR(20), email VARCHAR(100));`,
        schemaInspection: {
          table: 'contactos',
          columns: [
            { name: 'id', type: 'integer' },
            { name: 'nombre', type: 'character varying' },
            { name: 'telefono', type: 'character varying' },
            { name: 'email', type: 'character varying' },
          ],
        },
      },
    },
  },
]

