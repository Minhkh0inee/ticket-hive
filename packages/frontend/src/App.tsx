import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { SessionExpiredDialog } from '@/components/common/SessionExpiredDialog'
import { MainLayout } from '@/components/layout/MainLayout'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedLayout } from '@/components/ProtectedLayout'
import { HomePage } from '@/pages/HomePage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ConfirmationPage } from '@/pages/ConfirmationPage'
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage'
import { PaymentCancelPage } from '@/pages/PaymentCancelPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { MyTicketsPage } from '@/pages/MyTicketsPage'

const AdminEventsPage = lazy(() =>
  import('@/pages/AdminEventsPage').then((m) => ({ default: m.AdminEventsPage })),
)

const AdminBookingsPage = lazy(() =>
  import('@/pages/AdminBookingsPage').then((m) => ({ default: m.AdminBookingsPage })),
)

const AdminSeatsPage = lazy(() =>
  import('@/pages/AdminSeatsPage').then((m) => ({ default: m.AdminSeatsPage })),
)

const AdminUsersPage = lazy(() =>
  import('@/pages/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })),
)

function AdminSpinner() {
  return (
    <div className="min-h-screen bg-[oklch(0.13_0_0)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[oklch(0.6_0.2_250)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="top-right" richColors />
      <SessionExpiredDialog />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
          </Route>
        </Route>

        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/events" replace />} />
            <Route
              path="/admin/events"
              element={
                <Suspense fallback={<AdminSpinner />}>
                  <AdminEventsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <Suspense fallback={<AdminSpinner />}>
                  <AdminBookingsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/events/:id/seats"
              element={
                <Suspense fallback={<AdminSpinner />}>
                  <AdminSeatsPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Suspense fallback={<AdminSpinner />}>
                  <AdminUsersPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
