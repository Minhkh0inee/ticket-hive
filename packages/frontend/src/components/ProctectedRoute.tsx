import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { fetchProfileRequest } from '@/stores/slices/auth.slice'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.auth.accessToken)
  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(fetchProfileRequest())
    }
  }, [accessToken, user, dispatch])

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}