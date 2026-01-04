"use client";

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

interface ResultsTableProps {
  results: {
    rows: Record<string, unknown>[];
    fields: { name: string }[];
  };
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results.rows.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay resultados para mostrar
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-xs">
          {results.rows.length} fila{results.rows.length !== 1 ? "s" : ""}
        </Badge>
        <span className="text-xs text-muted-foreground sm:hidden">
          ← Desliza para ver más →
        </span>
      </div>

      {/* Scrollable table container */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {results.fields.map((field, idx) => (
                <TableHead
                  key={field.name}
                  className={`px-3 sm:px-4 whitespace-nowrap ${idx === 0 ? "sticky left-0 bg-muted/50 z-10" : ""}`}
                >
                  {field.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {results.fields.map((field, idx) => (
                  <TableCell
                    key={field.name}
                    className={`px-3 sm:px-4 font-mono text-xs whitespace-nowrap ${
                      idx === 0 ? "sticky left-0 bg-background z-10" : ""
                    }`}
                  >
                    {formatCellValue(row[field.name])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
