import AaveLendingPoolV2 from './AaveLendingPoolV2'
import AmbireFactory from './AmbireFactory'
import AmbireIdentity from './AmbireIdentity'
import ERC20 from './ERC20'
import ERC721 from './ERC721'
import Movr from './Movr'
import UniRouters from './UniRouters'
import WETH from './WETH'
import YearnVault from './YearnVault'

const all = {
  ...UniRouters,
  ...AaveLendingPoolV2,
  ...ERC20,
  ...ERC721,
  ...WETH,
  ...AmbireIdentity,
  ...AmbireFactory,
  ...YearnVault,
  ...Movr
}
export default all
