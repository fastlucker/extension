import { Activity, LegendActivity } from '@legends/contexts/activityContext/types'

interface WheelSpinOfTheDayParams {
    activity: Activity[] | null;
    isLoading: boolean;
}

export const isWheelSpinTodayAvailable = ({ activity, isLoading }: WheelSpinOfTheDayParams): boolean => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (!activity || isLoading) return false;
    const transaction: Activity | null = activity.find(
        (txn: Activity) => {
        const submittedDate = new Date(txn.submittedAt);
        return (
            submittedDate >= yesterday &&
            submittedDate <= now &&
            txn.legends.activities &&
            txn.legends.activities.some((acc: LegendActivity) =>
            acc.action.startsWith('WheelOfFortune')
            )
        );
        }
    ) ?? null;

    return !!transaction;
}