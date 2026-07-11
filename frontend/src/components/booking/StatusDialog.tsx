import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { changeBookingStatus } from '@/lib/endpoints'
import { ApiError } from '@/lib/api'
import { BOOKING_STATUS, BOOKING_STATUS_ORDER } from '@/lib/status'
import type { BookingStatus } from '@/lib/types'

export function StatusDialog({
  bookingId,
  current,
  open,
  onOpenChange,
}: {
  bookingId: number
  current: BookingStatus
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<BookingStatus>(current)
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    try {
      await changeBookingStatus(bookingId, status)
      toast.success('Status aktualisiert.')
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Status konnte nicht geändert werden.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Status ändern</DialogTitle>
        </DialogHeader>
        <Select value={status} onValueChange={(v) => setStatus(v as BookingStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BOOKING_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s}>
                {BOOKING_STATUS[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Abbrechen
          </Button>
          <Button onClick={save} disabled={busy}>
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
