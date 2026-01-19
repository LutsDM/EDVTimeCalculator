type Props = {
  label: string;
  value: string;
  strong?: boolean;
};

export default function ReportRow({ label, value, strong }: Props) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-800">{label}</span>
      <span className={strong ? "font-semibold text-gray-800" : ""}>{value}</span>
    </div>
  );
} 
