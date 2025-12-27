import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Explicitly hide if admin, just in case
  if (user?.role === 'super_admin' || user?.role === 'food_admin' || user?.role === 'resource_admin' || user?.role === 'event_admin') {
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", icon: "home", label: "Home" },
    { path: "/canteen", icon: "restaurant", label: "Canteen" },
    { path: "/events", icon: "event", label: "Events" },
    { path: "/resources", icon: "local_library", label: "Resources" },
    { path: "/settings", icon: "person", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50 animate-in slide-in-from-bottom-6 duration-700 delay-300">
      <nav className="glass-dock h-[72px] rounded-[2rem] flex items-center justify-between px-2 shadow-2xl shadow-primary/10">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors gap-1 group ${active ? "text-primary" : "text-muted-foreground hover:text-secondary"
                }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${active
                  ? "bg-primary/10"
                  : "group-hover:bg-secondary/10"
                  }`}
              >
                <span className={`material-symbols-outlined text-[24px] ${active ? 'material-symbols-filled' : ''}`}>
                  {item.icon}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
