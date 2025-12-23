'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Table2, 
  ChevronDown, 
  Key, 
  Link2,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  DollarSign
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui'

interface Column {
  name: string
  type: string
  isPrimary?: boolean
  isForeign?: boolean
  foreignRef?: string
  nullable?: boolean
  description: string
}

interface TableSchema {
  name: string
  description: string
  columns: Column[]
}

const schema: TableSchema[] = [
  {
    name: 'usuarios',
    description: 'Almacena información de los usuarios registrados en el sistema',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true, description: 'Identificador único auto-incremental' },
      { name: 'nombre', type: 'VARCHAR(100)', description: 'Nombre completo del usuario' },
      { name: 'email', type: 'VARCHAR(100)', description: 'Correo electrónico del usuario' },
      { name: 'fecha_registro', type: 'DATE', description: 'Fecha en que se registró el usuario' },
      { name: 'edad', type: 'INTEGER', nullable: true, description: 'Edad del usuario en años' },
      { name: 'ciudad', type: 'VARCHAR(100)', nullable: true, description: 'Ciudad de residencia' },
      { name: 'activo', type: 'BOOLEAN', description: 'Estado de la cuenta (activa/inactiva)' },
    ],
  },
  {
    name: 'pedidos',
    description: 'Registra los pedidos realizados por los usuarios',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true, description: 'Identificador único del pedido' },
      { name: 'usuario_id', type: 'INTEGER', isForeign: true, foreignRef: 'usuarios(id)', description: 'ID del usuario que realizó el pedido' },
      { name: 'monto', type: 'DECIMAL(10,2)', description: 'Monto total del pedido' },
      { name: 'fecha', type: 'DATE', description: 'Fecha en que se realizó el pedido' },
    ],
  },
]

const typeIcons: Record<string, typeof Hash> = {
  'SERIAL': Hash,
  'INTEGER': Hash,
  'VARCHAR': Type,
  'DATE': Calendar,
  'BOOLEAN': ToggleLeft,
  'DECIMAL': DollarSign,
}

function getTypeIcon(type: string) {
  const baseType = type.split('(')[0]
  return typeIcons[baseType] || Type
}

export function SchemaViewer() {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(
    new Set(schema.map(t => t.name))
  )

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev)
      if (next.has(tableName)) {
        next.delete(tableName)
      } else {
        next.add(tableName)
      }
      return next
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Esquema de Datos
        </h1>
        <p className="text-lg text-muted-foreground">
          Estructura de las tablas disponibles para practicar SQL.
        </p>
      </div>

      {/* ER Diagram Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Relaciones entre Tablas</CardTitle>
          <CardDescription>
            Diagrama simplificado de las relaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-primary/50 bg-primary/5">
              <Table2 className="h-5 w-5 text-primary" />
              <span className="font-mono font-medium">usuarios</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="hidden sm:block w-12 h-0.5 bg-muted-foreground/50" />
              <span className="text-xs">1:N</span>
              <div className="hidden sm:block w-12 h-0.5 bg-muted-foreground/50" />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-primary/50 bg-primary/5">
              <Table2 className="h-5 w-5 text-primary" />
              <span className="font-mono font-medium">pedidos</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Un usuario puede tener muchos pedidos (relación uno a muchos)
          </p>
        </CardContent>
      </Card>

      {/* Table Details */}
      <div className="space-y-4">
        {schema.map((table) => {
          const isExpanded = expandedTables.has(table.name)
          
          return (
            <Card key={table.name}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleTable(table.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Table2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="font-mono">{table.name}</CardTitle>
                      <CardDescription>{table.description}</CardDescription>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0">
                      <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium">Columna</th>
                              <th className="text-left p-3 font-medium">Tipo</th>
                              <th className="text-left p-3 font-medium hidden sm:table-cell">Descripción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {table.columns.map((column, idx) => {
                              const TypeIcon = getTypeIcon(column.type)
                              return (
                                <tr 
                                  key={column.name}
                                  className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                                >
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <code className="font-mono text-sm">{column.name}</code>
                                      {column.isPrimary && (
                                        <span title="Primary Key">
                                          <Key className="h-3.5 w-3.5 text-yellow-500" />
                                        </span>
                                      )}
                                      {column.isForeign && (
                                        <span title="Foreign Key">
                                          <Link2 className="h-3.5 w-3.5 text-blue-500" />
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                      <Badge variant="outline" className="font-mono text-xs">
                                        {column.type}
                                      </Badge>
                                      {column.nullable && (
                                        <span className="text-xs text-muted-foreground">NULL</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3 text-muted-foreground hidden sm:table-cell">
                                    {column.description}
                                    {column.foreignRef && (
                                      <span className="block text-xs text-blue-500 mt-1">
                                        → {column.foreignRef}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>

      {/* Sample Data */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de Ejemplo</CardTitle>
          <CardDescription>
            Algunos registros disponibles en las tablas para practicar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Usuarios (primeros 5)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">id</th>
                    <th className="p-2 text-left">nombre</th>
                    <th className="p-2 text-left">ciudad</th>
                    <th className="p-2 text-left">activo</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr><td className="p-2">1</td><td className="p-2">Ana García</td><td className="p-2">Madrid</td><td className="p-2">true</td></tr>
                  <tr className="bg-muted/20"><td className="p-2">2</td><td className="p-2">Carlos López</td><td className="p-2">Barcelona</td><td className="p-2">true</td></tr>
                  <tr><td className="p-2">3</td><td className="p-2">María Rodríguez</td><td className="p-2">Valencia</td><td className="p-2">false</td></tr>
                  <tr className="bg-muted/20"><td className="p-2">4</td><td className="p-2">Juan Martínez</td><td className="p-2">Sevilla</td><td className="p-2">true</td></tr>
                  <tr><td className="p-2">5</td><td className="p-2">Laura Sánchez</td><td className="p-2">Bilbao</td><td className="p-2">true</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

