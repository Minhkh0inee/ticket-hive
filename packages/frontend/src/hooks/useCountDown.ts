import { useEffect, useState } from "react"

export function useCountdown(lockExpiresAt: string | null) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (!lockExpiresAt) return 0
    return Math.max(0, Math.floor((new Date(lockExpiresAt).getTime() - Date.now()) / 1000))
  })

  useEffect(() => {
    if (!lockExpiresAt) return
    const interval = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((new Date(lockExpiresAt).getTime() - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(interval)
  }, [lockExpiresAt])

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')
  return { secondsLeft, display: `${mins}:${secs}`, isExpired: secondsLeft === 0 }
}