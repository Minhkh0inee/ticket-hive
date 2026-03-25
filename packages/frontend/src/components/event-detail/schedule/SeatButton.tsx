interface SeatButtonProps {
  seatId: string
  number: number
  label: string
  status: string
  isLocked: boolean
  isCurrentSection: boolean
  isSelected: boolean
  isMaxed: boolean
  color: string
  onClick: (seatId: string, isSelected: boolean) => void
}

export function SeatButton({
  seatId, number, status, isLocked,
  isCurrentSection, isSelected, isMaxed, color, onClick
}: SeatButtonProps) {
  const isBooked = status === 'booked'
  const isDisabledSection = !isCurrentSection
  const disabled = isDisabledSection || isBooked || isLocked || isMaxed

  return (
    <button
      onClick={() => !disabled && onClick(seatId, isSelected)}
      disabled={disabled}
      aria-pressed={isSelected}
      className={[
        'w-7 h-7 rounded text-[10px] font-bold transition-all duration-150',
        isDisabledSection
          ? 'bg-[oklch(0.16_0_0)] text-[oklch(0.16_0_0)] cursor-not-allowed'
        : isBooked
          ? 'bg-[oklch(0.3_0_0)] text-[oklch(0.5_0_0)] cursor-not-allowed'
        : isLocked
          ? 'bg-[oklch(0.75_0.15_85)] text-[oklch(0.3_0.1_85)] cursor-not-allowed'
        : isSelected
          ? 'text-white scale-105 shadow-lg'
        : isMaxed
          ? 'bg-[oklch(0.22_0_0)] text-[oklch(0.38_0_0)] cursor-not-allowed'
          : 'bg-[oklch(0.45_0.15_145)] text-white hover:bg-[oklch(0.5_0.15_145)] cursor-pointer',
      ].join(' ')}
      style={isSelected ? { backgroundColor: color } : undefined}
    >
      {isCurrentSection ? number : ''}
    </button>
  )
}