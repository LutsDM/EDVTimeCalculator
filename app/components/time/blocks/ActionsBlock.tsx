type ActionsBlockProps = {
  hasEmployees: boolean
  isIOS: boolean
  onPrint: () => void
  onPreview: () => void
  onDownloadPdf: () => void
}

export default function ActionsBlock({
  hasEmployees,
  isIOS,
  onPrint,
  onPreview,
  onDownloadPdf,
}: ActionsBlockProps) {
  return (
    <div className="flex justify-end gap-2">
      {!isIOS && (
        <button
          type="button"
          disabled={!hasEmployees}
          onClick={onPrint}
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
        onClick={onPreview}
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
        onClick={onDownloadPdf}
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
  )
}
