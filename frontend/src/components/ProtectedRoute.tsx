import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'customer' | 'service_provider' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const fallbackPath = user.role === 'admin' 
      ? '/admin/dashboard' 
      : user.role === 'service_provider' 
        ? '/provider/dashboard' 
        : '/dashboard';
    return <Navigate to={fallbackPath} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

