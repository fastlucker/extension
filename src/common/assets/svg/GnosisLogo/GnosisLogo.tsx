import React from 'react'
import Svg, { G, Path, SvgProps } from 'react-native-svg'

interface Props extends SvgProps {
  width?: number
  height?: number
}

const GnosisLogo: React.FC<Props> = ({ width = 32, height = 32, ...rest }) => (
  <Svg width={width} height={height} viewBox="0 0 32 32" {...rest}>
    <Path
      fill="#00a6c4"
      d="M12.29 17.248a2.342 2.342 0 0 0 1.43-.488l-3.28-3.28a2.343 2.343 0 0 0 .421 3.285 2.374 2.374 0 0 0 1.43.484Z"
    />
    <Path
      fill="#00a6c4"
      d="M22.048 14.906a2.342 2.342 0 0 0-.488-1.43l-3.28 3.28a2.338 2.338 0 0 0 3.768-1.851Z"
    />
    <Path
      fill="#00a6c4"
      d="m23.7 11.336-1.451 1.451a3.305 3.305 0 0 1-4.656 4.656L16 19.036l-1.59-1.59a3.305 3.305 0 0 1-4.656-4.656l-.744-.744-.71-.71a9 9 0 1 0 15.4 0Z"
    />
    <Path
      fill="#00a6c4"
      d="M22.511 9.786a9 9 0 0 0-12.718-.3q-.158.151-.3.3a9.544 9.544 0 0 0-.631.736l7.141 7.146 7.141-7.146a8.7 8.7 0 0 0-.633-.736Zm-6.51-1.611a7.736 7.736 0 0 1 5.535 2.292L16 16.004l-5.534-5.535A7.736 7.736 0 0 1 16 8.177Z"
    />
  </Svg>
)

export default GnosisLogo
