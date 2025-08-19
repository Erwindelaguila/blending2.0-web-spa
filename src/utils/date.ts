export function obtenerAnioActual(): number {
  return new Date().getFullYear();
}
export const onFormatDate = (date?: Date): string => {
  return !date
    ? ""
    : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export const formatearFechaCompleta = (fechaISO: string): string => {
  if (!fechaISO) return '';
  
  // Verificar si ya tiene información de timezone
  const tieneTimezone = /[Zz]|[+\-]\d{2}:\d{2}$/.test(fechaISO);
  
  // Si no tiene timezone, asumir que es UTC
  const fechaCorregida = tieneTimezone ? fechaISO : fechaISO + 'Z';
  
  const fecha = new Date(fechaCorregida);
  
  const opcionesFecha: Intl.DateTimeFormatOptions = {
    weekday: 'long', // Agregar día de la semana
    day: 'numeric',
    month: 'long', 
    year: 'numeric',
  };
  
  const opcionesHora: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit', // Agregar segundos
    hour12: false,
    timeZone: 'America/Lima' // Zona horaria de Perú
  };
  
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
  const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);
  
  // Capitalizar primera letra del día de la semana
  const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  
  return `${fechaCapitalizada} a las ${horaFormateada} hs`;
};