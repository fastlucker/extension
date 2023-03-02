export interface OnboardingContextReturnType {
  onboardingStatus: ONBOARDING_VALUES | null
  setOnboardingStatus: (item: ONBOARDING_VALUES | null) => void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum ONBOARDING_VALUES {
  ON_BOARDED = 'onBoarded',
  NOT_ON_BOARDED = 'not-on-boarded'
}
