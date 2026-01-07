import { useRef, useState } from "react"
import { employees, type Employee } from "../lib/employees"

export function useEmployeesSelection() {
  
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])


  const [employeeToAdd, setEmployeeToAdd] = useState<number | "">("")
  const [isAdding, setIsAdding] = useState(false)


  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [customEmployeeName, setCustomEmployeeName] = useState("")

  const customIdRef = useRef(-1)

  // Derived
  const selectedIds = selectedEmployees.map(e => e.id)

  const availableEmployees = employees.filter(
    e => !selectedIds.includes(e.id)
  )

  const employeeCount = selectedEmployees.length
  const hasEmployees = employeeCount > 0

  // Actions
  const startAddFromList = () => {
    setIsAdding(true)
    setIsAddingCustom(false)
  }

  const startAddCustom = () => {
    setIsAddingCustom(true)
    setIsAdding(false)
  }

  const cancelAdd = () => {
    setIsAdding(false)
    setIsAddingCustom(false)
    setEmployeeToAdd("")
    setCustomEmployeeName("")
  }

  const addEmployeeFromList = () => {
    if (!employeeToAdd) return

    const found = employees.find(e => e.id === employeeToAdd)
    if (!found) return

    
    if (selectedEmployees.some(e => e.id === found.id)) {
      setEmployeeToAdd("")
      setIsAdding(false)
      return
    }

    setSelectedEmployees(prev => [...prev, found])
    setEmployeeToAdd("")
    setIsAdding(false)
  }

  const addCustomEmployee = () => {
    const name = customEmployeeName.trim()
    if (!name) return

    const newEmployee: Employee = {
      id: customIdRef.current--,
      name,
    }

    setSelectedEmployees(prev => [...prev, newEmployee])
    setCustomEmployeeName("")
    setIsAddingCustom(false)
  }

  const removeEmployee = (id: number) => {
    setSelectedEmployees(prev => prev.filter(e => e.id !== id))
  }

  return {
    // state
    selectedEmployees,
    employeeToAdd,
    isAdding,
    isAddingCustom,
    customEmployeeName,

    // setters
    setEmployeeToAdd,
    setIsAdding,
    setIsAddingCustom,
    setCustomEmployeeName,

    // derived
    availableEmployees,
    employeeCount,
    hasEmployees,

    // actions
    startAddFromList,
    startAddCustom,
    cancelAdd,
    addEmployeeFromList,
    addCustomEmployee,
    removeEmployee,

    }
}
