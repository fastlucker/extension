import React, { useCallback, useMemo } from 'react'

import { DERIVATION_OPTIONS } from '@ambire-common/consts/derivation'
import Select from '@common/components/Select'
import useAccountAdderControllerState from '@web/hooks/useAccountAdderControllerState'

interface Props {}

const SelectDerivation: React.FC<Props> = () => {
  const { hdPathTemplate } = useAccountAdderControllerState()

  const value = useMemo(
    () => DERIVATION_OPTIONS.find((o) => o.value === hdPathTemplate),
    [hdPathTemplate]
  )

  // TODO:
  const handleChangeDerivation = useCallback(() => {}, [])

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
