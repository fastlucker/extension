import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { geckoIdMapper } from '@ambire-common/consts/coingecko'
import Network from '@ambire-common/interfaces/network'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import CoingeckoIcon from '@common/assets/svg/CoingeckoIcon'
import SuccessIcon from '@common/assets/svg/SuccessIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import { createTab } from '@web/extension-services/background/webapi/tab'

import getStyles from './styles'

type Props = {
  text: string
  containerStyle?: any
  address: CustomToken['address']
  network: Network
}

const CoingeckoConfirmedBadge = ({ text, address, network, containerStyle }: Props) => {
  const { styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const { t } = useTranslation()
  const [hasTokenInfo, setHasTokenInfo] = useState(false)

  const onCoingeckoBadgePress = async () => {
    if (!hasTokenInfo) return

    const coingeckoId = geckoIdMapper(address, network)

    try {
      await createTab(`https://www.coingecko.com/en/coins/${coingeckoId || address}`)
    } catch {
      addToast(t('Could not open token info'), { type: 'error' })
    }
  }

  useEffect(() => {
    if (!address || !network) return

    const coingeckoId = geckoIdMapper(address, network)

    const tokenInfoUrl = `https://www.coingecko.com/en/coins/${coingeckoId || address}`

    fetch(tokenInfoUrl, {
      method: 'HEAD'
    })
      .then((result) => {
        if (result.ok) {
          setHasTokenInfo(true)
          return
        }

        setHasTokenInfo(false)
      })
      .catch(() => {})
  }, [addToast, t, address, network])

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={onCoingeckoBadgePress}
      disabled={!hasTokenInfo}
    >
      <Text weight="medium" fontSize={10} color="#8DC63F" style={spacings.mrMi}>
        {text}
      </Text>
      <SuccessIcon color="#8DC63F" width={20} height={20} withCirc={false} />
      <CoingeckoIcon />
    </Pressable>
  )
}

export default React.memo(CoingeckoConfirmedBadge)
