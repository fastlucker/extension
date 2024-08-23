import { breakpointsByWindowHeight, breakpointsByWindowWidth } from './breakpoints'

export type WindowSizes = number | keyof typeof breakpointsByWindowWidth
export type WindowHeightSizes = number | keyof typeof breakpointsByWindowHeight

export type WindowSizeProps = {
  width: number
  height: number
  minWidthSize: (size: WindowSizes) => boolean
  maxWidthSize: (size: WindowSizes) => boolean
  minHeightSize: (size: WindowHeightSizes) => boolean
}
