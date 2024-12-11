import { CardActionType, CardFromResponse, CardStatus } from '@legends/modules/legends/types'

interface WheelSpinOfTheDayParams {
  legends: CardFromResponse[] | null
}

type TimeUntilMidnightReturnValue = {
  hours: number
  minutes: number
  seconds: number
}

export const timeUntilMidnight = (): TimeUntilMidnightReturnValue => {
  const now = new Date()
  const hoursLeft = 23 - now.getUTCHours()
  const minutesLeft = 59 - now.getUTCMinutes()
  const secondsLeft = 59 - now.getUTCSeconds()

  return {
    hours: hoursLeft,
    minutes: minutesLeft,
    seconds: secondsLeft
  }
}

export const isWheelSpinTodayDone = ({ legends }: WheelSpinOfTheDayParams): boolean => {
  if (!legends || !legends.length) return true

  const cardWheelOfFortune = legends.find((card: CardFromResponse) => {
    return (
      card.action.type === CardActionType.predefined &&
      card.action.predefinedId === 'wheelOfFortune'
    )
  })

  if (!cardWheelOfFortune) return false

  return cardWheelOfFortune.card.status === CardStatus.completed
}
