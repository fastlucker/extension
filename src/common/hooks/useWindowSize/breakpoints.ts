import { TAB_WIDE_CONTENT_WIDTH } from '@web/constants/spacings'

const breakpointsByWindowWidth = {
  xs: 320,
  s: 576,
  m: 768,
  l: 990,
  xl: TAB_WIDE_CONTENT_WIDTH,
  xxl: 1600,
  xxxl: 1900
}

const breakpointsByWindowHeight = {
  xs: 500,
  s: 600,
  m: 700,
  l: 800,
  xl: 900,
  xxl: 1000,
  xxxl: 1100
}

export { breakpointsByWindowWidth, breakpointsByWindowHeight }
