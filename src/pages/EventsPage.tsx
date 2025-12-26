import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ChevronRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  attendees: number;
  category: string;
  isRegistered: boolean;
}

const events: Event[] = [
  {
    id: '1',
    title: 'Tech Fest 2024',
    description: 'Annual technical festival with coding competitions and workshops',
    date: 'Jan 15, 2024',
    time: '9:00 AM',
    venue: 'Main Auditorium',
    attendees: 250,
    category: 'Technical',
    isRegistered: false,
  },
  {
    id: '2',
    title: 'Cultural Night',
    description: 'Celebrate diversity with performances and food stalls',
    date: 'Jan 20, 2024',
    time: '6:00 PM',
    venue: 'Open Air Theatre',
    attendees: 500,
    category: 'Cultural',
    isRegistered: true,
  },
  {
    id: '3',
    title: 'Blood Donation Camp',
    description: 'Volunteer for the annual blood donation drive',
    date: 'Jan 22, 2024',
    time: '10:00 AM',
    venue: 'Health Center',
    attendees: 100,
    category: 'Volunteer',
    isRegistered: false,
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Present your startup ideas to industry experts',
    date: 'Jan 25, 2024',
    time: '2:00 PM',
    venue: 'Conference Hall',
    attendees: 80,
    category: 'Technical',
    isRegistered: false,
  },
  {
    id: '5',
    title: 'Sports Day',
    description: 'Inter-department sports competitions',
    date: 'Feb 1, 2024',
    time: '8:00 AM',
    venue: 'Sports Ground',
    attendees: 400,
    category: 'Sports',
    isRegistered: false,
  },
];

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Volunteer'];

const categoryColors: Record<string, string> = {
  Technical: 'bg-primary',
  Cultural: 'bg-secondary',
  Sports: 'bg-success',
  Volunteer: 'bg-warning',
};

const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [registeredEvents, setRegisteredEvents] = useState<string[]>(['2']);

  const filteredEvents = events.filter(
    event => selectedCategory === 'All' || event.category === selectedCategory
  );

  const handleRegister = (eventId: string, eventTitle: string) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      toast.info(`Unregistered from ${eventTitle}`);
    } else {
      setRegisteredEvents(prev => [...prev, eventId]);
      toast.success(`Registered for ${eventTitle}!`, {
        description: 'You will receive a reminder before the event',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Events</h1>
            <p className="text-sm text-muted-foreground">Discover & participate</p>
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-card text-muted-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 space-y-4">
        {filteredEvents.map((event, index) => {
          const isRegistered = registeredEvents.includes(event.id);
          
          return (
            <motion.div
              key={event.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="module-card overflow-hidden"
            >
              {/* Category Badge */}
              <div className={`absolute top-0 left-0 w-1 h-full ${categoryColors[event.category] || 'bg-primary'}`} />
              
              <div className="pl-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{event.title}</h3>
                      {isRegistered && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-success/20 text-success rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Registered
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees} going
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant={isRegistered ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleRegister(event.id, event.title)}
                    className={isRegistered ? 'border-muted-foreground/30' : 'gradient-primary'}
                  >
                    {isRegistered ? 'Cancel' : 'Register'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EventsPage;
