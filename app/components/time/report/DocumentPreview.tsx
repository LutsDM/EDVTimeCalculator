"use client";

import {
  DOCUMENT_TITLES,
  type DocumentType,
  hasBothSignatures,
} from "../../../types/documentTypes";

type DocumentPreviewProps = {
  documentType: DocumentType;
  onClose: () => void;
  signatureKunde: string | null;
  signatureEmployee: string | null;
  onOpenKundeSignature: () => void;
  onOpenEmployeeSignature: () => void;
  onDownloadPdf: () => void;
  children: React.ReactNode;
};

export default function DocumentPreview({
  documentType,
  onClose,
  signatureKunde,
  signatureEmployee,
  onOpenKundeSignature,
  onOpenEmployeeSignature,
  onDownloadPdf,
  children,
}: DocumentPreviewProps) {
  const canDownload = hasBothSignatures({
    kunde: signatureKunde,
    employee: signatureEmployee,
  });
  const missingEmployee = !signatureEmployee;
  const missingKunde = !signatureKunde;

  return (
    <div className="block print:block">
      <div className="max-w-[800px] mx-auto px-4 py-4 print:hidden space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Zurück
          </button>
          <span className="text-sm font-medium text-gray-700">
            {DOCUMENT_TITLES[documentType]}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenEmployeeSignature}
            className={`relative touch-manipulation min-h-11 px-4 rounded-lg border text-sm font-medium transition-colors
              ${
                signatureEmployee
                  ? "border-green-600 bg-green-50 text-green-800"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
              }`}
          >
            {signatureEmployee && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white text-xs">
                ✓
              </span>
            )}
            <span className={signatureEmployee ? "pl-6" : ""}>
              Vom Mitarbeiter unterschreiben
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenKundeSignature}
            className={`relative touch-manipulation min-h-11 px-4 rounded-lg border text-sm font-medium transition-colors
              ${
                signatureKunde
                  ? "border-green-600 bg-green-50 text-green-800"
                  : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
              }`}
          >
            {signatureKunde && (
              <span className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white text-xs">
                ✓
              </span>
            )}
            <span className={signatureKunde ? "pl-6" : ""}>
              Vom Kunden unterschreiben
            </span>
          </button>

          <button
            type="button"
            disabled={!canDownload}
            onClick={onDownloadPdf}
            className={`touch-manipulation min-h-11 px-4 rounded-lg text-sm font-medium transition-colors
              ${
                canDownload
                  ? "bg-green-700 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            PDF herunterladen
          </button>
        </div>

        {!canDownload && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-2">
            PDF steht erst nach beiden Unterschriften zur Verfügung.
            {missingEmployee && missingKunde && (
              <span className="block mt-1">
                {" "}
                Es fehlen: Unterschrift Mitarbeiter, Unterschrift Kunde.
              </span>
            )}
            {missingEmployee && !missingKunde && (
              <span className="block mt-1">
                {" "}
                Es fehlt: Unterschrift Mitarbeiter.
              </span>
            )}
            {!missingEmployee && missingKunde && (
              <span className="block mt-1"> Es fehlt: Unterschrift Kunde.</span>
            )}
          </p>
        )}
      </div>

      <div className="print:block">{children}</div>
    </div>
  );
}
