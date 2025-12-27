import React, { useState } from 'react';
import { ArrowLeft, Bus, Train, Navigation, Clock, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getPublicTransportRoute, TransportRoute } from '@/lib/gemini';
import { toast } from 'sonner';

const TransportPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'selection' | 'college' | 'public'>('selection');

  // Public Transport State
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<TransportRoute | null>(null);

  const TRACKING_URL = import.meta.env.VITE_COLLEGE_BUS_MAP_URL || 'https://tinyurl.com/2p8rkuh9';

  const handleGetRoute = async () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }

    setLoading(true);
    setRouteData(null);
    try {
      const data = await getPublicTransportRoute(destination);
      setRouteData(data);
    } catch (error) {
      toast.error("Failed to find route");
    } finally {
      setLoading(false);
    }
  };

  const SelectionView = () => (
    <div className="flex flex-col gap-6 px-4 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h1 className="text-3xl font-bold mb-2">Choose Transport</h1>
        <p className="text-muted-foreground">Select your preferred mode of travel</p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setMode('college')}
        className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Bus size={120} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Bus size={32} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">College Transport</h2>
            <p className="text-muted-foreground text-sm">Official shuttle service & routes</p>
          </div>
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setMode('public')}
        className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Train size={120} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
            <Train size={32} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">Public Transport</h2>
            <p className="text-muted-foreground text-sm">RTC buses & Metro guide</p>
          </div>
        </div>
      </motion.button>
    </div>
  );

  const CollegeView = () => (
    <div className="flex flex-col h-full bg-background">
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border">
        <button onClick={() => setMode('selection')} className="p-2 -ml-2 hover:bg-muted rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">College Transport</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-primary">Route 15 - College Bus</h3>
            <p className="text-sm text-muted-foreground">Main Campus ↔ City Centre</p>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">
            LIVE
          </div>
        </div>

        <div className="h-[70vh] w-full rounded-2xl overflow-hidden border border-border shadow-sm bg-muted relative flex flex-col items-center justify-center p-6 text-center gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <MapPin className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Live Tracking Dashboard</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
              View the real-time location of the college bus on the secure Fleetx dashboard.
            </p>
          </div>

          <Button
            onClick={() => window.open('https://tinyurl.com/2p8rkuh9', '_blank')}
            className="gradient-primary text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 mt-2"
          >
            Start Live Tracking
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Powered by Fleetx.io
          </p>
        </div>
      </div>
    </div>
  );

  const PublicView = () => (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button onClick={() => setMode('selection')} className="p-2 -ml-2 hover:bg-muted rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Public Transport Guide</h1>
      </header>

      <main className="p-4 flex flex-col gap-6 pb-24">
        {/* Input Section */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 mt-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-0.5 h-8 bg-border border-l border-dashed" />
              <div className="w-3 h-3 rounded-full bg-orange-500" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">From</label>
                <div className="p-3 bg-muted rounded-xl text-sm font-medium">
                  KLH University, Bowrampet
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">To Location</label>
                <input
                  type="text"
                  placeholder="Enter destination (e.g. Miyapur Metro)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-xl text-sm outline-none focus:ring-2 ring-orange-500/20"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleGetRoute}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 rounded-xl"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Navigation className="w-5 h-5 mr-2" />}
            {loading ? 'Finding Route...' : 'Find RTC Route'}
          </Button>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {routeData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex gap-4">
                <div className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">Bus Numbers</p>
                  <div className="flex flex-wrap gap-2">
                    {routeData.busNumbers.map((bus, i) => (
                      <span key={i} className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-md">{bus}</span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                  <p className="text-xs text-orange-600 font-bold uppercase mb-1">Est. Time</p>
                  <div className="flex items-center gap-2 text-orange-900 font-bold">
                    <Clock className="w-4 h-4" />
                    {routeData.estimatedTime}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Route Roadmap
                </h3>
                <div className="space-y-6 relative pl-2">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-muted" />
                  {routeData.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="w-5 h-5 rounded-full bg-background border-4 border-primary z-10 shrink-0" />
                      <p className="text-sm text-foreground/80 leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-border hover:bg-muted"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=KLH+University+Bowrampet&destination=${encodeURIComponent(destination)}&travelmode=transit`, '_blank')}
              >
                Open full route in Google Maps
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {mode === 'selection' && <SelectionView />}
      {mode === 'college' && <CollegeView />}
      {mode === 'public' && <PublicView />}
    </div>
  );
};

export default TransportPage;
