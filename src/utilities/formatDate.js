const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export default formatDate;