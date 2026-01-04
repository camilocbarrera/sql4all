import { describe, expect, it } from "vitest";
import { exercisesData } from "@/lib/db/seed-data";
import {
  ALL_TABLE_NAMES,
  getTableColumns,
  tableExists,
} from "./fixtures/db-schema";

/**
 * Extract table names from text using common SQL patterns
 */
function extractTableReferences(text: string): string[] {
  const patterns = [
    /FROM\s+['"]?(\w+)['"]?/gi,
    /JOIN\s+['"]?(\w+)['"]?/gi,
    /INTO\s+['"]?(\w+)['"]?/gi,
    /UPDATE\s+['"]?(\w+)['"]?/gi,
    /TABLE\s+['"]?(\w+)['"]?/gi,
    /tabla\s+['"]?(\w+)['"]?/gi,
    /tablas?\s+['"]?(\w+)['"]?(?:\s*[,y]\s*['"]?(\w+)['"]?)?(?:\s*[,y]\s*['"]?(\w+)['"]?)?/gi,
  ];

  const tables = new Set<string>();

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    const matches = text.matchAll(regex);
    for (const match of matches) {
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          const tableName = match[i].toLowerCase();
          if (
            ALL_TABLE_NAMES.includes(tableName) ||
            isExpectedTable(tableName)
          ) {
            tables.add(tableName);
          }
        }
      }
    }
  }

  return Array.from(tables);
}

/**
 * Check if a table name is one we expect to exist (either in DB or created by DDL exercises)
 */
function isExpectedTable(name: string): boolean {
  const expectedTables = [
    ...ALL_TABLE_NAMES,
    // DDL exercises may create these tables
    "temporal",
    "clientes",
    "inventario",
    "empleados",
    "categorias",
    "articulos",
    "ordenes",
    "usuarios_app",
    "productos_venta",
    "ventas",
    "logs",
    "contactos",
  ];
  return expectedTables.includes(name);
}

describe("Exercise Schema Consistency", () => {
  describe("DML Exercises - Table References", () => {
    const dmlExercises = exercisesData.filter((ex) => ex.type !== "ddl");

    it.each(
      dmlExercises.map((ex, idx) => [idx + 1, ex.title, ex]),
    )('Exercise #%i "%s" references only existing tables', (_idx, _title, exercise) => {
      const textToCheck = [
        exercise.description,
        exercise.details,
        exercise.hint,
        exercise.example?.entrada ?? "",
        exercise.example?.salida ?? "",
      ].join(" ");

      const referencedTables = extractTableReferences(textToCheck);

      for (const table of referencedTables) {
        expect(
          tableExists(table),
          `Table "${table}" referenced in exercise "${exercise.title}" does not exist in DB schema. Available tables: ${ALL_TABLE_NAMES.join(", ")}`,
        ).toBe(true);
      }
    });
  });

  describe("Exercise Validation Conditions - Column References", () => {
    const exercisesWithColumns = exercisesData.filter(
      (ex) => ex.validation?.conditions?.columns && ex.type !== "ddl",
    );

    it.each(
      exercisesWithColumns.map((ex, idx) => [idx + 1, ex.title, ex]),
    )('Exercise #%i "%s" validation columns exist in schema', (_idx, _title, exercise) => {
      const validationColumns = exercise.validation.conditions
        .columns as string[];

      // For most exercises, columns should exist in one of our tables
      // We check against all tables since the exercise might join multiple
      const allAvailableColumns = ALL_TABLE_NAMES.flatMap((table) =>
        getTableColumns(table),
      );

      // Also allow computed/aliased columns
      const allowedAliases = [
        "total_pedidos",
        "count",
        "total",
        "max_monto",
        "numero_fila",
        "nombre_usuario",
        "correo",
        "info_usuario",
        "categoria_edad",
        "producto",
      ];

      for (const col of validationColumns) {
        const isValidColumn =
          allAvailableColumns.includes(col) || allowedAliases.includes(col);
        expect(
          isValidColumn,
          `Column "${col}" in exercise "${exercise.title}" validation is not in schema or allowed aliases`,
        ).toBe(true);
      }
    });
  });

  describe("Core Tables Existence", () => {
    it("should have usuarios table with required columns", () => {
      expect(tableExists("usuarios")).toBe(true);
      const columns = getTableColumns("usuarios");
      expect(columns).toContain("id");
      expect(columns).toContain("nombre");
      expect(columns).toContain("email");
    });

    it("should have productos table with required columns", () => {
      expect(tableExists("productos")).toBe(true);
      const columns = getTableColumns("productos");
      expect(columns).toContain("id");
      expect(columns).toContain("nombre");
      expect(columns).toContain("precio");
    });

    it("should have pedidos table with required columns including producto_id", () => {
      expect(tableExists("pedidos")).toBe(true);
      const columns = getTableColumns("pedidos");
      expect(columns).toContain("id");
      expect(columns).toContain("usuario_id");
      expect(columns).toContain("producto_id");
      expect(columns).toContain("monto");
    });
  });

  describe("Multiple JOINs Exercise (#28)", () => {
    it("should have all required tables for the Multiple JOINs exercise", () => {
      const multipleJoinsExercise = exercisesData.find(
        (ex) => ex.title === "Múltiples JOINs",
      );

      expect(multipleJoinsExercise).toBeDefined();

      // This exercise requires usuarios, pedidos, and productos
      expect(tableExists("usuarios")).toBe(true);
      expect(tableExists("pedidos")).toBe(true);
      expect(tableExists("productos")).toBe(true);

      // pedidos must have foreign keys to both
      const pedidosColumns = getTableColumns("pedidos");
      expect(pedidosColumns).toContain("usuario_id");
      expect(pedidosColumns).toContain("producto_id");
    });
  });

  describe("UNION Exercise (#31)", () => {
    it("should have productos table for UNION exercise", () => {
      const unionExercise = exercisesData.find(
        (ex) => ex.title === "UNION - Combinar Resultados",
      );

      expect(unionExercise).toBeDefined();

      // This exercise combines usuarios and productos
      expect(tableExists("usuarios")).toBe(true);
      expect(tableExists("productos")).toBe(true);

      // Both should have nombre column
      expect(getTableColumns("usuarios")).toContain("nombre");
      expect(getTableColumns("productos")).toContain("nombre");
    });
  });
});
