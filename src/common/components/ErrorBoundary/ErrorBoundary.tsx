import React from 'react'
import { withTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import { ThemeContext } from '@common/contexts/themeContext'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

import AmbireLogoHorizontal from '../AmbireLogoHorizontal'
import Button from '../Button'
import Text from '../Text'

interface ErrorBoundaryState {
  hasError: boolean
}

interface Props {
  children: React.ReactNode
  t: (key: string) => string
}
class ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
  // eslint-disable-next-line react/static-property-placement
  static contextType = ThemeContext

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    const { hasError } = this.state
    const { children, t } = this.props
    // @ts-ignore
    const { theme } = this.context

    if (hasError) {
      return (
        <View
          style={[
            flexbox.flex1,
            flexbox.center,
            {
              backgroundColor: theme.secondaryBackground
            }
          ]}
        >
          <View
            style={[
              spacings.pvXl,
              spacings.ph2Xl,
              flexbox.alignCenter,
              common.borderRadiusPrimary,
              {
                backgroundColor: theme.primaryBackground,
                borderColor: theme.secondaryBorder,
                borderWidth: 1
              }
            ]}
          >
            <AmbireLogoHorizontal width={124} height={43} style={spacings.mbXl} />
            <Text
              fontSize={20}
              weight="medium"
              style={{
                maxWidth: 360,
                ...text.center,
                ...spacings.mbMd
              }}
            >
              {t('Something went wrong, but your funds are safe!')}
            </Text>
            <View
              style={{
                maxWidth: 296,
                marginHorizontal: 'auto'
              }}
            >
              <Text fontSize={14} style={[text.center, spacings.mbMd]}>
                {t('If the problem persists, please contact us via our')}
                <TouchableOpacity>
                  <Text fontSize={14} weight="medium" color={theme.primary}>
                    {' '}
                    {t('Help Center')}
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
            <Button
              style={{
                width: 200
              }}
              text={t('Reload')}
              onPress={() => window.location.reload()}
              hasBottomSpacing={false}
            />
          </View>
        </View>
      )
    }

    return children
  }
}

export default withTranslation()(React.memo(ErrorBoundary))
