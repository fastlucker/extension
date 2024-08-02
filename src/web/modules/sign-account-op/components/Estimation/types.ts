import { SignAccountOpController } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { FeePaymentOption } from '@ambire-common/libs/estimate/interfaces'
import { SelectValue } from '@common/components/Select/types'

type FeeOption = Pick<SelectValue, 'value' | 'label' | 'disabled'> &
  Pick<FeePaymentOption, 'paidBy' | 'token'>

type Props = {
  signAccountOpState: SignAccountOpController | null
  disabled: boolean
  hasEstimation: boolean
  slowRequest: boolean
  isViewOnly: boolean
}

export type { FeeOption, Props }
