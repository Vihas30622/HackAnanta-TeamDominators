import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated && !user) {
    navigate("/login");
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-14 pb-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{currentDate}</span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Hi, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
        </div>
        <button aria-label="Notifications" onClick={() => navigate('/notifications')} className="glass w-12 h-12 flex items-center justify-center rounded-xl text-primary active:scale-95 transition-transform duration-200 relative">
          <span className="material-symbols-outlined text-[26px]">notifications</span>
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </header>

      {/* SOS Hero Section */}
      <section className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          {/* Outer Glow Rings */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border-4 border-dashed border-primary/20 animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Main SOS Button */}
          <button className="relative w-36 h-36 rounded-full bg-gradient-to-br from-white to-[#ebf4f5] shadow-[0_10px_40px_rgba(54,116,181,0.25)] flex flex-col items-center justify-center z-10 active:scale-95 transition-all duration-300 border-4 border-white/60 group overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="material-symbols-outlined text-primary text-[48px] mb-1 material-symbols-filled drop-shadow-sm">emergency_share</span>
            <span className="text-primary font-black text-xl tracking-wider">SOS</span>
          </button>

          {/* Pulsing Effect behind button */}
          <div className="absolute inset-0 rounded-full bg-primary/10 -z-10 animate-ripple"></div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Emergency?</h2>
          <p className="text-muted-foreground text-base font-medium">Press and hold for help</p>
        </div>
      </section>

      {/* Quick Actions Strip */}
      <div className="w-full overflow-x-auto no-scrollbar pl-6 py-4 flex gap-3 snap-x">
        {[
          { icon: 'badge', label: 'My ID', action: () => { } },
          { icon: 'map', label: 'Map', action: () => { } },
          { icon: 'school', label: 'Grades', action: () => { } },
          { icon: 'directions_bus', label: 'Bus Pass', action: () => { } },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="glass shrink-0 h-11 pl-4 pr-5 rounded-full flex items-center gap-2 text-sm font-bold text-foreground whitespace-nowrap snap-start active:bg-white/60 transition shadow-sm"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-2 gap-4 px-6 mt-2 pb-24">
        {/* Transport Card */}
        <div onClick={() => navigate('/transport')} className="glass-card p-5 rounded-[2rem] flex flex-col justify-between h-44 active:scale-[0.98] transition-transform relative overflow-hidden group border-none cursor-pointer">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-primary shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-[28px]">directions_bus</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Transport</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Shuttle arriving <span className="text-primary font-bold">4 min</span></p>
          </div>
        </div>

        {/* Canteen Card */}
        <div onClick={() => navigate('/canteen')} className="glass-card p-5 rounded-[2rem] flex flex-col justify-between h-44 active:scale-[0.98] transition-transform relative overflow-hidden group border-none cursor-pointer">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-400/10 rounded-full blur-xl group-hover:bg-orange-400/20 transition-colors"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-orange-500 shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-[28px]">restaurant</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Canteen</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Menu: <span className="text-orange-600 font-bold">Tacos</span></p>
          </div>
        </div>

        {/* Resources Card */}
        <div onClick={() => navigate('/resources')} className="glass-card p-5 rounded-[2rem] flex flex-col justify-between h-44 active:scale-[0.98] transition-transform relative overflow-hidden group border-none cursor-pointer">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-400/10 rounded-full blur-xl group-hover:bg-teal-400/20 transition-colors"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-teal-600 shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-[28px]">local_library</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Resources</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Library: <span className="text-teal-700 font-bold">Open</span></p>
          </div>
        </div>

        {/* Events Card */}
        <div onClick={() => navigate('/events')} className="glass-card p-5 rounded-[2rem] flex flex-col justify-between h-44 active:scale-[0.98] transition-transform relative overflow-hidden group border-none cursor-pointer">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-400/10 rounded-full blur-xl group-hover:bg-rose-400/20 transition-colors"></div>
          <div className="w-12 h-12 rounded-2xl bg-white/60 flex items-center justify-center text-rose-500 shadow-sm backdrop-blur-sm">
            <span className="material-symbols-outlined text-[28px]">confirmation_number</span>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Events</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Music Fest: <span className="text-rose-600 font-bold">5pm</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
