export const beneficiaryCompletionFields = [
  { key: 'phone', label: 'Teléfono', section: 'general', path: 'phone' },
  { key: 'medicalService', label: 'Servicio médico', section: 'general', path: 'medicalService' },
  { key: 'civilStatus', label: 'Estado civil', section: 'general', path: 'civilStatus' },
  { key: 'scholarship', label: 'Escolaridad', section: 'general', path: 'scholarship' },
  { key: 'occupation', label: 'Ocupación', section: 'expenses', path: 'occupation' },
  { key: 'delegation', label: 'Delegación', section: 'address', path: 'address.delegation' },
  { key: 'subdelegation', label: 'Subdelegación', section: 'address', path: 'address.subdelegation' },
  { key: 'street', label: 'Calle', section: 'address', path: 'address.street' },
  { key: 'extNum', label: 'Número exterior', section: 'address', path: 'address.extNum' },
  { key: 'neighborhood', label: 'Colonia', section: 'address', path: 'address.neighborhood' },
  { key: 'cp', label: 'Código postal', section: 'address', path: 'address.cp' }
]

const getPathValue = (source, path) => path.split('.').reduce((value, key) => value?.[key], source)

export const getMissingBeneficiaryFields = (beneficiary = {}) => beneficiaryCompletionFields
  .filter((field) => !getPathValue(beneficiary, field.path))

export const getMissingFieldCountBySection = (missingFields = []) => missingFields.reduce((counts, field) => {
  counts[field.section] = (counts[field.section] || 0) + 1
  return counts
}, {})
