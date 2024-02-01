interface ReturnInterface {
  ipfsCid: string
  ipfsPath: string
}

function extractIpfsInfo(url: string): ReturnInterface {
  let ipfsCid = ''
  let ipfsPath = ''

  // Condition 1: Through an HTTP gateway https://ipfs.io/ipfs/<cid>/<path>
  const httpGatewayRegex = /https?:\/\/[^/]+\/ipfs\/([^/]+)\/(.+)/
  const httpGatewayMatch = url.match(httpGatewayRegex)
  if (httpGatewayMatch) {
    ipfsCid = httpGatewayMatch[1]
    ipfsPath = httpGatewayMatch[2]
    return { ipfsCid, ipfsPath }
  }

  // Condition 2: Through the gateway subdomain https://<cid>.ipfs.<tld>/<path>
  const gatewaySubdomainRegex = /https?:\/\/([^.]+)\.ipfs\.[^/]+\/(.+)/
  const gatewaySubdomainMatch = url.match(gatewaySubdomainRegex)
  if (gatewaySubdomainMatch) {
    ipfsCid = gatewaySubdomainMatch[1]
    ipfsPath = gatewaySubdomainMatch[2]
    return { ipfsCid, ipfsPath }
  }

  // Condition 3: Custom URL protocols (ipfs://, ipns://, dweb:/)
  const customProtocolRegex = /(ipfs|ipns|dweb):\/\/([^/]+)\/(.+)/
  const customProtocolMatch = url.match(customProtocolRegex)
  if (customProtocolMatch) {
    ipfsCid = customProtocolMatch[2]
    ipfsPath = customProtocolMatch[3]
    return { ipfsCid, ipfsPath }
  }

  // Condition 4: Custom URL protocols (ipfs://, ipns://, dweb:/)
  const customProtocolOnlyCidRegex = /(ipfs|ipns|dweb):\/\/([^/]+)/
  const customProtocolOnlyCidMatch = url.match(customProtocolOnlyCidRegex)
  if (customProtocolOnlyCidMatch) {
    ipfsCid = customProtocolOnlyCidMatch[2]
    return { ipfsCid, ipfsPath: '' }
  }

  // Condition 5: Special dweb.link format https://<cid>.ipfs.dweb.link/<path>
  const dwebLinkRegex = /https?:\/\/([^.]+)\.ipfs\.dweb\.link\/(.+)/
  const dwebLinkMatch = url.match(dwebLinkRegex)
  if (dwebLinkMatch) {
    ipfsCid = dwebLinkMatch[1]
    ipfsPath = dwebLinkMatch[2]
    return { ipfsCid, ipfsPath }
  }

  return { ipfsCid, ipfsPath }
}

export default extractIpfsInfo
