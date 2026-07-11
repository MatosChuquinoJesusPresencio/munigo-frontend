import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { DocumentType } from '../../types/auth'

export default function Register() {
  const { register, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.DNI)
  const [documentNumber, setDocumentNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLocalError(null)

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        document_type: documentType,
        document_number: documentNumber,
        password,
      })
      navigate('/login')
    } catch {
      // error manejado por el context
    }
  }

  const displayError = localError || error

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-white p-8 shadow-md">
      <h1 className="mb-1 text-2xl font-semibold text-txt">Crear cuenta</h1>
      <p className="mb-6 text-sm text-txt-muted">Regístrate en Munigo</p>

      {displayError && (
        <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className="text-sm font-medium text-txt">
            Nombres
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className="text-sm font-medium text-txt">
            Apellidos
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-txt">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

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
            <option value={DocumentType.RUC}>RUC</option>
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
            minLength={6}
            className="rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-txt">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-md border border-border px-3 py-2 text-sm text-txt outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          onClick={() => {
            clearError()
            setLocalError(null)
          }}
          className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50"
        >
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-txt-muted">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-accent transition hover:text-orange-600">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
