import * as XLSX from 'xlsx';

/**
 * Exporta datos a un archivo Excel
 * @param {Array} data - Array de objetos con los datos a exportar
 * @param {Object} columns - Objeto donde las keys son los encabezados y los values son las propiedades de los datos
 *                           Ejemplo: { "Nombre": "name", "Edad": "age", "País": "address.country" }
 * @param {string} fileName - Nombre del archivo a generar (sin extensión)
 * @param {string} sheetName - Nombre de la hoja de cálculo (default: 'Datos')
 * @param {Object} options - Opciones adicionales
 * @param {Object} options.columnWidths - Objeto con anchos personalizados por columna
 * @param {Function} options.formatters - Objeto con funciones de formateo por columna
 * @returns {void}
 */
export function exportToExcel(data, columns, fileName, sheetName = 'Datos', options = {}) {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  if (!columns || Object.keys(columns).length === 0) {
    console.warn('No se especificaron columnas para exportar');
    return;
  }

  const { columnWidths = {}, formatters = {} } = options;

  // Mapear los datos según las columnas especificadas
  const dataExcel = data.map(item => {
    const row = {};
    
    for (const [header, path] of Object.entries(columns)) {
      try {
        // Obtener el valor usando el path (soporta propiedades anidadas)
        const cellValue = path.split('.').reduce((obj, key) => obj?.[key], item);
        
        // Aplicar formateador personalizado si existe
        if (formatters[header]) {
          row[header] = formatters[header](cellValue, item);
        } else {
          row[header] = cellValue ?? '';
        }
      } catch (error) {
        console.warn(`Error procesando campo ${header}:`, error);
        row[header] = '';
      }
    }
    
    return row;
  });

  // Crear hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(dataExcel);

  // Configurar anchos de columna
  if (Object.keys(columnWidths).length > 0) {
    worksheet['!cols'] = Object.keys(columns).map(header => ({
      wch: columnWidths[header] || 15
    }));
  }

  // Crear libro de trabajo y agregar la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Descargar archivo
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

/**
 * Formateador de fechas para Excel (formato DD/MM/YYYY)
 * @param {string|Date} value - Valor de fecha a formatear
 * @returns {string} Fecha formateada o cadena vacía
 */
export function formatDateForExcel(value) {
  if (!value) return '';
  
  const date = new Date(value);
  if (isNaN(date)) return value;
  
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formateador de números para Excel
 * @param {number} value - Valor numérico
 * @returns {number|string} Número o cadena vacía
 */
export function formatNumberForExcel(value) {
  if (value === null || value === undefined) return '';
  return Number(value);
}

/**
 * Formateador de moneda para Excel
 * @param {number} value - Valor monetario
 * @returns {string} Valor formateado o cadena vacía
 */
export function formatCurrencyForExcel(value) {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value);
}
