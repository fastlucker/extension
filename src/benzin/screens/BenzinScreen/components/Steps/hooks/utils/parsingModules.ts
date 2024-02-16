import { HumanizerParsingModule } from '@ambire-common/libs/humanizer/interfaces'
import { humanizerMetaParsing } from '@ambire-common/libs/humanizer/parsers/humanizerMetaParsing'

const parsingModules: HumanizerParsingModule[] = [humanizerMetaParsing]

export default parsingModules
