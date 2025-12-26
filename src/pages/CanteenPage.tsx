import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CanteenPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'South Ind', label: 'South Ind', icon: '🥘' },
    { id: 'North Ind', label: 'North Ind', icon: '🍛' },
    { id: 'Chinese', label: 'Chinese', icon: '🍜' },
    { id: 'Snacks', label: 'Snacks', icon: '🥪' },
    { id: 'Drinks', label: 'Drinks', icon: '🥤' },
  ];

  // Fetch Items
  React.useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'food_items'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoodItems(items);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = foodItems.filter(item => {
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = foodItems.find(i => i.id === id);
    return total + (item ? item.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id]--;
      else delete newCart[id];
      return newCart;
    });
  };

  const handleCheckout = () => {
    if (cartCount === 0) return;
    // Pass cart data to payment page
    navigate('/payment', { state: { cart, total: cartTotal } });
  };

  return (
    <div className="flex flex-col h-full fade-in pb-32">
      {/* Top App Bar */}
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
          {(user?.role === 'super_admin' || user?.role === 'food_admin') && (
            <button
              onClick={() => navigate('/admin/food')}
              className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              title="Edit Menu"
            >
              <span className="material-symbols-outlined">edit</span>
            </button>
          )}
          <button className="relative p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors text-primary">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-400 border border-white"></span>
          </button>
        </div>
      </header >

      {/* Main Content */}
      < main className="flex-1 px-1 pt-2" >
        {/* Search Bar */}
        < div className="px-4 mt-4 mb-2" >
          <div className="glass-card rounded-2xl flex items-center h-12 px-4 gap-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-secondary">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-primary placeholder-primary/50 text-base w-full p-0 font-medium"
              placeholder="Search for dosa, noodles..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div >

        {/* Categories Chips */}
        < div className="flex gap-3 px-4 py-4 overflow-x-auto no-scrollbar snap-x" >
          {
            categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`snap-start shrink-0 h-9 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold'
                  : 'glass-card text-primary hover:bg-white/70'
                  }`}
              >
                {cat.id === 'All' ? (
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                ) : (
                  <span>{cat.icon}</span>
                )}
                {cat.label}
              </button>
            ))
          }
        </div >

        {/* Food Grid */}
        < div className="px-4 pb-4" >
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className={`glass-card rounded-2xl p-3 flex flex-col gap-3 group hover:scale-[1.02] transition-transform duration-300 ${!item.available ? 'opacity-60 grayscale' : ''}`}>
                <div className="aspect-square rounded-xl overflow-hidden relative bg-gray-100">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${item.image || 'https://placehold.co/200?text=Food'}')` }}></div>
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-red-500 rounded-lg">SOLD OUT</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-primary font-bold text-base leading-tight mb-1 truncate">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary font-semibold text-sm">₹{item.price}</span>
                    {item.available && (
                      cart[item.id] ? (
                        <div className="flex items-center gap-2 h-8 bg-primary rounded-lg px-1 shadow-lg shadow-primary/20">
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-full flex items-center justify-center text-white active:scale-75 transition-transform">-</button>
                          <span className="text-white text-xs font-bold w-3 text-center">{cart[item.id]}</span>
                          <button onClick={() => addToCart(item.id)} className="w-6 h-full flex items-center justify-center text-white active:scale-75 transition-transform">+</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item.id)} className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                          <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {
            filteredItems.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">No items found.</p>
            )
          }
        </div >
      </main >

      {/* Floating Cart */}
      {
        cartCount > 0 && (
          <div className="fixed bottom-[90px] left-4 right-4 z-30 animate-in slide-in-from-bottom-4">
            <div onClick={handleCheckout} className="cursor-pointer glass-panel rounded-2xl p-2 flex items-center justify-between shadow-glass group hover:bg-white/70 transition-colors">
              <div className="flex items-center gap-3 pl-3">
                <div className="bg-secondary/20 p-2 rounded-lg text-secondary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-secondary font-semibold uppercase tracking-wide">{cartCount} items</span>
                  <span className="text-primary font-bold text-lg leading-none">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <button className="bg-primary hover:bg-[#2a5d96] text-white h-10 px-5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-primary/25 group-active:scale-95 transition-transform">
                Checkout
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default CanteenPage;
