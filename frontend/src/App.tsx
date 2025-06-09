import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardCliente from './pages/DashboardCliente';

import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import RegisterUser from './pages/RegisterUsers';
import UsersPage from './pages/Users';
import Teachers from './pages/Teachers';
import CreateTeacher from './pages/CreateTeacher';

import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<LoginPage />} />

        {/* Rutas para Cliente */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente/dashboard"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <DashboardCliente />
            </ProtectedRoute>
          }
        />

        {/* Rutas para Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/register-users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RegisterUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profesores"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profesores/crear"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateTeacher />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



