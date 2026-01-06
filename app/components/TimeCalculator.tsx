"use client";

import { useEffect, useMemo, useState } from "react";
import {
  emptyTime,
  formatDuration,
  getEndTime,
  getNowTime,
  getToday,
  timeToMinutes,
  makeTimeOptions,
  type TimeParts,
} from "./time/lib/time";

import TimeRow from "./time/TimeRow";
import ReportRow from "./time/ReportRow";
import TimeBlock from "./time/TimeBlock";
import { employees, type Employee } from "./time/lib/employees";
import ServiceReport from "./ServiceReport"


type Report = {
  arbeitszeit: number;
  fahrzeit: number;
  gesamtzeit: number;
  includeFahrzeit: boolean;
};

export default function TimeCalculator() {
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [date, setDate] = useState(getToday);
  const [auftragsnummer, setAuftragsnummer] = useState<string>(`${getToday()}- 001`)
  const [price, setPrice] = useState<number>(95)

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<number[]>([])
  const [employeeToAdd, setEmployeeToAdd] = useState<number | "">("")
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)

  const [start, setStart] = useState<TimeParts>(getNowTime);
  const [end, setEnd] = useState<TimeParts>(getEndTime);

  const [abfahrt, setAbfahrt] = useState<TimeParts>(emptyTime);
  const [ankunft, setAnkunft] = useState<TimeParts>(emptyTime);

  const [includeFahrzeit, setIncludeFahrzeit] = useState(false);

  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");

  const [showPreview, setShowPreview] = useState(false)

  const timeOptions = useMemo(() => makeTimeOptions, []);

  useEffect(() => {
    const startMin = timeToMinutes(start);
    const endMin = timeToMinutes(end);

    if (startMin >= endMin) {
      setError("Arbeitsbeginn muss vor dem Arbeitsende liegen.");
      setReport(null);
      return;
    }

    let fahrzeit = 0;

    if (includeFahrzeit) {
      const abfahrtMin = timeToMinutes(abfahrt);
      const ankunftMin = timeToMinutes(ankunft);

      if (abfahrtMin > ankunftMin) {
        setError("Abfahrt darf nicht später als Ankunft sein.");
        setReport(null);
        return;
      }

      if (ankunftMin > startMin) {
        setError("Arbeitsbeginn darf nicht vor der Ankunft liegen.");
        setReport(null);
        return;
      }

      if (abfahrtMin > endMin) {
        setError("Abfahrt darf nicht nach dem Arbeitsende liegen.");
        setReport(null);
        return;
      }

      fahrzeit = ankunftMin - abfahrtMin;

    }

    const arbeitszeit = endMin - startMin;

    setError("");
    setReport({
      arbeitszeit,
      fahrzeit,
      gesamtzeit: arbeitszeit + fahrzeit,
      includeFahrzeit,
    });
  }, [start, end, abfahrt, ankunft, includeFahrzeit]);

  const applyPdfSafeColors = () => {
    document.querySelectorAll("#print-preview *").forEach(el => {
      const element = el as HTMLElement
      element.style.color = "#000"
      element.style.backgroundColor = "#fff"
      element.style.borderColor = "#000"
      element.style.boxShadow = "none"
    })
  }

  const resetPdfSafeColors = () => {
    document.querySelectorAll("#print-preview *").forEach(el => {
      const element = el as HTMLElement
      element.style.removeProperty("color")
      element.style.removeProperty("background-color")
      element.style.removeProperty("border-color")
      element.style.removeProperty("box-shadow")
    })
  }

  const handlePrint = () => {
    if (!hasEmployees) {
      setError("Bitte wählen Sie mindestens einen Mitarbeiter aus.")
      return
    }

    window.print()
  }

  const downloadPdf = async () => {
    setShowPreview(true)

    await new Promise(resolve => setTimeout(resolve, 120))

    const element = document.getElementById("print-preview")
    if (!element) return

    applyPdfSafeColors()

    await new Promise(resolve => setTimeout(resolve, 50))

    const html2pdf = (await import("html2pdf.js")).default

    await html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: `Servicebericht_${date}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()

    resetPdfSafeColors()
    setShowPreview(false)
  }

  const hasEmployees = selectedEmployeeIds.length > 0

  const formatTime = (t: TimeParts) =>
    `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`

  const arbeitszeitRange = report
    ? `${formatTime(start)} bis ${formatTime(end)}`
    : ""

  const fahrzeitRange =
    report && report.includeFahrzeit
      ? `${formatTime(abfahrt)} bis ${formatTime(ankunft)}`
      : undefined


  const employeeCount = selectedEmployeeIds.length

  const bruttoAmount = report
    ? (report.arbeitszeit + report.fahrzeit) *
    (price / 60) *
    employeeCount
    : 0

  const nettoAmount = bruttoAmount / 1.19
  const mwstAmount = bruttoAmount - nettoAmount


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
            </label>

            {isIOS ? (
              <input
                type="text"
                value={new Date(date).toLocaleDateString("de-DE")}
                readOnly
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
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-white"
            />
          </div>

          <div className={`bg-white border rounded-lg p-4 shadow-sm space-y-3
    ${!hasEmployees ? "border-amber-300" : "border-gray-200"}
  `}>

            {!isAddingEmployee && (
              <button
                type="button"
                onClick={() => setIsAddingEmployee(true)}
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
            {isAddingEmployee && (
              <div className="flex gap-2">
                <select
                  value={employeeToAdd}
                  onChange={(e) => setEmployeeToAdd(Number(e.target.value))}
                  className="h-9 flex-1 rounded-md border border-gray-300 px-2 text-sm"
                >
                  <option value="">Mitarbeiter auswählen</option>
                  {employees
                    .filter(e => !selectedEmployeeIds.includes(e.id))
                    .map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                </select>

                <button
                  type="button"
                  disabled={!employeeToAdd}
                  onClick={() => {
                    setSelectedEmployeeIds([...selectedEmployeeIds, employeeToAdd as number])
                    setEmployeeToAdd("")
                    setIsAddingEmployee(false)
                  }}
                  className="h-9 px-3 rounded-md bg-green-600 text-white text-sm disabled:opacity-50"
                >
                  Hinzufügen
                </button>



              </div>

            )}
            {selectedEmployeeIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedEmployeeIds.map((id) => {
                  const employee = employees.find(e => e.id === id)
                  if (!employee) return null

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm"
                    >
                      {employee.name}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedEmployeeIds(
                            selectedEmployeeIds.filter(eid => eid !== id)
                          )
                        }
                        className="ml-1 text-green-700 hover:text-green-900"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
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

                {report.includeFahrzeit && (
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
                    {`${bruttoAmount.toFixed(2)} €`}
                  </div>
                </div>

              </div>

            )
          })()}

          <div className="flex justify-end gap-2">
            {!isIOS && (
              <button
                type="button"
                disabled={!hasEmployees}
                onClick={handlePrint}
                className={`h-9 px-4 rounded-md text-sm
      ${hasEmployees
                    ? "bg-red-900 text-white"
                    : "bg-red-200 text-white cursor-not-allowed"}
    `}
              >
                Drucken
              </button>
            )}



            <button
              type="button"
              disabled={!hasEmployees}
              onClick={() => setShowPreview(true)}
              className={`h-9 px-4 rounded-md text-sm
    ${hasEmployees
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"}
  `}
            >
              Bericht ansehen
            </button>



            <button
              type="button"
              disabled={!hasEmployees}
              onClick={downloadPdf}
              className={`h-9 px-4 rounded-md text-sm
    ${hasEmployees
                  ? "bg-green-700 text-white"
                  : "bg-green-200 text-white cursor-not-allowed"}
  `}
            >
              Herunterladen
            </button>
          </div>



        </div>

      </div>
      {/* ================= PRINT REPORT ================= */}
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
              report.includeFahrzeit
                ? formatDuration(report.fahrzeit)
                : undefined
            }
            fahrzeitRange={fahrzeitRange}
            gesamtzeitText={formatDuration(report.gesamtzeit)}
            stundensatz={`${price.toFixed(2)} €`}
            mitarbeiterAnzahl={employeeCount}
            netto={nettoAmount.toFixed(2) + " €"}
            mwst={mwstAmount.toFixed(2) + " €"}
            brutto={bruttoAmount.toFixed(2) + " €"}
            employees={employees.filter(e =>
              selectedEmployeeIds.includes(e.id)
            )}
          />
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="ml-30 text-sm text-gray-600 underline "
          >
            Vorschau schließen
          </button>

        </div>
      )}
    </>

  );
}
