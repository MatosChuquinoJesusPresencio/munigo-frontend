import { Outlet } from 'react-router'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
