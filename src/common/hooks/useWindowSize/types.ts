import { breakpointsByWindowWidth } from './breakpoints'

export type WindowSizeProps = {
  width: number
  height: number
  minWidthSize: (size: keyof typeof breakpointsByWindowWidth) => boolean
  maxWidthSize: (size: keyof typeof breakpointsByWindowWidth) => boolean
}
