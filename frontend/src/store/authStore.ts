import { create } from 'zustand'

interface Usuario {
  id: number
  nombre: string
  email: string
  token: string
}

interface AuthState {
  usuario: Usuario | null
  login: (usuario: Usuario) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  login: (usuario) => set({ usuario }),
  logout: () => set({ usuario: null }),
}))
