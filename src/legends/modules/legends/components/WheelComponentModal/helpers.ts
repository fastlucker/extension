import { CARD_PREDEFINED_ID } from '@legends/modules/legends/constants'
import { CardFromResponse, CardStatus } from '@legends/modules/legends/types'
import { isMatchingPredefinedId } from '@legends/modules/legends/utils/cards'

interface WheelSpinOfTheDayParams {
  legends: CardFromResponse[] | null
}

type TimeUntilMidnight = {
  time: {
    hours: number
    minutes: number
    seconds: number
  }
  label: string
}

export const timeUntilMidnight = (): TimeUntilMidnight => {
  const now = new Date()
  const hoursLeft = 23 - now.getUTCHours()
  const minutesLeft = 59 - now.getUTCMinutes()
  const secondsLeft = 59 - now.getUTCSeconds()

  // For now, we keep the label short, as there isn't much space in the components.
  // Therefore, we only display the hours and omit the minutes, seconds.
  let label
  if (hoursLeft < 1) {
    label = 'Available in < 1 hour'
  } else if (hoursLeft === 1) {
    label = `Available in ${hoursLeft} hour`
  } else {
    label = `Available in ${hoursLeft} hours`
  }

  return {
    time: {
      hours: hoursLeft,
      minutes: minutesLeft,
      seconds: secondsLeft
    },
    label
  }
}

export const isWheelSpinTodayDone = ({ legends }: WheelSpinOfTheDayParams): boolean => {
  if (!legends || !legends.length) return true

  const cardWheelOfFortune = legends.find((card: CardFromResponse) =>
    isMatchingPredefinedId(card.action, CARD_PREDEFINED_ID.wheelOfFortune)
  )

  if (!cardWheelOfFortune) return false

  return (
    cardWheelOfFortune.card.status === CardStatus.completed ||
    cardWheelOfFortune.card.status === CardStatus.disabled
  )
}
