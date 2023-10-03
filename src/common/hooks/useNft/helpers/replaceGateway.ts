import extractIpfsInfo from './extractIpfsInfo'

const replaceGateway = (url: string): string => {
  const { ipfsCid, ipfsPath } = extractIpfsInfo(url)

  return `https://ipfs.io/ipfs/${ipfsCid}/${ipfsPath}`
}

export default replaceGateway
