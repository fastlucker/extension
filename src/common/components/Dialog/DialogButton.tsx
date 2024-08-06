import Button, { Props as ButtonProps } from '@common/components/Button'

type Props = ButtonProps & Required<Pick<ButtonProps, 'text' | 'type'>>

const DialogButton = (props: Props) => (
  <Button
    hasBottomSpacing={false}
    style={{
      minWidth: 120
    }}
    size="small"
    {...props}
  />
)

export default DialogButton
