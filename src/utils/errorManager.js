const errorTranslations = {
  'User or password incorrect': 'Usuario o contraseña incorrectos.',
  ERR0000: {
    code: "ERR0000",
    title: "INTERNAL_SERVER_ERROR",
    description: "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.",
  },
  ERR0001: {
    code: "ERR0001",
    title: "NOT_FOUND",
    description: "El recurso solicitado no fue encontrado.",
  },
  ERR0002: {
    code: "ERR0002",
    title: "CANNOT_UPDATE_DUE_TO_OUTDATED_DATA",
    description: "Los datos que intentas actualizar están desactualizados. Por favor, refresca la página e inténtalo de nuevo.",
  },
  ERR0003: {
    code: "ERR0003",
    title: "INVALID_PAGINATION_FORMAT",
    description: "Asegúrate de que los parámetros de paginación tengan el formato correcto.",
  },
  ERR0004: {
    code: "ERR0004",
    title: "INVALID_PAGINATION_LIMIT",
    description: "Asegúrate de que el límite de paginación esté entre 1 y 100.",
  },
  ERR0005: {
    code: "ERR0005",
    title: "INVALID_PARAMETERS",
    description: "Asegúrate de que se incluya al menos un parámetro.",
  },
  ERR0006: {
    code: "ERR0006",
    title: "MISSING_PARAMETERS",
    description: "Asegúrate de que se incluyan todos los parámetros requeridos.",
  },
  ERR0007: {
    code: "ERR0007",
    title: "DUPLICATED_KEY",
    description: "La clave proporcionada ya existe. Asegúrate de que sea única.",
  },
  ERR0008: {
    code: "ERR0008",
    title: "BAD_REQUEST",
    description: "La solicitud no es correcta. Por favor, verifícala.",
  },
  ERR0009: {
    code: "ERR0009",
    title: "METHOD_DEPRECATED",
    description: "Este método está obsoleto y ya no se utiliza.",
  },
  ERR0010: {
    code: "ERR0010",
    title: "DATABASE_UNAVAILABLE",
    description: "La base de datos no está disponible en este momento.",
  },
  ERR0011: {
    code: "ERR0011",
    title: "SERVICE_UNAVAILABLE",
    description: "El servicio no está disponible en este momento.",
  },
  ERR0012: {
    code: "ERR0012",
    title: "COLUMN_NOT_FOUND",
    description: "No se encontró el documento o la columna especificada.",
  },
  ERR0013: {
    code: "ERR0013",
    title: "DUPLICATED_ID_FOUND",
    description: "Se encontró un identificador duplicado.",
  },
  ERR0014: {
    code: "ERR0014",
    title: "ITEM_INACTIVE",
    description: "El elemento está inactivo.",
  },
  ERR0015: {
    code: "ERR0015",
    title: "RULE_NOT_APPLY",
    description: "La regla especificada no aplica.",
  },
  ERR0016: {
    code: "ERR0016",
    title: "UNIQUE_VIOLATION",
    description: "Se ha violado una restricción de unicidad.",
  },
  ERR0017: {
    code: "ERR0017",
    title: "INVALID_PASSWORD",
    description: "La contraseña proporcionada no es válida.",
  },

  // Token
  ERR0018: {
    code: "ERR0018",
    title: "INVALID_OR_NULL_TOKEN",
    description: "El token proporcionado no es válido o es nulo.",
  },
  ERR0019: {
    code: "ERR0019",
    title: "TOKEN_EXPIRED",
    description: "El token proporcionado ha expirado.",
  },
  ERR0020: {
    code: "ERR0020",
    title: "UNAUTHORIZED",
    description: "El tipo de usuario no está autorizado para esta solicitud.",
  },

  // Booking Module (Ejemplos, pueden requerir más contexto)
  ERR0100: {
    code: "ERR0100",
    title: "BOOKING_MODULE",
    description: "Valor incorrecto para el parámetro de noches. La llegada y la salida no coinciden.",
  },
  ERR0101: {
    code: "ERR0101",
    title: "BOOKING_MODULE",
    description: "Valor incorrecto para el parámetro de noches, debe ser un número.",
  },
  ERR0102: {
    code: "ERR0102",
    title: "COMMON_ERRORS",
    description: "Valor incorrecto para la llegada, debe ser una fecha.",
  },
  ERR0103: {
    code: "ERR0103",
    title: "COMMON_ERRORS",
    description: "Valor incorrecto para la salida, debe ser una fecha.",
  },
  ERR0104: {
    code: "ERR0104",
    title: "BOOKING_MODULE",
    description: "Valor incorrecto para el parámetro de noches, debe ser un número positivo.",
  },
  ERR0111: {
    code: "ERR0111",
    title: "BOOKING_MODULE",
    description: "La fecha de llegada no puede ser posterior a la fecha de salida.",
  },
  ERR0200: {
    code: "ERR0200",
    title: "BOOKING_SENDING_MODULE",
    description: "El rango de fechas es incorrecto.",
  }
};

export const getTranslatedError = (err) => {
  // Error de red
  if (err.code === 'ERR_NETWORK') {
    return 'No se pudo conectar con el servidor';
  }

  // Errores de la API con estructura { errors: [{ code: '...' }] }
  const apiErrorCode = err.response?.data?.errors?.[0]?.code;
  if (apiErrorCode && errorTranslations[apiErrorCode]) {
    return errorTranslations[apiErrorCode].description;
  }

  // Errores de la API con estructura { message: '...' }
  const apiMessage = err.response?.data?.message;
  if (apiMessage && errorTranslations[apiMessage]) {
    return errorTranslations[apiMessage];
  }

  // Mensaje de fallback si no se encuentra traducción
  const fallbackMessage = err.response?.data?.errors?.[0]?.description || apiMessage;
  if (fallbackMessage) {
    return fallbackMessage;
  }

  // Mensaje genérico final
  return 'Ocurrió un error inesperado';
};
