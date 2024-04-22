import React from 'react'
import { Pressable, TouchableOpacity, View } from 'react-native'

import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

import AmbireLogoHorizontal from '../AmbireLogoHorizontal'
import Text from '../Text'

interface ErrorBoundaryState {
  hasError: boolean
}

interface Props {
  children: React.ReactNode
}

class ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
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
    const { children } = this.props

    if (hasError) {
      return (
        <View
          style={[
            flexbox.flex1,
            flexbox.center,
            {
              backgroundColor: '#F2F3FA'
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
                backgroundColor: '#FFFFFF',
                borderColor: '#CACDE6',
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
              Something went wrong, but your funds are safe!
            </Text>
            <View
              style={{
                maxWidth: 296,
                marginHorizontal: 'auto'
              }}
            >
              <Text fontSize={14} style={[text.center, spacings.mbMd]}>
                If the problem persists, please contact us via our
                <TouchableOpacity>
                  <Text fontSize={14} weight="medium" color="#6000FF">
                    {' '}
                    Help Center
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
            <Pressable
              style={({ hovered }: any) => ({
                backgroundColor: hovered ? '#8B3DFF' : '#6000FF',
                height: 56,
                width: 200,
                ...common.borderRadiusPrimary,
                ...flexbox.center
              })}
              onPress={() => {
                window.location.reload()
              }}
            >
              <Text fontSize={14} weight="medium" color="#fff">
                Reload
              </Text>
            </Pressable>
          </View>
        </View>
      )
    }

    return children
  }
}

export default ErrorBoundary
