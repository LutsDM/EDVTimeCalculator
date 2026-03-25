/** Hard maximum — input is blocked at this length. */
export const ORDER_DETAILS_MAX_CHARS = 1000

export function clampOrderDetails(value: string): string {
  if (value.length <= ORDER_DETAILS_MAX_CHARS) return value
  return value.slice(0, ORDER_DETAILS_MAX_CHARS)
}
