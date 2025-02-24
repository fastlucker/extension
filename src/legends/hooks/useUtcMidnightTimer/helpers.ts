// Calculate milliseconds until UTC midnight
export const calculateTimeToMidnight = () => {
  const now = new Date()
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1))
  return midnight.getTime() - now.getTime()
}

// Calculate the timestamp of today's midnight
export const calculateLastMidnight = () => {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).getTime()
}

// Format remaining time (ms) into readable text
export const getHoursLabel = (remainingTime: number) => {
  const hours = Math.floor(remainingTime / (1000 * 60 * 60))
  if (hours > 1) return `Available in ${hours} hours`
  if (hours === 1) return 'Available in 1 hour'
  if (remainingTime > 0) return 'Available in < 1 hour'

  // Midnight
  return 'Just a moment'
}

// Format remaining time (ms) as HH:mm
export const getMinutesLabel = (remainingTime: number) => {
  const totalMinutes = Math.floor(remainingTime / (1000 * 60))
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')

  if (totalMinutes) return `Available in ${hours}:${minutes}`
  if (remainingTime > 0) return 'Available in < 1 min'

  // Midnight
  return 'Just a moment'
}

// Format remaining time (ms) into hours and minutes
export const getHoursAndMinutesLabel = (remainingTime: number) => {
  const totalMinutes = Math.floor(remainingTime / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `Available in ${hours}h ${minutes}min`
  }

  return `Available in ${minutes}min`
}