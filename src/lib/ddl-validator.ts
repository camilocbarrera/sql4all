import { dbService, type SchemaInfo, type TableInfo, type ColumnInfo, type ConstraintInfo, type IndexInfo } from './db-service'

export interface ExpectedColumn {
  name: string
  type?: string
  nullable?: boolean
}

export interface ExpectedConstraint {
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK'
  columns: string[]
  definition?: string
}

export interface ExpectedIndex {
  name?: string
  columns: string[]
  isUnique?: boolean
}

export interface SchemaInspectionConfig {
  table: string
  shouldExist?: boolean
  columns?: ExpectedColumn[]
  constraints?: ExpectedConstraint[]
  indexes?: ExpectedIndex[]
}

export interface TestQueryConfig {
  query: string
  shouldSucceed: boolean
  description?: string
}

export interface DDLValidationConfig {
  schemaInspection?: SchemaInspectionConfig
  testQueries?: TestQueryConfig[]
}

export interface DDLValidationResult {
  isValid: boolean
  schemaValidation?: {
    passed: boolean
    errors: string[]
    tableFound: boolean
    columnsMatched: boolean
    constraintsMatched: boolean
    indexesMatched: boolean
  }
  testQueryResults?: {
    passed: boolean
    results: {
      query: string
      expected: boolean
      actual: boolean
      error?: string
    }[]
  }
}

function normalizeType(type: string): string {
  const typeMap: Record<string, string[]> = {
    'integer': ['integer', 'int', 'int4', 'serial'],
    'bigint': ['bigint', 'int8', 'bigserial'],
    'smallint': ['smallint', 'int2'],
    'text': ['text', 'character varying', 'varchar'],
    'boolean': ['boolean', 'bool'],
    'numeric': ['numeric', 'decimal'],
    'timestamp': ['timestamp without time zone', 'timestamp with time zone', 'timestamp'],
    'date': ['date'],
    'real': ['real', 'float4'],
    'double precision': ['double precision', 'float8'],
  }

  const lowerType = type.toLowerCase().replace(/\(\d+.*\)/, '').trim()
  
  for (const [normalized, variants] of Object.entries(typeMap)) {
    if (variants.includes(lowerType)) {
      return normalized
    }
  }
  
  return lowerType
}

function validateColumns(
  actualColumns: ColumnInfo[],
  expectedColumns: ExpectedColumn[]
): { matched: boolean; errors: string[] } {
  const errors: string[] = []

  for (const expected of expectedColumns) {
    const actual = actualColumns.find(c => c.name.toLowerCase() === expected.name.toLowerCase())
    
    if (!actual) {
      errors.push(`Columna '${expected.name}' no encontrada`)
      continue
    }

    if (expected.type) {
      const normalizedActual = normalizeType(actual.type)
      const normalizedExpected = normalizeType(expected.type)
      
      if (normalizedActual !== normalizedExpected) {
        errors.push(`Columna '${expected.name}' tiene tipo '${actual.type}' pero se esperaba '${expected.type}'`)
      }
    }

    if (expected.nullable !== undefined) {
      if (actual.nullable !== expected.nullable) {
        errors.push(`Columna '${expected.name}' ${actual.nullable ? 'permite' : 'no permite'} NULL pero se esperaba ${expected.nullable ? 'que lo permitiera' : 'NOT NULL'}`)
      }
    }
  }

  return { matched: errors.length === 0, errors }
}

function validateConstraints(
  actualConstraints: ConstraintInfo[],
  expectedConstraints: ExpectedConstraint[]
): { matched: boolean; errors: string[] } {
  const errors: string[] = []

  for (const expected of expectedConstraints) {
    const matching = actualConstraints.filter(c => c.type === expected.type)
    
    if (matching.length === 0) {
      errors.push(`Constraint de tipo '${expected.type}' no encontrada`)
      continue
    }

    const hasMatchingColumns = matching.some(c => {
      const actualCols = c.columns.map(col => col.toLowerCase()).sort()
      const expectedCols = expected.columns.map(col => col.toLowerCase()).sort()
      return actualCols.length === expectedCols.length && 
             actualCols.every((col, i) => col === expectedCols[i])
    })

    if (!hasMatchingColumns) {
      errors.push(`Constraint '${expected.type}' existe pero no tiene las columnas esperadas: ${expected.columns.join(', ')}`)
    }
  }

  return { matched: errors.length === 0, errors }
}

function validateIndexes(
  actualIndexes: IndexInfo[],
  expectedIndexes: ExpectedIndex[]
): { matched: boolean; errors: string[] } {
  const errors: string[] = []

  for (const expected of expectedIndexes) {
    let found = false

    for (const actual of actualIndexes) {
      const actualCols = actual.columns.map(c => c.toLowerCase())
      const expectedCols = expected.columns.map(c => c.toLowerCase())

      if (expected.name && actual.name.toLowerCase() !== expected.name.toLowerCase()) {
        continue
      }

      const columnsMatch = actualCols.length === expectedCols.length &&
                          actualCols.every((col, i) => col === expectedCols[i])

      if (columnsMatch) {
        if (expected.isUnique !== undefined && actual.isUnique !== expected.isUnique) {
          errors.push(`Índice en columnas (${expected.columns.join(', ')}) ${actual.isUnique ? 'es único' : 'no es único'} pero se esperaba ${expected.isUnique ? 'UNIQUE' : 'no único'}`)
        }
        found = true
        break
      }
    }

    if (!found) {
      const indexDesc = expected.name 
        ? `'${expected.name}'` 
        : `en columnas (${expected.columns.join(', ')})`
      errors.push(`Índice ${indexDesc} no encontrado`)
    }
  }

  return { matched: errors.length === 0, errors }
}

export async function validateDDL(config: DDLValidationConfig): Promise<DDLValidationResult> {
  const result: DDLValidationResult = { isValid: true }

  if (config.schemaInspection) {
    const schemaInfo = await dbService.inspectSchema()
    const schemaValidation = validateSchemaInspection(schemaInfo, config.schemaInspection)
    result.schemaValidation = schemaValidation
    
    if (schemaValidation && !schemaValidation.passed) {
      result.isValid = false
    }
  }

  if (config.testQueries && config.testQueries.length > 0) {
    const testResults = await runTestQueries(config.testQueries)
    result.testQueryResults = testResults
    
    if (testResults && !testResults.passed) {
      result.isValid = false
    }
  }

  return result
}

function validateSchemaInspection(
  schemaInfo: SchemaInfo,
  config: SchemaInspectionConfig
): DDLValidationResult['schemaValidation'] {
  const errors: string[] = []
  
  const table = schemaInfo.tables.find(
    t => t.name.toLowerCase() === config.table.toLowerCase()
  )

  const shouldExist = config.shouldExist !== false

  if (shouldExist && !table) {
    return {
      passed: false,
      errors: [`Tabla '${config.table}' no encontrada en el esquema`],
      tableFound: false,
      columnsMatched: false,
      constraintsMatched: false,
      indexesMatched: false,
    }
  }

  if (!shouldExist && table) {
    return {
      passed: false,
      errors: [`Tabla '${config.table}' todavía existe cuando debería haber sido eliminada`],
      tableFound: true,
      columnsMatched: false,
      constraintsMatched: false,
      indexesMatched: false,
    }
  }

  if (!shouldExist && !table) {
    return {
      passed: true,
      errors: [],
      tableFound: false,
      columnsMatched: true,
      constraintsMatched: true,
      indexesMatched: true,
    }
  }

  let columnsMatched = true
  let constraintsMatched = true
  let indexesMatched = true

  if (config.columns) {
    const columnValidation = validateColumns(table!.columns, config.columns)
    columnsMatched = columnValidation.matched
    errors.push(...columnValidation.errors)
  }

  if (config.constraints) {
    const constraintValidation = validateConstraints(table!.constraints, config.constraints)
    constraintsMatched = constraintValidation.matched
    errors.push(...constraintValidation.errors)
  }

  if (config.indexes) {
    const indexValidation = validateIndexes(table!.indexes, config.indexes)
    indexesMatched = indexValidation.matched
    errors.push(...indexValidation.errors)
  }

  return {
    passed: errors.length === 0,
    errors,
    tableFound: true,
    columnsMatched,
    constraintsMatched,
    indexesMatched,
  }
}

async function runTestQueries(
  testQueries: TestQueryConfig[]
): Promise<DDLValidationResult['testQueryResults']> {
  const results: DDLValidationResult['testQueryResults'] = {
    passed: true,
    results: [],
  }

  for (const test of testQueries) {
    const queryResult = await dbService.executeTestQuery(test.query)
    const actual = queryResult.success

    const testResult = {
      query: test.query,
      expected: test.shouldSucceed,
      actual,
      error: queryResult.error,
    }

    results.results.push(testResult)

    if (actual !== test.shouldSucceed) {
      results.passed = false
    }
  }

  return results
}

