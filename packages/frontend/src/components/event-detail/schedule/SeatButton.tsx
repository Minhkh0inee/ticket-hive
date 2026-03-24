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
  const isBooked = status === 'booked' || isLocked
  const isDisabledSection = !isCurrentSection
  const disabled = isDisabledSection || isBooked || isMaxed

  return (
    <button
      onClick={() => !disabled && onClick(seatId, isSelected)}
      disabled={disabled}
      aria-pressed={isSelected}
      className={[
        'w-7 h-7 rounded text-[10px] font-bold transition-all duration-150',
        isDisabledSection ? 'bg-[oklch(0.16_0_0)] text-[oklch(0.16_0_0)] cursor-not-allowed'
        : isBooked        ? 'bg-[oklch(0.24_0_0)] text-[oklch(0.38_0_0)] cursor-not-allowed'
        : isSelected      ? 'text-white scale-105 shadow-lg'
        : isMaxed         ? 'bg-[oklch(0.22_0_0)] text-[oklch(0.38_0_0)] cursor-not-allowed'
                          : 'bg-[oklch(0.28_0_0)] text-[oklch(0.65_0_0)] hover:bg-[oklch(0.32_0_0)] hover:text-white cursor-pointer',
      ].join(' ')}
      style={isSelected ? { backgroundColor: color } : undefined}
    >
      {isCurrentSection ? number : ''}
    </button>
  )
}