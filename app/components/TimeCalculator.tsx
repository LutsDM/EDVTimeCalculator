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
import ReportRow from "./time/ui/ReportRow";
import TimeBlock from "./time/ui/TimeBlock";

import ServiceReport from "./time/report/ServiceReport";
import { useTimeCalculation } from "./time/hooks/useTimeCalculation";
import { usePriceCalculation } from "@/app/components/time/hooks/usePriceCalculation"
import { useEmployeesSelection } from "./time/hooks/useEmployeesSelection"

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

  const timeOptions = useMemo(() => makeTimeOptions, []);

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

    // 2️⃣ iOS Safari: открываем PDF в новой вкладке
    if (isIOS) {
      window.open(url)
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      return
    }

    // 3️⃣ Desktop и Android
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

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Arbeitsdatum
              {isIOS && (
                <span className="ml-1">📅</span>
              )}
            </label>

            {isIOS ? (
              <input
                type="text"
                value={new Date(date).toLocaleDateString("de-DE")}
                className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-gray-50 text-gray-800"
              />
            ) : (
              <input
                type="date"
                lang="de"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-white"
              />
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Auftragsnummer
            </label>
            <input
              type="text"
              value={auftragsnummer}
              onChange={(e) => setAuftragsnummer(e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-white"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Preis pro Stunde, €
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-white"
            />
          </div>

          <div className={`bg-white border rounded-lg p-4 shadow-sm space-y-3
    ${!hasEmployees ? "border-amber-300" : "border-gray-200"}
  `}>

            {!isAdding && (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-2 text-sm text-green-700 font-medium"
              >
                <span className="text-lg leading-none">+</span>
                Mitarbeiter hinzufügen
              </button>
            )}

            {!hasEmployees && (
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                Bitte wählen Sie mindestens einen Mitarbeiter aus, um den Servicebericht zu erstellen.
              </div>
            )}
            {isAdding && (
              <div className="flex gap-2">
                <select
                  value={employeeToAdd}
                  onChange={(e) => setEmployeeToAdd(Number(e.target.value))}
                  className="h-9 flex-1 rounded-md border border-gray-300 px-2 text-sm"
                >
                  <option value="">Mitarbeiter auswählen</option>
                  {availableEmployees.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!employeeToAdd}
                  onClick={addEmployee}

                  className="h-9 px-3 rounded-md bg-green-600 text-white text-sm disabled:opacity-50"
                >
                  Hinzufügen
                </button>



              </div>

            )}
            {selectedEmployees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedEmployees.map(employee => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm"
                  >
                    {employee.name}
                    <button
                      type="button"
                      onClick={() => removeEmployee(employee.id)}
                      className="ml-1 text-green-700 hover:text-green-900"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}


          </div>


          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeFahrzeit}
                onChange={(e) => setIncludeFahrzeit(e.target.checked)}
                className="h-4 w-4"
              />
              Fahrzeit berücksichtigen
            </label>

            {includeFahrzeit && (
              <div className="space-y-4 pt-2 border-t">
                <TimeRow
                  label="Abfahrt"
                  value={abfahrt}
                  onChange={setAbfahrt}
                  timeOptions={timeOptions}
                />
                <TimeRow
                  label="Ankunft"
                  value={ankunft}
                  onChange={setAnkunft}
                  timeOptions={timeOptions}
                />
              </div>
            )}
          </div>

          <TimeBlock
            title="Von"
            label="Arbeitsbeginn"
            value={start}
            onChange={setStart}
            timeOptions={timeOptions}
          />

          <TimeBlock
            title="Bis"
            label="Arbeitsende"
            value={end}
            onChange={setEnd}
            timeOptions={timeOptions}
          />

          {error && (
            <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {report && (() => {

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
          })()}

          {uiError && (
            <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
              {uiError}
            </div>
          )}


          <div className="flex justify-end gap-2">
            {!isIOS && (
              <button
                type="button"
                disabled={!hasEmployees}
                onClick={handlePrint}
                className={`h-9 px-4 rounded-md text-sm transition-colors duration-150
      ${hasEmployees
                    ? "bg-red-900 text-white hover:bg-red-800 active:bg-red-950"
                    : "bg-red-200 text-white cursor-not-allowed"
                  }
    `}
              >
                Drucken
              </button>
            )}


            <button
              type="button"
              disabled={!hasEmployees}
              onClick={() => setShowPreview(true)}
              className={`h-9 px-4 rounded-md text-sm transition-colors duration-150
    ${hasEmployees
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
  `}
            >
              Bericht ansehen
            </button>
            <button
              type="button"
              disabled={!hasEmployees}
              onClick={downloadPdf}
              className={`h-9 px-4 rounded-md text-sm transition-all duration-150
    ${hasEmployees
                  ? "bg-green-700 text-white hover:bg-green-600 active:bg-green-800 active:scale-[0.98]"
                  : "bg-green-200 text-white cursor-not-allowed"
                }
  `}
            >
              {isIOS ? "Drucken / Speichern" : "PDF herunterladen"}
            </button>


          </div>
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
