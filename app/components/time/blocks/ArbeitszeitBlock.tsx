import TimeBlock from "../ui/TimeBlock"
import TimeRow from "../ui/TimeRow"
import { TimeParts } from "../lib/time"

type Props = {
  // Ankunft (immer von / bis)
  ankunftVon: TimeParts
  ankunftBis: TimeParts
  onAnkunftVonChange: (value: TimeParts) => void
  onAnkunftBisChange: (value: TimeParts) => void

  // Arbeitszeit
  start: TimeParts
  end: TimeParts
  onStartChange: (value: TimeParts) => void
  onEndChange: (value: TimeParts) => void

  timeOptions: {
    hours: string[]
    minutes: string[]
  }
}

export default function ArbeitszeitBlock({
  ankunftVon,
  ankunftBis,
  onAnkunftVonChange,
  onAnkunftBisChange,
  start,
  end,
  onStartChange,
  onEndChange,
  timeOptions,
}: Props) {
  return (
    <TimeBlock title="Arbeitszeit">
      <div className="space-y-4">
        {/* Ankunft */}
        <div>
          <div className="flex justify-center font-bold text-xs text-gray-600 mb-1">
            Ankunft
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TimeRow
              label="Von"
              value={ankunftVon}
              onChange={onAnkunftVonChange}
              timeOptions={timeOptions}
            />

            <TimeRow
              label="Bis"
              value={ankunftBis}
              onChange={onAnkunftBisChange}
              timeOptions={timeOptions}
            />
          </div>
        </div>

        {/* Arbeitszeit */}
        <div>
          <div className="flex justify-center font-bold text-xs text-gray-600 mb-1">
            Arbeitszeit
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TimeRow
              label="Beginn"
              value={start}
              onChange={onStartChange}
              timeOptions={timeOptions}
            />

            <TimeRow
              label="Ende"
              value={end}
              onChange={onEndChange}
              timeOptions={timeOptions}
            />
          </div>
        </div>
      </div>
    </TimeBlock>
  )
}
