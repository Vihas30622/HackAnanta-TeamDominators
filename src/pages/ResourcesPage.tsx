import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResourcesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Study', 'Dining', 'Health', 'Tech'];

  const resources = [
    {
      id: 1,
      name: 'Main Library',
      category: 'Study',
      status: 'Open Now',
      statusColor: 'text-green-700',
      dotColor: 'bg-green-500',
      location: 'Central Campus',
      meta: '50% Full',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Student Center',
      category: 'Dining',
      status: 'Closing Soon (1hr)',
      statusColor: 'text-orange-600',
      dotColor: 'bg-orange-400',
      location: 'North Wing',
      meta: 'Food Court',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'North Gym',
      category: 'Health',
      status: 'Open Now',
      statusColor: 'text-green-700',
      dotColor: 'bg-green-500',
      location: 'West Campus',
      meta: 'Low Traffic',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Tech Lab A',
      category: 'Tech',
      status: 'Closed',
      statusColor: 'text-red-600',
      dotColor: 'bg-red-400',
      location: 'Science Block',
      meta: 'Opens 8 AM',
      image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=200&auto=format&fit=crop',
    },
  ];

  const filteredResources = activeTab === 'All'
    ? resources
    : resources.filter(r => r.category === activeTab);

  return (
    <div className="flex flex-col h-full fade-in pb-28">
      {/* Header */}
      <header className="z-20 px-5 pt-12 pb-4 glass-nav rounded-b-3xl sticky top-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200" style={{ backgroundImage: `url("${user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          </div>
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Good Morning,</p>
            <h1 className="text-lg font-bold text-primary leading-tight">{user?.name?.split(' ')[0] || 'Student'} 👋</h1>
          </div>
        </div>
        <div className="flex gap-2">
          {(user?.role === 'super_admin' || user?.role === 'resource_admin') && (
            <button
              onClick={() => navigate('/admin/resources')}
              className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              title="Edit Resources"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          )}
          <button className="relative p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors text-primary">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-400 border border-white"></span>
          </button>
        </div>
      </header>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-30 px-6 py-4 bg-gradient-to-b from-background/90 to-background/0 backdrop-blur-[2px]">
        <label className="flex flex-col w-full group transition-all duration-300">
          <div className="flex w-full items-center rounded-2xl h-14 glass-panel shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 gap-3 focus-within:ring-2 focus-within:ring-primary/20">
            <span className="material-symbols-outlined text-text-muted">search</span>
            <input
              className="flex w-full min-w-0 flex-1 bg-transparent border-none text-[#101419] placeholder:text-text-muted focus:outline-0 focus:ring-0 text-base font-medium h-full p-0"
              placeholder="Search for labs, dining, gyms..."
            />
            <div className="w-8 h-8 rounded-lg bg-white/40 flex items-center justify-center cursor-pointer hover:bg-white/60 transition-colors">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
            </div>
          </div>
        </label>
      </div>

      {/* Category Chips */}
      <div className="flex gap-3 px-6 pb-6 overflow-x-auto no-scrollbar snap-x">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`snap-start flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 shadow-sm transition-transform active:scale-95 ${activeTab === category
              ? 'glass-chip-active'
              : 'glass-chip hover:bg-white/50'
              }`}
          >
            {category !== 'All' && (
              <span className="material-symbols-outlined text-base">
                {category === 'Study' ? 'school' :
                  category === 'Dining' ? 'restaurant' :
                    category === 'Health' ? 'fitness_center' : 'computer'}
              </span>
            )}
            <p className={`text-sm font-medium leading-normal ${activeTab === category ? 'text-white font-bold' : 'text-[#101419]'}`}>
              {category}
            </p>
          </button>
        ))}
      </div>

      {/* Resource Cards List */}
      <div className="flex flex-col gap-5 px-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="glass-panel p-4 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(54,115,181,0.15)] transition-all duration-300 group cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5 flex-[2_2_0px]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    {resource.status.includes('Open') && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${resource.dotColor}`}></span>
                  </span>
                  <p className={`${resource.statusColor} text-xs font-bold uppercase tracking-wide`}>{resource.status}</p>
                </div>
                <h3 className="text-[#101419] text-lg font-bold leading-tight group-hover:text-primary transition-colors">{resource.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/50 text-text-muted">
                    {resource.location}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${resource.status === 'Open Now' ? 'bg-accent/30 text-primary' : resource.status.includes('Closing') ? 'bg-white/50 text-text-muted' : 'bg-green-100 text-green-800'}`}>
                    {resource.meta}
                  </span>
                </div>
              </div>
              <div
                className={`w-24 h-24 bg-center bg-no-repeat bg-cover rounded-xl shadow-inner shrink-0 ${resource.status === 'Closed' ? 'grayscale' : ''}`}
                style={{ backgroundImage: `url('${resource.image}')` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
