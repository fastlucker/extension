import React, { FC } from 'react'
import { View } from 'react-native'

import Alert from '@common/components/Alert'
import spacings from '@common/styles/spacings'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'

type Props = {
  isViewOnly: boolean
}

const Errors: FC<Props> = ({ isViewOnly }) => {
  const { errors } = useSignAccountOpControllerState() || {}

  return !!errors?.length && !isViewOnly ? (
    <View style={spacings.ptTy}>
      <Alert type="error" title={errors[0]} />
    </View>
  ) : null
}

export default Errors
