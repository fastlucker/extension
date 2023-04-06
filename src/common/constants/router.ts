import { isWeb } from '@common/config/env'

export const TAB_BAR_HEIGHT = isWeb ? 80 : 63
export const TAB_BAR_ICON_SIZE = 22
// Currently supported only on iOS
export const TAB_BAR_BLUR = 55
