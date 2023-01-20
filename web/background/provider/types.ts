export type ProviderRequest<TMethod = string> = {
  data: {
    method: TMethod
    params?: any
    $ctx?: any
  }
  session?: {
    name: string
    origin: string
    icon: string
  } | null
  origin?: string
  requestedApproval?: boolean
}
