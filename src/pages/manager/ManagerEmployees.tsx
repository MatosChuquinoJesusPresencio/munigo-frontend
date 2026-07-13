import { useState, useEffect } from 'react'
import { employeeService } from '../../lib/employee.service'
import type { EmployeeUser, EmployeeCreateRequest, EmployeeUpdateRequest } from '../../lib/employee.service'
import { PositionLabels, Position, Area, AreaLabels } from '../../types/auth'
import EmployeeForm from './EmployeeForm'

export default function ManagerEmployees() {
  const [employees, setEmployees] = useState<EmployeeUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<EmployeeUser | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function loadEmployees() {
    try {
      setLoading(true)
      const data = await employeeService.getAllEmployees()
      setEmployees(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  async function handleCreate(data: EmployeeCreateRequest | EmployeeUpdateRequest) {
    await employeeService.createEmployee(data as EmployeeCreateRequest)
    setShowForm(false)
    try { await loadEmployees() } catch { /* form already closed */ }
  }

  async function handleUpdate(data: EmployeeUpdateRequest) {
    if (!editingEmployee) return
    await employeeService.updateEmployee(editingEmployee.id, data)
    setEditingEmployee(null)
    try { await loadEmployees() } catch { /* form already closed */ }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
  }

  async function confirmDelete() {
    if (deletingId === null) return
    try {
      await employeeService.deleteEmployee(deletingId)
      setDeletingId(null)
      await loadEmployees()
    } catch {
      // silent
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-txt">Empleados</h1>
          <p className="text-sm text-txt-muted">Gestión de empleados del sistema</p>
        </div>
        <button
          onClick={() => { setEditingEmployee(null); setShowForm(true) }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          + Crear empleado
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-txt-muted">Cargando empleados...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
          <h3 className="mb-2 text-lg font-semibold text-txt">No hay empleados</h3>
          <p className="text-sm text-txt-muted">Crea el primer empleado del sistema.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Nombre</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Email</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Cargo</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-txt-muted">Área</th>
                <th className="px-5 py-3 text-right text-sm font-medium text-txt-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 text-sm font-medium text-txt">
                    {emp.first_name} {emp.last_name}
                  </td>
                  <td className="px-5 py-3 text-sm text-txt-muted">{emp.email}</td>
                  <td className="px-5 py-3 text-sm text-txt-muted">
                    {PositionLabels[emp.position as Position] || emp.position}
                  </td>
                  <td className="px-5 py-3 text-sm text-txt-muted">
                    {AreaLabels[emp.area as Area] || emp.area}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingEmployee(emp); setShowForm(true) }}
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-txt transition hover:bg-surface"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={editingEmployee ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingEmployee(null) }}
        />
      )}

      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-sm rounded-lg border border-border bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-txt">Confirmar eliminación</h3>
            <p className="mb-4 text-sm text-txt-muted">
              ¿Estás seguro de eliminar este empleado? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="rounded-md border border-border px-4 py-2 text-sm text-txt transition hover:bg-surface"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
