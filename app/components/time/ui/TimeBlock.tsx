import { TimeParts } from "../lib/time";
import TimeRow from "./TimeRow";

type TimeOptions = {
  hours: string[]
  minutes: string[]
}

type Props = {
  title: string
  label: string
  value: TimeParts
  onChange: (next: TimeParts) => void
  timeOptions: TimeOptions
}


export default function TimeBlock({
  title,
  label,
  value,
  onChange,
  timeOptions,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-blue-600 uppercase">
        {title}
      </h2>

      <TimeRow
        label={label}
        value={value}
        onChange={onChange}
        timeOptions={timeOptions}
      />
    </div>
  );
}
