'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, ChevronDown, ChevronUp, X, Key, Table2 } from 'lucide-react'
import { Button, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

interface Column {
  name: string
  type: string
  isPrimary?: boolean
  isForeign?: boolean
}

interface TableSchema {
  name: string
  columns: Column[]
}

const schema: TableSchema[] = [
  {
    name: 'usuarios',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true },
      { name: 'nombre', type: 'VARCHAR' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'fecha_registro', type: 'DATE' },
      { name: 'edad', type: 'INTEGER' },
      { name: 'ciudad', type: 'VARCHAR' },
      { name: 'activo', type: 'BOOLEAN' },
    ],
  },
  {
    name: 'pedidos',
    columns: [
      { name: 'id', type: 'SERIAL', isPrimary: true },
      { name: 'usuario_id', type: 'INTEGER', isForeign: true },
      { name: 'monto', type: 'DECIMAL' },
      { name: 'fecha', type: 'DATE' },
    ],
  },
]

export function SchemaHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedTable, setExpandedTable] = useState<string | null>(null)

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={cn(
            'rounded-full shadow-lg h-12 w-12 sm:h-14 sm:w-14 p-0',
            isOpen && 'bg-primary/90'
          )}
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <Database className="h-5 w-5 sm:h-6 sm:w-6" />
          )}
        </Button>
      </motion.div>

      {/* Schema Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-30 w-72 sm:bottom-24 sm:right-6 sm:w-80"
          >
            <div className="bg-card border rounded-lg shadow-xl overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Esquema de Datos</span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {schema.map((table) => (
                  <div key={table.name} className="border-b last:border-b-0">
                    <button
                      onClick={() =>
                        setExpandedTable(
                          expandedTable === table.name ? null : table.name
                        )
                      }
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Table2 className="h-4 w-4 text-primary" />
                        <code className="text-sm font-medium">{table.name}</code>
                      </div>
                      {expandedTable === table.name ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedTable === table.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 space-y-1">
                            {table.columns.map((col) => (
                              <div
                                key={col.name}
                                className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/30 text-xs"
                              >
                                <div className="flex items-center gap-1.5">
                                  {col.isPrimary && (
                                    <Key className="h-3 w-3 text-yellow-500" />
                                  )}
                                  <code className="font-mono">{col.name}</code>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {col.type}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t bg-muted/30">
                <p className="text-[10px] text-muted-foreground text-center">
                  Haz clic en una tabla para ver sus columnas
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

