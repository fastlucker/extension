import { SELECTORS } from '../../common/selectors/selectors'
import { buildSelector } from '../../common-helpers/buildSelector'

export const SEND_TOKEN_SELECTOR = SELECTORS.nativeTokenBaseDashboard
export const DASHBOARD_SEND_BTN_SELECTOR = SELECTORS.tokenSend
export const DASHBOARD_TOP_UP_BTN_SELECTOR = SELECTORS.topUpButton
export const FEE_TOKEN_POL_SELECTOR = buildSelector(
  'option-0x4c71d299f23efc660b3295d1f631724693ae22ac0x0000000000000000000000000000000000000000pol'
)
export const BIG_AMOUNT = '22222'
