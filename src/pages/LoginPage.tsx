import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (isAuthenticated && user) {
    if (user.role === 'super_admin') {
      return <Navigate to="/admin/users" replace />;
    } else if (user.role === 'food_admin') {
      return <Navigate to="/admin/food" replace />;
    } else if (user.role === 'resource_admin') {
      return <Navigate to="/admin/resources" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true);
      await login();
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="font-display antialiased text-gray-900 bg-background-light selection:bg-primary/30 h-screen overflow-hidden relative fade-in">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="blob blob-1 rounded-full"></div>
        <div className="blob blob-2 rounded-full"></div>
        <div className="blob blob-3 rounded-full"></div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-6 w-full max-w-md mx-auto">
        {/* Top Logo Area */}
        <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <span className="material-symbols-outlined text-white text-4xl">school</span>
          </div>
          {/* HeadlineText Component Adapted */}
          <h1 className="text-primary tracking-tight text-[32px] font-extrabold leading-tight text-center drop-shadow-sm">
            Campus OS
          </h1>
          {/* TitleText Component Adapted */}
          <h2 className="text-secondary text-lg font-bold leading-tight tracking-[-0.015em] text-center pt-1">
            Your campus, simplified.
          </h2>
        </div>

        {/* Glass Card Component */}
        <div className="w-full glass-card rounded-3xl p-8 flex flex-col items-center gap-2 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(54,115,181,0.25)] animate-in zoom-in-95 duration-500 delay-100">
          {/* Decorative Mini Grid (Using ImageGrid Component Logic) */}
          <div className="w-full mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div
                className="aspect-[4/3] w-full bg-cover bg-center rounded-xl shadow-sm"
                aria-label="University graduates throwing caps in the air"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQi81bRpXMRLVSmvFS2CIAOkQP_HjxJ502steWMYeVNPJIBPrQn4mNC3EpMH833NcuNuOrtEij0bBZ23yr2_XqLcnrJ6DJLpEWA1ad5jaYAL-qAVsNa15cAhGBTdj96lG0uTWGX3CdSgLCqtRtZXkZvR96z-CRlS6mofubJP56w9q_re4B7BA-Y1VecaC2AKHnx7e2UOsZHvfwe8ZK-7G-mNYSZ_wTw1dK_zLp5vb3O-e3MZqm-Fg8Nk9e2CBe1IT1wq5GdbpknM8")' }}
              ></div>
              <div
                className="aspect-[4/3] w-full bg-cover bg-center rounded-xl shadow-sm"
                aria-label="Students studying together outdoors on campus"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCkMaR3kY_8XYZHsjXBwO9faiUGJ99tva7xuWnJHXGUY0ZQRfA-OuUI3OhDIfvGJ2MXK3ru6k7ex8VPsmgLA3SzNMNP677_lfD9N9pssXShzP1qsPwts-_lNpIA5QSSsEn5wWp3wbvrmjDTXJNSKMdYpaoq-qkpT2bsqhxcVoPIJdi5zpdFzqt9To_DXCMuqxlXrl7BDtjMhdlK2xd6qxS3GQIRt4MFH39DsFYRJ-xWHY3_w-xJ-JzSPDy4tiH9eSTL1Fvivvg7Sdw")' }}
              ></div>
            </div>
          </div>

          {/* Internal Greeting */}
          <div className="flex flex-col gap-1 w-full text-center pt-2">
            {/* HeadlineText Variant */}
            <h2 className="text-[#101419] tracking-light text-[26px] font-bold leading-tight">
              Hello there! 👋
            </h2>
            {/* BodyText Component Adapted */}
            <p className="text-slate-600 text-base font-medium leading-relaxed pb-6 pt-2 px-2">
              Sign in with your university account to continue.
            </p>
          </div>

          {/* Action Area */}
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="group relative flex items-center justify-center w-full bg-white hover:bg-white/90 active:scale-[0.98] text-slate-700 font-bold py-3.5 px-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute left-4 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            </div>
            <span className="pl-6 font-display">{isLoggingIn ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-slate-300"></span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
            <span className="h-px w-12 bg-slate-300"></span>
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-3 text-primary text-sm font-bold hover:text-primary/80 transition-colors py-2"
          >
            Log in with ID
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <p className="text-slate-500 text-sm font-medium">
            Need help? <a className="text-primary hover:text-secondary font-bold underline decoration-2 underline-offset-2 transition-colors" href="#">Contact Admin</a>
          </p>
          <div className="mt-4 flex gap-4 justify-center text-xs text-slate-400">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <span>•</span>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
