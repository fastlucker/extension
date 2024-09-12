export const INVITE_STORAGE_ITEM = {
  status: 'VERIFIED',
  verifiedAt: 1715332416400,
  verifiedCode: 'dummy-test-code'
}

export const TEST_ACCOUNT_NAMES = ['Test-Account-1', 'Test-Account-2']

export const INVITE_STATUS_VERIFIED = 'VERIFIED'
export const TEST_ID_ENTER_SEED_PHRASE_FIELD_PLACEHOLDER = 'Enter a private key'

// URLs
export const URL_GET_STARTED = '/tab.html#/get-started'
export const URL_ACCOUNT_SELECT = '/tab.html#/account-select'

// INVALID PRIV KEYS, SEEDS, ACCOUNT ADDRESSES
export const INVALID_SEEDS = [
  '00000 000000 00000 000000 00000 000000 00000 000000 00000 000000 00000 000000',
  'allow survey play weasel exhibit helmet industry bunker fish step garlic ababa'
]

export const INVALID_PRIV_KEYS = [
  '',
  '0000000000000000000000000000000000000000000000000000000000000000',
  '00390ce7b96835258b010e25f9196bf4ddbff575b7c102546e9e40780118018',
  '03#90ce7b96835258b019e25f9196bf4ddbff575b7c102546e9e40780118018'
]
export const INVALID_ACC_ADDRESS = '0xC254b41239582e45a2aCE62D5adD3F8092D4ea6C'

// ERROR MESSAGES
export const INVALID_PRIVATE_KEY_ERROR_MSG = 'Invalid private key.'
export const INVALID_SEED_PHRASE_ERROR_MSG =
  'Invalid Seed Phrase. Please review every field carefully.'
export const INVALID_CHECKSUM_ERROR_MSG = 'Invalid checksum. Verify the address and try again.'
export const INVALID_ADDRESS_OR_UD_DOMAIN_ERROR_MSG =
  'Please enter a valid address or ENS/UD domain'

// SUCCESS MESSAGES
export const SUCCESSFULLY_ADDED_2_ACCOUNTS_MSG = 'Successfully added 2 accounts'

export const SMART_ACC_VIEW_ONLY_ADDRESS = '0xC254b41be9582e45a2aCE62D5adD3F8092D4ea6C'
export const BASIC_ACC_VIEW_ONLY_ADDRESS = '0x048d8573402CE085A6c8f34d568eC2Ccc995196e'
export const VIEW_ONLY_LABEL = 'View-only'
