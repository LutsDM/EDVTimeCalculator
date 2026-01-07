"use client";

import { useMemo, useState } from "react";
import {
  emptyTime,
  formatDuration,
  getEndTime,
  getNowTime,
  getToday,
  makeTimeOptions,
  type TimeParts,
} from "./time/lib/time";

import TimeRow from "./time/ui/TimeRow";

import TimeBlock from "./time/ui/TimeBlock";
import ActionsBlock from "./time/blocks/ActionsBlock"
import ServiceReport from "./time/report/ServiceReport";
import { useTimeCalculation } from "./time/hooks/useTimeCalculation";
import { usePriceCalculation } from "@/app/components/time/hooks/usePriceCalculation"
import { useEmployeesSelection } from "./time/hooks/useEmployeesSelection"
import EmployeesBlock from "./time/blocks/EmployeesBlock";
import ReportSummaryBlock from "./time/blocks/ReportSummaryBlock"
import HeaderBlock from "./time/blocks/HeaderBlock"
import TravelTimeBlock from "./time/blocks/TravelTimeBlock"
import ArbeitszeitBlock from "./time/blocks/ArbeitszeitBlock";



export default function TimeCalculator() {
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [date, setDate] = useState(getToday);
  const [auftragsnummer, setAuftragsnummer] = useState<string>(`${getToday()}- 001`)
  const [price, setPrice] = useState<string>("95")

  const [uiError, setUiError] = useState<string>("")

  const [start, setStart] = useState<TimeParts>(getNowTime);
  const [end, setEnd] = useState<TimeParts>(getEndTime);

  const [abfahrt, setAbfahrt] = useState<TimeParts>(emptyTime);
  const [ankunft, setAnkunft] = useState<TimeParts>(emptyTime);

  const [includeFahrzeit, setIncludeFahrzeit] = useState(false);

  const {
    selectedEmployees,
    availableEmployees,
    employeeCount,
    hasEmployees,
    employeeToAdd,
    isAdding,
    setEmployeeToAdd,
    setIsAdding,
    addEmployee,
    removeEmployee,
  } = useEmployeesSelection()

  const [showPreview, setShowPreview] = useState(false)

  const timeOptions = useMemo(() => ({
    hours: makeTimeOptions(24),
    minutes: makeTimeOptions(60),
  }), [])

  const { report, error } = useTimeCalculation({
    start,
    end,
    abfahrt,
    ankunft,
    includeFahrzeit,
  })


  const {
    brutto,
    netto,
    mwst,
    stundensatzText,
  } = usePriceCalculation({
    report,
    price,
    employeeCount,
  })


  const downloadPdf = async () => {
    if (!report) return

    const { pdf } = await import("@react-pdf/renderer")

    const { default: ServiceReportPdf } =
      await import("../components/time/report/ServiceReportPdf")

    const blob = await pdf(
      <ServiceReportPdf
        arbeitsdatum={date}
        auftragsnummer={auftragsnummer}
        arbeitszeitText={formatDuration(report.arbeitszeit)}
        arbeitszeitRange={arbeitszeitRange}
        fahrzeitText={
          includeFahrzeit
            ? formatDuration(report.fahrzeit)
            : undefined
        }
        fahrzeitRange={fahrzeitRange}
        gesamtzeitText={formatDuration(report.gesamtzeit)}
        stundensatz={stundensatzText}
        mitarbeiterAnzahl={employeeCount}
        netto={`${netto.toFixed(2)} €`}
        mwst={`${mwst.toFixed(2)} €`}
        brutto={`${brutto.toFixed(2)} €`}
        employees={selectedEmployees}
      />
    ).toBlob()

    const url = URL.createObjectURL(blob)


    if (isIOS && navigator.share) {
      const file = new File([blob], `Servicebericht_${date}.pdf`, {
        type: "application/pdf",
      })

      await navigator.share({
        files: [file],

      })

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




  const handlePrint = () => {
    if (!hasEmployees) {
      setUiError("Bitte wählen Sie mindestens einen Mitarbeiter aus.")
      return
    }
    setUiError("")
    window.print()
  }



  const formatTime = (t: TimeParts) =>
    `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`

  const arbeitszeitRange = report
    ? `${formatTime(start)} bis ${formatTime(end)}`
    : ""

  const fahrzeitRange =
    report && includeFahrzeit
      ? `${formatTime(abfahrt)} bis ${formatTime(ankunft)}`
      : undefined




  return (
    <>
      <div
        className={`
    min-h-screen bg-gray-50 p-4 sm:p-6
    ${showPreview ? "hidden" : "block"}
    print:hidden
  `}
      >
        <div className="max-w-md sm:max-w-sm mx-auto space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Servicebericht
          </h1>

          <HeaderBlock
            date={date}
            onDateChange={setDate}
            auftragsnummer={auftragsnummer}
            onAuftragsnummerChange={setAuftragsnummer}
            price={price}
            onPriceChange={setPrice}
            isIOS={isIOS}
          />


          <EmployeesBlock
            selectedEmployees={selectedEmployees}
            availableEmployees={availableEmployees}
            employeeToAdd={employeeToAdd}
            isAdding={isAdding}
            hasEmployees={hasEmployees}
            onStartAdd={() => setIsAdding(true)}
            onEmployeeToAddChange={setEmployeeToAdd}
            onAddEmployee={addEmployee}
            onRemoveEmployee={removeEmployee}
          />



          <TravelTimeBlock
            includeFahrzeit={includeFahrzeit}
            onToggleIncludeFahrzeit={setIncludeFahrzeit}
            abfahrt={abfahrt}
            ankunft={ankunft}
            onAbfahrtChange={setAbfahrt}
            onAnkunftChange={setAnkunft}
            timeOptions={timeOptions}
          />


          <ArbeitszeitBlock
            start={start}
            end={end}
            onStartChange={setStart}
            onEndChange={setEnd}
            timeOptions={timeOptions}
          />


          {error && (
            <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {report && (
            <ReportSummaryBlock
              report={report}
              includeFahrzeit={includeFahrzeit}
              employeeCount={employeeCount}
              brutto={brutto}
            />
          )}


          {uiError && (
            <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
              {uiError}
            </div>
          )}


          <ActionsBlock
            hasEmployees={hasEmployees}
            isIOS={isIOS}
            onPrint={handlePrint}
            onPreview={() => setShowPreview(true)}
            onDownloadPdf={downloadPdf}
          />
        </div>

      </div>
      {report && (
        <div
          id="print-preview"
          className={`
      ${showPreview ? "block" : "hidden"}
      print:block
    `}
        >
          <ServiceReport
            arbeitsdatum={date}
            auftragsnummer={auftragsnummer}
            arbeitszeitText={formatDuration(report.arbeitszeit)}
            arbeitszeitRange={arbeitszeitRange}
            fahrzeitText={
              includeFahrzeit
                ? formatDuration(report.fahrzeit)
                : undefined
            }
            fahrzeitRange={fahrzeitRange}
            gesamtzeitText={formatDuration(report.gesamtzeit)}
            stundensatz={stundensatzText}
            mitarbeiterAnzahl={employeeCount}
            netto={`${netto.toFixed(2)} €`}
            mwst={`${mwst.toFixed(2)} €`}
            brutto={`${brutto.toFixed(2)} €`}
            employees={selectedEmployees}
          />
        </div>
      )}

    </>

  );
}
