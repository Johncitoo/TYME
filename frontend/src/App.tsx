import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreateUser from "./pages/CreateUser";
import Routines from "./pages/Routines";
import MobileLogin from "./pages/MobileLogin";  // ← importa aquí

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Login móvil (para pruebas en celular/emulador) */}
        <Route path="/mobile-login" element={<MobileLogin />} />

        {/* Proteger las rutas para administradores */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-user" element={<CreateUser />} />

        {/* Página de Rutinas */}
        <Route path="/admin/routines" element={<Routines />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


