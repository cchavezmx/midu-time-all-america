import countries from './countries.json'

const $ = (selector) => document.querySelector(selector)

function changeTimeZone (date, timeZone) {
  const dateToUse = typeof date === 'string'
    ? new Date(date)
    : date

  const localDate = dateToUse.toLocaleString('es-ES', {
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    timeZone
  })

  return localDate
    .replace(':00', ' Hrs.')
}

$('form').addEventListener('submit', (e) => {
  e.preventDefault()
  // Get the form data
  // console.log(new window.FormData(e.target).get('date'))

  const { date } = Object.fromEntries(new window.FormData(e.target))
  // e.target is the form element
  const mainData = new Date(date)
  const html = countries.map((country) => {
    const { timezones, emoji } = country
    const [timezone] = timezones

    const dateInTimezone = changeTimeZone(mainData, timezone)
    return `${emoji} ${dateInTimezone}`
  }).join('\n')

  $('#result').value = html
})
