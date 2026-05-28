import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789', 12)

export function generateOrderCode(): number {
  return Number(nanoid())
}