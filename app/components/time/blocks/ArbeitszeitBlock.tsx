import { TimeParts } from "../lib/time"
import TimeBlock from "../ui/TimeBlock"

type Props = {
  start: TimeParts
  end: TimeParts
  onStartChange: (next: TimeParts) => void
  onEndChange: (next: TimeParts) => void
  timeOptions: {
    hours: string[]
    minutes: string[]
  }
}

export default function ArbeitszeitBlock({
  start,
  end,
  onStartChange,
  onEndChange,
  timeOptions,
}: Props) {
  return (
    <>
      <TimeBlock
        title="Von"
        label="Arbeitsbeginn"
        value={start}
        onChange={onStartChange}
        timeOptions={timeOptions}
      />

      <TimeBlock
        title="Bis"
        label="Arbeitsende"
        value={end}
        onChange={onEndChange}
        timeOptions={timeOptions}
      />
    </>
  )
}
