import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Trainer from './pages/TrainerDashboard';

import DashboardInicioCliente from './pages/DashboardInicioCliente';
import DashboardRutinaCliente from './pages/DashboardRutinaCliente';
import ClasesCliente from './pages/ClasesCliente';
import EditarPerfilCliente from './pages/EditarPerfilCliente';

import Plan from './pages/Plan';

import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import RegisterUser from './pages/RegisterUsers';
import UsersPage from './pages/Users';
import Teachers from './pages/Teachers';
import CreateTeacher from './pages/CreateTeacher';
import CreateRoutine from './pages/CreateRoutine';
import CreateClass from './pages/CreateClass';
import EjerciciosPage from './pages/ExercisePage';
import RutinasPage from './pages/RoutinesPage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import RutinaDetailPage from '@/pages/RutinaDetailPage';
import CreateRutinaPage from './pages/CreateRoutine';
import EditRutinaPage from '@/pages/EditRutinaPage';
import PagosPage from './pages/PagosPage';
import CreatePagoPage from '@/pages/CreatePagoPage';

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
            <ProtectedRoute allowedRoles={[ 'cliente' ]}>
              <DashboardInicioCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rutina"
          element={
            <ProtectedRoute allowedRoles={[ 'cliente' ]}>
              <DashboardRutinaCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clases"
          element={
            <ProtectedRoute allowedRoles={[ 'cliente' ]}>
              <ClasesCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editar-perfil"
          element={
            <ProtectedRoute allowedRoles={[ 'cliente', 'admin', 'entrenador' ]}>
              <EditarPerfilCliente />
            </ProtectedRoute>
          }
        />

        {/* Ruta de Entrenador */}
        <Route
          path="/trainer"
          element={
            <ProtectedRoute allowedRoles={[ 'entrenador' ]}>
              <Trainer />
            </ProtectedRoute>
          }
        />

        {/* Rutas para Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/RegisterUsers"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <RegisterUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profesores"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profesores/crearRutina"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <CreateRoutine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profesores/crearClase"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <CreateClass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profesores/crear"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <CreateTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/plan"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <Plan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ejercicios"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <EjerciciosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ejercicios/crear"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <CreateExercisePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ejercicios/:id/editar"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <EditExercisePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rutinas"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <RutinasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rutinas/:id/ejercicios"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <RutinaDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rutinas/crear"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <CreateRutinaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rutinas/editar/:id"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <EditRutinaPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pagos"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <PagosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pagos/crear"
          element={
            <ProtectedRoute allowedRoles={[ 'admin' ]}>
              <CreatePagoPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all: redirige al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

