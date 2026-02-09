"use client";

import { useState } from "react";

type Props = {
  initialValue: string;
  onSave: (next: string) => void;
  onClose: () => void;
};

export default function OrderDetailsModal({ initialValue, onSave, onClose }: Props) {
  const [value, setValue] = useState(initialValue);

  function handleSave() {
    onSave(value);
    onClose();
  }

  function handleClear() {
    onSave("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="text-lg font-semibold">Auftragsdetails</div>
        <div className="mt-1 text-sm opacity-70">
          Schreibe hier einen beliebigen Text, der im Bericht erscheint.
        </div>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={6}
          className="mt-3 w-full rounded-xl border p-3 text-sm outline-none focus:ring-2"
          placeholder="z.B. Datenübernahme, Einrichtung von E-Mail, Backup, neue SSD..."
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Abbrechen
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Löschen
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
