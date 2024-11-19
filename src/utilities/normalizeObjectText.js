function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}
function normalizeObjectTextProperties(obj) {
  const normalizedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === "string") {
        normalizedObj[key] = normalizeText(value);
      } else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        normalizedObj[key] = normalizeObjectTextProperties(value);
      } else if (typeof value !== "boolean") {
        normalizedObj[key] = value;
      }
    }
  }
  return normalizedObj;
}

export default normalizeObjectTextProperties;
