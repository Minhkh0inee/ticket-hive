import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'

function Spinner() {
  return (
    <div className="min-h-screen bg-[oklch(0.13_0_0)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[oklch(0.6_0.2_250)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function AdminGuard() {
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const user = useAppSelector((s) => s.auth.user)
  const profileLoading = useAppSelector((s) => s.auth.profileLoading)

  if (accessToken && profileLoading && !user) {
    return <Spinner />
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
