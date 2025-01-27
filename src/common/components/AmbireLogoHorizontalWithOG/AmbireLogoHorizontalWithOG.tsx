import React from 'react'
import { View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import usePrevious from '@common/hooks/usePrevious'
import ConfettiAnimation from '@common/modules/dashboard/components/ConfettiAnimation'
import useInviteControllerState from '@web/hooks/useInviteControllerState'

import styles, { CONFETTI_HEIGHT, CONFETTI_WIDTH } from './styles'
import ToggleOG from './ToggleOG'

const AmbireLogoHorizontalWithOG: React.FC<SvgProps> = ({ ...rest }) => {
  const { isOG } = useInviteControllerState()
  const prevIsOG = usePrevious(isOG)

  const hasJustBecomeOG = prevIsOG !== undefined && isOG && !prevIsOG

  return (
    <>
      <ToggleOG {...rest} />
      {hasJustBecomeOG && (
        <View style={styles.confettiContainer}>
          <ConfettiAnimation width={CONFETTI_WIDTH} height={CONFETTI_HEIGHT} autoPlay={false} />
        </View>
      )}
    </>
  )
}

export default React.memo(AmbireLogoHorizontalWithOG)
