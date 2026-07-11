import { Routes, Route } from 'react-router'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Tramites from './pages/citizen/Tramites'
import Appointments from './pages/citizen/Appointments'
import Notifications from './pages/citizen/Notifications'
import Organizations from './pages/citizen/Organizations'
import Panel from './pages/employee/Panel'
import NotFound from './pages/errors/NotFound'
import Unauthorized from './pages/errors/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import { UserRole } from './types/auth'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute allowedRoles={[UserRole.CITIZEN]} />}>
          <Route path="/tramites" element={<Tramites />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/organizations" element={<Organizations />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]} />}>
          <Route path="/panel" element={<Panel />} />
        </Route>
      </Route>

      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
