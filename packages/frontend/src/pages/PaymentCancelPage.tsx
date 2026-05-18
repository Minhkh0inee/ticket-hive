import { useSearchParams, useNavigate } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[oklch(0.13_0_0)] flex items-center justify-center px-4">
      <Card className="bg-[oklch(0.19_0_0)] border-[oklch(0.26_0_0)] text-white w-full max-w-md">
        <CardContent className="pt-10 pb-8 flex flex-col items-center text-center space-y-5">

          <div className="w-16 h-16 rounded-full bg-[oklch(0.22_0.05_25)] flex items-center justify-center">
            <XCircle size={36} className="text-[oklch(0.65_0.18_25)]" />
          </div>

          <div className="space-y-1">
            <h1 className="text-white font-bold text-xl">Thanh toán bị huỷ</h1>
            <p className="text-[oklch(0.55_0_0)] text-sm">
              Giao dịch của bạn đã bị huỷ. Ghế sẽ được giải phóng.
            </p>
          </div>

          {bookingId && (
            <>
              <Separator className="bg-[oklch(0.26_0_0)] w-full" />
              <div className="w-full space-y-1">
                <p className="text-[oklch(0.5_0_0)] text-xs uppercase tracking-wider font-semibold">
                  Mã đặt vé
                </p>
                <p className="text-[oklch(0.55_0_0)] font-mono text-sm tracking-widest">
                  {bookingId.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </>
          )}

          <Separator className="bg-[oklch(0.26_0_0)] w-full" />

          <Button
            onClick={() => navigate('/events')}
            className="w-full h-10 rounded-xl font-semibold text-sm bg-[oklch(0.6_0.2_250)] hover:bg-[oklch(0.54_0.2_250)] text-white"
          >
            Xem sự kiện khác
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full h-10 text-[oklch(0.55_0_0)] hover:text-white text-sm"
          >
            Về trang chủ
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
