import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

const steps = [
  {
    num: '01',
    title: 'Crea tu cuenta',
    description: 'Regístrate con tu DNI o documento en segundos.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Elige tu trámite',
    description: 'Selecciona entre ITSE o Licencia de Funcionamiento y agenda tu cita.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Recibe tu confirmación',
    description: 'Recibe confirmación y recordatorios de tu cita.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
  },
]

const features = [
  {
    title: 'ITSE',
    description: 'Agenda tu inspección de seguridad y salud en el trabajo para tu establecimiento.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: 'Licencias de Funcionamiento',
    description: 'Solicita y renueva tu licencia para operar tu negocio en el distrito.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    title: 'Citas',
    description: 'Agenda y administra tus citas de manera rápida y sencilla desde cualquier dispositivo.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
]

const stats = [
  { value: '1,200+', label: 'Ciudadanos registrados' },
  { value: '50+', label: 'Establecimientos atendidos' },
  { value: '5,000+', label: 'Citas agendadas' },
  { value: '98%', label: 'Satisfacción' },
]

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1C1C1E] py-24">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Gestiona tus citas en Los Olivos
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            Agenda tus citas para trámites de ITSE y Licencias de Funcionamiento en el distrito de
            Los Olivos.
          </p>
          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:border-white/60 hover:bg-white/10"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-white px-6 py-3 text-sm font-medium text-[#1C1C1E] transition hover:bg-white/90"
              >
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-2xl font-semibold text-txt">Nuestros servicios</h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-txt-muted">
            Todo lo que necesitas para gestionar tus citas en un solo lugar.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold text-txt">{f.title}</h3>
                <p className="text-sm leading-relaxed text-txt-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="border-y border-border bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-2xl font-semibold text-txt">¿Cómo funciona?</h2>
          <p className="mx-auto mb-14 max-w-lg text-center text-txt-muted">
            Tres sencillos pasos para agendar tu cita.
          </p>
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3 md:gap-4">
            {steps.map((s, i) => (
              <div key={s.num} className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                  {s.num}
                </div>
                <h3 className="mb-2 font-semibold text-txt">{s.title}</h3>
                <p className="text-sm leading-relaxed text-txt-muted">{s.description}</p>

                {i < steps.length - 1 && (
                  <svg
                    className="pointer-events-none absolute left-[calc(50%+2.5rem)] top-5 hidden h-5 w-10 text-border md:block"
                    fill="none"
                    viewBox="0 0 40 20"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 10h32m-6-6l6 6-6 6" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mb-1 text-3xl font-bold text-white md:text-4xl">{s.value}</div>
              <div className="text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
