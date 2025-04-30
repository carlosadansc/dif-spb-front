// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   console.log(dateString)
//   const day = String(date.getDate()).padStart(2, '0');
//   const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
//   const month = monthNames[date.getMonth()];
//   const year = date.getFullYear();
//   return `${day} / ${month} / ${year}`;
// }

// export default formatDate;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  // Ajustar la fecha a UTC
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  const day = String(utcDate.getUTCDate()).padStart(2, '0');
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const month = monthNames[utcDate.getUTCMonth()];
  const year = utcDate.getUTCFullYear();
  
  return `${day} - ${month} - ${year}`;
}

export default formatDate;
