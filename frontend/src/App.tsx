import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

import DashboardInicioCliente from './pages/DashboardInicioCliente';
import DashboardRutinaCliente from './pages/DashboardRutinaCliente';
import ClasesCliente from './pages/ClasesCliente';

import Plan from './pages/Plan';

import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import RegisterUser from './pages/RegisterUsers';
import UsersPage from './pages/Users';
import Teachers from './pages/Teachers';
import CreateTeacher from './pages/CreateTeacher';
import CreateRoutine from './pages/CreateRoutine';
import CreateClass from './pages/CreateClass';

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
              <DashboardInicioCliente />
            </ProtectedRoute>
          }
        />
        {/* Ruta de Rutina del Cliente */}
        <Route
          path="/rutina"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <DashboardRutinaCliente />
            </ProtectedRoute>
          }
        />
        {/* Ruta de Clases para Cliente */}
        <Route
          path="/clases"
          element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <ClasesCliente />
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
          path="/admin/RegisterUsers"
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
          path="/admin/profesores/crearRutina"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateRoutine/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profesores/crearClase"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateClass />
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
        <Route
          path="/admin/plan"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Plan />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirige al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
