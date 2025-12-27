
import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Building2, Trophy, Pencil, Trash2, X, History, Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, where, serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logActivity } from '@/lib/resourceManager';

// Types
interface SportsEquipment {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  isActive: boolean; // Soft Delete
}

interface Room {
  id: string;
  name: string;
  type: string; // Classroom, Lab, Sports Room
  available: boolean;
  isActive: boolean; // Soft Delete
}

interface ActivityLog {
  id: string;
  resourceName: string;
  action: string;
  performedByName: string;
  timestamp: any;
  details: string;
}

const ResourceAdminPage = () => {
  const [activeTab, setActiveTab] = useState<'sports' | 'rooms' | 'logs'>('sports');
  const { user } = useAuth();

  // Data State
  const [equipment, setEquipment] = useState<SportsEquipment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // UI State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Real-time Fetching
  useEffect(() => {
    if (!db) return;

    // Fetch Sports
    const qSports = query(collection(db, 'sports_equipment'), orderBy('name'));
    const unsubSports = onSnapshot(qSports, (snap) => {
      setEquipment(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SportsEquipment)));
    });

    // Fetch Rooms
    const qRooms = query(collection(db, 'rooms'), orderBy('name'));
    const unsubRooms = onSnapshot(qRooms, (snap) => {
      setRooms(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room)));
    });

    // Fetch Logs
    const qLogs = query(collection(db, 'resource_logs'), orderBy('timestamp', 'desc')); // Limit needed in prod
    const unsubLogs = onSnapshot(qLogs, (snap) => {
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog)));
    });

    return () => { unsubSports(); unsubRooms(); unsubLogs(); };
  }, []);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const collectionName = activeTab === 'sports' ? 'sports_equipment' : 'rooms';

    try {
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        await logActivity(editingItem.id, formData.name, 'update', user?.id || 'admin', user?.name || 'Admin', `Updated details`);
        toast.success('Updated successfully');
      } else {
        const docRef = await addDoc(collection(db, collectionName), {
          ...formData,
          isActive: true, // Default active
          createdAt: serverTimestamp()
        });
        await logActivity(docRef.id, formData.name, 'create', user?.id || 'admin', user?.name || 'Admin', `Created new ${activeTab === 'sports' ? 'item' : 'room'}`);
        toast.success('Added successfully');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
    } catch (error) {
      console.error(error);
      toast.error('Operation failed');
    }
  };

  const softDelete = async (id: string, currentStatus: boolean, name: string) => {
    const collectionName = activeTab === 'sports' ? 'sports_equipment' : 'rooms';
    try {
      await updateDoc(doc(db, collectionName, id), { isActive: !currentStatus });
      await logActivity(id, name, 'update', user?.id || 'admin', user?.name || 'Admin', `${currentStatus ? 'Deactivated' : 'Reactivated'} item`);
      toast.success(currentStatus ? 'Marked as Inactive' : 'Restored');
    } catch (e) {
      toast.error("Status update failed");
    }
  };

  const manualStockAdjust = async (item: SportsEquipment, adjustment: number) => {
    // Simpler adjustment
    const newQty = item.quantity + adjustment;
    if (newQty < 0) return;

    try {
      await updateDoc(doc(db, 'sports_equipment', item.id), { quantity: newQty });
      await logActivity(item.id, item.name, 'restock', user?.id || 'admin', user?.name || 'Admin', `Adjusted quantity by ${adjustment}`);
      toast.success("Stock updated");
    } catch (e) { toast.error("Stock update failed"); }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData(activeTab === 'sports' ? { name: '', quantity: 0 } : { name: '', type: 'Classroom', available: true });
    }
    setIsDialogOpen(true);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="px-4 py-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Resource Admin</h1>
            <p className="text-sm text-muted-foreground">Manage Inventory & Logs</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Tabs */}
        <div className="flex bg-muted/50 p-1 rounded-xl overflow-x-auto">
          {['sports', 'rooms', 'logs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all capitalize whitespace-nowrap ${activeTab === tab ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {tab === 'sports' ? 'Sports Equipment' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'sports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
              <h2 className="font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-orange-500" /> Inventory</h2>
              <Button size="sm" onClick={() => openModal()}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="grid gap-3">
              {equipment.map(item => (
                <div key={item.id} className={`flex flex-col p-4 bg-card border border-border rounded-xl shadow-sm ${!item.isActive ? 'opacity-60 grayscale' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      {!item.isActive && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">Inactive</span>}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModal(item)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => softDelete(item.id, item.isActive ?? true, item.name)}><Archive className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 bg-muted/30 p-2 rounded-lg">
                    <span className="text-sm font-medium">Qty: {item.quantity}</span>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => manualStockAdjust(item, -1)}>-</Button>
                      <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => manualStockAdjust(item, 1)}>+</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
              <h2 className="font-bold flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-500" /> Rooms</h2>
              <Button size="sm" onClick={() => openModal()}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="grid gap-3">
              {rooms.map(room => (
                <div key={room.id} className={`flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-sm ${!room.isActive ? 'opacity-60' : ''}`}>
                  <div>
                    <h3 className="font-bold">{room.name}</h3>
                    <p className="text-xs text-muted-foreground">{room.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      onClick={async () => {
                        await updateDoc(doc(db, 'rooms', room.id), { available: !room.available });
                        logActivity(room.id, room.name, 'update', user?.id || 'admin', user?.name || 'Admin', `Toggled availability to ${!room.available}`);
                      }}
                    >
                      {room.available ? 'Free' : 'Occupied'}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => openModal(room)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => softDelete(room.id, room.isActive ?? true, room.name)}><Archive className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <h2 className="font-bold flex items-center gap-2 px-1"><History className="w-5 h-5" /> Activity History</h2>
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="bg-card p-3 rounded-xl border border-border text-sm flex flex-col gap-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-primary">{log.performedByName}</span>
                    <span className="text-muted-foreground text-xs">
                      {log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-foreground">
                    <span className="capitalize font-bold text-xs bg-muted px-1.5 py-0.5 rounded mr-2">{log.action}</span>
                    {log.resourceName}
                  </p>
                  {log.details && <p className="text-xs text-muted-foreground italic">{log.details}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Add'} {activeTab === 'sports' ? 'Equipment' : 'Room'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            {activeTab === 'sports' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Total Quantity</label>
                <Input type="number" value={formData.quantity || 0} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} required />
              </div>
            )}

            {activeTab === 'rooms' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Input value={formData.type || ''} onChange={e => setFormData({ ...formData, type: e.target.value })} placeholder="Classroom, Lab..." required />
              </div>
            )}

            <Button type="submit" className="w-full">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceAdminPage;
