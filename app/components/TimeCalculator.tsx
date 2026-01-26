"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------
 * Time helpers and types
 * ------------------------------------------------------------------ */
import {
  emptyTime,
  formatDuration,
  getEndTime,
  getNowTime,
  getToday,
  makeTimeOptions,
  type TimeParts,
} from "./time/lib/time";

/* ------------------------------------------------------------------
 * Hooks (business logic)
 * ------------------------------------------------------------------ */
import { useTimeCalculation } from "./time/hooks/useTimeCalculation";
import { usePriceCalculation } from "@/app/components/time/hooks/usePriceCalculation";
import { useEmployeesSelection } from "./time/hooks/useEmployeesSelection";
import { usePdfDownload } from "./time/hooks/usePdfDownload";
import { useTimeRanges } from "./time/hooks/useTimeRange";

/* ------------------------------------------------------------------
 * UI Blocks (presentation only)
 * ------------------------------------------------------------------ */
import HeaderBlock from "./time/blocks/HeaderBlock";
import EmployeesBlock from "./time/blocks/EmployeesBlock";
import TravelTimeBlock from "./time/blocks/TravelTimeBlock";
import ArbeitszeitBlock from "./time/blocks/ArbeitszeitBlock";
import ReportSummaryBlock from "./time/blocks/ReportSummaryBlock";
import ActionsBlock from "./time/blocks/ActionsBlock";

/* ------------------------------------------------------------------
 * Print / Preview
 * ------------------------------------------------------------------ */
import ServiceReport from "./time/report/ServiceReport";
import { Customer } from "../types/customer";
import CustomerModal from "./time/blocks/CustomerModal";

export default function TimeCalculator() {
  /* ------------------------------------------------------------------
   * Platform detection
   * ------------------------------------------------------------------ */
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  /* ------------------------------------------------------------------
   * Header state (date, order number, price)
   * ------------------------------------------------------------------ */
  const [date, setDate] = useState(getToday);
  const [auftragsnummer, setAuftragsnummer] = useState<string>(
    `${getToday()}- 001`
  );
  const [price, setPrice] = useState<string>("95");

  /* ------------------------------------------------------------------
   * UI-level error (not business validation)
   * ------------------------------------------------------------------ */
  const [uiError, setUiError] = useState<string>("");

  /* ------------------------------------------------------------------
   * Working time (Von / Bis)
   * ------------------------------------------------------------------ */
  const [start, setStart] = useState<TimeParts>(getNowTime);
  const [end, setEnd] = useState<TimeParts>(getEndTime);

  /* ------------------------------------------------------------------
   * Travel time (Abfahrt / Ankunft)
   * ------------------------------------------------------------------ */
  const [ankunftVon, setAnkunftVon] = useState<TimeParts>(getNowTime)
  const [ankunftBis, setAnkunftBis] = useState<TimeParts>(getNowTime)
  const [includeAbfahrt, setIncludeAbfahrt] = useState(false);

  const [abfahrtVon, setAbfahrtVon] = useState<TimeParts>(emptyTime)
  const [abfahrtBis, setAbfahrtBis] = useState<TimeParts>(emptyTime)
  /* ------------------------------------------------------------------
    * Customer 
    * ------------------------------------------------------------------ */
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false)
  /* ------------------------------------------------------------------
    * OrderDetails
    * ------------------------------------------------------------------ */

  const [orderDetails, setOrderDetails] = useState<string>("");

  /* ------------------------------------------------------------------
   * Employees selection logic
   * ------------------------------------------------------------------ */
  const {
    // state
    selectedEmployees,
    employeeToAdd,
    isAdding,
    isAddingCustom,
    customEmployeeName,

    // setters
    setEmployeeToAdd,
    setIsAdding,
    setIsAddingCustom,
    setCustomEmployeeName,

    // derived
    availableEmployees,
    employeeCount,
    hasEmployees,

    // actions
    startAddFromList,
    startAddCustom,
    cancelAdd,
    addEmployeeFromList,
    addCustomEmployee,
    removeEmployee,

    hydrateEmployees
  } = useEmployeesSelection()


  /* ------------------------------------------------------------------
   * Preview / print mode
   * ------------------------------------------------------------------ */
  const [showPreview, setShowPreview] = useState(false);

  /* ------------------------------------------------------------------
   * Signature Modal
   * ------------------------------------------------------------------ */
  const [signatureKunde, setSignatureKunde] = useState<string | null>(null);
  const [signatureKundeOpen, setSignatureKundeOpen] = useState(false);
  const [signatureEmployee, setSignatureEmployee] = useState<string | null>(null);
  const [signatureEmployeeOpen, setSignatureEmployeeOpen] = useState(false);


  /* ------------------------------------------------------------------
     * Save service report in Local Storage
     * ------------------------------------------------------------------ */
  const STORAGE_KEY = "service_report_draft";

  const [isHydrated, setIsHydrated] = useState(false);

  const draft = useMemo(
    () => ({
      // header
      date,
      auftragsnummer,
      price,

      // working time
      start,
      end,

      // arrival / travel
      ankunftVon,
      ankunftBis,
      includeAbfahrt,
      abfahrtVon,
      abfahrtBis,

      // employees & customer
      selectedEmployees,
      customer,

      // signatures
      signatureKunde,
      signatureEmployee,
    }),
    [
      date,
      auftragsnummer,
      price,

      start,
      end,

      ankunftVon,
      ankunftBis,
      includeAbfahrt,
      abfahrtVon,
      abfahrtBis,

      selectedEmployees,
      customer,

      signatureKunde,
      signatureEmployee,
    ]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setSignatureKunde(null);
      setSignatureEmployee(null);
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (parsed.date) setDate(parsed.date);
      if (parsed.auftragsnummer) setAuftragsnummer(parsed.auftragsnummer);
      if (parsed.price) setPrice(parsed.price);

      if (parsed.start) setStart(parsed.start);
      if (parsed.end) setEnd(parsed.end);

      if (parsed.ankunftVon) setAnkunftVon(parsed.ankunftVon);
      if (parsed.ankunftBis) setAnkunftBis(parsed.ankunftBis);

      if (typeof parsed.includeAbfahrt === "boolean") {
        setIncludeAbfahrt(parsed.includeAbfahrt);
      }

      if (parsed.abfahrtVon) setAbfahrtVon(parsed.abfahrtVon);
      if (parsed.abfahrtBis) setAbfahrtBis(parsed.abfahrtBis);

      if (Array.isArray(parsed.selectedEmployees)) {
        hydrateEmployees(parsed.selectedEmployees);
      }

      setCustomer(parsed.customer ?? null);

      setSignatureKunde(parsed.signatureKunde ?? null);
      setSignatureEmployee(parsed.signatureEmployee ?? null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, [hydrateEmployees]);


  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window === "undefined") return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, isHydrated]);


  /* ------------------------------------------------------------------
      * Function fur Reset Button
      * ------------------------------------------------------------------ */
  const resetForm = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }

    setDate(getToday());
    setAuftragsnummer(`${getToday()}- 001`);
    setPrice("95");

    setStart(getNowTime());
    setEnd(getEndTime());

    setAnkunftVon(getNowTime());
    setAnkunftBis(getNowTime());

    setIncludeAbfahrt(false);
    setAbfahrtVon(emptyTime);
    setAbfahrtBis(emptyTime);

    setCustomer(null);

    hydrateEmployees([]);

    setSignatureKunde(null)
    setSignatureEmployee(null)
  };


  /* ------------------------------------------------------------------
   * Time select options (memoized once)
   * ------------------------------------------------------------------ */
  const timeOptions = useMemo(
    () => ({
      hours: makeTimeOptions(24),
      minutes: makeTimeOptions(60),
    }),
    []
  );


  /* ------------------------------------------------------------------
   * Core business calculation (time validation + totals)
   * ------------------------------------------------------------------ */
  const { report, error } = useTimeCalculation({
    ankunftVon,
    ankunftBis,
    start,
    end,
    abfahrtVon,
    abfahrtBis,
    includeAbfahrt,
  })

  /* ------------------------------------------------------------------
   * Price calculation (derived values only)
   * ------------------------------------------------------------------ */
  const { brutto, netto, mwst, stundensatzText } = usePriceCalculation({
    report,
    price,
    employeeCount,
  });

  /* ------------------------------------------------------------------
   * Formatted time ranges (for UI + PDF)
   * ------------------------------------------------------------------ */
  const {
    ankunftRange,
    arbeitszeitRange,
    abfahrtRange,
  } = useTimeRanges({
    report,
    ankunftVon,
    ankunftBis,
    start,
    end,
    abfahrtVon,
    abfahrtBis,
    includeAbfahrt,
  })

  /* ------------------------------------------------------------------
   * PDF download handler (isolated side-effect)
   * ------------------------------------------------------------------ */
  const downloadPdf = usePdfDownload({
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
    employees: selectedEmployees,
    isIOS,
    customer,
    signatureKunde,
    signatureEmployee
  });

  /* ------------------------------------------------------------------
   * Print handler (desktop only)
   * ------------------------------------------------------------------ */
  const handlePrint = () => {
    if (!hasEmployees) {
      setUiError("Bitte wählen Sie mindestens einen Mitarbeiter aus.");
      return;
    }
    setUiError("");
    window.print();
  };

  /* ------------------------------------------------------------------
   * Kunden button
   * ------------------------------------------------------------------ */

  const hasCustomer = Boolean(customer);

  const customerName = useMemo(() => {
    if (!customer) return "";
    const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
    return name;
  }, [customer]);

  const customerButtonText = hasCustomer
    ? `Kundendaten: ${customerName || "gespeichert"}`
    : "Kundendaten hinzufügen";

  /* ------------------------------------------------------------------
* Kunden button
* ------------------------------------------------------------------ */




  /* ==================================================================
   * RENDER
   * ================================================================== */
  return (
    <>
      {/* ===================== FORM VIEW ===================== */}
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

          {/* Header (date, order number, price) */}
          <HeaderBlock
            date={date}
            onDateChange={setDate}
            auftragsnummer={auftragsnummer}
            onAuftragsnummerChange={setAuftragsnummer}
            price={price}
            onPriceChange={setPrice}
            isIOS={isIOS}
          />

          <button
            onClick={() => setCustomerModalOpen(true)}
            className={`
    w-full rounded-lg py-2 text-sm font-medium border
    transition-colors flex items-center justify-center gap-2
    ${hasCustomer
                ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                : "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"}
    active:scale-[0.98]
  `}
          >
            {hasCustomer && <span className="text-base leading-none">✔</span>}
            <span className="truncate max-w-[85%]">{customerButtonText}</span>
          </button>

          {isCustomerModalOpen && (
            <CustomerModal
              initialValue={customer}
              onSave={setCustomer}
              onClose={() => setCustomerModalOpen(false)}
            />
          )}

          {/* Employees selection */}
          <EmployeesBlock
            selectedEmployees={selectedEmployees}
            availableEmployees={availableEmployees}
            employeeToAdd={employeeToAdd}
            isAdding={isAdding}
            isAddingCustom={isAddingCustom}
            customEmployeeName={customEmployeeName}
            hasEmployees={hasEmployees}

            onStartAddFromList={startAddFromList}
            onStartAddCustom={startAddCustom}
            onCancelAdd={cancelAdd}

            onEmployeeToAddChange={setEmployeeToAdd}
            onCustomEmployeeNameChange={setCustomEmployeeName}

            onAddEmployeeFromList={addEmployeeFromList}
            onAddCustomEmployee={addCustomEmployee}

            onRemoveEmployee={removeEmployee}
          />

          {/* Working time */}
          <ArbeitszeitBlock
            ankunftVon={ankunftVon}
            ankunftBis={ankunftBis}
            onAnkunftVonChange={setAnkunftVon}
            onAnkunftBisChange={setAnkunftBis}
            start={start}
            end={end}
            onStartChange={setStart}
            onEndChange={setEnd}
            timeOptions={timeOptions}
          />


          {/* Travel time */}
          <TravelTimeBlock
            includeAbfahrt={includeAbfahrt}
            onToggleIncludeAbfahrt={setIncludeAbfahrt}
            abfahrtVon={abfahrtVon}
            abfahrtBis={abfahrtBis}
            onAbfahrtVonChange={setAbfahrtVon}
            onAbfahrtBisChange={setAbfahrtBis}
            timeOptions={timeOptions}
          />


          {/* Validation errors */}
          {error && (
            <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Report summary */}
          {report && (
            <ReportSummaryBlock
              report={report}
              includeAbfahrt={includeAbfahrt}
              employeeCount={employeeCount}
              brutto={brutto}
            />
          )}

          {/* UI errors */}
          {uiError && (
            <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
              {uiError}
            </div>
          )}

          {/* Actions */}
          <ActionsBlock
            hasEmployees={hasEmployees}
            isIOS={isIOS}
            onPrint={handlePrint}
            onPreview={() => setShowPreview(true)}
            onDownloadPdf={downloadPdf}
            onReset={resetForm}

            signatureKundeOpen={signatureKundeOpen}
            onOpenKundeSignature={() => setSignatureKundeOpen(true)}
            onCloseKundeSignature={() => setSignatureKundeOpen(false)}
            signatureKunde={signatureKunde}
            setSignatureKunde={setSignatureKunde}

            signatureEmployeeOpen={signatureEmployeeOpen}
            onOpenEmployeeSignature={() => setSignatureEmployeeOpen(true)}
            onCloseEmployeeSignature={() => setSignatureEmployeeOpen(false)}
            signatureEmployee={signatureEmployee}
            setSignatureEmployee={setSignatureEmployee}

          />
        </div>
      </div>

      {/* ===================== PRINT / PREVIEW ===================== */}
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
            employees={selectedEmployees}
            customer={customer}
            onBack={() => setShowPreview(false)}
            signatureKunde={signatureKunde}
            signatureEmployee={signatureEmployee}
          />

        </div>
      )}
    </>
  );
}
