export type AccountsPaginationContextData = {
  page: number
  pageStartIndex: number
  pageEndIndex: number
  handleLargePageStepDecrement: () => void
  handleSmallPageStepDecrement: () => void
  handleSmallPageStepIncrement: () => void
  handleLargePageStepIncrement: () => void
}
