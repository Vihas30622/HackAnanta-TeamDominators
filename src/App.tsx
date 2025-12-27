import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

// Components
import BottomNav from "@/components/BottomNav";
import SOSButton from "@/components/SOSButton";
import InstallPrompt from "@/components/InstallPrompt";
import NotificationBanner from "@/components/NotificationBanner";
import RoleBasedHome from "@/components/RoleBasedHome";
import StudentRoute from "@/components/StudentRoute";
import AdminLayout from "@/components/AdminLayout";
import AppLayout from "@/components/AppLayout";
// Pages
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import TransportPage from "@/pages/TransportPage";
import MentalHealthPage from "@/pages/MentalHealthPage";
import ResourcesPage from "@/pages/ResourcesPage";
import CanteenPage from "@/pages/CanteenPage";
import EventsPage from "@/pages/EventsPage";
import EventDetailsPage from "@/pages/EventDetailsPage";
import GrievancePage from "@/pages/GrievancePage";
import CommunityChatPage from "./modules/community-chat/CommunityChatPage"; // Import Chat Module
import EmergencyPage from "@/pages/EmergencyPage";
import MorePage from "@/pages/MorePage";
import SettingsPage from "@/pages/SettingsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import FoodAdminPage from "@/pages/admin/FoodAdminPage";
import ResourceAdminPage from "@/pages/admin/ResourceAdminPage";
import EventsAdminPage from "@/pages/admin/EventsAdminPage";
import TransportAdminPage from "@/pages/admin/TransportAdminPage";
import SuperAdminPage from "@/pages/admin/SuperAdminPage";
import NotificationsAdminPage from "@/pages/admin/NotificationsAdminPage";
import GrievanceAdminPage from "@/pages/admin/GrievanceAdminPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage"; // Updated Super Admin Hub
import RoleConfigPage from "@/pages/admin/RoleConfigPage";
import PaymentPage from "@/pages/PaymentPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
        <p className="text-foreground">Loading Application...</p>
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
            {/* Dynamic landing based on role */}
            <RoleBasedHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transport"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <TransportPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mental-health"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <MentalHealthPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <ResourcesPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/canteen"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <CanteenPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <EventsPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <EventDetailsPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/grievance"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <GrievancePage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/community-chat/*"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <CommunityChatPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/emergency"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <EmergencyPage />
              </AppLayout>
            </StudentRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/more"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <AppLayout>
                <MorePage />
              </AppLayout>
            </StudentRoute>
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
        path="/admin/dashboard"
        element={
          <AdminRoute allowedRoles={['super_admin']}>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/food"
        element={
          <AdminRoute allowedRoles={['food_admin', 'super_admin']}>
            <AdminLayout>
              <FoodAdminPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/resources"
        element={
          <AdminRoute allowedRoles={['resource_admin', 'super_admin']}>
            <AdminLayout>
              <ResourceAdminPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute allowedRoles={['super_admin']}>
            <AdminLayout>
              <SuperAdminPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <AdminRoute allowedRoles={['super_admin', 'event_admin']}>
            <AdminLayout>
              <EventsAdminPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin-setup"
        element={
          <ProtectedRoute>
            <RoleConfigPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transport"
        element={
          <AdminRoute allowedRoles={['super_admin', 'transport_admin']}>
            <AdminLayout>
              <TransportAdminPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <AdminRoute allowedRoles={['super_admin']}>
            <AdminLayout>
              <NotificationsAdminPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/grievances"
        element={
          <AdminRoute allowedRoles={['super_admin']}>
            <AdminLayout>
              <GrievanceAdminPage />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
