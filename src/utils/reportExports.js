import { exportToExcel, formatDateForExcel, formatNumberForExcel } from './excelExport'

const datedFileName = (name) => `${name}-${new Date().toISOString().slice(0, 10)}`

const beneficiaryColumns = {
  CURP: 'curp',
  Nombre: 'name',
  'Apellido paterno': 'fatherSurname',
  'Apellido materno': 'motherSurname',
  'Fecha de nacimiento': 'birthdate',
  Teléfono: 'phone',
  Colonia: 'address.neighborhood',
  'Código postal': 'address.cp',
  Dirección: 'address.street',
  'Número exterior': 'address.extNum',
  'Número interior': 'address.intNum',
  Ciudad: 'address.city',
  'Tipo de comunidad': 'address.communityType',
  'Lugar de nacimiento': 'birthplace',
  'Estado civil': 'civilStatus',
  Sexo: 'sex',
  'Servicio médico': 'medicalService',
  'Tiene alguna discapacidad': 'hasDisability',
  'Tipo de discapacidad': 'disabilityType',
  'Grado de estudios': 'scholarship',
  'Ingresos mensuales': 'income'
}

const contributionColumns = {
  Folio: 'folio',
  CURP: 'curp',
  Nombre: 'nombre',
  'Apellido paterno': 'apellido paterno',
  'Apellido materno': 'apellido materno',
  'Fecha de nacimiento': 'fecha de nacimiento',
  Sexo: 'sexo',
  Edad: 'edad',
  Calle: 'calle',
  Número: 'numero',
  Colonia: 'colonia',
  Delegación: 'delegacion',
  Subdelegación: 'subdilegacion',
  'Código postal': 'codigo postal',
  'Fecha de apoyo': 'fecha de apoyo',
  'Quien recibió': 'quien recibio',
  'Quien entregó': 'quien entrego',
  'Tipo de apoyo': 'tipo de apoyo',
  'Apoyo otorgado': 'apoyo otorgado',
  Cantidad: 'cantidad'
}

const beneficiaryContributionColumns = {
  Folio: 'folio',
  'Fecha de apoyo': 'contributionDate',
  Beneficiario: 'beneficiaryName',
  'Otorgado por': 'createdBy',
  'Tipo de apoyo': 'categoryName',
  'Apoyo otorgado': 'description',
  Cantidad: 'quantity'
}

export const exportBeneficiariesReport = (data) => {
  exportToExcel(data, beneficiaryColumns, datedFileName('padron-beneficiarios-smdif-la-paz'), 'Beneficiarios', {
    columnWidths: {
      CURP: 20,
      Nombre: 18,
      'Apellido paterno': 18,
      'Apellido materno': 18,
      'Fecha de nacimiento': 18,
      Teléfono: 14,
      Dirección: 24,
      Colonia: 20
    },
    formatters: { 'Fecha de nacimiento': formatDateForExcel }
  })
}

export const exportContributionsReport = (data) => {
  exportToExcel(data, contributionColumns, datedFileName('registro-apoyos-otorgados-smdif-la-paz'), 'Apoyos', {
    columnWidths: {
      Folio: 14,
      CURP: 20,
      Nombre: 18,
      'Fecha de apoyo': 16,
      'Quien recibió': 20,
      'Quien entregó': 20,
      'Tipo de apoyo': 20,
      'Apoyo otorgado': 32,
      Cantidad: 12
    },
    formatters: { Cantidad: formatNumberForExcel }
  })
}

export const exportBeneficiaryContributionsReport = (data, beneficiary) => {
  const name = [beneficiary.name, beneficiary.fatherSurname]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ-]+/gi, '-')

  exportToExcel(
    data,
    beneficiaryContributionColumns,
    datedFileName(`historial-apoyos-${name || 'beneficiario'}-smdif-la-paz`),
    'Apoyos',
    {
      columnWidths: {
        Folio: 14,
        'Fecha de apoyo': 16,
        Beneficiario: 28,
        'Otorgado por': 22,
        'Tipo de apoyo': 20,
        'Apoyo otorgado': 32,
        Cantidad: 12
      },
      formatters: {
        'Fecha de apoyo': formatDateForExcel,
        Cantidad: formatNumberForExcel
      }
    }
  )
}
