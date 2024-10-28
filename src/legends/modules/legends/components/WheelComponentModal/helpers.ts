import { Activity, LegendActivity } from '@legends/contexts/activityContext/types'
import { CardFromResponse, CardType } from '@legends/modules/legends/types'

interface WheelSpinOfTheDayParams {
  legends: CardFromResponse[] | null
  activity: Activity[] | null
}

export const isWheelSpinTodayDone = ({ legends, activity }: WheelSpinOfTheDayParams): boolean => {
  if (!legends || !legends.length) return true
  const today = new Date().toISOString().split('T')[0]

  const cardwheelOfFortune =
    legends.find((card: CardFromResponse) => {
      return card.action.predefinedId === 'wheelOfFortune' && card.card.type === CardType.done
    }) ||
    (activity && activity.length
      ? (activity.find((txn: Activity) => {
          return (
            txn.legends.activities.find((acc: LegendActivity) =>
              acc.action.startsWith('WheelOfFortune')
            ) && txn.submittedAt.startsWith(today)
          )
        }) as unknown as CardFromResponse | null)
      : null)
  return !!cardwheelOfFortune
}
