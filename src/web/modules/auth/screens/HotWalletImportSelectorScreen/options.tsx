import EmailVaultIcon from '@common/assets/svg/EmailVaultIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'

const options = [
  {
    testID: 'button-proceed-seed-phrase',
    title: 'Seed Phrase',
    text: 'Select this option to create/import your Basic or Smart account(s) by using a seed phrase.',
    image: SeedPhraseIcon,
    buttonText: 'Proceed',
    flow: 'seed'
  },
  {
    testID: 'button-import-private-key',
    title: 'Private Key',
    text: 'Select this option to import your Basic or Smart account(s) by entering their private key.',
    image: PrivateKeyIcon,
    buttonText: 'Import',
    flow: 'private-key'
  },
  {
    title: 'Email Vault',
    text: "Select this option to access the Smart Account(s) you've previously added to your Email Vault.",
    image: EmailVaultIcon,
    buttonText: 'Log in',
    flow: 'TODO-EMAIL-VAULT', // @TODO
    isDisabled: true
  }
]

export default options
