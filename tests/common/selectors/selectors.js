import { buildSelector } from '../../common-helpers/buildSelector'

export const TEST_IDS = {
  account: 'account',
  importBtn: 'import-button',
  importPrivateBtn: 'button-import-private-key',
  saveAndContinueBtn: 'button-save-and-continue',
  enterSeedPhraseField: 'enter-seed-phrase-field',
  buttonProceedSeedPhrase: 'button-proceed-seed-phrase',
  doNotSaveSeedBtn: 'do-not-save-seed-button',
  getStartedBtnImport: 'get-started-button-import',
  enterPassField: 'enter-pass-field',
  repeatPassField: 'repeat-pass-field',
  keystoreBtnCreate: 'keystore-button-create',
  keystoreBtnContinue: 'keystore-button-continue',
  editBtnForEditNameField: 'edit-btn-for-edit-name-field',
  editFieldNameField: 'edit-name-field'
}

export const SELECTORS = Object.fromEntries(
  Object.entries(TEST_IDS).map(([key, value]) => [key, buildSelector(value)])
)
