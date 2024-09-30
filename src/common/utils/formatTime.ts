/* eslint-disable no-param-reassign */

function formatTime(seconds: number) {
  const weeks = Math.floor(seconds / (7 * 24 * 3600))
  seconds %= 7 * 24 * 3600
  const days = Math.floor(seconds / (24 * 3600))
  seconds %= 24 * 3600
  const hours = Math.floor(seconds / 3600)
  seconds %= 3600
  const minutes = Math.floor(seconds / 60)
  seconds %= 60

  if (weeks > 0) {
    return days !== 0 ? `${weeks}w ${days}d` : `${weeks}w`
  }
  if (days > 0) {
    return hours !== 0 ? `${days}d ${hours}h` : `${hours}h`
  }
  if (hours > 0) {
    return minutes !== 0 ? `${hours}h, ${minutes}m` : `${hours}h`
  }
  if (minutes > 0) {
    return seconds !== 0 ? `${minutes}m, ${seconds}s` : `${minutes}m`
  }

  return `${seconds}s`
}

export default formatTime
