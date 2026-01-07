type HeaderBlockProps = {
  date: string
  onDateChange: (value: string) => void
  auftragsnummer: string
  onAuftragsnummerChange: (value: string) => void
  price: string
  onPriceChange: (value: string) => void
  isIOS: boolean
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
  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Arbeitsdatum
          {isIOS && <span className="ml-1">📅</span>}
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
            onChange={(e) => onDateChange(e.target.value)}
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
          onChange={(e) => onAuftragsnummerChange(e.target.value)}
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
          onChange={(e) => onPriceChange(e.target.value)}
          className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm bg-white"
        />
      </div>
    </>
  )
}
