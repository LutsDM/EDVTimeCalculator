"use client"

import TimeRow from "../ui/TimeRow"
import { TimeParts } from "../lib/time"

type TravelTimeBlockProps = {
  includeAbfahrt: boolean
  onToggleIncludeAbfahrt: (value: boolean) => void

  abfahrtVon: TimeParts
  abfahrtBis: TimeParts
  onAbfahrtVonChange: (value: TimeParts) => void
  onAbfahrtBisChange: (value: TimeParts) => void

  timeOptions: {
    hours: string[]
    minutes: string[]
  }
}

export default function TravelTimeBlock({
  includeAbfahrt,
  onToggleIncludeAbfahrt,
  abfahrtVon,
  abfahrtBis,
  onAbfahrtVonChange,
  onAbfahrtBisChange,
  timeOptions,
}: TravelTimeBlockProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeAbfahrt}
          onChange={(e) => onToggleIncludeAbfahrt(e.target.checked)}
          className="h-4 w-4"
        />
        Abfahrt berücksichtigen
      </label>

      {includeAbfahrt && (
        <div className="space-y-3 pt-2 border-t">
          <div className="text-xs font-medium text-gray-600">
            Abfahrt
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TimeRow
              label="Von"
              value={abfahrtVon}
              onChange={onAbfahrtVonChange}
              timeOptions={timeOptions}
            />

            <TimeRow
              label="Bis"
              value={abfahrtBis}
              onChange={onAbfahrtBisChange}
              timeOptions={timeOptions}
            />
          </div>
        </div>
      )}
    </div>
  )
}
