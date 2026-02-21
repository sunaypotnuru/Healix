import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
