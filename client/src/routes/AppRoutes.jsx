import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import Login        from '../pages/Login'
import Signup       from '../pages/Signup'
import Dashboard    from '../pages/Dashboard'
import Employees    from '../pages/Employees'
import EmployeeForm from '../pages/EmployeeForm'
import Departments  from '../pages/Departments'

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected */}
          <Route path="/"            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees"           element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/employees/new"       element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
          <Route path="/employees/:id/edit"  element={<ProtectedRoute><EmployeeForm /></ProtectedRoute>} />
          <Route path="/departments"         element={<ProtectedRoute><Departments /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
