"use client";

import React from "react";
import SignaturePad from "./SignaturePad";

type SignatureModalProps = {
  open: boolean;
  onClose: () => void;

  signature: string | null;
  setSignature: (v: string | null) => void;
};

export function SignatureModal({
  open,
  onClose,
  signature,
  setSignature,
}: SignatureModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Unterschrift</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Schließen
          </button>
        </div>

        <SignaturePad value={signature} onChange={setSignature} />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
}
