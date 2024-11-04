/**
 * Converts a given number of seconds into a human-readable string format.
 * The format will be in weeks, days, hours, minutes, and seconds, depending on the input.
 *
 * Examples:
 * - 90061 seconds will be formatted as "1d 1h"
 * - 3600 seconds will be formatted as "1h"
 * - 61 seconds will be formatted as "1 min, 1 sec"
 * - 59 seconds will be formatted as "59 sec"
 */
function formatTime(seconds: number) {
  let remainingSeconds = seconds

  const weeks = Math.floor(remainingSeconds / (7 * 24 * 3600))
  remainingSeconds %= 7 * 24 * 3600
  const days = Math.floor(remainingSeconds / (24 * 3600))
  remainingSeconds %= 24 * 3600
  const hours = Math.floor(remainingSeconds / 3600)
  remainingSeconds %= 3600
  const minutes = Math.floor(remainingSeconds / 60)
  remainingSeconds %= 60

  if (weeks > 0) {
    return days !== 0 ? `${weeks}w ${days}d` : `${weeks}w`
  }
  if (days > 0) {
    return hours !== 0 ? `${days}d ${hours}h` : `${days}d`
  }
  if (hours > 0) {
    return minutes !== 0 ? `${hours}h, ${minutes} min` : `${hours}h`
  }
  if (minutes > 0) {
    return remainingSeconds !== 0 ? `${minutes} min, ${remainingSeconds} sec` : `${minutes} min`
  }

  return `${remainingSeconds} sec`
}

export default formatTime
