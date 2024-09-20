import { ViewStyle } from 'react-native'

import Button, { Props as ButtonProps } from '@common/components/Button'

type Props = ButtonProps &
  Required<Pick<ButtonProps, 'text' | 'type'>> & {
    style?: ViewStyle
  }

const DialogButton = ({ style, ...rest }: Props) => (
  <Button
    {...rest}
    hasBottomSpacing={false}
    style={{
      ...(style || {}),
      minWidth: 120
    }}
    size="small"
  />
)

export default DialogButton
