export const createLabel = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .toUpperCase(); // Convert to uppercase
};