import EmailVaultIcon from '@common/assets/svg/EmailVaultIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'

const options = [
  {
    title: 'Email Vault',
    text: "Select this option to access the Smart Account(s) you've previously added to your Email Vault.",
    image: EmailVaultIcon,
    buttonText: 'Log in',
    flow: 'TODO-EMAIL-VAULT', // @TODO
    isDisabled: true
  },
  {
    testID: 'button-import-private-key',
    title: 'Private Key',
    text: 'Select this option to import your Basic or Smart account(s) by entering their Private Key.',
    image: PrivateKeyIcon,
    buttonText: 'Import',
    flow: 'private-key'
  },
  {
    testID: 'button-proceed-seed-phrase',
    title: 'Seed Phrase',
    text: 'Select this option to import your Basic or Smart account(s) by entering their Seed Phrase.',
    image: SeedPhraseIcon,
    buttonText: 'Proceed',
    flow: 'seed'
  }
]

export default options
