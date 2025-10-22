const DEFAULT_LOCALE = 'en-US'

const baseDateFormatter = (locale: string, timeZone: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeZone,
  })

const baseTimeFormatter = (locale: string, timeZone: string) =>
  new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  })

const baseTimeWithZoneFormatter = (locale: string, timeZone: string) =>
  new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  })

const toLocalKey = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).format(date)

export const getTimeZoneAbbreviation = (
  date: Date,
  timeZone: string,
  locale = DEFAULT_LOCALE
) => {
  const parts = baseTimeWithZoneFormatter(locale, timeZone).formatToParts(date)
  return (
    parts.find((part) => part.type === 'timeZoneName')?.value ??
    timeZone.replace('_', ' ')
  )
}

export const formatWorkshopDateRange = (
  start: string,
  end: string,
  timeZone: string,
  locale = DEFAULT_LOCALE
) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const sameDay = toLocalKey(startDate, timeZone) === toLocalKey(endDate, timeZone)

  const dateFormatter = baseDateFormatter(locale, timeZone)
  const timeFormatter = baseTimeFormatter(locale, timeZone)
  const tzAbbr = getTimeZoneAbbreviation(startDate, timeZone, locale)

  let dateLabel = dateFormatter.format(startDate)
  let timeLabel = `${timeFormatter.format(startDate)} – ${timeFormatter.format(endDate)} ${tzAbbr}`

  if (!sameDay) {
    const endDateLabel = dateFormatter.format(endDate)
    timeLabel = `${timeFormatter.format(startDate)} ${dateLabel} → ${timeFormatter.format(endDate)} ${endDateLabel} ${tzAbbr}`
    dateLabel = `${dateLabel} – ${endDateLabel}`
  }

  return { dateLabel, timeLabel }
}

export const formatSessionTimeRange = (
  start: string,
  end: string,
  timeZone: string,
  locale = DEFAULT_LOCALE
) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const timeFormatter = baseTimeFormatter(locale, timeZone)
  return `${timeFormatter.format(startDate)} – ${timeFormatter.format(endDate)}`
}

export const formatSessionStartDate = (
  start: string,
  timeZone: string,
  locale = DEFAULT_LOCALE
) => {
  const startDate = new Date(start)
  return baseDateFormatter(locale, timeZone).format(startDate)
}
