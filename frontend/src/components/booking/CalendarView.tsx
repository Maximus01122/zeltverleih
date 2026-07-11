import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { de } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { listBookings } from '@/lib/endpoints'
import { BOOKING_STATUS, BOOKING_STATUS_ORDER } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { BookingSummary } from '@/lib/types'

const WEEK_OPTS = { weekStartsOn: 1 } as const
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function parseIso(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

interface Segment {
  booking: BookingSummary
  colStart: number
  span: number
  lane: number
  roundLeft: boolean
  roundRight: boolean
}

/** Greedy lane packing so overlapping bookings stack within a week. */
function layoutWeek(weekStart: Date, weekEnd: Date, bookings: BookingSummary[]): Segment[] {
  const candidates = bookings
    .map((booking) => ({ booking, start: parseIso(booking.startDate), end: parseIso(booking.endDate) }))
    .filter((b) => b.end >= weekStart && b.start <= weekEnd)
    .sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime())

  const laneEnds: number[] = []
  const segments: Segment[] = []

  for (const { booking, start, end } of candidates) {
    const segStart = start < weekStart ? weekStart : start
    const segEnd = end > weekEnd ? weekEnd : end
    const colStart = differenceInCalendarDays(segStart, weekStart) + 1
    const span = differenceInCalendarDays(segEnd, segStart) + 1

    let lane = laneEnds.findIndex((endCol) => endCol < colStart)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(0)
    }
    laneEnds[lane] = colStart + span - 1

    segments.push({
      booking,
      colStart,
      span,
      lane,
      roundLeft: start >= weekStart,
      roundRight: end <= weekEnd,
    })
  }
  return segments
}

export function CalendarView({ onSelect }: { onSelect: (id: number) => void }) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()))

  const gridStart = startOfWeek(startOfMonth(month), WEEK_OPTS)
  const gridEnd = endOfWeek(endOfMonth(month), WEEK_OPTS)

  const { data: bookings } = useQuery({
    queryKey: ['bookings', 'calendar', format(gridStart, 'yyyy-MM-dd'), format(gridEnd, 'yyyy-MM-dd')],
    queryFn: () =>
      listBookings(format(gridStart, 'yyyy-MM-dd'), format(gridEnd, 'yyyy-MM-dd')),
  })

  const weeks = useMemo(() => {
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
    const result: Date[][] = []
    for (let i = 0; i < days.length; i += 7) result.push(days.slice(i, i + 7))
    return result
  }, [gridStart, gridEnd])

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {format(month, 'MMMM yyyy', { locale: de })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setMonth(startOfMonth(new Date()))}>
            Heute
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMonth((m) => addMonths(m, -1))}
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            aria-label="Nächster Monat"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-l border-t text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((d) => (
          <div key={d} className="border-b border-r px-2 py-1.5">
            {d}
          </div>
        ))}
      </div>

      <div className="border-l">
        {weeks.map((week, wi) => {
          const weekStart = week[0]
          const weekEnd = week[6]
          const segments = layoutWeek(weekStart, weekEnd, bookings ?? [])
          const laneCount = Math.max(1, ...segments.map((s) => s.lane + 1))
          return (
            <div
              key={wi}
              className="grid grid-cols-7"
              style={{ gridTemplateRows: `auto repeat(${laneCount}, 1.5rem) 0.25rem` }}
            >
              {week.map((day, di) => (
                <div
                  key={di}
                  className={cn(
                    'border-b border-r',
                    !isSameMonth(day, month) && 'bg-muted/40',
                  )}
                  style={{ gridColumn: di + 1, gridRow: `1 / -1` }}
                />
              ))}

              {week.map((day, di) => (
                <div
                  key={`n-${di}`}
                  className={cn(
                    'px-2 py-1 text-right text-xs',
                    isSameMonth(day, month) ? 'text-foreground' : 'text-muted-foreground/60',
                  )}
                  style={{ gridColumn: di + 1, gridRow: 1 }}
                >
                  <span
                    className={cn(
                      isToday(day) &&
                        'inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground',
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
              ))}

              {segments.map((seg) => (
                <button
                  key={`${seg.booking.id}-${seg.lane}`}
                  type="button"
                  onClick={() => onSelect(seg.booking.id)}
                  title={`${seg.booking.clientName} · ${BOOKING_STATUS[seg.booking.status].label}`}
                  className={cn(
                    'z-10 mx-0.5 truncate px-1.5 text-left text-xs font-medium leading-6 transition-colors',
                    BOOKING_STATUS[seg.booking.status].bar,
                    seg.roundLeft && 'ml-1 rounded-l',
                    seg.roundRight && 'mr-1 rounded-r',
                  )}
                  style={{
                    gridColumn: `${seg.colStart} / span ${seg.span}`,
                    gridRow: seg.lane + 2,
                  }}
                >
                  {seg.booking.clientName}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {BOOKING_STATUS_ORDER.map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn('h-3 w-3 rounded-sm', BOOKING_STATUS[s].bar.split(' ')[0])} />
            {BOOKING_STATUS[s].label}
          </div>
        ))}
      </div>
    </Card>
  )
}
