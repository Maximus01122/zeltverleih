import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: string[]
  current: number
  onStepClick?: (index: number) => void
}) {
  return (
    <ol className="mb-8 flex items-center gap-2">
      {steps.map((label, index) => {
        const done = index < current
        const active = index === current
        const clickable = onStepClick != null

        const stepContent = (
          <>
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                done && 'border-primary bg-primary text-primary-foreground',
                active && 'border-primary text-primary',
                !done && !active && 'border-border text-muted-foreground',
              )}
            >
              {done ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={cn(
                'hidden text-sm sm:inline',
                active ? 'font-medium text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </>
        )

        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            {clickable ? (
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className={cn(
                  'flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-left transition-colors',
                  'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active && 'cursor-default',
                )}
                aria-current={active ? 'step' : undefined}
              >
                {stepContent}
              </button>
            ) : (
              <div className="flex items-center gap-2">{stepContent}</div>
            )}
            {index < steps.length - 1 ? (
              <div className="mx-1 h-px flex-1 bg-border" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
