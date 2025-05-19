import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface Props {
  children: JSX.Element
  allowedRoles: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const storedUser = localStorage.getItem("usuario")
  const user = storedUser ? JSON.parse(storedUser) : null

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
