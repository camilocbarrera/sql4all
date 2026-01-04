"use client";

import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Brackets,
  Calculator,
  Filter,
  Layers,
  Link2,
  SearchX,
  Table2,
} from "lucide-react";
import { useMemo } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

interface SqlCommand {
  id: string;
  name: string;
  description: string;
  syntax: string;
  examples: { code: string; description: string }[];
  icon: typeof Table2;
  tags: string[];
}

const sqlCommands: SqlCommand[] = [
  {
    id: "select",
    name: "SELECT",
    description: "Selecciona datos de una o más tablas",
    syntax: "SELECT columna1, columna2, ... FROM tabla",
    icon: Table2,
    tags: ["básico", "consulta"],
    examples: [
      {
        code: "SELECT * FROM usuarios",
        description: "Selecciona todas las columnas",
      },
      {
        code: "SELECT nombre, email FROM usuarios",
        description: "Selecciona columnas específicas",
      },
      {
        code: "SELECT DISTINCT ciudad FROM usuarios",
        description: "Valores únicos",
      },
      {
        code: "SELECT * FROM usuarios LIMIT 5",
        description: "Limitar resultados",
      },
    ],
  },
  {
    id: "where",
    name: "WHERE",
    description: "Filtra registros basándose en condiciones",
    syntax: "SELECT ... FROM tabla WHERE condición",
    icon: Filter,
    tags: ["filtro", "condición"],
    examples: [
      {
        code: "SELECT * FROM usuarios WHERE activo = true",
        description: "Condición de igualdad",
      },
      {
        code: "SELECT * FROM usuarios WHERE edad > 30",
        description: "Comparación numérica",
      },
      {
        code: "SELECT * FROM usuarios WHERE ciudad IN ('Madrid', 'Barcelona')",
        description: "Lista de valores",
      },
      {
        code: "SELECT * FROM usuarios WHERE nombre LIKE 'A%'",
        description: "Búsqueda con patrón",
      },
      {
        code: "SELECT * FROM usuarios WHERE edad BETWEEN 25 AND 35",
        description: "Rango de valores",
      },
    ],
  },
  {
    id: "orderby",
    name: "ORDER BY",
    description: "Ordena los resultados de una consulta",
    syntax: "SELECT ... FROM tabla ORDER BY columna [ASC|DESC]",
    icon: ArrowUpDown,
    tags: ["ordenar", "sort"],
    examples: [
      {
        code: "SELECT * FROM usuarios ORDER BY nombre",
        description: "Orden ascendente (por defecto)",
      },
      {
        code: "SELECT * FROM usuarios ORDER BY edad DESC",
        description: "Orden descendente",
      },
      {
        code: "SELECT * FROM usuarios ORDER BY ciudad, nombre",
        description: "Múltiples columnas",
      },
    ],
  },
  {
    id: "join",
    name: "JOIN",
    description: "Combina registros de dos o más tablas",
    syntax: "SELECT ... FROM tabla1 JOIN tabla2 ON tabla1.col = tabla2.col",
    icon: Link2,
    tags: ["unión", "relación", "avanzado"],
    examples: [
      {
        code: "SELECT u.nombre, p.monto\nFROM usuarios u\nJOIN pedidos p ON u.id = p.usuario_id",
        description: "INNER JOIN - Solo registros con coincidencia",
      },
      {
        code: "SELECT u.nombre, p.monto\nFROM usuarios u\nLEFT JOIN pedidos p ON u.id = p.usuario_id",
        description: "LEFT JOIN - Todos los usuarios, incluso sin pedidos",
      },
    ],
  },
  {
    id: "aggregations",
    name: "Funciones de Agregación",
    description: "Realizan cálculos sobre conjuntos de valores",
    syntax: "SELECT función(columna) FROM tabla",
    icon: Calculator,
    tags: ["cálculo", "estadística"],
    examples: [
      {
        code: "SELECT COUNT(*) FROM usuarios",
        description: "Contar registros",
      },
      { code: "SELECT SUM(monto) FROM pedidos", description: "Sumar valores" },
      { code: "SELECT AVG(edad) FROM usuarios", description: "Promedio" },
      {
        code: "SELECT MIN(edad), MAX(edad) FROM usuarios",
        description: "Mínimo y máximo",
      },
    ],
  },
  {
    id: "groupby",
    name: "GROUP BY",
    description: "Agrupa filas con valores iguales en filas de resumen",
    syntax: "SELECT columna, función() FROM tabla GROUP BY columna",
    icon: Layers,
    tags: ["agrupar", "agregación"],
    examples: [
      {
        code: "SELECT ciudad, COUNT(*) as total\nFROM usuarios\nGROUP BY ciudad",
        description: "Contar por ciudad",
      },
      {
        code: "SELECT usuario_id, SUM(monto) as total\nFROM pedidos\nGROUP BY usuario_id",
        description: "Total de pedidos por usuario",
      },
      {
        code: "SELECT ciudad, COUNT(*) as total\nFROM usuarios\nGROUP BY ciudad\nHAVING COUNT(*) > 1",
        description: "Filtrar grupos con HAVING",
      },
    ],
  },
  {
    id: "subqueries",
    name: "Subconsultas",
    description: "Consultas anidadas dentro de otras consultas",
    syntax: "SELECT ... FROM tabla WHERE columna IN (SELECT ...)",
    icon: Brackets,
    tags: ["avanzado", "anidado"],
    examples: [
      {
        code: "SELECT * FROM usuarios\nWHERE id IN (\n  SELECT usuario_id FROM pedidos\n)",
        description: "Usuarios con pedidos",
      },
      {
        code: "SELECT *,\n  (SELECT COUNT(*) FROM pedidos p\n   WHERE p.usuario_id = u.id) as total_pedidos\nFROM usuarios u",
        description: "Subconsulta en SELECT",
      },
    ],
  },
];

interface SqlReferenceProps {
  searchQuery?: string;
}

export function SqlReference({ searchQuery = "" }: SqlReferenceProps) {
  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return sqlCommands;

    const query = searchQuery.toLowerCase();
    return sqlCommands.filter(
      (cmd) =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.tags.some((tag) => tag.includes(query)) ||
        cmd.examples.some((ex) => ex.code.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  if (filteredCommands.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Comandos SQL
          </h1>
          <p className="text-lg text-muted-foreground">
            Referencia rápida de comandos SQL más utilizados
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              No se encontraron resultados
            </p>
            <p className="text-muted-foreground text-center">
              No hay comandos que coincidan con &quot;{searchQuery}&quot;
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Comandos SQL</h1>
        <p className="text-lg text-muted-foreground">
          Referencia rápida de comandos SQL más utilizados
        </p>
      </div>

      <div className="space-y-6">
        {filteredCommands.map((command, index) => {
          const Icon = command.icon;
          return (
            <motion.div
              key={command.id}
              id={command.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-mono">
                          {command.name}
                        </CardTitle>
                        <CardDescription>{command.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {command.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sintaxis</h4>
                    <pre className="p-3 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
                      {command.syntax}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Ejemplos</h4>
                    <div className="space-y-3">
                      {command.examples.map((example) => (
                        <div
                          key={example.code}
                          className="rounded-lg border overflow-hidden"
                        >
                          <pre className="p-3 bg-muted/50 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                            {example.code}
                          </pre>
                          <p className="px-3 py-2 text-sm text-muted-foreground border-t bg-background">
                            {example.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
