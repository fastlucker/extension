import extractIpfsInfo from './extractIpfsInfo'

const getImageUrlFromAmbireCdn = (uri: string) => {
  const imageUri = uri

  const { ipfsCid, ipfsPath } = extractIpfsInfo(imageUri)

  if (!imageUri || (!ipfsCid && !ipfsPath)) return ''

  if (uri.startsWith('data:image')) return imageUri

  return `https://nftcdn.ambire.com/proxy?url=ipfs://${ipfsCid}${ipfsPath ? `/${ipfsPath}` : ''}`
}

export default getImageUrlFromAmbireCdn
