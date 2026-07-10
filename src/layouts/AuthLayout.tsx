import { Outlet } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="relative bg-[url('/auth-background.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex min-h-full items-center justify-center px-4 py-12">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
