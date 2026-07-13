import { Routes, Route } from 'react-router'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Tramites from './pages/citizen/Tramites'
import CaseFileDetail from './pages/citizen/CaseFileDetail'
import Appointments from './pages/citizen/Appointments'
import Notifications from './pages/citizen/Notifications'
import Organizations from './pages/citizen/Organizations'
import Panel from './pages/employee/Panel'
import CaseFileReview from './pages/employee/CaseFileReview'
import Historial from './pages/employee/Historial'
import InspectorPanel from './pages/employee/InspectorPanel'
import InspectionHistory from './pages/employee/InspectionHistory'
import InspectionDetail from './pages/employee/InspectionDetail'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManagerCaseFiles from './pages/manager/ManagerCaseFiles'
import ManagerCaseFileDetail from './pages/manager/ManagerCaseFileDetail'
import ManagerEmployees from './pages/manager/ManagerEmployees'
import ManagerRequirements from './pages/manager/ManagerRequirements'
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
          <Route path="/tramites/:id" element={<CaseFileDetail />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/organizations" element={<Organizations />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[UserRole.EMPLOYEE]} />}>
          <Route path="/panel" element={<Panel />} />
          <Route path="/panel/:id" element={<CaseFileReview />} />
          <Route path="/historial-tramites" element={<Historial />} />
          <Route path="/inspector" element={<InspectorPanel />} />
          <Route path="/historial-inspecciones" element={<InspectionHistory />} />
          <Route path="/inspector/:id" element={<InspectionDetail />} />
          <Route path="/gerente" element={<ManagerDashboard />} />
          <Route path="/gerente/expedientes" element={<ManagerCaseFiles />} />
          <Route path="/gerente/expedientes/:id" element={<ManagerCaseFileDetail />} />
          <Route path="/gerente/empleados" element={<ManagerEmployees />} />
          <Route path="/gerente/requisitos" element={<ManagerRequirements />} />
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
