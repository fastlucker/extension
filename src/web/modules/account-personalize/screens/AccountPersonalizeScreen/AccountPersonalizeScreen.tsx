import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import Card from '@web/modules/account-personalize/components/Card'

const AccountPersonalizeScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [elementHeights, setElementHeights] = useState({})
  const [totalHeight, setTotalHeight] = useState(300)

  const handleLayout = (index: string, event: any) => {
    const { height } = event.nativeEvent.layout
    setElementHeights((prevState) => ({ ...prevState, [index]: height + 15 }))
  }

  useEffect(() => {
    // Calculate the sum of heights
    const totalHeightCalculated = Object.values(elementHeights)
      .slice(0, 2)
      .reduce((acc, height) => acc + height, 0)

    setTotalHeight(totalHeightCalculated)
  }, [elementHeights])

  // TODO: those accounts are dummy data that will be removed when this screen is wired
  const accounts = [
    { address: '0x3242354345346456445645674r564567459', smartAccount: true },
    { address: '0x3242354345346456445645674r564567459', smartAccount: false },
    { address: '0x3242354345346456445645674r564567452', smartAccount: false }
  ]
  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={[flexboxStyles.alignCenter, spacings.mtXl]}>
          <View>
            <Wrapper
              contentContainerStyle={{
                height: totalHeight,
                ...spacings.pt0
              }}
            >
              {accounts.map((acc, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Card handleLayout={handleLayout} account={acc} index={i} key={acc.address + i} />
              ))}
            </Wrapper>
            <Button
              onPress={() => navigate('/')}
              text={t('Save and Continue')}
              style={[spacings.mtLg, flexboxStyles.alignSelfEnd]}
            />
          </View>
        </View>
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent>
        <Text weight="medium" style={spacings.mb} color={colors.titan} fontSize={16}>
          {t('Account personalization')}
        </Text>
        <Text
          shouldScale={false}
          weight="regular"
          style={spacings.mb}
          color={colors.titan}
          fontSize={14}
        >
          {t(
            'The account label is any arbitrary label that you choose. Both the label and the avatar are only local and for own organizational purposes - none of this will be uploaded on the blockchain or anywhere else.'
          )}
        </Text>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default AccountPersonalizeScreen
