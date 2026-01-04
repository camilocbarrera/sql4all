interface ValidationResult {
  isValid: boolean;
  message: string;
  example?: string;
}

export const validateQuery = (
  query: string,
  ejercicioId: number,
): ValidationResult => {
  // Convertir la consulta a minúsculas y eliminar espacios extra para comparación
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, " ").trim();

  switch (ejercicioId) {
    case 1: {
      // Validar la consulta básica de selección
      const expectedParts = [
        "select",
        "from usuarios",
        "limit 5",
        "order by id",
      ];

      const isValid = expectedParts.every((part) =>
        normalizedQuery.includes(part),
      );

      if (!isValid) {
        return {
          isValid: false,
          message:
            "La consulta debe seleccionar todas las columnas de la tabla usuarios, limitada a 5 resultados y ordenada por ID",
        };
      }

      // Verificar que no haya cláusulas adicionales innecesarias
      const hasUnexpectedClauses =
        normalizedQuery.includes("group by") ||
        normalizedQuery.includes("having");

      if (hasUnexpectedClauses) {
        return {
          isValid: false,
          message: "La consulta contiene cláusulas innecesarias",
        };
      }

      return {
        isValid: true,
        message: "¡Excelente! Has completado el ejercicio correctamente.",
      };
    }

    case 2: {
      // Validar la consulta de filtrado con WHERE
      const expectedParts = [
        "select",
        "from usuarios",
        "where",
        "fecha_registro",
        "2023-01-01",
      ];

      const isValid =
        expectedParts.every((part) => normalizedQuery.includes(part)) &&
        (normalizedQuery.includes(">") || normalizedQuery.includes(">="));

      if (!isValid) {
        return {
          isValid: false,
          message:
            "La consulta debe filtrar usuarios registrados después del '2023-01-01' usando WHERE",
        };
      }

      // Verificar que la comparación de fecha sea correcta
      const hasValidDateComparison = normalizedQuery.match(
        /fecha_registro\s*>[=]?\s*'2023-01-01'/,
      );

      if (!hasValidDateComparison) {
        return {
          isValid: false,
          message:
            "La comparación de fecha no es correcta. Usa '>' o '>=' con el formato de fecha correcto",
        };
      }

      return {
        isValid: true,
        message:
          "¡Excelente! Has completado el ejercicio de filtrado correctamente.",
      };
    }

    case 3: {
      // Validar la consulta de JOIN y agregación
      const expectedParts = [
        "select",
        "from usuarios",
        "join",
        "pedidos",
        "count",
        "group by",
      ];

      const isValid = expectedParts.every((part) =>
        normalizedQuery.includes(part),
      );

      if (!isValid) {
        return {
          isValid: false,
          message:
            "La consulta debe incluir un JOIN entre usuarios y pedidos, y usar COUNT para totalizar",
          example: `
Estructura sugerida:
SELECT usuarios.id, usuarios.nombre, usuarios.email, COUNT(pedidos.id) as total_pedidos
FROM usuarios
LEFT JOIN pedidos ON usuarios.id = pedidos.usuario_id
GROUP BY usuarios.id, usuarios.nombre, usuarios.email`,
        };
      }

      // Verificar que el JOIN sea correcto
      const hasValidJoin = normalizedQuery.match(
        /usuarios\s+(?:inner\s+|left\s+)?join\s+pedidos\s+on\s+usuarios\.id\s*=\s*pedidos\.usuario_id/,
      );

      if (!hasValidJoin) {
        return {
          isValid: false,
          message:
            "El JOIN debe relacionar las tablas usuarios y pedidos usando la condición ON usuarios.id = pedidos.usuario_id",
          example: "LEFT JOIN pedidos ON usuarios.id = pedidos.usuario_id",
        };
      }

      // Verificar que se incluyan las columnas necesarias en GROUP BY
      const hasRequiredColumns = normalizedQuery.includes(
        "group by usuarios.id",
      );
      if (!hasRequiredColumns) {
        return {
          isValid: false,
          message:
            "Debes incluir usuarios.id en la cláusula GROUP BY. Además, incluye todas las columnas no agregadas del SELECT.",
          example: "GROUP BY usuarios.id, usuarios.nombre, usuarios.email",
        };
      }

      // Verificar que se use COUNT correctamente
      const hasValidCount = normalizedQuery.match(
        /count\s*\(\s*(?:pedidos\.id|\*)\s*\)/i,
      );
      if (!hasValidCount) {
        return {
          isValid: false,
          message: "Usa COUNT para contar los pedidos de cada usuario",
          example: "COUNT(pedidos.id) as total_pedidos",
        };
      }

      return {
        isValid: true,
        message:
          "¡Excelente! Has completado el ejercicio avanzado correctamente.",
      };
    }

    default:
      return {
        isValid: false,
        message: "Ejercicio no encontrado",
      };
  }
};
