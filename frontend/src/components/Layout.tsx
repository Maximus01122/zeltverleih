import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PlusCircle,
  Warehouse,
  X,
} from 'lucide-react'

import logo from '@/assets/logo.jpg'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/AuthContext'
import { unprocessedCount } from '@/lib/endpoints'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/anfragen', label: 'Anfragen', icon: ClipboardList, badge: true },
  { to: '/buchungen', label: 'Buchungen', icon: CalendarDays },
  { to: '/buchungen/neu', label: 'Neue Buchung', icon: PlusCircle },
  { to: '/lager', label: 'Lager', icon: Warehouse },
  { to: '/materialien', label: 'Materialien', icon: Package },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

function SidebarNav({
  openCount,
  onNavigate,
}: {
  openCount?: number
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {NAV.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/buchungen'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground',
            )
          }
        >
          <span className="flex items-center gap-3">
            <Icon className="h-4 w-4" />
            {label}
          </span>
          {badge && openCount && openCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground">
              {openCount}
            </span>
          ) : null}
        </NavLink>
      ))}
    </nav>
  )
}

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 border-b px-6 py-5">
      <img src={logo} alt="Zeltverleih Erfurt" className="h-11 w-11 rounded object-contain" />
      <div className="leading-tight">
        <div className="text-sm font-semibold text-primary">Zeltverleih</div>
        <div className="text-xs text-muted-foreground">Erfurt · Verwaltung</div>
      </div>
    </div>
  )
}

export function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: openCount } = useQuery({
    queryKey: ['anfragen', 'count'],
    queryFn: unprocessedCount,
    refetchInterval: 60_000,
  })

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-card md:flex">
        <SidebarBrand />
        <SidebarNav openCount={openCount?.count} />
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Navigation schließen"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      ) : null}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Zeltverleih Erfurt" className="h-10 w-10 rounded object-contain" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-primary">Zeltverleih</div>
              <div className="text-xs text-muted-foreground">Erfurt · Verwaltung</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closeMobile} aria-label="Menü schließen">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarNav openCount={openCount?.count} onNavigate={closeMobile} />
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={() => {
              closeMobile()
              void handleLogout()
            }}
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-card px-4 py-3 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Menü öffnen">
            <Menu className="h-5 w-5" />
          </Button>
          <img src={logo} alt="" className="h-8 w-8 rounded object-contain" />
          <span className="truncate text-sm font-semibold text-primary">
            {[...NAV]
              .sort((a, b) => b.to.length - a.to.length)
              .find(
                ({ to }) =>
                  location.pathname === to ||
                  (to !== '/buchungen' && location.pathname.startsWith(`${to}/`)),
              )?.label ?? 'Verwaltung'}
          </span>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
