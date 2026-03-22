import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { MainLayout } from '@/components/layout/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { EventsPage } from '@/pages/EventsPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Auth routes — standalone, no header/footer */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Main layout routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
