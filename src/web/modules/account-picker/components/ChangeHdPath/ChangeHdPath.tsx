import React, { useCallback, useMemo } from 'react'
import { View } from 'react-native'

import { DERIVATION_OPTIONS, HD_PATH_TEMPLATE_TYPE } from '@ambire-common/consts/derivation'
import InformationIcon from '@common/assets/svg/InformationIcon'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useAccountPickerControllerState from '@web/hooks/useAccountPickerControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'

import styles from './styles'

interface Props {}

const ChangeHdPath: React.FC<Props> = () => {
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { hdPathTemplate, isPageLocked, pageError } = useAccountPickerControllerState()

  const value = useMemo(
    () => DERIVATION_OPTIONS.find((o) => o.value === hdPathTemplate),
    [hdPathTemplate]
  )

  const handleChangeHdPath = useCallback(
    (s: SelectValue) => {
      dispatch({
        type: 'MAIN_CONTROLLER_ACCOUNT_PICKER_SET_HD_PATH_TEMPLATE',
        params: { hdPathTemplate: s.value as HD_PATH_TEMPLATE_TYPE }
      })
    },
    [dispatch]
  )

  if (!value) return null // should never happen

  return (
    <View style={[flexbox.directionRow, flexbox.center]}>
      <Text fontSize={12} weight="medium" style={spacings.mrMi}>
        {t('HD Path')}
      </Text>
      <InformationIcon
        width={14}
        height={14}
        style={spacings.mrSm}
        dataSet={{
          tooltipId: 'hd-path-tooltip',
          tooltipContent: t(
            "Your account(s) might be created using a different HD path. If you don't see the expected accounts, try switching the HD path to access other sets of addresses within this wallet."
          )
        }}
      />
      <Tooltip id="hd-path-tooltip" />
      <Select
        testID="select-change-hd-path"
        disabled={isPageLocked || !!pageError}
        setValue={handleChangeHdPath}
        containerStyle={styles.selectContainer}
        selectStyle={{ height: 40 }}
        options={DERIVATION_OPTIONS}
        value={value}
        withSearch={false}
      />
    </View>
  )
}

export default React.memo(ChangeHdPath)
