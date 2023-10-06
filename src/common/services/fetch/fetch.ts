import {
  fetchCaught as commonFetchCaught,
  fetchGet as commonFetchGet,
  fetchPost as commonFetchPost
} from '@ambire-common-v1/services/fetch'

export const fetchPost = (url: string, body: any) => commonFetchPost(fetch, url, body)

export const fetchGet = (url: string) => commonFetchGet(fetch, url)

export const fetchCaught = (url: any, params?: any) => commonFetchCaught(fetch, url, params)
