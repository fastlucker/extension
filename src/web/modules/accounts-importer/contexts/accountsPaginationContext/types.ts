export type AccountsPaginationContextData = {
  page: number
  handleLargePageStepDecrement: () => void
  handleSmallPageStepDecrement: () => void
  handleSmallPageStepIncrement: () => void
  handleLargePageStepIncrement: () => void
}
