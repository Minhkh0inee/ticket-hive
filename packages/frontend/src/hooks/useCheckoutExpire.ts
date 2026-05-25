import { useEffect, useRef } from "react"
import { useCountdown } from "./useCountDown"
import { toast } from "sonner"

export function useCheckoutExpiry(lockExpiresAt: string) {
  const { secondsLeft, isExpired } = useCountdown(lockExpiresAt)
  const warnedRef = useRef(false)

  useEffect(() => {
    if (secondsLeft <= 120 && secondsLeft > 0 && !warnedRef.current) {
      warnedRef.current = true
      toast.warning('Ghế sắp hết hạn giữ — còn 2 phút!')
    }
  }, [secondsLeft])

  return { isExpired }  // Chỉ expose isExpired, không expose secondsLeft
}