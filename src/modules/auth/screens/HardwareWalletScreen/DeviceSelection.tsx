import React from 'react'

import { useTranslation } from '@config/localization'
import Wrapper, { WRAPPER_TYPES } from '@modules/common/components/Wrapper'

import DeviceItem from './DeviceItem'

const DeviceSelection = ({ onSelectDevice, devices }: any) => {
  const { t } = useTranslation()

  const keyExtractor = (item: any) => item.id

  const renderItem = ({ item }: any) => {
    return <DeviceItem device={item} onSelect={onSelectDevice} />
  }

  return (
    <Wrapper
      type={WRAPPER_TYPES.FLAT_LIST}
      data={devices}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}

export default DeviceSelection
