import { TimeParts } from "../lib/time"
import { Report } from "@/app/types/report"

function format(t: TimeParts): string {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`
}

export function useTimeRanges({
  report,
  start,
  end,
  abfahrt,
  ankunft,
  includeFahrzeit,
}: {
  report: Report | null
  start: TimeParts
  end: TimeParts
  abfahrt: TimeParts
  ankunft: TimeParts
  includeFahrzeit: boolean
}) {
  const arbeitszeitRange = report
    ? `${format(start)} bis ${format(end)}`
    : ""

  const fahrzeitRange =
    report && includeFahrzeit
      ? `${format(abfahrt)} bis ${format(ankunft)}`
      : undefined

  return {
    arbeitszeitRange,
    fahrzeitRange,
  }
}
