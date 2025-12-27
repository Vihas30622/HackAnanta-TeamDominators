import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';

const RoleBasedHome: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (!user) return <Navigate to="/login" replace />;

    switch (user.role) {
        case 'super_admin':
            return <Navigate to="/admin/dashboard" replace />;
        case 'food_admin':
            return <Navigate to="/admin/food" replace />;
        case 'resource_admin':
            return <Navigate to="/admin/resources" replace />;
        case 'event_admin':
            return <Navigate to="/admin/events" replace />;
        case 'student':
        default:
            return <HomePage />;
    }
};

export default RoleBasedHome;
