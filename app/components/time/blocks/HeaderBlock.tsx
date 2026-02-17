import { useMemo, useRef } from "react"


type HeaderBlockProps = {
  date: string
  onDateChange: (value: string) => void
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
  onDateChange,
  auftragsnummer,
  onAuftragsnummerChange,
  price,
  onPriceChange,
  isIOS,
}: HeaderBlockProps) {

  const dateInputRef = useRef<HTMLInputElement>(null)

  const todayISO = useMemo(() => toISODateLocal(new Date()), [])

  const handleDateChange = (next: string) => {
    if (next !== todayISO) {
      onDateChange(todayISO)
      return
    }
    onDateChange(next)
  }

   return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Arbeitsdatum
          {isIOS && <span className="ml-1">📅</span>}
        </label>

        {isIOS ? (
          <div className="relative">
            <input
              type="text"
              readOnly
              value={new Date(date).toLocaleDateString("de-DE")}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-gray-50 text-gray-800"
            />

            <input
              ref={dateInputRef}
              type="date"
              value={date}
              min={todayISO}
              max={todayISO}
              onChange={(e) => handleDateChange(e.target.value)}
              className="absolute inset-0 opacity-0"
            />
          </div>
        ) : (
          <input
            type="date"
            lang="de"
            value={date}
            min={todayISO}
            max={todayISO}
            onChange={(e) => handleDateChange(e.target.value)}
            className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-gray-50 text-gray-800"
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
          onChange={(e) => onAuftragsnummerChange(e.target.value)}
          className="h-9 w-full rounded-md border border-gray-300 text-gray-800 px-2 text-sm bg-gray-50"
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
          onChange={(e) => onPriceChange(e.target.value)}
          className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-gray-50 text-gray-800"
        />
      </div>
    </>
  )
}
