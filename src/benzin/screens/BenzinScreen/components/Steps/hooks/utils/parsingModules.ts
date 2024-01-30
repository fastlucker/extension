import { HumanizerParsingModule } from '@ambire-common/libs/humanizer/interfaces'
import { tokenParsing } from '@ambire-common/libs/humanizer/parsers/tokenParsing'

const parsingModules: HumanizerParsingModule[] = [tokenParsing]

export default parsingModules
