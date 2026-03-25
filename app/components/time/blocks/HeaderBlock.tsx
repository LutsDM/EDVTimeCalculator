import { useMemo } from "react"

type HeaderBlockProps = {
  date: string
  auftragsnummer: string
  onAuftragsnummerChange: (value: string) => void
  price: string
  onPriceChange: (value: string) => void
  isIOS: boolean
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4">
      <div className="min-w-0 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
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

      <div className="min-w-0 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Auftragsnummer
        </label>

        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-sm text-gray-700 whitespace-nowrap">
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

            className="h-9 min-w-0 flex-1 rounded-md border border-gray-300 text-gray-800 px-2 text-sm bg-gray-50"
          />
        </div>
      </div>

      <div className="min-w-0 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
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
    </div>
  )
}
