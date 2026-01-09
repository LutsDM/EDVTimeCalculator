"use client"

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
}: ServiceReportProps) {
  return (
    <div className="print-area max-w-[800px] mx-auto bg-white p-8 text-sm text-gray-900 leading-relaxed">

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
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Gesamtbetrag</span>
          <span>{brutto}</span>
        </div>
      </div>

      {/* EMPLOYEES */}
      <div className="mt-10 max-w-[400px] text-xs break-inside-avoid">
        <strong>Ausgeführt durch:</strong>

        <div className="grid grid-cols-2 gap-6 mt-4">
          {employees.map(e => (
            <div key={e.id} className="text-center">
              <div className="mb-6 border-b border-gray-500 h-6" />
              <div className="font-medium">{e.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER SIGNATURE */}
      <div className="mt-12 text-xs break-inside-avoid">
        <div className="w-full sm:w-1/3 sm:ml-auto text-center">
          <div className="mb-6 border-b border-gray-500 h-6" />
          {customer
            ? `${customer.firstName} ${customer.lastName}`
            : "Kunde"}
        </div>
      </div>

    </div>
  )
}
