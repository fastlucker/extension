import Alert from '@common/components/Alert'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

interface Props {
  onDoNotAskMeAgainChange: () => void
  doNotAskMeAgain: boolean
}

const Authorization7702 = ({ onDoNotAskMeAgainChange, doNotAskMeAgain }: Props) => {
  const { t } = useTranslation()

  return (
    <TabLayoutWrapperMainContent style={spacings.mbLg} contentContainerStyle={spacings.pvXl}>
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          spacings.mbLg
        ]}
      >
        <Text fontSize={16}>
          Do you want to make your Basic Account smarter? There should be a better styled text here
          explaining in human language what a smart account is and what are the benefits
        </Text>
      </View>
      <View>
        <Checkbox
          value={doNotAskMeAgain}
          style={spacings.mb0}
          onValueChange={onDoNotAskMeAgainChange}
        >
          <Text fontSize={16}>{t('Do not ask me again')}</Text>
        </Checkbox>
        {doNotAskMeAgain && (
          <Alert type="info" style={spacings.mt}>
            <Text>You can always change this from account settings</Text>
          </Alert>
        )}
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default React.memo(Authorization7702)
