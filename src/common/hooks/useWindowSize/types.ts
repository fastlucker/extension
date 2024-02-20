import { breakpointsByWindowWidth } from './breakpoints'

export type WindowSizes = keyof typeof breakpointsByWindowWidth

export type WindowSizeProps = {
  width: number
  height: number
  minWidthSize: (size: WindowSizes | number) => boolean
  maxWidthSize: (size: WindowSizes | number) => boolean
}
