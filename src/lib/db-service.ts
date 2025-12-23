import { PGlite } from '@electric-sql/pglite'
import { handleSQLError } from './sql-error-handler'

interface QueryResult {
  error: boolean
  message?: string
  example?: string
  rows: Record<string, unknown>[]
  fields: { name: string }[]
}

class DatabaseService {
  private db: PGlite | null = null
  private initPromise: Promise<PGlite> | null = null

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
