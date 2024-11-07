export interface UserOperation {
  sender: string
  callData: string
  hashStatus: 'found' | 'not_found'
  paymaster?: string
}
