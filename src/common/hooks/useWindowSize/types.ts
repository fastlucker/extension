import { breakpointsByWindowWidth } from './breakpoints'

export type WindowSizes = number | keyof typeof breakpointsByWindowWidth

export type WindowSizeProps = {
  width: number
  height: number
  minWidthSize: (size: WindowSizes) => boolean
  maxWidthSize: (size: WindowSizes) => boolean
}
