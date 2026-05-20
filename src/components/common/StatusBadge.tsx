import type { ReactNode } from 'react'
import { Badge } from './Badge'
import type { BadgeTone } from './Badge'

type StatusBadgeProps = {
  children: ReactNode
  tone?: BadgeTone
}

export function StatusBadge({ children, tone = 'default' }: StatusBadgeProps) {
  return <Badge tone={tone}>{children}</Badge>
}
