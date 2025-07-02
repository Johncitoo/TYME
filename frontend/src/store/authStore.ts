import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Usuario {
  id_usuario: number;
  correo: string;
  primer_nombre: string;
  primer_apellido?: string;
  tipo_usuario: string;
  token?: string;
}

interface AuthState {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      login: (usuario) => set({ usuario }),
      logout: () => set({ usuario: null }),
    }),
    {
      name: "auth-storage", // clave en localStorage
    }
  )
);
