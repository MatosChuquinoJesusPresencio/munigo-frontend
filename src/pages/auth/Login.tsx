import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { DocumentType } from '../../types/auth'

export default function Login() {
  const { login, isLoading, error, clearError } = useAuth()

  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.DNI)
  const [documentNumber, setDocumentNumber] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login({ document_type: documentType, document_number: documentNumber, password })
    } catch {
      // error manejado por el context
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 shadow-md">
      <h1 className="mb-1 text-2xl font-semibold text-txt">Iniciar sesión</h1>
      <p className="mb-6 text-sm text-txt-muted">Accede a tu cuenta de Munigo</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="documentType" className="text-sm font-medium text-txt">
            Tipo de documento
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            className="rounded-md border border-border bg-white px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value={DocumentType.DNI}>DNI</option>
            <option value={DocumentType.CARNE_DE_EXTRANJERIA}>Carné de Extranjería</option>
            <option value={DocumentType.PASAPORTE}>Pasaporte</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="documentNumber" className="text-sm font-medium text-txt">
            Número de documento
          </label>
          <input
            id="documentNumber"
            type="text"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            required
            className="rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-txt">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          onClick={() => clearError()}
          className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50"
        >
          {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-txt-muted">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-medium text-accent transition hover:text-orange-600">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
