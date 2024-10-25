interface SQLError {
  message: string;
  stack?: string;
  code?: string;
}

interface SQLErrorResponse {
  message: string;
  example?: string;
}

export function handleSQLError(error: SQLError): SQLErrorResponse {
  const errorMessage = error.message.toLowerCase();

  // Manejar errores de sintaxis
  if (errorMessage.includes('syntax error')) {
    const nearPart = errorMessage.match(/near "([^"]+)"/)?.[1] || '';
    return {
      message: `Error de sintaxis ${nearPart ? `cerca de "${nearPart}"` : ''}. Verifica tu consulta SQL.`,
      example: `
Ejemplos de sintaxis correcta:
SELECT * FROM usuarios
SELECT columna FROM tabla WHERE condicion
SELECT * FROM tabla1 JOIN tabla2 ON tabla1.id = tabla2.id`
    };
  }

  // Manejar errores de tabla no existente
  if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
    const tableName = errorMessage.match(/relation "([^"]+)" does not exist/)?.[1];
    return {
      message: `La tabla "${tableName}" no existe.`,
      example: `
Tablas disponibles:
- usuarios (id, nombre, email, fecha_registro, edad, ciudad, activo)
- pedidos (id, usuario_id, monto, fecha)`
    };
  }

  // Manejar errores de columna no existente
  if (errorMessage.includes('column') && errorMessage.includes('does not exist')) {
    const columnName = errorMessage.match(/column "([^"]+)" does not exist/)?.[1];
    return {
      message: `La columna "${columnName}" no existe en la tabla.`,
      example: `
Columnas disponibles:
usuarios: id, nombre, email, fecha_registro, edad, ciudad, activo
pedidos: id, usuario_id, monto, fecha`
    };
  }

  // Manejar errores de GROUP BY
  if (errorMessage.includes('must appear in the group by clause')) {
    return {
      message: 'Todas las columnas en el SELECT deben aparecer en el GROUP BY o ser parte de una función de agregación.',
      example: `
SELECT usuarios.id, usuarios.nombre, COUNT(*) as total
FROM usuarios
GROUP BY usuarios.id, usuarios.nombre`
    };
  }

  // Error genérico con sugerencias
  return {
    message: 'Error en la consulta SQL. Verifica la sintaxis y los nombres de tablas/columnas.',
    example: `
Sugerencias:
1. Verifica que los nombres de tablas y columnas estén escritos correctamente
2. Asegúrate de usar la sintaxis correcta para cada tipo de consulta
3. Revisa que las tablas y columnas referenciadas existan`
  };
}
