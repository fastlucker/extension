export const PAGE_CONTEXT = 'pageContext'
export const CONTENT_SCRIPT = 'contentScript'
export const BACKGROUND = 'background'
export const PATHS = [PAGE_CONTEXT, CONTENT_SCRIPT, BACKGROUND]

// for verbosity in the console
// Could create a log func to avoid repeating console logs with long concats
export const RELAYER_VERBOSE_TAG = {
  [PAGE_CONTEXT]: '🖲️️',
  [CONTENT_SCRIPT]: '📺️',
  [BACKGROUND]: '🧬'
}
