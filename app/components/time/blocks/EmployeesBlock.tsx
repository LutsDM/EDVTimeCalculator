"use client";

import { Employee } from "../lib/employees";

type Props = {
  selectedEmployees: Employee[]
  availableEmployees: Employee[]
  employeeToAdd: number | ""
  isAdding: boolean

  isAddingCustom: boolean
  customEmployeeName: string

  hasEmployees: boolean

  onStartAddFromList: () => void
  onStartAddCustom: () => void
  onCancelAdd: () => void

  onEmployeeToAddChange: (id: number | "") => void
  onCustomEmployeeNameChange: (value: string) => void

  onAddEmployeeFromList: () => void
  onAddCustomEmployee: () => void

  onRemoveEmployee: (id: number) => void
}


export default function EmployeesBlock({
  selectedEmployees,
  availableEmployees,
  employeeToAdd,
  isAdding,
  isAddingCustom,
  customEmployeeName,
  hasEmployees,

  onStartAddFromList,
  onStartAddCustom,
  onCancelAdd,

  onEmployeeToAddChange,
  onCustomEmployeeNameChange,

  onAddEmployeeFromList,
  onAddCustomEmployee,

  onRemoveEmployee,
}: Props) {
  return (
    <div
      className={`bg-white border rounded-lg p-4 shadow-sm space-y-3
        ${!hasEmployees ? "border-amber-300" : "border-gray-200"}
      `}
    >
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Mitarbeiter
      </label>

      {!isAdding && !isAddingCustom && (
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onStartAddFromList}
            className="inline-flex items-center gap-2 text-sm text-green-700 font-medium"
          >
            <span className="text-lg leading-none">+</span>
            Aus Liste hinzufügen
          </button>

          <button
            type="button"
            onClick={onStartAddCustom}
            className="inline-flex items-center gap-2 text-sm text-blue-700 font-medium"
          >
            <span className="text-lg leading-none">+</span>
            Manuell hinzufügen
          </button>
        </div>
      )}

      {!hasEmployees && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
          Bitte wählen Sie mindestens einen Mitarbeiter aus, um den Servicebericht zu erstellen.
        </div>
      )}

      {/* add from list */}
      {isAdding && (
        <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <select
            value={employeeToAdd}
            onChange={(e) =>
              onEmployeeToAddChange(
                e.target.value ? Number(e.target.value) : ""
              )
            }
            className="h-9 flex-1 rounded-md border border-gray-300 px-2 text-sm"
          >
            
            <option value="">Mitarbeiter auswählen</option>
            {availableEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
</div>
          <button
            type="button"
            disabled={!employeeToAdd}
            onClick={onAddEmployeeFromList}
            className="h-9 px-3 rounded-md bg-green-600 text-white text-sm disabled:opacity-50"
          >
            Hinzufügen
          </button>

          <button
            type="button"
            onClick={onCancelAdd}
            className="h-9 px-3 rounded-md border border-gray-300 text-sm"
          >
            Abbrechen
          </button>
        </div>
      )}

      {/* Manual add */}
      {isAddingCustom && (
        <div className="flex flex-col gap-2">

          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Name des Mitarbeiters"
              value={customEmployeeName}
              onChange={(e) => onCustomEmployeeNameChange(e.target.value)}
              className="h-9 flex-1 rounded-md border border-gray-300 px-2 text-sm"
            />
          </div>
          <button
            type="button"
            disabled={!customEmployeeName.trim()}
            onClick={onAddCustomEmployee}
            className="h-9 px-3 rounded-md bg-blue-600 text-white text-sm disabled:opacity-50"
          >
            Hinzufügen
          </button>

          <button
            type="button"
            onClick={onCancelAdd}
            className="h-9 px-3 rounded-md border border-gray-300 text-sm"
          >
            Abbrechen
          </button>

        </div>
      )}

      {/* Employees fron databank */}
      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-800 text-sm"
            >
              {employee.name}
              <button
                type="button"
                onClick={() => onRemoveEmployee(employee.id)}
                className="ml-1 text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}