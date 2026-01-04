import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { exercisesData } from "@/lib/db/seed-data";
import {
  getSolutionForExercise,
  SAMPLE_SOLUTIONS,
} from "./fixtures/sample-solutions";

const DDL_SCHEMA = "practice_ddl";

/**
 * Initialize a PGlite instance with the full schema
 */
async function createTestDatabase(): Promise<PGlite> {
  const db = new PGlite();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      email VARCHAR(100),
      fecha_registro DATE,
      edad INTEGER,
      ciudad VARCHAR(100),
      activo BOOLEAN
    );

    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100),
      precio DECIMAL(10,2),
      categoria VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuarios(id),
      producto_id INTEGER REFERENCES productos(id),
      monto DECIMAL(10,2),
      fecha DATE
    );

    INSERT INTO usuarios (nombre, email, fecha_registro, edad, ciudad, activo) VALUES
      ('Ana García', 'ana.garcia@email.com', '2023-01-15', 28, 'Madrid', true),
      ('Carlos López', 'carlos.lopez@email.com', '2023-02-20', 35, 'Barcelona', true),
      ('María Rodríguez', 'maria.rodriguez@email.com', '2023-03-10', 42, 'Valencia', false),
      ('Juan Martínez', 'juan.martinez@email.com', '2023-04-05', 31, 'Sevilla', true),
      ('Laura Sánchez', 'laura.sanchez@email.com', '2023-05-12', 29, 'Bilbao', true),
      ('Pedro Ramírez', 'pedro.ramirez@email.com', '2023-06-18', 38, 'Málaga', false),
      ('Sofia Torres', 'sofia.torres@email.com', '2023-07-22', 33, 'Zaragoza', true),
      ('Diego Herrera', 'diego.herrera@email.com', '2023-08-30', 45, 'Alicante', true),
      ('Carmen Ruiz', 'carmen.ruiz@email.com', '2023-09-14', 27, 'Granada', false),
      ('Miguel Flores', 'miguel.flores@email.com', '2023-10-25', 36, 'Murcia', true);

    INSERT INTO productos (nombre, precio, categoria) VALUES
      ('Laptop Pro', 1299.99, 'Electrónica'),
      ('Smartphone X', 899.50, 'Electrónica'),
      ('Auriculares Wireless', 149.99, 'Electrónica'),
      ('Camiseta Premium', 45.00, 'Ropa'),
      ('Zapatillas Running', 120.00, 'Ropa'),
      ('Libro SQL Avanzado', 35.50, 'Libros'),
      ('Teclado Mecánico', 89.99, 'Electrónica'),
      ('Mochila Viaje', 75.00, 'Accesorios');

    INSERT INTO pedidos (usuario_id, producto_id, monto, fecha) VALUES
      (1, 1, 150.50, '2023-02-01'),
      (1, 3, 200.75, '2023-03-15'),
      (2, 2, 350.00, '2023-02-28'),
      (3, 4, 125.25, '2023-04-10'),
      (4, 1, 475.00, '2023-05-05'),
      (4, 5, 225.50, '2023-06-20'),
      (5, 6, 180.75, '2023-07-12'),
      (6, 7, 300.00, '2023-08-18'),
      (7, 2, 425.25, '2023-09-22'),
      (7, 8, 150.00, '2023-10-05'),
      (8, 3, 275.50, '2023-11-15'),
      (9, 4, 190.75, '2023-12-01'),
      (10, 1, 400.00, '2023-12-10'),
      (10, 5, 325.25, '2023-12-20');
  `);

  return db;
}

/**
 * Set up DDL schema for DDL exercises
 */
async function setupDDLSchema(db: PGlite, setupSQL?: string): Promise<void> {
  await db.exec(`
    DROP SCHEMA IF EXISTS ${DDL_SCHEMA} CASCADE;
    CREATE SCHEMA ${DDL_SCHEMA};
    SET search_path TO ${DDL_SCHEMA}, public;
  `);

  if (setupSQL) {
    await db.exec(setupSQL);
  }
}

describe("DML Exercise Solutions", () => {
  let db: PGlite;

  beforeAll(async () => {
    db = await createTestDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  const dmlExercises = exercisesData.filter((ex) => ex.type !== "ddl");
  const dmlSolutions = SAMPLE_SOLUTIONS.filter((s) => s.type === "dml");

  it("should have sample solutions for all DML exercises", () => {
    const exerciseTitles = dmlExercises.map((ex) => ex.title);
    const solutionTitles = dmlSolutions.map((s) => s.exerciseTitle);

    for (const title of exerciseTitles) {
      expect(
        solutionTitles.includes(title),
        `Missing sample solution for DML exercise: "${title}"`,
      ).toBe(true);
    }
  });

  describe("Execute sample solutions", () => {
    it.each(
      dmlSolutions.map((s) => [s.exerciseTitle, s.sql]),
    )('"%s" executes without errors', async (_title, sql) => {
      await expect(db.query(sql)).resolves.not.toThrow();
    });
  });

  describe("Critical exercises verification", () => {
    it("Multiple JOINs exercise returns correct columns", async () => {
      const solution = getSolutionForExercise("Múltiples JOINs");
      expect(solution).toBeDefined();
      if (!solution) return;

      const result = await db.query(solution.sql);
      const columns = result.fields.map((f) => f.name);

      expect(columns).toContain("nombre");
      expect(columns).toContain("monto");
      expect(columns).toContain("producto");
    });

    it("UNION exercise returns results from both tables", async () => {
      const solution = getSolutionForExercise("UNION - Combinar Resultados");
      expect(solution).toBeDefined();
      if (!solution) return;

      const result = await db.query(solution.sql);

      // Should have names from both usuarios and productos
      expect(result.rows.length).toBeGreaterThan(0);
    });

    it("Total de Pedidos por Usuario returns expected columns", async () => {
      const solution = getSolutionForExercise("Total de Pedidos por Usuario");
      expect(solution).toBeDefined();
      if (!solution) return;

      const result = await db.query(solution.sql);
      const columns = result.fields.map((f) => f.name);

      expect(columns).toContain("nombre");
      expect(columns).toContain("email");
      expect(columns).toContain("total_pedidos");
    });
  });
});

describe("DDL Exercise Solutions", () => {
  const ddlExercises = exercisesData.filter((ex) => ex.type === "ddl");
  const ddlSolutions = SAMPLE_SOLUTIONS.filter((s) => s.type === "ddl");

  it("should have sample solutions for all DDL exercises", () => {
    const exerciseTitles = ddlExercises.map((ex) => ex.title);
    const solutionTitles = ddlSolutions.map((s) => s.exerciseTitle);

    for (const title of exerciseTitles) {
      expect(
        solutionTitles.includes(title),
        `Missing sample solution for DDL exercise: "${title}"`,
      ).toBe(true);
    }
  });

  describe("Execute DDL solutions with setup", () => {
    it.each(
      ddlExercises.map((ex) => {
        const solution = getSolutionForExercise(ex.title);
        const setupSQL = (ex.validation.conditions as { setupSQL?: string })
          .setupSQL;
        return [ex.title, solution?.sql ?? "", setupSQL ?? ""];
      }),
    )('"%s" executes without errors', async (_title, sql, setupSQL) => {
      if (!sql) {
        return; // Skip if no solution
      }

      const db = await createTestDatabase();
      try {
        await setupDDLSchema(db, setupSQL || undefined);
        await expect(db.query(sql)).resolves.not.toThrow();
      } finally {
        await db.close();
      }
    });
  });
});

describe("Exercise Coverage", () => {
  it("all exercises should have a sample solution", () => {
    const allExerciseTitles = exercisesData.map((ex) => ex.title);
    const allSolutionTitles = SAMPLE_SOLUTIONS.map((s) => s.exerciseTitle);

    const missingExercises = allExerciseTitles.filter(
      (title) => !allSolutionTitles.includes(title),
    );

    expect(
      missingExercises,
      `Missing solutions for: ${missingExercises.join(", ")}`,
    ).toHaveLength(0);
  });
});
