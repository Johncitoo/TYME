import { create } from 'zustand'

export interface Usuario {
  id_usuario: number;
  correo: string;
  primer_nombre: string;
  tipo_usuario: string;
  token?: string;
}

interface AuthState {
  usuario: Usuario | null;
  login: (usuario: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  login: (usuario) => set({ usuario }),
  logout: () => set({ usuario: null }),
}));
