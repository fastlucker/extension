import React from 'react'
import { View, ViewStyle } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Alert from '@common/components/Alert'
import { Toast as ToastType } from '@common/contexts/toastContext'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { TAB_CONTENT_WIDTH } from '@web/constants/spacings'
import { AnimatedPressable, useMultiHover } from '@web/hooks/useHover'
import { getUiType } from '@web/utils/uiType'

const { isPopup } = getUiType()

const TOAST_CLOSE_BACKGROUND_COLOR = {
  success: '#0186491A',
  error: '#EA01291A',
  warning: '#CA7E041A',
  info: '#6000FF1A'
}

const ANIMATION_VALUES: {
  property: keyof ViewStyle
  from: number
  to: number
}[] = [
  {
    property: 'width',
    from: 20,
    to: 32
  },
  {
    property: 'height',
    from: 20,
    to: 32
  },
  {
    property: 'top',
    from: 0.5,
    to: -5.5
  },
  {
    property: 'right',
    from: 0.5,
    to: -5.5
  }
]

const Toast = ({
  text,
  type = 'success',
  id,
  removeToast,
  isTypeLabelHidden
}: ToastType & {
  removeToast: (id: number) => void
}) => {
  const { theme } = useTheme()

  const [bindAnim, animStyle] = useMultiHover({
    values: ANIMATION_VALUES
  })

  return (
    <View
      style={{
        maxWidth: TAB_CONTENT_WIDTH,
        width: '100%',
        ...common.borderRadiusPrimary,
        ...spacings.mbTy,
        ...common.shadowSecondary
      }}
      testID={`${type}-${id}`}
    >
      <Alert
        size={isPopup ? 'sm' : 'md'}
        title={text}
        type={type}
        style={{ borderWidth: 2 }}
        isTypeLabelHidden={isTypeLabelHidden}
      >
        <AnimatedPressable
          {...bindAnim}
          style={{
            ...flexbox.center,
            position: 'absolute',
            right: 0,
            backgroundColor: TOAST_CLOSE_BACKGROUND_COLOR[type],
            borderRadius: 16,
            ...animStyle
          }}
          onPress={() => removeToast(id)}
        >
          <CloseIcon width={8} height={8} color={theme[`${type}Decorative`]} strokeWidth="2.5" />
        </AnimatedPressable>
      </Alert>
    </View>
  )
}

export default Toast
