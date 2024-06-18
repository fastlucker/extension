export type FinalizedStatusType = {
  status: 'confirmed' | 'dropped' | 'rejected' | 'failed' | 'fetching'
  reason?: string
} | null

export type ActiveStepType = 'signed' | 'in-progress' | 'finalized'
