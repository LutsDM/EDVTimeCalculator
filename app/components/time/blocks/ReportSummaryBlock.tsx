import ReportRow from "../ui/ReportRow"
import { formatDuration } from "../lib/time"
import { Report } from "@/app/types/report"

type ReportSummaryBlockProps = {
  report: Report
  includeFahrzeit: boolean
  employeeCount: number
  brutto: number
}

export default function ReportSummaryBlock({
  report,
  includeFahrzeit,
  employeeCount,
  brutto,
}: ReportSummaryBlockProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
      <div className="text-xs uppercase tracking-wide text-gray-500">
        Bericht
      </div>

      <ReportRow
        label="Arbeitszeit"
        value={formatDuration(report.arbeitszeit)}
      />

      {includeFahrzeit && (
        <ReportRow
          label="Fahrzeit"
          value={formatDuration(report.fahrzeit)}
        />
      )}

      <div className="pt-2 border-t">
        <ReportRow
          label="Gesamtzeit"
          value={formatDuration(report.gesamtzeit)}
          strong
        />
      </div>

      <ReportRow
        label="Mitarbeiteranzahl"
        value={String(employeeCount)}
        strong
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 font-medium">
          <span>Gesamtbetrag</span>

          <div className="relative group">
            <span className="cursor-pointer text-gray-400">ℹ️</span>

            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 rounded-md bg-gray-800 text-white text-xs p-2 shadow-lg z-10">
              (Arbeitszeit + Fahrzeit) × Stundensatz × Mitarbeiteranzahl
            </div>
          </div>
        </div>

        <div className="font-semibold">
          {brutto.toFixed(2)} €
        </div>
      </div>
    </div>
  )
}
