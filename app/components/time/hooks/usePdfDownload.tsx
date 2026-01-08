import { Report } from "@/app/types/report"
import { Employee } from "../lib/employees"
import { formatDuration } from "../lib/time"

type Params = {
  report: Report | null
  date: string
  auftragsnummer: string
  includeAbfahrt: boolean
  arbeitszeitRange: string
  abfahrtRange?: string
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
  includeAbfahrt,
  arbeitszeitRange,
  abfahrtRange,
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
        abfahrtText={
          includeAbfahrt ? formatDuration(report.abfahrt) : undefined
        }
        abfahrtRange={abfahrtRange}
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
