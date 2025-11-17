import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // For admin routes, you can add admin check here
  // For now, we'll allow any authenticated user
  // You can add: if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute

