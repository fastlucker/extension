const handleCollectibleUri = (uri: string) => {
  let imageUri = uri
  if (!imageUri) return ''
  imageUri = uri.startsWith('data:application/json')
    ? imageUri.replace('data:application/json;utf8,', '')
    : imageUri

  if (imageUri.split('/').length === 1) return `https://ipfs.io/ipfs/${imageUri}`
  if (imageUri.split('/')[0] === 'data:image') return imageUri
  if (imageUri.startsWith('ipfs://'))
    return imageUri.replace(/ipfs:\/\/ipfs\/|ipfs:\/\//g, 'https://ipfs.io/ipfs/')
  if (imageUri.split('/')[2].endsWith('mypinata.cloud'))
    return `https://ipfs.io/ipfs/${imageUri.split('/').slice(4).join('/')}`

  return imageUri
}

export default handleCollectibleUri
