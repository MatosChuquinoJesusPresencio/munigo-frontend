import { Routes, Route } from 'react-router'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Appointments from './pages/citizen/Appointments'
import Panel from './pages/employee/Panel'
import NotFound from './pages/errors/NotFound'
import Unauthorized from './pages/errors/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import { UserRole } from './types/auth'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/appointments" element={<Appointments />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]} />}>
          <Route path="/panel" element={<Panel />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
