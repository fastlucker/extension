const INPUT_FIELDS = [
  {
    name: 'name',
    label: 'Network Name',
    editable: false,
    rules: {
      required: 'Field is required',
      minLength: 1
    }
  },
  {
    name: 'rpcUrl',
    label: 'RPC URL',
    editable: true,
    rules: {
      required: 'Field is required'
    }
  },
  {
    name: 'chainId',
    label: 'Chain ID',
    editable: false,
    rules: {
      required: 'Field is required'
    }
  },
  {
    name: 'nativeAssetSymbol',
    label: 'Currency Symbol',
    editable: false,
    rules: {
      required: 'Field is required'
    }
  },
  {
    name: 'explorerUrl',
    label: 'Block Explorer URL',
    editable: true,
    rules: {
      required: 'Field is required',
      validate: (value: string) => {
        if (!value) return 'URL cannot be empty'

        try {
          const url = new URL(value)

          return url.protocol === 'https:' ? undefined : 'URL must start with https://'
        } catch {
          return 'Invalid URL'
        }
      }
    }
  }
]

export default INPUT_FIELDS
