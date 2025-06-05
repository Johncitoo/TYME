 import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
 import LoginPage      from './pages/LoginPage';
 import HomePage       from './pages/HomePage';
 import { ProtectedRoute } from './components/ProtectedRoute';
 import AdminDashboard from './pages/AdminDashboard';
 import AdminProfile   from './pages/AdminProfile';
 import RegisterUser from './pages/RegisterUsers';
 import UsersPage from './pages/Users';
 import Teachers from "./pages/Teachers";
 import CreateTeacher from "./pages/CreateTeacher";

 export default function App() {
   return (
     <BrowserRouter>
       <Routes>
         {/* Login siempre accesible */}
         <Route path="/" element={<LoginPage />} />

         {/* Rutas protegidas para cliente */}
         <Route
           path="/home"
           element={
             <ProtectedRoute allowedRoles={['cliente']}>
               <HomePage />
             </ProtectedRoute>
           }
         />

         {/* Ruta protegida para admin: dashboard */}
         <Route
           path="/admin"
           element={
             <ProtectedRoute allowedRoles={['admin']}>
               <AdminDashboard />
             </ProtectedRoute>
           }
         />

       {/* Ruta protegida para admin: perfil */}
       <Route
         path="/admin/profile"
         element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProfile />
          </ProtectedRoute>
          }
        />

        {/* Ruta protegida para admin: usuarios */}
        <Route
          path="/admin/users"
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersPage/>
          </ProtectedRoute>
          }
        />

        {/* Ruta protegida para admin: Registrar usuarios */}
        <Route
          path="/admin/RegisterUsers"
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <RegisterUser />
          </ProtectedRoute>
          }
        />
        
        {/* Ruta protegida para admin: profesores */}
        <Route
          path="/admin/profesores"
          element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Teachers />
          </ProtectedRoute>
          }
        />

          {/* Rutas protegidas para entrenador */}
          <Route
            path="/admin/profesores/crear"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateTeacher />
              </ProtectedRoute>
            }
          />

         {/* Cualquier otra URL redirige al login */}
         <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
     </BrowserRouter>
   );
 }


