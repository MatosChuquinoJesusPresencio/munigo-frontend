import { useState, useEffect, useCallback, useRef } from 'react'
import type { Company, Establishment } from '../../types/organization'
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  searchCompanies,
  addCitizenToCompany,
} from '../../lib/company.service'
import {
  createEstablishment,
  updateEstablishment,
  deleteEstablishment,
} from '../../lib/establishment.service'

import CompanyCard from '../../components/organizations/CompanyCard'
import EstablishmentCard from '../../components/organizations/EstablishmentCard'
import CompanyModal from '../../components/organizations/CompanyModal'
import EstablishmentModal from '../../components/organizations/EstablishmentModal'
import DeleteConfirmModal from '../../components/organizations/DeleteConfirmModal'
import EmptyState from '../../components/organizations/EmptyState'

export default function Organizations() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [selectedEstablishments, setSelectedEstablishments] = useState<Establishment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [companyModalOpen, setCompanyModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [establishmentModalOpen, setEstablishmentModalOpen] = useState(false)
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingItem, setDeletingItem] = useState<{
    type: 'company' | 'establishment'
    id: number
    name: string
  } | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Company[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [joiningCompanyId, setJoiningCompanyId] = useState<number | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSearchResults([])
      setSearching(false)
      return
    }
    try {
      setSearching(true)
      setSearchError(null)
      const results = await searchCompanies(trimmed)
      setSearchResults(results)
    } catch {
      setSearchError('Error al buscar empresas.')
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      searchTimeout.current = setTimeout(() => {
        setSearchResults([])
        setSearching(false)
      }, 0)
      return () => {
        if (searchTimeout.current) clearTimeout(searchTimeout.current)
      }
    }
    searchTimeout.current = setTimeout(() => doSearch(searchQuery), 350)
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [searchQuery, doSearch])

  async function handleJoinCompany(companyId: number) {
    try {
      setJoiningCompanyId(companyId)
      await addCitizenToCompany(companyId)
      setSearchQuery('')
      setSearchResults([])
      const refreshed = await getCompanies()
      setCompanies(refreshed)
    } catch {
      setSearchError('Error al asociarse a la empresa.')
    } finally {
      setJoiningCompanyId(null)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getCompanies()
        if (!cancelled) setCompanies(data)
      } catch {
        if (!cancelled) setError('Error al cargar las empresas. Intenta nuevamente.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (selectedCompanyId === null) return
    let cancelled = false
    async function load() {
      try {
        const company = await getCompanyById(selectedCompanyId!)
        if (!cancelled) setSelectedEstablishments(company.establishments ?? [])
      } catch {
        if (!cancelled) setError('Error al cargar los establecimientos.')
      }
    }
    load()
    return () => { cancelled = true }
  }, [selectedCompanyId])

  function handleSelectCompany(companyId: number) {
    setSelectedCompanyId(selectedCompanyId === companyId ? null : companyId)
  }

  async function handleCompanySubmit(data: {
    business_name: string
    ruc: string
  }) {
    if (editingCompany) {
      await updateCompany(editingCompany.id, data)
      setEditingCompany(null)
      if (selectedCompanyId === editingCompany.id) {
        const updated = await getCompanyById(editingCompany.id)
        setSelectedEstablishments(updated.establishments ?? [])
      }
    } else {
      const created = await createCompany(data)
      setSelectedCompanyId(created.id)
    }
    const refreshed = await getCompanies()
    setCompanies(refreshed)
  }

  async function handleEstablishmentSubmit(data: {
    company: number
    name: string
    address: string
    business_category: import('../../types/organization').BusinessCategory
    square_meters: number
  }) {
    if (editingEstablishment) {
      await updateEstablishment(editingEstablishment.id, {
        name: data.name,
        address: data.address,
        business_category: data.business_category,
        square_meters: data.square_meters,
      })
      setEditingEstablishment(null)
    } else {
      await createEstablishment(data)
    }
    if (selectedCompanyId !== null) {
      const company = await getCompanyById(selectedCompanyId)
      setSelectedEstablishments(company.establishments ?? [])
      const refreshed = await getCompanies()
      setCompanies(refreshed)
    }
  }

  async function handleDelete() {
    if (!deletingItem) return

    if (deletingItem.type === 'company') {
      await deleteCompany(deletingItem.id)
      if (selectedCompanyId === deletingItem.id) {
        setSelectedCompanyId(null)
        setSelectedEstablishments([])
      }
    } else {
      await deleteEstablishment(deletingItem.id)
    }
    const refreshed = await getCompanies()
    setCompanies(refreshed)
    if (selectedCompanyId !== null) {
      const company = await getCompanyById(selectedCompanyId)
      setSelectedEstablishments(company.establishments ?? [])
    }
    setDeletingItem(null)
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <div className="mb-2 h-8 w-48 animate-pulse rounded bg-surface" />
          <div className="h-4 w-64 animate-pulse rounded bg-surface" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg bg-surface" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-txt">Mis Empresas</h1>
        <p className="text-sm text-txt-muted">
          Gestiona tus empresas y establecimientos
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-medium underline"
          >
            Cerrar
          </button>
        </div>
      )}

      <section className="relative mb-8 rounded-lg border border-border bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-txt">Buscar empresa existente</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nombre o RUC de la empresa..."
            className="flex-1 rounded-md border border-border px-3 py-2 text-sm text-txt placeholder:text-txt-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {searchError && (
          <p className="mt-2 text-sm text-red-600">{searchError}</p>
        )}
        {searching && (
          <p className="mt-2 text-sm text-txt-muted">Buscando...</p>
        )}
        {searchResults.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-10 mt-1 divide-y divide-border rounded-md border border-border bg-white shadow-lg">
            {searchResults.map((company) => (
              <li key={company.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-txt">{company.business_name}</p>
                  <p className="text-xs text-txt-muted">RUC: {company.ruc}</p>
                </div>
                <button
                  onClick={() => handleJoinCompany(company.id)}
                  disabled={joiningCompanyId === company.id}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-hover disabled:opacity-50"
                >
                  {joiningCompanyId === company.id ? 'Asociando...' : 'Asociarse'}
                </button>
              </li>
            ))}
          </ul>
        )}
        {searchQuery.trim() && !searching && searchResults.length === 0 && !searchError && (
          <p className="mt-2 text-sm text-txt-muted">
            No se encontraron empresas con ese nombre o RUC.
          </p>
        )}
      </section>

      {companies.length === 0 ? (
        <EmptyState onCreateCompany={() => setCompanyModalOpen(true)} />
      ) : (
        <>
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-txt">Empresas</h2>
              <button
                onClick={() => setCompanyModalOpen(true)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                + Nueva empresa
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  isSelected={selectedCompanyId === company.id}
                  onSelect={() => handleSelectCompany(company.id)}
                  onEdit={() => {
                    setEditingCompany(company)
                    setCompanyModalOpen(true)
                  }}
                  onDelete={() => {
                    setDeletingItem({
                      type: 'company',
                      id: company.id,
                      name: company.business_name,
                    })
                    setDeleteModalOpen(true)
                  }}
                />
              ))}
            </div>
          </section>

          {selectedCompanyId !== null && selectedCompany && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-txt">
                  Establecimientos de {selectedCompany.business_name}
                </h2>
                <button
                  onClick={() => {
                    setEditingEstablishment(null)
                    setEstablishmentModalOpen(true)
                  }}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
                >
                  + Nuevo establecimiento
                </button>
              </div>

              {selectedEstablishments.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-white px-6 py-10 text-center">
                  <p className="text-sm text-txt-muted">
                    Esta empresa no tiene establecimientos registrados.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedEstablishments.map((est) => (
                    <EstablishmentCard
                      key={est.id}
                      establishment={est}
                      onEdit={() => {
                        setEditingEstablishment(est)
                        setEstablishmentModalOpen(true)
                      }}
                      onDelete={() => {
                        setDeletingItem({
                          type: 'establishment',
                          id: est.id,
                          name: est.name,
                        })
                        setDeleteModalOpen(true)
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

      <CompanyModal
        key={companyModalOpen ? (editingCompany?.id ?? 'new') : 'company-closed'}
        isOpen={companyModalOpen}
        company={editingCompany}
        onClose={() => setCompanyModalOpen(false)}
        onSubmit={handleCompanySubmit}
      />

      <EstablishmentModal
        key={establishmentModalOpen ? (editingEstablishment?.id ?? 'new') : 'establishment-closed'}
        isOpen={establishmentModalOpen}
        establishment={editingEstablishment}
        companyId={selectedCompanyId ?? 0}
        onClose={() => setEstablishmentModalOpen(false)}
        onSubmit={handleEstablishmentSubmit}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={
          deletingItem?.type === 'company'
            ? '¿Eliminar empresa?'
            : '¿Eliminar establecimiento?'
        }
        itemName={deletingItem?.name ?? ''}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeletingItem(null)
        }}
        onConfirm={handleDelete}
      />
    </div>
  )
}
