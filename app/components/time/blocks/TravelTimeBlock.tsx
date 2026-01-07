"use client"

import TimeRow from "../ui/TimeRow"
import { TimeParts } from "../lib/time"

type TravelTimeBlockProps = {
  includeFahrzeit: boolean
  onToggleIncludeFahrzeit: (value: boolean) => void

  abfahrt: TimeParts
  ankunft: TimeParts
  onAbfahrtChange: (value: TimeParts) => void
  onAnkunftChange: (value: TimeParts) => void

  timeOptions: {
    hours: string[]
    minutes: string[]
  }
}

export default function TravelTimeBlock({
  includeFahrzeit,
  onToggleIncludeFahrzeit,
  abfahrt,
  ankunft,
  onAbfahrtChange,
  onAnkunftChange,
  timeOptions,
}: TravelTimeBlockProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeFahrzeit}
          onChange={(e) => onToggleIncludeFahrzeit(e.target.checked)}
          className="h-4 w-4"
        />
        Fahrzeit berücksichtigen
      </label>

      {includeFahrzeit && (
        <div className="space-y-4 pt-2 border-t">
          <TimeRow
            label="Abfahrt"
            value={abfahrt}
            onChange={onAbfahrtChange}
            timeOptions={timeOptions}
          />

          <TimeRow
            label="Ankunft"
            value={ankunft}
            onChange={onAnkunftChange}
            timeOptions={timeOptions}
          />
        </div>
      )}
    </div>
  )
}
