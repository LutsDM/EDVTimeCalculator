"use client"

import { Customer } from "@/app/types/customer"
import { useState } from "react"

type Props = {
  initialValue: Customer | null
  onSave: (customer: Customer) => void
  onClose: () => void
}

export default function CustomerModal({
  initialValue,
  onSave,
  onClose,
}: Props) {
  const [type, setType] = useState<Customer["type"]>(
    initialValue?.type ?? "private"
  )

  const [form, setForm] = useState<Customer>({
    type: initialValue?.type ?? "private",
    firstName: initialValue?.firstName ?? "",
    lastName: initialValue?.lastName ?? "",
    phone: initialValue?.phone ?? "",
    postalCode: initialValue?.postalCode ?? "",
    city: initialValue?.city ?? "",
    street: initialValue?.street ?? "",
    houseNumber: initialValue?.houseNumber ?? "",
    companyName: initialValue?.companyName ?? "",
  })

  function update<K extends keyof Customer>(key: K, value: Customer[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    onSave({
      ...form,
      type,
      companyName: type === "company" ? form.companyName : undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4 space-y-4">
        <div className="text-lg font-semibold">Kundendaten</div>

        {/* Type */}
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={type === "private"}
              onChange={() => setType("private")}
            />
            Privatkunde
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={type === "company"}
              onChange={() => setType("company")}
            />
            Firma
          </label>
        </div>

        {type === "company" && (
          <input
            className="w-full border rounded p-2 text-sm"
            placeholder="Firmenname"
            value={form.companyName}
            onChange={e => update("companyName", e.target.value)}
          />
        )}

        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Vorname"
            className="border p-2 text-sm"
            value={form.firstName}
            onChange={e => update("firstName", e.target.value)}
          />
          <input
            placeholder="Nachname"
            className="border p-2 text-sm"
            value={form.lastName}
            onChange={e => update("lastName", e.target.value)}
          />
        </div>

        <input
          placeholder="Telefon"
          className="border p-2 text-sm"
          value={form.phone}
          onChange={e => update("phone", e.target.value)}
        />

        <div className="grid grid-cols-3 gap-2">
          <input
            placeholder="PLZ"
            className="border p-2 text-sm"
            value={form.postalCode}
            onChange={e => update("postalCode", e.target.value)}
          />
          <input
            placeholder="Ort"
            className="border p-2 text-sm col-span-2"
            value={form.city}
            onChange={e => update("city", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            placeholder="Straße"
            className="border p-2 text-sm col-span-2"
            value={form.street}
            onChange={e => update("street", e.target.value)}
          />
          <input
            placeholder="Nr."
            className="border p-2 text-sm"
            value={form.houseNumber}
            onChange={e => update("houseNumber", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="text-sm">
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  )
}
