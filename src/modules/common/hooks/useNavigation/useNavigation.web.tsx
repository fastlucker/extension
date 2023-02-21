import { useNavigate } from 'react-router-dom'

type Options = {
  state?: {
    [key: string]: any
  }
  replace?: boolean
  preventScrollReset?: boolean
  relative?: 'route' | 'path'
}

const useNavigation = () => {
  const nav: any = useNavigate()

  const navigate = (url: string, options?: Options) => {
    return nav(url, options)
  }

  const setOptions = () => {}

  return {
    navigate,
    setOptions
  }
}

export default useNavigation
