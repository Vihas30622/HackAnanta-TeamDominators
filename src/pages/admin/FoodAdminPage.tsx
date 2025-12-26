import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Pencil, Trash2, X, Check,
  UtensilsCrossed, Search, Filter, ToggleLeft, ToggleRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

const initialMenuItems: MenuItem[] = [
  // ... initial items
];

const categories = ['South Ind', 'North Ind', 'Chinese', 'Snacks', 'Drinks'];

const FoodAdminPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'Snacks',
    image: '',
    available: true,
  });

  // ... useEffect for fetching items ...

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image || '',
        available: item.available,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Snacks',
        image: '',
        available: true,
      });
    }
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 100KB for Firestore)
      if (file.size > 100 * 1024) {
        toast.error("Image too large. Please use an image under 100KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || formData.price <= 0) {
      toast.error('Please fill all fields correctly');
      return;
    }

    if (!db) {
      toast.error("Database connection failed");
      return;
    }

    try {
      if (editingItem) {
        const itemRef = doc(db, 'food_items', editingItem.id);
        await updateDoc(itemRef, { ...formData });
        toast.success('Menu item updated!');
      } else {
        await addDoc(collection(db, 'food_items'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
        toast.success('Menu item added!');
      }
      handleCloseForm();
    } catch (error: any) {
      console.error("Error saving item:", error);
      toast.error("Failed to save: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, 'food_items', id));
        toast.success('Menu item deleted');
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  const handleToggleAvailability = async (id: string) => {
    if (!db) return;
    const item = menuItems.find(i => i.id === id);
    if (item) {
      try {
        await updateDoc(doc(db, 'food_items', id), { available: !item.available });
      } catch (error) {
        console.error("Error updating availability:", error);
        toast.error("Failed to update status");
      }
    }
  };

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
              <h1 className="text-xl font-bold text-foreground">Food Admin</h1>
              <p className="text-sm text-muted-foreground">Manage canteen menu</p>
            </div>
          </div>
          <Button onClick={() => handleOpenForm()} size="sm" className="gradient-primary">
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>
      </header>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full bg-card rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 glass-card p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{menuItems.length}</p>
            <p className="text-xs text-muted-foreground">Total Items</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <p className="text-2xl font-bold text-success">{menuItems.filter(i => i.available).length}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div className="flex-1 glass-card p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{menuItems.filter(i => !i.available).length}</p>
            <p className="text-xs text-muted-foreground">Unavailable</p>
          </div>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="px-4 space-y-3">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`module-card ${!item.available ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-xl bg-muted h-16 w-16 shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-full bg-success/20 flex items-center justify-center rounded-lg">
                    <UtensilsCrossed className="w-6 h-6 text-success" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${item.available ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                    {item.available ? 'Available' : 'Sold Out'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-secondary">₹{item.price}</span>
                  <span className="text-xs text-muted-foreground">• {item.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleAvailability(item.id)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  title={item.available ? 'Mark as sold out' : 'Mark as available'}
                >
                  {item.available ? (
                    <ToggleRight className="w-5 h-5 text-success" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => handleOpenForm(item)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No menu items found</p>
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
                    {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                  </h2>
                  <button onClick={handleCloseForm} className="p-2 rounded-lg hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Item Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Masala Dosa"
                    className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Item Image</label>
                  <div className="flex items-start gap-4">
                    <div className={`w-20 h-20 rounded-xl bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden relative ${!formData.image ? 'p-4' : ''}`}>
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-muted-foreground">image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                      />
                      <p className="text-[10px] text-muted-foreground mt-2">Max size: 100KB (auto-converted to Base64)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the item"
                    className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50 min-h-[80px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 ring-secondary/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-muted rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 ring-secondary/50"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-muted rounded-xl p-4">
                  <span className="text-sm font-medium text-foreground">Available for Order</span>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, available: !prev.available }))}
                    className={`w-12 h-6 rounded-full transition-colors ${formData.available ? 'bg-success' : 'bg-muted-foreground/30'
                      }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-foreground transition-transform ${formData.available ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-border safe-area-bottom">
                <Button onClick={handleSave} className="w-full h-12 gradient-primary text-base font-semibold">
                  <Check className="w-5 h-5 mr-2" />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodAdminPage;
