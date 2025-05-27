import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import logo from '../assets/logo2-tyme.png'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((state: { login: (user: any) => void }) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const user = await response.json()

      // Guardar usuario globalmente y en localStorage
      login(user)
      localStorage.setItem('usuario', JSON.stringify(user))

      // Redirección según rol
      if (user.role === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      alert(error.message || 'Login failed')
    }
  }

  return (
    <div className="w-full sm:max-w-md p-6 sm:p-8 bg-white rounded-2xl shadow-md border-t-4 border-tyme">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Logo TYME" className="h-12 sm:h-16 object-contain" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-center text-tyme mb-4 sm:mb-6">
        Bienvenido al gimnasio TYME
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 text-sm font-semibold">Correo electrónico</label>
          <input
            type="email"
            placeholder="tucorreo@ejemplo.com"
            className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyme text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 text-sm font-semibold">Contraseña</label>
          <input
            type="password"
            placeholder="********"
            className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyme text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 sm:py-3 rounded-lg font-semibold border border-primary hover:bg-primary/90 hover:text-white transition text-sm"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  )
}
