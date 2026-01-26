import { SignatureModal } from "../Signature/SignatureModal"

type ActionsBlockProps = {
  hasEmployees: boolean
  isIOS: boolean
  onPrint: () => void
  onPreview: () => void
  onDownloadPdf: () => void
  onReset: () => void

  signatureKundeOpen: boolean
  onOpenKundeSignature: () => void
  onCloseKundeSignature: () => void

  signatureKunde: string | null
  setSignatureKunde: (v: string | null) => void

  signatureEmployeeOpen: boolean
  onOpenEmployeeSignature: () => void
  onCloseEmployeeSignature: () => void

  signatureEmployee: string | null
  setSignatureEmployee: (v: string | null) => void

}

export default function ActionsBlock({
  hasEmployees,
  isIOS,
  onPrint,
  onPreview,
  onDownloadPdf,
  onReset,

  signatureEmployeeOpen,
  onOpenEmployeeSignature,
  onCloseEmployeeSignature,
  signatureEmployee,
  setSignatureEmployee,

  signatureKundeOpen,
  onOpenKundeSignature,
  onCloseKundeSignature,
  signatureKunde,
  setSignatureKunde,
}: ActionsBlockProps) {
  const handleResetClick = () => {
    const ok = window.confirm("Aktuelle Eingaben wirklich löschen?")
    if (!ok) return
    onReset()
  }

  return (
    <div className="mb-8">
      <div className="space-y-3">
        {/* Preview */}
        <button
          type="button"
          disabled={!hasEmployees}
          onClick={onPreview}
          className={`w-full touch-manipulation h-12 px-4 rounded-lg text-sm font-medium transition-colors
          ${hasEmployees
              ? "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          Bericht ansehen
        </button>

        {/* Grid of actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* Reset */}
          <button
            type="button"
            onClick={handleResetClick}
            className="touch-manipulation h-12 rounded-lg px-3 text-sm font-medium border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 active:scale-[0.98]"
          >
            Formular leeren
          </button>

          {/* Print or Save (iOS) */}
          {!isIOS ? (
            <button
              type="button"
              disabled={!hasEmployees}
              onClick={onPrint}
              className={`touch-manipulation h-12 rounded-lg px-3 text-sm font-medium transition-colors
              ${hasEmployees
                  ? "bg-red-900 text-white hover:bg-red-800 active:bg-red-950"
                  : "bg-red-200 text-white cursor-not-allowed"
                }`}
            >
              Drucken
            </button>
          ) : (
            <button
              type="button"
              disabled={!hasEmployees}
              onClick={onDownloadPdf}
              className={`touch-manipulation h-12 rounded-lg px-3 text-sm font-medium transition-colors
              ${hasEmployees
                  ? "bg-green-700 text-white hover:bg-green-600 active:bg-green-800 active:scale-[0.98]"
                  : "bg-green-200 text-white cursor-not-allowed"
                }`}
            >
              Drucken
            </button>
          )}

          {/* PDF button desktop only */}
          {!isIOS && (
            <button
              type="button"
              disabled={!hasEmployees}
              onClick={onDownloadPdf}
              className={`touch-manipulation h-12 rounded-lg px-3 text-sm font-medium transition-colors
              ${hasEmployees
                  ? "bg-green-700 text-white hover:bg-green-600 active:bg-green-800 active:scale-[0.98]"
                  : "bg-green-200 text emphasize cursor-not-allowed"
                }`}
            >
              PDF
            </button>
          )}

          {/* Kunde signature */}
          {/* Kunde signature */}
          <button
            type="button"
            onClick={onOpenKundeSignature}
            className={`relative touch-manipulation min-h-12 w-full rounded-lg border px-3 py-2 text-sm font-medium
    whitespace-normal text-center leading-tight transition-colors
    ${signatureKunde
                ? "border-green-600 bg-green-50 text-green-800 hover:bg-green-100"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
              }`}
          >
            {signatureKunde && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white text-xs">
                ✓
              </span>
            )}

            <span className={signatureKunde ? "pl-6 block" : "block"}>
              {signatureKunde ? "Unterschrift des Kunden hinzugefügt" : "Kunde unterschreiben lassen"}
            </span>
          </button>

          {/* Mitarbeiter signature */}
          <button
            type="button"
            onClick={onOpenEmployeeSignature}
            className={`relative touch-manipulation min-h-12 w-full rounded-lg border px-3 py-2 text-sm font-medium
    whitespace-normal text-center leading-tight transition-colors
    ${signatureEmployee
                ? "border-green-600 bg-green-50 text-green-800 hover:bg-green-100"
                : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
              }`}
          >
            {signatureEmployee && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white text-xs">
                ✓
              </span>
            )}

            <span className={signatureEmployee ? "pl-6 block" : "block"}>
              {signatureEmployee ? "Unterschrift des Mitarbeiters hinzugefügt" : "Mitarbeiter unterschreiben lassen"}
            </span>
          </button>


        </div>

        {/* Modals */}
        <SignatureModal
          open={signatureKundeOpen}
          onClose={onCloseKundeSignature}
          signature={signatureKunde}
          setSignature={setSignatureKunde}
        />

        <SignatureModal
          open={signatureEmployeeOpen}
          onClose={onCloseEmployeeSignature}
          signature={signatureEmployee}
          setSignature={setSignatureEmployee}
        />
      </div>
    </div>
  )

}
