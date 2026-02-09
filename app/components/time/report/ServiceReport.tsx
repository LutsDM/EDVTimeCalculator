"use client"

import { LineItem } from "@/app/types/lineItem"
import { Employee } from "../lib/employees"
import { Customer } from "@/app/types/customer"

type ServiceReportProps = {
  arbeitsdatum: string
  auftragsnummer: string
  kundenNr?: string

  arbeitszeitText: string
  arbeitszeitRange: string

  abfahrtText?: string
  abfahrtRange?: string

  gesamtzeitText: string

  stundensatz: string
  mitarbeiterAnzahl: number

  netto: string
  mwst: string
  brutto: string

  employees: Employee[]
  customer?: Customer | null

  onBack: () => void

  signatureKunde: string | null
  signatureEmployee: string | null

  orderDetails?: string

  lineItems?: LineItem[]
  extraBrutto?: string


}

export default function ServiceReport({
  abfahrtRange,
  arbeitsdatum,
  arbeitszeitRange,
  auftragsnummer,
  kundenNr,
  arbeitszeitText,
  abfahrtText,
  gesamtzeitText,
  stundensatz,
  mitarbeiterAnzahl,
  netto,
  mwst,
  brutto,
  employees,
  customer,
  onBack,
  signatureKunde,
  signatureEmployee,
  orderDetails,
  lineItems,
  extraBrutto,

}: ServiceReportProps) {
  return (
    <div className="print-area max-w-[800px] mx-auto bg-white p-8 text-sm text-gray-900 leading-relaxed">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 print:hidden"
      >
        Zurück
      </button>

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6">

          {/* LEFT COLUMN */}
          <div className="text-[10px] leading-relaxed">
            EDV SERVICE Samirae<br />
            Schloßstr. 33<br />
            51427 Bergisch Gladbach<br />
            Tel. 02204 96 70 720<br />
            Mobil 0163 2496741

            {customer && (
              <div className="mt-4">
                <div className="font-semibold">Kunde</div>

                {customer.type === "company" && customer.companyName && (
                  <div>{customer.companyName}</div>
                )}

                <div>
                  {customer.firstName} {customer.lastName}
                </div>

                <div>
                  {customer.street} {customer.houseNumber}
                </div>

                <div>
                  {customer.postalCode} {customer.city}
                </div>

                {customer.phone && (
                  <div>Tel. {customer.phone}</div>
                )}
              </div>
            )}
          </div>

          {/* LOGO */}
          <div className="self-start">
            <img
              src="/LOGO.png"
              alt="EDV Service Samirae"
              width={160}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div className="text-right text-xs leading-relaxed mb-4">
        <strong className="text-sm">Servicebericht</strong><br />
        Arbeitsdatum: {arbeitsdatum}<br />
        Auftragsnummer: {auftragsnummer}<br />
        {kundenNr && <>Kunden Nr: {kundenNr}<br /></>}
      </div>

      {/* LEISTUNGEN */}
      <table className="w-full border border-gray-300 mb-6">
        <tbody>
          <tr className="border border-gray-300">
            <td className="p-2">
              Arbeitszeit<br />
              <span className="text-xs text-gray-500">
                ({arbeitszeitRange})
              </span>
            </td>
            <td className="p-2 text-right">{arbeitszeitText}</td>
          </tr>

          {abfahrtText && abfahrtRange && (
            <tr className="border border-gray-300">
              <td className="p-2">
                Fahrzeit<br />
                <span className="text-xs text-gray-500">
                  ({abfahrtRange})
                </span>
              </td>
              <td className="p-2 text-right">{abfahrtText}</td>
            </tr>
          )}

          <tr className="border border-gray-300 font-bold">
            <td className="p-2">Gesamtzeit</td>
            <td className="p-2 text-right">{gesamtzeitText}</td>
          </tr>

          <tr className="border border-gray-300">
            <td className="p-2">Stundensatz</td>
            <td className="p-2 text-right">{stundensatz}</td>
          </tr>

          <tr className="border border-gray-300">
            <td className="p-2">Mitarbeiteranzahl</td>
            <td className="p-2 text-right">{mitarbeiterAnzahl}</td>
          </tr>

          {lineItems?.length ? (
            <>
              {lineItems.map((item) => (
                <tr key={item.id} className="border border-gray-300">
                  <td className="p-2">{item.title}</td>
                  <td className="p-2 text-right">
                    {(item.amountCents / 100).toFixed(2).replace(".", ",")} €
                  </td>
                </tr>
              ))}
            </>
          ) : null}

        </tbody>
      </table>

      {/* TOTALS */}
      <div className="w-1/2 ml-auto space-y-1 mb-10">
        <div className="flex justify-between">
          <span>Nettobetrag</span>
          <span>{netto}</span>
        </div>
        <div className="flex justify-between">
          <span>MwSt 19 %</span>
          <span>{mwst}</span>
        </div>
        {extraBrutto ? (
          <div className="flex justify-between">
            <span>Zusatzpositionen</span>
            <span>{extraBrutto}</span>
          </div>
        ) : null}
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Gesamtbetrag</span>
          <span>{brutto}</span>
        </div>
      </div>

      {orderDetails?.trim() ? (
        <div className="mt-4">
          <div className="text-sm font-semibold">Auftragsdetails</div>
          <div className="mt-1 whitespace-pre-wrap text-sm">{orderDetails}</div>
        </div>
      ) : null}

      {/* EMPLOYEES */}
      <div className="flex items-center gap-10">

        <div className="mt-10 ml-auto max-w-[400px] text-xs break-inside-avoid">

          {/* EMPLOYEE SIGNATURE */}
          <div className="text-center">
            <strong>Ausgeführt durch:</strong>
            <div className="bg-white flex items-center justify-center overflow-hidden h-[90px]">
              {signatureEmployee ? (
                <img
                  src={signatureEmployee}
                  alt="Unterschrift Mitarbeiter"
                  className="max-h-[90px] max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-400">Bitte unterschreiben</span>
              )}
            </div>

            <div className="border-b border-gray-500 h-2 mb-1" />

            <div className="font-medium">
              {employees.length === 1 ? employees[0].name : "Mitarbeiter"}
            </div>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="mt-10 text-xs break-inside-avoid">
          <div>


            {/* CUSTOMER SIGNATURE */}
            <div className="text-center">
              <strong>Kunde:</strong>
              <div className="bg-white flex items-center justify-center overflow-hidden h-[90px]">
                {signatureKunde ? (
                  <img
                    src={signatureKunde}
                    alt="Unterschrift Kunde"
                    className="max-h-[90px] max-w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Bitte unterschreiben</span>
                )}
              </div>

              <div className="border-b border-gray-500 h-2 mb-2" />

              <div className="font-medium">
                {customer ? `${customer.firstName} ${customer.lastName}` : "Kunde"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
