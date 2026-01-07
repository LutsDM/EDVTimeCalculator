"use client";

import { Employee } from "../lib/employees";

type Props = {
  selectedEmployees: Employee[];
  availableEmployees: Employee[];
  employeeToAdd: number | "";
  isAdding: boolean;

  hasEmployees: boolean;

  onStartAdd: () => void;
  onCancelAdd?: () => void;
  onEmployeeToAddChange: (id: number | "") => void;
  onAddEmployee: () => void;
  onRemoveEmployee: (id: number) => void;
};

export default function EmployeesBlock({
  selectedEmployees,
  availableEmployees,
  employeeToAdd,
  isAdding,
  hasEmployees,
  onStartAdd,
  onEmployeeToAddChange,
  onAddEmployee,
  onRemoveEmployee,
}: Props) {
  return (
    <div
      className={`bg-white border rounded-lg p-4 shadow-sm space-y-3
        ${!hasEmployees ? "border-amber-300" : "border-gray-200"}
      `}
    >
      {!isAdding && (
        <button
          type="button"
          onClick={onStartAdd}
          className="inline-flex items-center gap-2 text-sm text-green-700 font-medium"
        >
          <span className="text-lg leading-none">+</span>
          Mitarbeiter hinzufügen
        </button>
      )}

      {!hasEmployees && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
          Bitte wählen Sie mindestens einen Mitarbeiter aus, um den Servicebericht zu erstellen.
        </div>
      )}

      {isAdding && (
        <div className="flex gap-2">
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

          <button
            type="button"
            disabled={!employeeToAdd}
            onClick={onAddEmployee}
            className="h-9 px-3 rounded-md bg-green-600 text-white text-sm disabled:opacity-50"
          >
            Hinzufügen
          </button>
        </div>
      )}

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
  );
}
