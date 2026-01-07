import { useState } from "react"
import { employees } from "../lib/employees"

export function useEmployeesSelection() {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [employeeToAdd, setEmployeeToAdd] = useState<number | "">("")
  const [isAdding, setIsAdding] = useState(false)

  const selectedEmployees = employees.filter(e =>
    selectedIds.includes(e.id)
  )

  const employeeCount = selectedIds.length

  const availableEmployees = employees.filter(
    e => !selectedIds.includes(e.id)
  )

  const addEmployee = () => {
    if (!employeeToAdd) return
    setSelectedIds(prev => [...prev, employeeToAdd as number])
    setEmployeeToAdd("")
    setIsAdding(false)
  }

  const removeEmployee = (id: number) => {
    setSelectedIds(prev => prev.filter(eid => eid !== id))
  }

  return {
    // state
    selectedIds,
    employeeToAdd,
    isAdding,

    // setters
    setEmployeeToAdd,
    setIsAdding,

    // derived
    selectedEmployees,
    availableEmployees,
    employeeCount,
    hasEmployees: employeeCount > 0,

    // actions
    addEmployee,
    removeEmployee,
  }
}
