
import React, { useState } from 'react';
import { Search, MapPin, Trophy, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import FreeRoomFinder from '@/components/resources/FreeRoomFinder';
import SportsEquipmentView from '@/components/resources/SportsEquipmentView';

const ResourcesPage = () => {
  const [view, setView] = useState<'main' | 'rooms' | 'sports'>('main');

  if (view === 'rooms') {
    return <FreeRoomFinder onBack={() => setView('main')} />;
  }

  if (view === 'sports') {
    return <SportsEquipmentView onBack={() => setView('main')} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 fade-in">
      {/* Header */}
      <header className="px-6 py-6 pt-10">
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground mt-1">
          Everything you need on campus.
        </p>
      </header>

      {/* Main Options */}
      <div className="flex-1 px-4 space-y-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setView('rooms')}
          className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <MapPin size={100} />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="w-14 h-14 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Free Room Finder</h2>
              <p className="text-sm text-muted-foreground w-3/4">Find empty classrooms for peaceful self-study periods.</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-primary">
              Check Availability <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setView('sports')}
          className="bg-card border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy size={100} />
          </div>
          <div className="relative z-10 flex flex-col items-start gap-4">
            <div className="w-14 h-14 bg-orange-500/10 text-orange-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Sports Equipment</h2>
              <p className="text-sm text-muted-foreground w-3/4">Check current inventory of bats, balls, and equipment.</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-primary">
              View Inventory <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourcesPage;
