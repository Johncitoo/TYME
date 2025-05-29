 import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
 import LoginPage      from './pages/LoginPage';
 import HomePage       from './pages/HomePage';
 import { ProtectedRoute } from './components/ProtectedRoute';
 import AdminDashboard from './pages/AdminDashboard';
 import AdminProfile   from './pages/AdminProfile';

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

         {/* Cualquier otra URL redirige al login */}
         <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
     </BrowserRouter>
   );
 }


