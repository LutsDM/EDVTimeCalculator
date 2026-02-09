"use client";

import { useMemo, useState } from "react";
import type { LineItem } from "@/app/types/lineItem";

type Props = {
  initialValue: LineItem[];
  onSave: (next: LineItem[]) => void;
  onClose: () => void;
};

function parseEuroToCents(input: string): number {
  const normalized = input.trim().replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100);
}

function formatCents(cents: number): string {
  const euros = (cents / 100).toFixed(2);
  return euros.replace(".", ",");
}

export default function LineItemsModal({ initialValue, onSave, onClose }: Props) {
  const [items, setItems] = useState<LineItem[]>(initialValue);

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + (i.amountCents || 0), 0),
    [items]
  );

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", amountCents: 0 },
    ]);
  }

  function updateTitle(id: string, title: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, title } : i)));
  }

  function updateAmount(id: string, amountText: string) {
    const cents = parseEuroToCents(amountText);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, amountCents: cents } : i))
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleSave() {
    const cleaned = items
      .map((i) => ({
        ...i,
        title: i.title.trim(),
      }))
      .filter((i) => i.title.length > 0 && i.amountCents > 0);

    onSave(cleaned);
    onClose();
  }

  function handleClear() {
    onSave([]);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="text-lg font-semibold">Zusatzpositionen</div>
        <div className="mt-1 text-sm opacity-70">
          Manuelle Positionen, die zur Gesamtsumme addiert werden.
        </div>

        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <input
                value={item.title}
                onChange={(e) => updateTitle(item.id, e.target.value)}
                className="col-span-7 rounded-xl border px-3 py-2 text-sm"
                placeholder="Titel (z.B. Norton Antivirus)"
              />

              <input
                inputMode="decimal"
                defaultValue={item.amountCents ? formatCents(item.amountCents) : ""}
                onChange={(e) => updateAmount(item.id, e.target.value)}
                className="col-span-4 rounded-xl border px-3 py-2 text-sm text-right"
                placeholder="Preis € (z.B. 40,00)"
              />

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="col-span-1 rounded-xl border px-2 py-2 text-sm"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={addItem}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            + Position hinzufügen
          </button>

          <div className="text-sm">
            Summe: <span className="font-semibold">{formatCents(totalCents)} €</span>
          </div>
        </div>

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
