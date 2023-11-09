const handleCollectibleUri = (uri: string) => {
  let imageUri = uri
  if (!imageUri) return ''
  imageUri = uri.startsWith('data:application/json')
    ? imageUri.replace('data:application/json;utf8,', '')
    : imageUri

  if (imageUri.split('/')[0] === 'data:image') return imageUri
  if (imageUri.split('/')[2].endsWith('mypinata.cloud'))
    return `https://nftcdn.ambire.com/proxy?url=ipfs://${imageUri.split('/').slice(4).join('/')}`

  return `https://nftcdn.ambire.com/proxy?url=${imageUri}`
}

export default handleCollectibleUri
