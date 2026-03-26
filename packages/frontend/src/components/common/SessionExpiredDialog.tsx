import { useNavigate } from 'react-router-dom'
import { LogIn, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { logout } from '@/stores/slices/auth.slice'

export function SessionExpiredDialog() {
  const sessionExpired = useAppSelector((s) => s.auth.sessionExpired)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function handleReLogin() {
    dispatch(logout())
    navigate('/login')
  }

  function handleReload() {
    window.location.reload()
  }

  return (
    <Dialog open={sessionExpired}>
      <DialogContent
        className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] text-white max-w-sm rounded-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-base font-bold">
            Phiên đăng nhập đã hết hạn
          </DialogTitle>
          <DialogDescription className="text-[oklch(0.5_0_0)] text-sm mt-1">
            Phiên của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)]">
          <Button
            onClick={handleReLogin}
            className="w-full bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white gap-2"
          >
            <LogIn size={15} aria-hidden="true" />
            Đăng nhập lại
          </Button>
          <Button
            onClick={handleReload}
            className="w-full bg-[oklch(0.24_0_0)] hover:bg-[oklch(0.28_0_0)] text-white border border-[oklch(0.32_0_0)] gap-2"
          >
            <RefreshCw size={15} aria-hidden="true" />
            Tải lại trang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
