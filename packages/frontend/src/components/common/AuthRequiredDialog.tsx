import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

interface AuthRequiredDialogProps {
  open: boolean
  onClose: () => void
}

export function AuthRequiredDialog({ open, onClose }: AuthRequiredDialogProps) {
  const navigate = useNavigate()

  function handleLogin() {
    navigate('/login')
    onClose()
  }

  function handleRegister() {
    navigate('/register')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="bg-[oklch(0.19_0_0)] border border-[oklch(0.26_0_0)] text-white max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-base font-bold">
            Yêu cầu đăng nhập
          </DialogTitle>
          <DialogDescription className="text-[oklch(0.5_0_0)] text-sm mt-1">
            Bạn cần đăng nhập để đặt ghế. Vui lòng đăng nhập hoặc tạo tài khoản mới.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] px-4 pb-4">
          <Button
            onClick={handleLogin}
            className="w-full bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white gap-2"
          >
            <LogIn size={15} aria-hidden="true" />
            Đăng nhập
          </Button>
          <Button
            onClick={handleRegister}
            className="w-full bg-[oklch(0.24_0_0)] hover:bg-[oklch(0.28_0_0)] text-white border border-[oklch(0.32_0_0)] gap-2"
          >
            <UserPlus size={15} aria-hidden="true" />
            Tạo tài khoản
          </Button>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="w-full text-[oklch(0.55_0_0)] hover:text-white hover:bg-[oklch(0.22_0_0)]"
            >
              Để sau
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
