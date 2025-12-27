import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (user && user.role !== 'student') {
        // Redirect admins back to their home which handles their specific redirect
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default StudentRoute;
