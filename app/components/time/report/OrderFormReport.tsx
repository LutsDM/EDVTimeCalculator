"use client";

import { LineItem } from "@/app/types/lineItem";
import { Employee } from "../lib/employees";
import { Customer } from "@/app/types/customer";

type OrderFormReportProps = {
  arbeitsdatum: string;
  auftragsnummer: string;
  kundenNr?: string;
  preisProStunde: string;
  mitarbeiterAnzahl: number;
  orderDetails?: string;
  lineItems?: LineItem[];
  extraBrutto?: string;
  employees: Employee[];
  customer?: Customer | null;
  signatureKunde: string | null;
  signatureEmployee: string | null;
};

export default function OrderFormReport({
  arbeitsdatum,
  auftragsnummer,
  kundenNr,
  preisProStunde,
  mitarbeiterAnzahl,
  orderDetails,
  lineItems,
  extraBrutto,
  employees,
  customer,
  signatureKunde,
  signatureEmployee,
}: OrderFormReportProps) {
  return (
    <div className="print-area max-w-[800px] mx-auto bg-white p-8 text-base text-gray-900 leading-relaxed">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
          <div className="text-xs leading-relaxed">
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
                {customer.phone && <div>Tel. {customer.phone}</div>}
              </div>
            )}
          </div>
          <div className="self-start">
            <img
              src="/LOGO.png"
              alt="EDV Service Samirae"
              width={192}
              height={96}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>

    <div className="text-right text-sm leading-relaxed mb-4">
        <strong className="text-xl font-bold block mb-1">Auftragsformular</strong>
        Arbeitsdatum: {arbeitsdatum}<br />
        Auftragsnummer: {auftragsnummer}<br />
        {kundenNr && <>Kunden Nr: {kundenNr}<br /></>}
      </div>

      {/* Таблица как в Servicebericht (без блока времени) */}
      <table className="w-full border border-gray-300 mb-6">
        <tbody>
          <tr className="border border-gray-300">
            <td className="p-2">Stundensatz</td>
            <td className="p-2 text-right">{preisProStunde}</td>
          </tr>
          <tr className="border border-gray-300">
            <td className="p-2">Mitarbeiteranzahl</td>
            <td className="p-2 text-right">{mitarbeiterAnzahl}</td>
          </tr>
          {lineItems?.length
            ? lineItems.map((item) => (
                <tr key={item.id} className="border border-gray-300">
                  <td className="p-2">{item.title}</td>
                  <td className="p-2 text-right">
                    {(item.amountCents / 100).toFixed(2).replace(".", ",")} €
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>

      {orderDetails?.trim() ? (
        <div className="mt-4 mb-6 rounded-lg border border-gray-300 bg-gray-50 p-4">
          <div className="text-base font-bold text-gray-800">Auftragsdetails</div>
          <div className="mt-2 whitespace-pre-wrap text-base">{orderDetails}</div>
        </div>
      ) : null}

      {/* SIGNATURES */}
      <div className="flex items-center gap-10 mt-10">
        <div className="ml-auto max-w-[400px] text-sm break-inside-avoid">
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
                <span className="text-gray-400"></span>
              )}
            </div>
            <div className="border-b border-gray-500 h-2 mb-1" />
            <div className="font-medium">
              {employees.length === 1 ? employees[0].name : "Mitarbeiter"}
            </div>
          </div>
        </div>
        <div className="text-xs break-inside-avoid">
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
                <span className="text-gray-400"></span>
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
  );
}
