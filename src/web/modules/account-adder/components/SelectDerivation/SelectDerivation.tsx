import React, { useCallback, useMemo } from 'react'

import { DERIVATION_OPTIONS, HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

interface Props {}

const SelectDerivation: React.FC<Props> = () => {
  const { dispatch } = useBackgroundService()
  const { hdPathTemplate } = useAccountAdderControllerState()

  const value = useMemo(
    () => DERIVATION_OPTIONS.find((o) => o.value === hdPathTemplate),
    [hdPathTemplate]
  )

  const handleChangeDerivation = useCallback(
    (s: SelectValue) => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_ADDER_SET_HD_PATH_TEMPLATE',
        params: { hdPathTemplate: s.value as HD_PATH_TEMPLATE_TYPE }
      })
    },
    [dispatch]
  )

  if (!value) return null

  return (
    <Select
      setValue={handleChangeDerivation}
      containerStyle={{ width: 350 }}
      selectStyle={{ height: 40 }}
      options={DERIVATION_OPTIONS}
      value={value}
    />
  )
}

export default React.memo(SelectDerivation)
