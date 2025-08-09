import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

export function logout() {
  useAuthStore.getState().logout();
  useUserStore.getState().logout();
  localStorage.removeItem("token");
  localStorage.removeItem("auth-storage");
  localStorage.removeItem("user-storage");
  // Esto es clave: recarga la página para limpiar memoria y stores
  window.location.href = "/login";
}
