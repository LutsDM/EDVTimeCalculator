import { TimeParts } from "./lib/time";

type Props = {
    label: string;
    value: TimeParts;
    onChange: (next: TimeParts) => void;
    timeOptions: (max: number) => string[];
};

export default function TimeRow({
    label,
    value,
    onChange,
    timeOptions,
}: Props) {
    const labels = ["Stunde", "Minute", "Sekunde"] as const;

    return (
        <div>
            <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>

            <div className="grid grid-cols-3 gap-2">
                {(["hour", "minute", "second"] as const).map((k, idx) => (
                    <div key={k}>
                        <div className="text-[10px] text-gray-500 mb-0.5 uppercase">
                            {labels[idx]}
                        </div>

                        <select
                            value={value[k]}
                            onChange={(e) => onChange({ ...value, [k]: e.target.value })}
                            className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm"
                        >
                            {timeOptions(k === "hour" ? 24 : 60).map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}
