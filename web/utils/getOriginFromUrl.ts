export const getOriginFromUrl = (url: string) => {
  const urlObj = new URL(url)
  return urlObj.origin
}

export default getOriginFromUrl
