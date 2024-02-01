import extractIpfsInfo from './extractIpfsInfo'

const getUrlWithIpfsGateway = (url: string): string => {
  const { ipfsCid, ipfsPath } = extractIpfsInfo(url)

  if (!ipfsCid && !ipfsPath) return url

  return `https://ipfs.io/ipfs/${ipfsCid}${ipfsPath ? `/${ipfsPath}` : ''}`
}

export default getUrlWithIpfsGateway
