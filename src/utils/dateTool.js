import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.locale('es')
dayjs.extend(utc)
dayjs.extend(timezone)

const tz = new Intl.DateTimeFormat().resolvedOptions().timeZone

export const useDate = () => {
  const getCurrentDate = (short = false) => {
    // Regresa la fecha y hora en locale espaÃ±ol por defecto en formato tipo (Martes, 1 de junio de 2021 12:00:00)
    return dayjs.utc().tz(tz).locale('es').format(short ? 'dddd, D [de] MMMM [de] YYYY' : 'dddd, D [de] MMMM hh:mm a')
  }

  const formatDatetime = (date) => {
    if (!date) return ''
    return dayjs.utc(date).tz(tz).locale('es').format('dddd, D [de] MMMM [de] YYYY hh:mm:ss a')
  }

  const formatDatetimeShort = (date) => {
    if (!date) return ''
    return dayjs.utc(date).tz(tz).locale('es').format('DD/MM/YYYY HH:mm')
  }

  const formatDate = (date) => {
    if (!date) return ''
    return dayjs(date).format('D [de] MMMM [de] YYYY')
  }

  const formatDateShort = (date) => {
    if (!date) return ''
    return dayjs.utc(date).format('DD/MM/YYYY')
  }

  const formatTime12 = (time) => {
    if (!time) return ''
    return dayjs(`2000-01-01 ${time}`).format('hh:mm a')
  }

  const formatTime24 = (time) => {
    if (!time) return ''
    return dayjs(`2000-01-01 ${time}`).format('HH:mm')
  }

  return {
    getCurrentDate,
    formatDatetime,
    formatDatetimeShort,
    formatDateShort,
    formatDate,
    formatTime12,
    formatTime24,
  }
}