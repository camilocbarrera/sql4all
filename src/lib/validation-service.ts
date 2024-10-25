import { ExpectedOutput } from '@/types/exercises'

export function validateQueryResult(result: any, expectedOutput: ExpectedOutput): boolean {
  const { type, conditions } = expectedOutput;

  switch (type) {
    case 'exact':
      // Validar número exacto de filas
      if (conditions.rows && result.rows.length !== conditions.rows) {
        return false;
      }
      
      // Validar columnas esperadas
      if (conditions.columns) {
        const hasAllColumns = conditions.columns.every(col => 
          result.fields.some((field: any) => field.name === col)
        );
        if (!hasAllColumns) return false;
      }

      // Validar valores específicos
      if (conditions.values) {
        return conditions.values.every((expectedRow, index) => {
          const actualRow = result.rows[index];
          return Object.entries(expectedRow).every(([key, value]) => 
            actualRow[key] === value
          );
        });
      }
      
      return true;

    case 'partial':
      // Validar columnas requeridas
      if (conditions.columns) {
        const hasRequiredColumns = conditions.columns.every(col => 
          result.fields.some((field: any) => field.name === col)
        );
        if (!hasRequiredColumns) return false;
      }

      // Ejecutar validación personalizada si existe
      if (conditions.customValidation) {
        return conditions.customValidation(result);
      }
      
      return true;

    case 'count':
      return result.rows.length === conditions.rows;

    case 'custom':
      return conditions.customValidation ? conditions.customValidation(result) : false;

    default:
      return false;
  }
}
