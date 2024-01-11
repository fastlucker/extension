import EmailVaultIcon from '@common/assets/svg/EmailVaultIcon'
import PrivateKeyIcon from '@common/assets/svg/PrivateKeyIcon'
import SeedPhraseIcon from '@common/assets/svg/SeedPhraseIcon'

const options = [
  {
    title: 'Email Vault',
    text: "Select this option to access the Smart Account(s) you've previously added to your Email Vault.",
    image: () => <EmailVaultIcon height={80} />,
    buttonText: 'Log in',
    flow: 'TODO-EMAIL-VAULT', // @TODO
    isDisabled: true
  },
  {
    title: 'Private Key',
    text: 'Select this option to import your Basic or Smart account(s) by entering their Private Key.',
    image: () => <PrivateKeyIcon height={80} />,
    buttonText: 'Import',
    flow: 'private-key'
  },
  {
    title: 'Seed Phrase',
    text: 'Select this option to import your Basic or Smart account(s) by entering their Seed Phrase.',
    image: () => <SeedPhraseIcon height={80} />,
    buttonText: 'Proceed',
    flow: 'seed'
  }
]

export default options
