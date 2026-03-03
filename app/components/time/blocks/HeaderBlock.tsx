import { useMemo, useRef } from "react"


type HeaderBlockProps = {
  date: string
  auftragsnummer: string
  onAuftragsnummerChange: (value: string) => void
  price: string
  onPriceChange: (value: string) => void
  isIOS: boolean
}

function toISODateLocal(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export default function HeaderBlock({
  date,
  auftragsnummer,
  onAuftragsnummerChange,
  price,
  onPriceChange,
  isIOS,
}: HeaderBlockProps) {
  const dateText = useMemo(
    () => new Date(date).toLocaleDateString("de-DE"),
    [date]
  )

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Arbeitsdatum
          {isIOS && <span className="ml-1">📅</span>}
        </label>

        <input
          type="text"
          readOnly
          value={dateText}
          className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-gray-50 text-gray-800"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Auftragsnummer
        </label>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 whitespace-nowrap">
            {date}-
          </span>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={auftragsnummer}
            onChange={(e) => {
              const onlyDigits = e.target.value.replace(/\D/g, "").slice(0,3)
              onAuftragsnummerChange(onlyDigits)
            }}

            className="h-9 w-full rounded-md border border-gray-300 text-gray-800 px-2 text-sm bg-gray-50"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Preis pro Stunde, €
        </label>
        <input
          type="number"
          inputMode="decimal"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-gray-50 text-gray-800"
        />
      </div>
    </>
  )
}
