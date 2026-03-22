export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function fmtDateRange(startIso: string, endIso?: string): string {
  return endIso ? `${fmtDate(startIso)} - ${fmtDate(endIso)}` : fmtDate(startIso)
}

export function fmtPrice(price: string): string {
  const n = parseInt(price, 10)
  return n === 0 ? 'Miễn phí' : `${n.toLocaleString('vi-VN')} đ`
}
