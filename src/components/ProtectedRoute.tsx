import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE } from '../constants/roles';

interface ProtectedRouteProps {
  allowedRoles: ROLE[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, roles } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAuthorized = roles.some(role => allowedRoles.includes(role as ROLE));

  return isAuthorized ? <Outlet /> : <Navigate to="/403-forbidden" replace />;
};


export default ProtectedRoute;
