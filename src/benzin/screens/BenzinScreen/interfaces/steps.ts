export type FinalizedStatusType = {
  status: 'confirmed' | 'dropped' | 'failed' | 'fetching'
  reason?: string
} | null

export type ActiveStepType = 'signed' | 'in-progress' | 'finalized'
