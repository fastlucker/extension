// @ts-nocheck

import { engine } from '@web/constants/browserapi'

export const POPUP_WIDTH = 600

// The browser popup window has a top bar that takes some of the height.
// So this is about the size of this tab bar (magic number), that hopefully 🙏
// is enough to extend the height so that the content doesn't get cut.
const BROWSER_WINDOW_TOP_BAR_HEIGHT = engine === 'gecko' ? 20 : 30
export const POPUP_HEIGHT = Math.round(
  BROWSER_WINDOW_TOP_BAR_HEIGHT + (engine === 'gecko' ? 600 : 730)
)
