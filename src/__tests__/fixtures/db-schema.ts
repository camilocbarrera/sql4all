/**
 * Database schema definition for testing
 * This should mirror the schema in db-service.ts initialize() method
 */

export interface TableSchema {
  name: string;
  columns: string[];
}

export const DB_TABLES: TableSchema[] = [
  {
    name: "usuarios",
    columns: [
      "id",
      "nombre",
      "email",
      "fecha_registro",
      "edad",
      "ciudad",
      "activo",
    ],
  },
  {
    name: "productos",
    columns: ["id", "nombre", "precio", "categoria"],
  },
  {
    name: "pedidos",
    columns: ["id", "usuario_id", "producto_id", "monto", "fecha"],
  },
];

export const ALL_TABLE_NAMES = DB_TABLES.map((t) => t.name);

export function getTableColumns(tableName: string): string[] {
  const table = DB_TABLES.find((t) => t.name === tableName);
  return table?.columns ?? [];
}

export function tableExists(tableName: string): boolean {
  return ALL_TABLE_NAMES.includes(tableName);
}
