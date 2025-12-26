import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bus, MapPin, Navigation, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const collegeRoutes = [
  { id: '1', name: 'Route 1 - Main Campus', stops: 12, time: '25 min' },
  { id: '2', name: 'Route 2 - North Campus', stops: 8, time: '18 min' },
  { id: '3', name: 'Route 3 - South Campus', stops: 10, time: '22 min' },
  { id: '4', name: 'Route 4 - Express', stops: 4, time: '12 min' },
];

const destinations = [
  { id: '1', name: 'City Center', buses: ['42', '56', '78'], time: '35 min' },
  { id: '2', name: 'Railway Station', buses: ['12', '23'], time: '20 min' },
  { id: '3', name: 'Airport', buses: ['A1', 'A2'], time: '55 min' },
  { id: '4', name: 'Mall District', buses: ['34', '45'], time: '25 min' },
];

const TransportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'college' | 'public'>('college');

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Transport</h1>
            <p className="text-sm text-muted-foreground">Track buses & plan routes</p>
          </div>
        </div>
      </header>

      {/* Tab Switcher */}
      <div className="px-4 mb-4">
        <div className="flex bg-card rounded-xl p-1">
          <button
            onClick={() => setActiveTab('college')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'college'
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            College Transport
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'public'
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Public Transport
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'college' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Select Route</h2>
            {collegeRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="module-card"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary">
                    <Bus className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{route.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {route.stops} stops
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-2">Select Destination</h2>
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="module-card"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-secondary">
                    <Navigation className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{dest.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Buses: {dest.buses.join(', ')}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{dest.time}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
            
            <div className="mt-4 p-4 glass-card bg-secondary/10 border-secondary/30">
              <p className="text-sm text-muted-foreground">
                💡 AI-powered route suggestions coming soon with real-time RTC bus tracking.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TransportPage;
