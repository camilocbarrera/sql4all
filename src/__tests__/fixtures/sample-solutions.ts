/**
 * Sample SQL solutions for each exercise
 * These are used to verify exercises are solvable with the current schema
 */

export interface SampleSolution {
  exerciseTitle: string;
  sql: string;
  type: "dml" | "ddl";
}

export const SAMPLE_SOLUTIONS: SampleSolution[] = [
  // DML - Principiante
  {
    exerciseTitle: "Consulta Básica de Selección",
    sql: "SELECT * FROM usuarios LIMIT 5",
    type: "dml",
  },
  {
    exerciseTitle: "Selección de Columnas Específicas",
    sql: "SELECT nombre, email FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "Filtrado con WHERE",
    sql: "SELECT * FROM usuarios WHERE edad > 30",
    type: "dml",
  },
  {
    exerciseTitle: "Ordenamiento con ORDER BY",
    sql: "SELECT * FROM usuarios ORDER BY nombre ASC",
    type: "dml",
  },
  {
    exerciseTitle: "Uso de Alias (AS)",
    sql: "SELECT nombre AS nombre_usuario, email AS correo FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "Manejo de NULL",
    sql: "SELECT * FROM usuarios WHERE ciudad IS NULL",
    type: "dml",
  },
  {
    exerciseTitle: "Ordenamiento Descendente",
    sql: "SELECT * FROM usuarios ORDER BY edad DESC",
    type: "dml",
  },
  {
    exerciseTitle: "Operadores Lógicos (AND/OR)",
    sql: "SELECT * FROM usuarios WHERE edad > 25 AND ciudad = 'Madrid'",
    type: "dml",
  },
  {
    exerciseTitle: "Operador NOT",
    sql: "SELECT * FROM usuarios WHERE NOT activo",
    type: "dml",
  },

  // DML - Intermedio
  {
    exerciseTitle: "Filtrado con Fechas",
    sql: "SELECT * FROM usuarios WHERE fecha_registro > '2023-05-10'",
    type: "dml",
  },
  {
    exerciseTitle: "Conteo con COUNT",
    sql: "SELECT COUNT(*) FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "Operador LIKE",
    sql: "SELECT * FROM usuarios WHERE email LIKE '%gmail%'",
    type: "dml",
  },
  {
    exerciseTitle: "Agrupamiento con GROUP BY",
    sql: "SELECT ciudad, COUNT(*) as count FROM usuarios GROUP BY ciudad",
    type: "dml",
  },
  {
    exerciseTitle: "DISTINCT - Valores Únicos",
    sql: "SELECT DISTINCT ciudad FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "Operador IN",
    sql: "SELECT * FROM usuarios WHERE ciudad IN ('Madrid', 'Barcelona', 'Valencia')",
    type: "dml",
  },
  {
    exerciseTitle: "BETWEEN - Rango de Valores",
    sql: "SELECT * FROM usuarios WHERE edad BETWEEN 25 AND 35",
    type: "dml",
  },
  {
    exerciseTitle: "HAVING - Filtrar Agregaciones",
    sql: "SELECT ciudad, COUNT(*) as count FROM usuarios GROUP BY ciudad HAVING COUNT(*) > 1",
    type: "dml",
  },
  {
    exerciseTitle: "LOWER y UPPER - Transformar Texto",
    sql: "SELECT UPPER(nombre), LOWER(email) FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "ROUND - Redondear Números",
    sql: "SELECT ROUND(AVG(monto), 2) FROM pedidos",
    type: "dml",
  },
  {
    exerciseTitle: "Promedio con AVG",
    sql: "SELECT AVG(edad) FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "MIN y MAX",
    sql: "SELECT MIN(edad), MAX(edad) FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "COALESCE - Valores por Defecto",
    sql: "SELECT nombre, COALESCE(ciudad, 'Sin ciudad') as ciudad FROM usuarios",
    type: "dml",
  },
  {
    exerciseTitle: "Concatenación de Texto",
    sql: "SELECT nombre || ' (' || email || ')' AS info_usuario FROM usuarios",
    type: "dml",
  },

  // DML - Avanzado
  {
    exerciseTitle: "JOIN Básico",
    sql: "SELECT u.nombre, p.monto FROM usuarios u JOIN pedidos p ON u.id = p.usuario_id",
    type: "dml",
  },
  {
    exerciseTitle: "Suma con SUM",
    sql: "SELECT SUM(monto) FROM pedidos",
    type: "dml",
  },
  {
    exerciseTitle: "Total de Pedidos por Usuario",
    sql: `SELECT u.nombre, u.email, COUNT(p.id) as total_pedidos 
          FROM usuarios u 
          LEFT JOIN pedidos p ON u.id = p.usuario_id 
          GROUP BY u.id, u.nombre, u.email 
          ORDER BY u.nombre`,
    type: "dml",
  },
  {
    exerciseTitle: "Subconsulta Básica",
    sql: `SELECT DISTINCT u.* FROM usuarios u 
          JOIN pedidos p ON u.id = p.usuario_id 
          WHERE p.monto > (SELECT AVG(monto) FROM pedidos)`,
    type: "dml",
  },
  {
    exerciseTitle: "Múltiples JOINs",
    sql: `SELECT u.nombre, p.monto, pr.nombre as producto
          FROM usuarios u
          JOIN pedidos p ON u.id = p.usuario_id
          JOIN productos pr ON p.producto_id = pr.id`,
    type: "dml",
  },
  {
    exerciseTitle: "LEFT JOIN con NULL",
    sql: `SELECT u.nombre, u.email 
          FROM usuarios u 
          LEFT JOIN pedidos p ON u.id = p.usuario_id 
          WHERE p.id IS NULL`,
    type: "dml",
  },
  {
    exerciseTitle: "UNION - Combinar Resultados",
    sql: "SELECT nombre FROM usuarios UNION SELECT nombre FROM productos",
    type: "dml",
  },
  {
    exerciseTitle: "CASE WHEN - Expresiones Condicionales",
    sql: `SELECT nombre, 
          CASE 
            WHEN edad < 30 THEN 'Joven'
            WHEN edad BETWEEN 30 AND 50 THEN 'Adulto'
            ELSE 'Senior'
          END as categoria_edad
          FROM usuarios`,
    type: "dml",
  },
  {
    exerciseTitle: "Self JOIN - Auto-unión",
    sql: `SELECT u1.nombre, u2.nombre, u1.ciudad 
          FROM usuarios u1 
          JOIN usuarios u2 ON u1.ciudad = u2.ciudad 
          WHERE u1.id < u2.id`,
    type: "dml",
  },
  {
    exerciseTitle: "NOT IN con Subconsulta",
    sql: `SELECT * FROM usuarios 
          WHERE id NOT IN (SELECT usuario_id FROM pedidos)`,
    type: "dml",
  },
  {
    exerciseTitle: "EXISTS - Verificar Existencia",
    sql: `SELECT * FROM usuarios u 
          WHERE EXISTS (SELECT 1 FROM pedidos p WHERE p.usuario_id = u.id)`,
    type: "dml",
  },
  {
    exerciseTitle: "Subconsulta Correlacionada",
    sql: `SELECT nombre, 
          (SELECT SUM(monto) FROM pedidos WHERE usuario_id = usuarios.id) as total
          FROM usuarios`,
    type: "dml",
  },
  {
    exerciseTitle: "ROW_NUMBER - Funciones de Ventana",
    sql: `SELECT nombre, fecha_registro, 
          ROW_NUMBER() OVER (ORDER BY fecha_registro) as numero_fila
          FROM usuarios`,
    type: "dml",
  },
  {
    exerciseTitle: "Pedido Máximo por Usuario",
    sql: `SELECT u.nombre, MAX(p.monto) as max_monto
          FROM usuarios u
          JOIN pedidos p ON u.id = p.usuario_id
          GROUP BY u.id, u.nombre`,
    type: "dml",
  },

  // DDL - Principiante
  {
    exerciseTitle: "CREATE TABLE - Tabla Básica",
    sql: `CREATE TABLE productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      precio DECIMAL(10,2)
    )`,
    type: "ddl",
  },
  {
    exerciseTitle: "DROP TABLE - Eliminar Tabla",
    sql: "DROP TABLE IF EXISTS temporal",
    type: "ddl",
  },
  {
    exerciseTitle: "ALTER TABLE - Agregar Columna",
    sql: "ALTER TABLE clientes ADD COLUMN email VARCHAR(255)",
    type: "ddl",
  },
  {
    exerciseTitle: "ALTER TABLE - Eliminar Columna",
    sql: "ALTER TABLE inventario DROP COLUMN obsoleto",
    type: "ddl",
  },

  // DDL - Intermedio
  {
    exerciseTitle: "CREATE TABLE con PRIMARY KEY",
    sql: `CREATE TABLE empleados (
      id INTEGER PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      departamento VARCHAR(50)
    )`,
    type: "ddl",
  },
  {
    exerciseTitle: "ALTER TABLE - Agregar PRIMARY KEY",
    sql: "ALTER TABLE categorias ADD CONSTRAINT pk_categorias PRIMARY KEY (codigo)",
    type: "ddl",
  },
  {
    exerciseTitle: "ALTER TABLE - Agregar FOREIGN KEY",
    sql: "ALTER TABLE articulos ADD CONSTRAINT fk_articulos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id)",
    type: "ddl",
  },
  {
    exerciseTitle: "CREATE TABLE con NOT NULL",
    sql: `CREATE TABLE ordenes (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(100) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      fecha DATE
    )`,
    type: "ddl",
  },

  // DDL - Avanzado
  {
    exerciseTitle: "ALTER TABLE - Agregar UNIQUE",
    sql: "ALTER TABLE usuarios_app ADD CONSTRAINT unique_email UNIQUE (email)",
    type: "ddl",
  },
  {
    exerciseTitle: "ALTER TABLE - Agregar CHECK",
    sql: "ALTER TABLE productos_venta ADD CONSTRAINT check_precio_positivo CHECK (precio > 0)",
    type: "ddl",
  },
  {
    exerciseTitle: "CREATE INDEX - Índice Simple",
    sql: "CREATE INDEX idx_ventas_fecha ON ventas (fecha)",
    type: "ddl",
  },
  {
    exerciseTitle: "CREATE INDEX - Índice Compuesto",
    sql: "CREATE INDEX idx_logs_usuario_fecha ON logs (usuario_id, fecha)",
    type: "ddl",
  },
  {
    exerciseTitle: "ALTER TABLE - Renombrar Columna",
    sql: "ALTER TABLE contactos RENAME COLUMN nombre_completo TO nombre",
    type: "ddl",
  },
];

export function getSolutionForExercise(
  title: string,
): SampleSolution | undefined {
  return SAMPLE_SOLUTIONS.find((s) => s.exerciseTitle === title);
}
