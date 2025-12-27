
import React, { useState } from 'react';
import { Plus, Search, Building2, Trophy, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Equipment Interface
interface SportsEquipment {
  id: string;
  name: string;
  quantity: number;
}

const ResourceAdminPage = () => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'sports'>('sports');

  // Sports State
  const [equipment, setEquipment] = useState<SportsEquipment[]>([]);
  const [isSportsDialogOpen, setIsSportsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SportsEquipment | null>(null);
  const [sportsFormData, setSportsFormData] = useState({ name: '', quantity: 0 });

  // Fetch Equipment
  React.useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'sports_equipment'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEquipment(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SportsEquipment)));
    }, (err) => {
      console.error("Error fetching sports equipment:", err);
      toast.error("Could not fetch equipment list");
    });
    return () => unsubscribe();
  }, []);

  const handleSportsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'sports_equipment', editingItem.id), sportsFormData);
        toast.success('Updated successfully');
      } else {
        await addDoc(collection(db, 'sports_equipment'), sportsFormData);
        toast.success('Added successfully');
      }
      setIsSportsDialogOpen(false);
      setSportsFormData({ name: '', quantity: 0 });
      setEditingItem(null);
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  const deleteEquipment = async (id: string) => {
    if (confirm('Delete this item?')) {
      try {
        await deleteDoc(doc(db, 'sports_equipment', id));
        toast.success('Deleted');
      } catch (e) {
        toast.error("Failed to delete");
      }
    }
  };

  const openEdit = (item: SportsEquipment) => {
    setEditingItem(item);
    setSportsFormData({ name: item.name, quantity: item.quantity });
    setIsSportsDialogOpen(true);
  }

  // Initial Seed Function
  const seedData = async () => {
    const initial = [
      { name: 'Chess Tables', quantity: 4 },
      { name: 'Carrom Tables', quantity: 4 },
      { name: 'Table Tennis', quantity: 4 },
      { name: 'Volleyballs', quantity: 4 },
      { name: 'Footballs', quantity: 2 },
      { name: 'Cricket Bats', quantity: 2 },
    ];
    try {
      for (const item of initial) {
        await addDoc(collection(db, 'sports_equipment'), item);
      }
      toast.success('Seeded initial data');
    } catch (e) {
      toast.error("Failed to seed data");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="px-4 py-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Resource Admin</h1>
            <p className="text-sm text-muted-foreground">Manage inventory</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Tabs */}
        <div className="flex bg-muted/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('sports')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'sports' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Sports Equipment
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'rooms' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Rooms & Labs
          </button>
        </div>

        {activeTab === 'sports' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold">Inventory</h2>
                  <p className="text-xs text-muted-foreground">{equipment.length} Items</p>
                </div>
              </div>
              <Button size="sm" onClick={() => { setEditingItem(null); setSportsFormData({ name: '', quantity: 0 }); setIsSportsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {equipment.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm mb-4">No equipment found.</p>
                <Button variant="outline" size="sm" onClick={seedData}>Seed Default Data</Button>
              </div>
            )}

            <div className="grid gap-3">
              {equipment.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm">
                  <div>
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10" onClick={() => deleteEquipment(item.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Dialog open={isSportsDialogOpen} onOpenChange={setIsSportsDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Item' : 'New Equipment'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSportsSubmit} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Item Name</label>
                    <Input
                      placeholder="e.g. Football"
                      value={sportsFormData.name}
                      onChange={e => setSportsFormData({ ...sportsFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity Available</label>
                    <Input
                      type="number"
                      min="0"
                      value={sportsFormData.quantity}
                      onChange={e => setSportsFormData({ ...sportsFormData, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-4">
            <div className="bg-muted p-4 rounded-full">
              <Building2 className="w-8 h-8 opacity-50" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-foreground">Rooms Management</h3>
              <p className="text-sm">This module is coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceAdminPage;
