import allCountries from './allcountries.json'
import { latam } from './latamCountries'
import { toast } from 'https://cdn.skypack.dev/wc-toast'
const countries = allCountries.filter((country) => latam.includes(country.country_code))

const $ = (selector) => document.querySelector(selector)

function changeTimeZone (date, timeZone) {
  const dateToUse = typeof date === 'string'
    ? new Date(date)
    : date

  return new Date(dateToUse.toLocaleString('en-US', {
    timeZone
  }))
}

const transformDateToString = (date) => {
  const localDate = date.toLocaleString('es-ES', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric'
  })

  return localDate.replace(':00', ' Hrs.')
}

$('input').addEventListener('change', () => {
  // e.preventDefault()
  // Get the form data
  // console.log(new window.FormData(e.target).get('date'))
  // const { date } = Object.fromEntries(new window.FormData(e.target))

  const date = $('input').value
  // e.target is the form element
  const mainData = new Date(date)
  const times = {}
  countries.forEach((country) => {
    const { timezones, emoji, country_code: code } = country
    if (Array.isArray(timezones)) {
      const [timezone] = timezones
      // set the time in the object timeZones
      const dateInTimezone = changeTimeZone(mainData, timezone)
      const hour = dateInTimezone.getHours()

      times[hour] ??= []

      times[hour].push({
        date: dateInTimezone,
        code,
        emoji,
        timezones
      })
    } else {
      console.log('No timezones', country)
    }
  })

  // como ordenar el objeto times
  const sortinTimesEntries = Object.entries(times).sort(([timeA], [timeB]) => +timeB - +timeA)
  console.log('🚀 ~ file: main.js ~ line 58 ~ $ ~ sortinTimesEntries', sortinTimesEntries)

  const html = sortinTimesEntries.map(([_, countries]) => {
    const flags = countries.map(country => `${country.emoji}`).join(' ')
    const [country] = countries
    const { date } = country
    const dateInTimezone = transformDateToString(date)

    return `${flags} ${dateInTimezone}`
  }).join('\n')

  // compiamos en resultado en el portapapeles
  navigator.clipboard.writeText(html)
  toast('¡Copiado al portapapeles!', {
    duration: 2000,
    icon: {
      type: 'success'
    }
  })

  $('#result').value = html
})
