"use client";

import { useMemo, useState } from "react";
import type { LineItem } from "@/app/types/lineItem";
import {
  cleanLineItemsForSave,
  createEmptyLineItem,
  formatCents,
  parseEuroToCents,
  parseQuantity,
  sumLineItemsCents,
  withLineItemTotal,
} from "../lib/lineItemUtils";

type Props = {
  initialValue: LineItem[];
  onSave: (next: LineItem[]) => void;
  onClose: () => void;
};

export default function LineItemsModal({ initialValue, onSave, onClose }: Props) {
  const [items, setItems] = useState<LineItem[]>(initialValue);

  const totalCents = useMemo(() => sumLineItemsCents(items), [items]);

  function addItem() {
    setItems((prev) => [...prev, createEmptyLineItem()]);
  }

  function updateTitle(id: string, title: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, title } : i)));
  }

  function updateQuantity(id: string, quantityText: string) {
    const quantity = parseQuantity(quantityText);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? withLineItemTotal({ ...i, quantity }) : i,
      ),
    );
  }

  function updateUnitPrice(id: string, amountText: string) {
    const unitPriceCents = parseEuroToCents(amountText);
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? withLineItemTotal({ ...i, unitPriceCents }) : i,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleSave() {
    onSave(cleanLineItemsForSave(items));
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
                className="col-span-5 rounded-xl border px-3 py-2 text-sm"
                placeholder="Titel (z.B. Norton Antivirus)"
              />

              <input
                inputMode="decimal"
                defaultValue={item.quantity > 0 ? String(item.quantity) : ""}
                onChange={(e) => updateQuantity(item.id, e.target.value)}
                className="col-span-2 rounded-xl border px-3 py-2 text-sm text-right"
                placeholder="Menge"
              />

              <input
                inputMode="decimal"
                defaultValue={
                  item.unitPriceCents ? formatCents(item.unitPriceCents) : ""
                }
                onChange={(e) => updateUnitPrice(item.id, e.target.value)}
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
            Summe:{" "}
            <span className="font-semibold">{formatCents(totalCents)} €</span>
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
