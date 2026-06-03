import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'

export function ProtectedLayout() {
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const profileLoading = useAppSelector((s) => s.auth.profileLoading)
  const user = useAppSelector((s) => s.auth.user)

  // Still resolving identity — render nothing so MainLayout stays visible without flash
  if (accessToken && profileLoading && !user) {
    return null
  }

  if (!accessToken || (accessToken && !profileLoading && !user)) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
