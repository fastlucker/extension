import { SignAccountOpController } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
import { TokenResult } from '@ambire-common/libs/portfolio'
import { SelectValue } from '@common/components/Select/types'

type FeeOption = Pick<SelectValue, 'value' | 'label' | 'disabled'> &
  Pick<FeePaymentOption, 'paidBy'> & {
    token: TokenResult | null
  }

type Props = {
  signAccountOpState: SignAccountOpController | null
  disabled: boolean
  hasEstimation: boolean
  slowRequest: boolean
  slowPaymasterRequest: boolean
  isViewOnly: boolean
}

export type { FeeOption, Props }
