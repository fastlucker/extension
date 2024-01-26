import { HumanizerCallModule } from '@ambire-common/libs/humanizer/interfaces'
import { aaveHumanizer } from '@ambire-common/libs/humanizer/modules/Aave'
import { fallbackHumanizer } from '@ambire-common/libs/humanizer/modules/fallBackHumanizer'
import { gasTankModule } from '@ambire-common/libs/humanizer/modules/gasTankModule'
import { privilegeHumanizer } from '@ambire-common/libs/humanizer/modules/privileges'
import { sushiSwapModule } from '@ambire-common/libs/humanizer/modules/sushiSwapModule'
import {
  genericErc20Humanizer,
  genericErc721Humanizer
} from '@ambire-common/libs/humanizer/modules/tokens'
import { uniswapHumanizer } from '@ambire-common/libs/humanizer/modules/Uniswap'
import { WALLETModule } from '@ambire-common/libs/humanizer/modules/WALLET'
import { wrappingModule } from '@ambire-common/libs/humanizer/modules/wrapped'
import { yearnVaultModule } from '@ambire-common/libs/humanizer/modules/yearnTesseractVault'

const humanizerModules: HumanizerCallModule[] = [
  genericErc20Humanizer,
  genericErc721Humanizer,
  gasTankModule,
  uniswapHumanizer,
  wrappingModule,
  aaveHumanizer,
  WALLETModule,
  privilegeHumanizer,
  yearnVaultModule,
  sushiSwapModule,
  fallbackHumanizer
]

export default humanizerModules
