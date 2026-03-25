"use client";

import { useMemo, useState } from "react";
import {
  ORDER_DETAILS_MAX_CHARS,
  clampOrderDetails,
} from "../lib/orderDetailsLimits";

type Props = {
  value: string;
  onSave: (next: string) => void;
};

export default function OrderDetailsBlock({ value, onSave }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState(value);

  const hasDetails = useMemo(
    () => value.trim().length > 0,
    [value]
  );

  function handleOpen() {
    setText(clampOrderDetails(value));
    setIsOpen(true);
  }

  function handleSave() {
    onSave(text);
    setIsOpen(false);
  }

  function handleClear() {
    onSave("");
    setText("");
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border-2 border-gray-200 bg-gray-50/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-gray-900">Auftragsdetails</div>
          <div className="text-sm opacity-70">
            Freitext für den Auftrag, erscheint im Bericht.
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpen}
          className={[
            "rounded-xl px-4 py-2 text-sm font-medium",
            hasDetails
              ? "bg-emerald-600 text-white"
              : "bg-zinc-900 text-white",
          ].join(" ")}
        >
          {hasDetails ? "Details hinzugefügt" : "Details hinzufügen"}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="text-xl font-bold text-gray-900">Auftragsdetails</div>
            <div className="mt-1 text-sm opacity-70">
              Schreibe hier einen beliebigen Text.
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(clampOrderDetails(e.target.value))}
              rows={6}
              maxLength={ORDER_DETAILS_MAX_CHARS}
              className="mt-3 w-full rounded-xl border p-3 text-sm outline-none focus:ring-2"
              placeholder="z.B. Kunde wünscht Datenübernahme, E-Mail wurde neu eingerichtet..."
            />

            <div className="mt-2 flex justify-end text-xs">
              <span
                className={
                  text.length >= ORDER_DETAILS_MAX_CHARS
                    ? "font-medium text-red-600"
                    : text.length >= ORDER_DETAILS_MAX_CHARS * 0.9
                      ? "text-amber-600"
                      : "text-gray-500"
                }
              >
                {text.length} / {ORDER_DETAILS_MAX_CHARS}
              </span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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
      )}
    </div>
  );
}
