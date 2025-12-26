import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Pencil, Trash2, X, Check, 
  Building2, Dumbbell, Search, Users, Clock 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ResourceType = 'room' | 'equipment';

interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  available: boolean;
  capacity?: number;
  availableUntil?: string;
  description?: string;
}

const initialResources: Resource[] = [
  { id: '1', name: 'Conference Room A', type: 'room', location: 'Block A, Floor 2', capacity: 20, available: true, availableUntil: '4:00 PM' },
  { id: '2', name: 'Study Room 101', type: 'room', location: 'Library, Floor 1', capacity: 8, available: true, availableUntil: '6:00 PM' },
  { id: '3', name: 'Seminar Hall', type: 'room', location: 'Block B, Ground Floor', capacity: 100, available: false },
  { id: '4', name: 'Badminton Racket Set', type: 'equipment', location: 'Sports Complex', available: true, description: '2 rackets with shuttlecocks' },
  { id: '5', name: 'Football', type: 'equipment', location: 'Sports Complex', available: true },
  { id: '6', name: 'Projector', type: 'equipment', location: 'IT Department', available: false },
  { id: '7', name: 'Lab 204', type: 'room', location: 'Block C, Floor 2', capacity: 30, available: true, availableUntil: '5:00 PM' },
  { id: '8', name: 'Cricket Kit', type: 'equipment', location: 'Sports Complex', available: true },
];

const ResourceAdminPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ResourceType | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<Omit<Resource, 'id'>>({
    name: '',
    type: 'room',
    location: '',
    available: true,
    capacity: undefined,
    availableUntil: '',
    description: '',
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleOpenForm = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        name: resource.name,
        type: resource.type,
        location: resource.location,
        available: resource.available,
        capacity: resource.capacity,
        availableUntil: resource.availableUntil || '',
        description: resource.description || '',
      });
    } else {
      setEditingResource(null);
      setFormData({
        name: '',
        type: 'room',
        location: '',
        available: true,
        capacity: undefined,
        availableUntil: '',
        description: '',
      });
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.location) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingResource) {
      setResources(prev =>
        prev.map(resource =>
          resource.id === editingResource.id ? { ...resource, ...formData } : resource
        )
      );
      toast.success('Resource updated!');
    } else {
      const newResource: Resource = {
        id: Date.now().toString(),
        ...formData,
      };
      setResources(prev => [...prev, newResource]);
      toast.success('Resource added!');
    }

    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
    toast.success('Resource deleted');
  };

  const handleToggleAvailability = (id: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === id ? { ...resource, available: !resource.available } : resource
      )
    );
  };

  const roomCount = resources.filter(r => r.type === 'room').length;
  const equipmentCount = resources.filter(r => r.type === 'equipment').length;
  const availableCount = resources.filter(r => r.available).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Resource Admin</h1>
              <p className="text-sm text-muted-foreground">Manage rooms & equipment</p>
            </div>
          </div>
          <Button onClick={() => handleOpenForm()} size="sm" className="gradient-primary">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="px-4 py-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-card rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'room', label: 'Rooms', icon: Building2 },
            { key: 'equipment', label: 'Equipment', icon: Dumbbell },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key as ResourceType | 'all')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === tab.key
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

      {/* Stats */}
      <div className="px-4 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 glass-card p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{roomCount}</p>
            <p className="text-xs text-muted-foreground">Rooms</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{equipmentCount}</p>
            <p className="text-xs text-muted-foreground">Equipment</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <p className="text-2xl font-bold text-success">{availableCount}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="px-4 space-y-3">
        {filteredResources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`module-card ${!resource.available ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${resource.type === 'room' ? 'bg-primary' : 'bg-secondary'}`}>
                {resource.type === 'room' ? (
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Dumbbell className="w-5 h-5 text-secondary-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{resource.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    resource.available ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {resource.available ? 'Available' : 'In Use'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{resource.location}</p>
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
                  {resource.description && (
                    <span className="text-xs text-muted-foreground">{resource.description}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleAvailability(resource.id)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    resource.available 
                      ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' 
                      : 'bg-success/10 text-success hover:bg-success/20'
                  }`}
                >
                  {resource.available ? 'Set In Use' : 'Set Free'}
                </button>
                <button
                  onClick={() => handleOpenForm(resource)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredResources.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No resources found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={handleCloseForm}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    {editingResource ? 'Edit Resource' : 'Add Resource'}
                  </h2>
                  <button onClick={handleCloseForm} className="p-2 rounded-lg hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                {/* Resource Type */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, type: 'room' }))}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                        formData.type === 'room'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Room
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, type: 'equipment' }))}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                        formData.type === 'equipment'
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Dumbbell className="w-4 h-4" />
                      Equipment
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={formData.type === 'room' ? 'e.g., Conference Room A' : 'e.g., Badminton Racket Set'}
                    className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Block A, Floor 2"
                    className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                  />
                </div>

                {formData.type === 'room' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Capacity</label>
                      <input
                        type="number"
                        value={formData.capacity || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) || undefined }))}
                        placeholder="0"
                        className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Available Until</label>
                      <input
                        type="text"
                        value={formData.availableUntil || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, availableUntil: e.target.value }))}
                        placeholder="e.g., 5:00 PM"
                        className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                      />
                    </div>
                  </div>
                )}

                {formData.type === 'equipment' && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Description (Optional)</label>
                    <input
                      type="text"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g., 2 rackets with shuttlecocks"
                      className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between bg-muted rounded-xl p-4">
                  <span className="text-sm font-medium text-foreground">Currently Available</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, available: !prev.available }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.available ? 'bg-success' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${
                      formData.available ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-border safe-area-bottom">
                <Button onClick={handleSave} className="w-full h-12 gradient-primary text-base font-semibold">
                  <Check className="w-5 h-5 mr-2" />
                  {editingResource ? 'Update Resource' : 'Add Resource'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceAdminPage;
