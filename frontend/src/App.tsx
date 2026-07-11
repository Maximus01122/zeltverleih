import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '@/auth/AuthContext'
import { Layout } from '@/components/Layout'
import { LoginPage } from '@/pages/LoginPage'
import { AnfragenPage } from '@/pages/AnfragenPage'
import { BuchungenPage } from '@/pages/BuchungenPage'
import { BuchungDetailPage } from '@/pages/BuchungDetailPage'
import { BuchungWizardPage } from '@/pages/BuchungWizardPage'
import { LagerPage } from '@/pages/LagerPage'
import { MaterialienPage } from '@/pages/MaterialienPage'
import { DashboardPage } from '@/pages/DashboardPage'

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/buchungen" replace />} />
        <Route path="/anfragen" element={<AnfragenPage />} />
        <Route path="/buchungen" element={<BuchungenPage />} />
        <Route path="/buchungen/neu" element={<BuchungWizardPage />} />
        <Route path="/buchungen/:id" element={<BuchungDetailPage />} />
        <Route path="/buchungen/:id/bearbeiten" element={<BuchungWizardPage />} />
        <Route path="/lager" element={<LagerPage />} />
        <Route path="/materialien" element={<MaterialienPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/buchungen" replace />} />
    </Routes>
  )
}
