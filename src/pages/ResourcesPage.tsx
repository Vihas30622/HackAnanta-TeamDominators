import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Building2, Dumbbell, Filter, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

type ResourceType = 'all' | 'rooms' | 'equipment';

interface Resource {
  id: string;
  name: string;
  type: 'room' | 'equipment';
  available: boolean;
  location: string;
  capacity?: number;
  availableUntil?: string;
}

const resources: Resource[] = [
  { id: '1', name: 'Conference Room A', type: 'room', available: true, location: 'Block A, Floor 2', capacity: 20, availableUntil: '4:00 PM' },
  { id: '2', name: 'Study Room 101', type: 'room', available: true, location: 'Library, Floor 1', capacity: 8, availableUntil: '6:00 PM' },
  { id: '3', name: 'Seminar Hall', type: 'room', available: false, location: 'Block B, Ground Floor', capacity: 100 },
  { id: '4', name: 'Badminton Racket Set', type: 'equipment', available: true, location: 'Sports Complex' },
  { id: '5', name: 'Football', type: 'equipment', available: true, location: 'Sports Complex' },
  { id: '6', name: 'Projector', type: 'equipment', available: false, location: 'IT Department' },
  { id: '7', name: 'Lab 204', type: 'room', available: true, location: 'Block C, Floor 2', capacity: 30, availableUntil: '5:00 PM' },
  { id: '8', name: 'Cricket Kit', type: 'equipment', available: true, location: 'Sports Complex' },
];

const ResourcesPage: React.FC = () => {
  const [filter, setFilter] = useState<ResourceType>('all');
  const [search, setSearch] = useState('');

  const filteredResources = resources.filter(resource => {
    const matchesFilter = filter === 'all' || 
      (filter === 'rooms' && resource.type === 'room') ||
      (filter === 'equipment' && resource.type === 'equipment');
    const matchesSearch = resource.name.toLowerCase().includes(search.toLowerCase()) ||
      resource.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Campus Resources</h1>
            <p className="text-sm text-muted-foreground">Rooms & equipment availability</p>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms or equipment..."
            className="w-full bg-card rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'rooms', label: 'Rooms', icon: Building2 },
            { key: 'equipment', label: 'Equipment', icon: Dumbbell },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as ResourceType)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-card text-muted-foreground'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="px-4 space-y-3">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="module-card"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${resource.type === 'room' ? 'bg-primary' : 'bg-secondary'}`}>
                {resource.type === 'room' ? (
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Dumbbell className="w-5 h-5 text-secondary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{resource.name}</h3>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                      resource.available
                        ? 'bg-success/20 text-success'
                        : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {resource.available ? 'Available' : 'In Use'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{resource.location}</p>
                <div className="flex items-center gap-3 mt-1">
                  {resource.capacity && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {resource.capacity} seats
                    </span>
                  )}
                  {resource.availableUntil && resource.available && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Until {resource.availableUntil}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-muted-foreground">No resources found</p>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
