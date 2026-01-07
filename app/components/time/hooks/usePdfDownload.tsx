import { Report } from "@/app/types/report"
import { Employee } from "../lib/employees"
import { formatDuration } from "../lib/time"

type Params = {
  report: Report | null
  date: string
  auftragsnummer: string
  includeFahrzeit: boolean
  arbeitszeitRange: string
  fahrzeitRange?: string
  stundensatzText: string
  employeeCount: number
  netto: number
  mwst: number
  brutto: number
  employees: Employee[]
  isIOS: boolean
}

export function usePdfDownload({
  report,
  date,
  auftragsnummer,
  includeFahrzeit,
  arbeitszeitRange,
  fahrzeitRange,
  stundensatzText,
  employeeCount,
  netto,
  mwst,
  brutto,
  employees,
  isIOS,
}: Params) {
  return async function downloadPdf() {
    if (!report) return

    const { pdf } = await import("@react-pdf/renderer")
    const { default: ServiceReportPdf } =
      await import("../report/ServiceReportPdf")

    const blob = await pdf(
      <ServiceReportPdf
        arbeitsdatum={date}
        auftragsnummer={auftragsnummer}
        arbeitszeitText={formatDuration(report.arbeitszeit)}
        arbeitszeitRange={arbeitszeitRange}
        fahrzeitText={
          includeFahrzeit ? formatDuration(report.fahrzeit) : undefined
        }
        fahrzeitRange={fahrzeitRange}
        gesamtzeitText={formatDuration(report.gesamtzeit)}
        stundensatz={stundensatzText}
        mitarbeiterAnzahl={employeeCount}
        netto={`${netto.toFixed(2)} €`}
        mwst={`${mwst.toFixed(2)} €`}
        brutto={`${brutto.toFixed(2)} €`}
        employees={employees}
      />
    ).toBlob()

    const url = URL.createObjectURL(blob)

    if (isIOS && navigator.share) {
      const file = new File([blob], `Servicebericht_${date}.pdf`, {
        type: "application/pdf",
      })

      await navigator.share({ files: [file] })
      URL.revokeObjectURL(url)
      return
    }

    if (isIOS) {
      window.open(url)
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      return
    }

    const a = document.createElement("a")
    a.href = url
    a.download = `Servicebericht_${date}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }
}
