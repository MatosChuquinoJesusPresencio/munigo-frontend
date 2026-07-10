import { Routes, Route } from 'react-router'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Appointments from './pages/Appointments'
import Panel from './pages/Panel'
import NotFound from './pages/NotFound'
import Unauthorized from './pages/Unauthorized'
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
