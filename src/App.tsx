import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Components
import BottomNav from "@/components/BottomNav";
import SOSButton from "@/components/SOSButton";
import InstallPrompt from "@/components/InstallPrompt";
import NotificationBanner from "@/components/NotificationBanner";
// Pages
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import TransportPage from "@/pages/TransportPage";
import MentalHealthPage from "@/pages/MentalHealthPage";
import ResourcesPage from "@/pages/ResourcesPage";
import CanteenPage from "@/pages/CanteenPage";
import EventsPage from "@/pages/EventsPage";
import GrievancePage from "@/pages/GrievancePage";
import EmergencyPage from "@/pages/EmergencyPage";
import MorePage from "@/pages/MorePage";
import SettingsPage from "@/pages/SettingsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import FoodAdminPage from "@/pages/admin/FoodAdminPage";
import ResourceAdminPage from "@/pages/admin/ResourceAdminPage";
import SuperAdminPage from "@/pages/admin/SuperAdminPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Route wrapper - checks for specific roles
const AdminRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App Layout with navigation
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <NotificationBanner />
      {children}
      <SOSButton />
      <BottomNav />
      <InstallPrompt />
    </>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* Protected Routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transport"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TransportPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mental-health"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MentalHealthPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResourcesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/canteen"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CanteenPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EventsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grievance"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GrievancePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EmergencyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/more"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MorePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <NotificationsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/food"
        element={
          <AdminRoute allowedRoles={['food_admin', 'super_admin']}>
            <AppLayout>
              <FoodAdminPage />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/resources"
        element={
          <AdminRoute allowedRoles={['resource_admin', 'super_admin']}>
            <AppLayout>
              <ResourceAdminPage />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute allowedRoles={['super_admin']}>
            <AppLayout>
              <SuperAdminPage />
            </AppLayout>
          </AdminRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
