```
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Dumbbell } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { borrowEquipment, logActivity } from '@/lib/resourceManager';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SportsEquipment {
    id: string;
    name: string;
    quantity: number;
    description?: string;
    status?: 'in_stock' | 'out_of_stock';
}

const SportsEquipmentView = ({ onBack }: { onBack: () => void }) => {
  const [equipment, setEquipment] = useState<SportsEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'sports_equipment'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as SportsEquipment[];
        setEquipment(items);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching equipment:", error);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBorrow = async (item: SportsEquipment) => {
      if (!user) {
          toast.error("You must be logged in to borrow.");
          return;
      }
      
      try {
          setProcessingId(item.id);
          await borrowEquipment(item.id, user.id, user.name);
          // Log explicitly here since transaction worked
          await logActivity(item.id, item.name, 'borrow', user.id, user.name, 'Student borrowed 1 unit');
          toast.success(`You borrowed a ${ item.name } `);
      } catch (error: any) {
          toast.error(error.message || "Failed to borrow item");
      } finally {
          setProcessingId(null);
      }
  };

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl">
           <span className="sr-only">Back</span>
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-bold">Sports Equipment</h1>
      </header>

      <div className="p-4 space-y-6 pb-24">
        {loading ? (
             <div className="text-center py-10 text-muted-foreground">Loading inventory...</div>
        ) : equipment.length === 0 ? (
             <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed">
                 <Trophy className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                 <p className="text-muted-foreground">No equipment available.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {equipment.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w - 12 h - 12 rounded - xl flex items - center justify - center ${ item.quantity > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground' } `}>
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none mb-1">{item.name}</h3>
                                <p className="text-xs text-muted-foreground">Available to borrow</p>
                            </div>
                        </div>
                        
                        <div className="text-right flex flex-col items-end gap-2">
                             {item.quantity > 0 ? (
                                 <>
                                     <div className="flex items-center gap-2">
                                         <span className="text-2xl font-bold tabular-nums">{item.quantity}</span>
                                         <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-[10px] px-2 py-0">In Stock</Badge>
                                     </div>
                                     <Button 
                                        size="sm" 
                                        onClick={() => handleBorrow(item)} 
                                        disabled={processingId === item.id}
                                     >
                                        {processingId === item.id ? 'Processing...' : 'Borrow'}
                                     </Button>
                                 </>
                             ) : (
                                 <Badge variant="destructive" className="opacity-90">Out of Stock</Badge>
                             )}
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
export default SportsEquipmentView;
```
