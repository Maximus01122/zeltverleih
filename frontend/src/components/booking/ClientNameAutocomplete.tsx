import { useEffect, useId, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Input } from '@/components/ui/input'
import { searchClients } from '@/lib/endpoints'
import { cn } from '@/lib/utils'
import type { ClientSuggestion } from '@/lib/types'

export interface ClientFormData {
  name: string
  email: string
  phoneNumber: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

interface ClientNameAutocompleteProps {
  value: string
  onChange: (name: string) => void
  onSelect: (client: ClientFormData) => void
}

export function ClientNameAutocomplete({ value, onChange, onSelect }: ClientNameAutocompleteProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(value.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [value])

  const { data: suggestions = [] } = useQuery({
    queryKey: ['client-search', debouncedQuery],
    queryFn: () => searchClients(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  })

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const showSuggestions = open && debouncedQuery.length >= 2 && suggestions.length > 0

  const pick = (client: ClientSuggestion) => {
    onSelect({
      name: client.name,
      email: client.email ?? '',
      phoneNumber: client.phoneNumber ?? '',
      street: client.street ?? '',
      houseNumber: client.houseNumber ?? '',
      postalCode: client.postalCode ?? '',
      city: client.city ?? '',
    })
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        role="combobox"
        aria-expanded={showSuggestions}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
      />
      {showSuggestions ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-popover py-1 text-sm shadow-md"
        >
          {suggestions.map((client) => (
            <li key={client.id} role="option">
              <button
                type="button"
                className={cn(
                  'flex w-full flex-col items-start px-3 py-2 text-left hover:bg-accent',
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(client)}
              >
                <span className="font-medium">{client.name}</span>
                <span className="text-xs text-muted-foreground">
                  {[client.customerNumber, client.email, client.city].filter(Boolean).join(' · ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
