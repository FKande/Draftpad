import { Navigate } from 'react-router-dom'
import type { User } from './api'

type RequireAuthProps = {
  user: User | null
  children: React.ReactNode
}

const RequireAuth = ({ user, children }: RequireAuthProps) => {
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default RequireAuth
