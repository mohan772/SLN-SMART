import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="text-center py-16">Loading authentication...</div>
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
