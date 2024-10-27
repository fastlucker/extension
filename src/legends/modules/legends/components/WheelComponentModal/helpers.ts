import { CardFromResponse, CardType } from '@legends/modules/legends/types'

interface WheelSpinOfTheDayParams {
  legends: CardFromResponse[] | null
  isLegendsLoading: boolean
}

export const isWheelSpinTodayAvailable = ({
  legends,
  isLegendsLoading
}: WheelSpinOfTheDayParams): boolean => {
  if (!legends || isLegendsLoading) return false
  const cardwheelOfFortune: CardFromResponse | null =
    legends.find((card: CardFromResponse) => {
      return card.action.predefinedId === 'wheelOfFortune' && card.card.type === CardType.done
    }) ?? null

  return !!cardwheelOfFortune
}
