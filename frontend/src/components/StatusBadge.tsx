import { Badge } from '@/components/ui/badge'
import { BOOKING_STATUS } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/lib/types'

export function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS[status]
  return (
    <Badge variant="outline" className={cn('border', meta.badge)}>
      {meta.label}
    </Badge>
  )
}
