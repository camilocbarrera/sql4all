import { PGlite } from '@electric-sql/pglite'
import { handleSQLError } from './sql-error-handler'

export interface QueryResult {
  error: boolean
  message?: string
  example?: string
  rows: Record<string, unknown>[]
  fields: { name: string }[]
}

export interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  defaultValue: string | null
}

export interface ConstraintInfo {
  name: string
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK' | 'NOT NULL'
  columns: string[]
  definition?: string
}

export interface IndexInfo {
  name: string
  columns: string[]
  isUnique: boolean
}

export interface TableInfo {
  name: string
  columns: ColumnInfo[]
  constraints: ConstraintInfo[]
  indexes: IndexInfo[]
}

export interface SchemaInfo {
  tables: TableInfo[]
}

const DDL_SCHEMA = 'practice_ddl'

class DatabaseService {
  private db: PGlite | null = null
  private initPromise: Promise<PGlite> | null = null
  private ddlSchemaInitialized = false
  private ddlResetInProgress = false
  private ddlResetPromise: Promise<void> | null = null

  async initialize() {
    if (typeof window === 'undefined') {
      throw new Error('Database can only be initialized in the browser')
    }

    if (this.db) return this.db

    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise(async (resolve, reject) => {
      try {
        this.db = new PGlite()

        await this.db.exec(`
          CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100),
            email VARCHAR(100),
            fecha_registro DATE,
            edad INTEGER,
            ciudad VARCHAR(100),
            activo BOOLEAN
          );

          CREATE TABLE IF NOT EXISTS pedidos (
            id SERIAL PRIMARY KEY,
            usuario_id INTEGER REFERENCES usuarios(id),
            monto DECIMAL(10,2),
            fecha DATE
          );

          TRUNCATE TABLE pedidos RESTART IDENTITY;
          TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE;

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

          INSERT INTO pedidos (usuario_id, monto, fecha) VALUES
            (1, 150.50, '2023-02-01'),
            (1, 200.75, '2023-03-15'),
            (2, 350.00, '2023-02-28'),
            (3, 125.25, '2023-04-10'),
            (4, 475.00, '2023-05-05'),
            (4, 225.50, '2023-06-20'),
            (5, 180.75, '2023-07-12'),
            (6, 300.00, '2023-08-18'),
            (7, 425.25, '2023-09-22'),
            (7, 150.00, '2023-10-05'),
            (8, 275.50, '2023-11-15'),
            (9, 190.75, '2023-12-01'),
            (10, 400.00, '2023-12-10'),
            (10, 325.25, '2023-12-20');
        `)

        resolve(this.db)
      } catch (error) {
        reject(error)
      } finally {
        this.initPromise = null
      }
    })

    return this.initPromise
  }

  async initializeDDLSchema(): Promise<void> {
    if (!this.db) {
      await this.initialize()
    }

    if (this.ddlSchemaInitialized) return

    try {
      await this.db!.exec(`
        CREATE SCHEMA IF NOT EXISTS ${DDL_SCHEMA};
        SET search_path TO ${DDL_SCHEMA}, public;
      `)
      this.ddlSchemaInitialized = true
    } catch (error) {
      console.error('Error initializing DDL schema:', error)
      throw error
    }
  }

  async resetDDLSchema(setupSQL?: string): Promise<void> {
    // If a reset is already in progress, wait for it to complete
    if (this.ddlResetInProgress && this.ddlResetPromise) {
      console.log('[DDL] Reset already in progress, waiting...')
      await this.ddlResetPromise
      return
    }

    this.ddlResetInProgress = true
    
    this.ddlResetPromise = (async () => {
      if (!this.db) {
        await this.initialize()
      }

      try {
        console.log('[DDL] Starting schema reset...')
        
        // Drop and recreate schema
        await this.db!.exec(`
          DROP SCHEMA IF EXISTS ${DDL_SCHEMA} CASCADE;
          CREATE SCHEMA ${DDL_SCHEMA};
          SET search_path TO ${DDL_SCHEMA}, public;
        `)
        
        console.log('[DDL] Schema reset complete, running setup SQL...')

        if (setupSQL) {
          await this.db!.exec(setupSQL)
          console.log('[DDL] Setup SQL executed successfully')
        }

        this.ddlSchemaInitialized = true
      } catch (error) {
        console.error('[DDL] Error resetting DDL schema:', error)
        throw error
      } finally {
        this.ddlResetInProgress = false
        this.ddlResetPromise = null
      }
    })()

    await this.ddlResetPromise
  }

  async inspectSchema(): Promise<SchemaInfo> {
    if (!this.db) {
      await this.initialize()
    }

    try {
      const tablesResult = await this.db!.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = '${DDL_SCHEMA}'
        ORDER BY table_name
      `)

      const tables: TableInfo[] = []

      for (const row of tablesResult.rows as { table_name: string }[]) {
        const tableName = row.table_name

        const columnsResult = await this.db!.query(`
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM information_schema.columns
          WHERE table_schema = '${DDL_SCHEMA}' AND table_name = '${tableName}'
          ORDER BY ordinal_position
        `)

        const columns: ColumnInfo[] = (columnsResult.rows as {
          column_name: string
          data_type: string
          is_nullable: string
          column_default: string | null
        }[]).map(col => ({
          name: col.column_name,
          type: col.data_type,
          nullable: col.is_nullable === 'YES',
          defaultValue: col.column_default,
        }))

        const constraintsResult = await this.db!.query(`
          SELECT 
            tc.constraint_name,
            tc.constraint_type,
            kcu.column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name 
            AND tc.table_schema = kcu.table_schema
          WHERE tc.table_schema = '${DDL_SCHEMA}' 
            AND tc.table_name = '${tableName}'
          ORDER BY tc.constraint_name, kcu.ordinal_position
        `)

        const constraintMap = new Map<string, ConstraintInfo>()
        for (const row of constraintsResult.rows as {
          constraint_name: string
          constraint_type: string
          column_name: string
        }[]) {
          const existing = constraintMap.get(row.constraint_name)
          if (existing) {
            existing.columns.push(row.column_name)
          } else {
            constraintMap.set(row.constraint_name, {
              name: row.constraint_name,
              type: row.constraint_type as ConstraintInfo['type'],
              columns: [row.column_name],
            })
          }
        }

        const checkConstraintsResult = await this.db!.query(`
          SELECT 
            cc.constraint_name,
            cc.check_clause
          FROM information_schema.check_constraints cc
          JOIN information_schema.table_constraints tc 
            ON cc.constraint_name = tc.constraint_name
          WHERE tc.table_schema = '${DDL_SCHEMA}' 
            AND tc.table_name = '${tableName}'
            AND tc.constraint_type = 'CHECK'
        `)

        for (const row of checkConstraintsResult.rows as {
          constraint_name: string
          check_clause: string
        }[]) {
          const existing = constraintMap.get(row.constraint_name)
          if (existing) {
            existing.definition = row.check_clause
          }
        }

        const constraints = Array.from(constraintMap.values())

        const indexesResult = await this.db!.query(`
          SELECT 
            i.relname as index_name,
            array_agg(a.attname ORDER BY array_position(ix.indkey, a.attnum)) as columns,
            ix.indisunique as is_unique
          FROM pg_class t
          JOIN pg_index ix ON t.oid = ix.indrelid
          JOIN pg_class i ON i.oid = ix.indexrelid
          JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
          JOIN pg_namespace n ON n.oid = t.relnamespace
          WHERE n.nspname = '${DDL_SCHEMA}'
            AND t.relname = '${tableName}'
            AND NOT ix.indisprimary
          GROUP BY i.relname, ix.indisunique
          ORDER BY i.relname
        `)

        const indexes: IndexInfo[] = (indexesResult.rows as {
          index_name: string
          columns: string[]
          is_unique: boolean
        }[]).map(idx => ({
          name: idx.index_name,
          columns: idx.columns,
          isUnique: idx.is_unique,
        }))

        tables.push({
          name: tableName,
          columns,
          constraints,
          indexes,
        })
      }

      return { tables }
    } catch (error) {
      console.error('Error inspecting schema:', error)
      return { tables: [] }
    }
  }

  async executeDDLQuery(query: string): Promise<QueryResult> {
    if (typeof window === 'undefined') {
      throw new Error('Queries can only be executed in the browser')
    }

    if (!this.db) {
      return {
        error: true,
        message: 'Base de datos no inicializada',
        rows: [],
        fields: [],
      }
    }

    try {
      if (!query.trim()) {
        return {
          error: true,
          message: 'La consulta SQL no puede estar vacía',
          example: 'CREATE TABLE productos (id SERIAL PRIMARY KEY, nombre VARCHAR(100))',
          rows: [],
          fields: [],
        }
      }

      await this.db.exec(`SET search_path TO ${DDL_SCHEMA}, public;`)

      try {
        const result = await this.db.query(query)
        return {
          error: false,
          rows: result.rows as Record<string, unknown>[],
          fields: result.fields as { name: string }[],
        }
      } catch (sqlError: unknown) {
        console.error('DDL Error:', sqlError)

        const errorObj = sqlError as { message?: string; stack?: string; code?: string }
        const errorMessage = errorObj?.message || 'Error desconocido'

        const formattedError = handleSQLError({
          message: errorMessage,
          stack: errorObj?.stack,
          code: errorObj?.code,
        })

        return {
          error: true,
          message: formattedError.message,
          example: formattedError.example,
          rows: [],
          fields: [],
        }
      }
    } catch {
      return {
        error: true,
        message: 'Error inesperado al ejecutar la consulta DDL',
        example: 'Intenta verificar la sintaxis de tu consulta',
        rows: [],
        fields: [],
      }
    }
  }

  async executeTestQuery(query: string): Promise<{ success: boolean; error?: string }> {
    if (!this.db) {
      return { success: false, error: 'Base de datos no inicializada' }
    }

    try {
      await this.db.exec(`SET search_path TO ${DDL_SCHEMA}, public;`)
      await this.db.query(query)
      return { success: true }
    } catch (error) {
      const errorObj = error as { message?: string }
      return { success: false, error: errorObj?.message || 'Error desconocido' }
    }
  }

  async executeQuery(query: string): Promise<QueryResult> {
    if (typeof window === 'undefined') {
      throw new Error('Queries can only be executed in the browser')
    }

    if (!this.db) {
      return {
        error: true,
        message: 'Base de datos no inicializada',
        rows: [],
        fields: [],
      }
    }

    try {
      if (!query.trim()) {
        return {
          error: true,
          message: 'La consulta SQL no puede estar vacía',
          example: 'SELECT * FROM usuarios',
          rows: [],
          fields: [],
        }
      }

      try {
        const result = await this.db.query(query)
        return {
          error: false,
          rows: result.rows as Record<string, unknown>[],
          fields: result.fields as { name: string }[],
        }
      } catch (sqlError: unknown) {
        console.error('SQL Error:', sqlError)

        const errorObj = sqlError as { message?: string; stack?: string; code?: string }
        const errorMessage = errorObj?.message || 'Error desconocido'

        const formattedError = handleSQLError({
          message: errorMessage,
          stack: errorObj?.stack,
          code: errorObj?.code,
        })

        return {
          error: true,
          message: formattedError.message,
          example: formattedError.example,
          rows: [],
          fields: [],
        }
      }
    } catch {
      return {
        error: true,
        message: 'Error inesperado al ejecutar la consulta',
        example: 'Intenta verificar la sintaxis de tu consulta',
        rows: [],
        fields: [],
      }
    }
  }
}

export const dbService = new DatabaseService()
