export type UsePrivateModeReturnType = {
  isPrivateMode: boolean
  hidePrivateValue: (value: string | number) => string | number
  togglePrivateMode: () => void
}
