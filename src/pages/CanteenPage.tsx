import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Plus, Minus, ShoppingCart, CreditCard, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'Masala Dosa', description: 'Crispy dosa with potato filling', price: 50, category: 'South Indian', available: true },
  { id: '2', name: 'Paneer Butter Masala', description: 'Creamy paneer curry', price: 120, category: 'North Indian', available: true },
  { id: '3', name: 'Veg Biryani', description: 'Fragrant rice with vegetables', price: 100, category: 'Rice', available: true },
  { id: '4', name: 'Cold Coffee', description: 'Chilled coffee with ice cream', price: 60, category: 'Beverages', available: true },
  { id: '5', name: 'Samosa (2 pcs)', description: 'Crispy fried pastry', price: 30, category: 'Snacks', available: true },
  { id: '6', name: 'Chicken Fried Rice', description: 'Stir-fried rice with chicken', price: 130, category: 'Chinese', available: false },
  { id: '7', name: 'Fruit Salad', description: 'Fresh seasonal fruits', price: 70, category: 'Healthy', available: true },
  { id: '8', name: 'Chai', description: 'Indian masala tea', price: 15, category: 'Beverages', available: true },
];

const categories = ['All', 'South Indian', 'North Indian', 'Chinese', 'Snacks', 'Beverages', 'Healthy'];

const CanteenPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredItems = menuItems.filter(
    item => selectedCategory === 'All' || item.category === selectedCategory
  );

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCart(false);
      setCart([]);
      toast.success('Order placed successfully!', {
        description: 'Your order will be ready in 15-20 minutes',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-4 pt-4 pb-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-card transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Canteen</h1>
              <p className="text-sm text-muted-foreground">Order food & beverages</p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative p-2.5 rounded-xl bg-card hover:bg-card/80 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
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

      {/* Menu Items */}
      <div className="px-4 space-y-3">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`module-card ${!item.available ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl">
                🍽️
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  {!item.available && (
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-destructive/20 text-destructive rounded-full">
                      Sold Out
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-secondary">₹{item.price}</span>
                  {item.available && (
                    <Button
                      size="sm"
                      onClick={() => addToCart(item)}
                      className="h-8 px-3 bg-secondary hover:bg-secondary/90"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Sheet */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-4" />
                <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
              </div>
              
              {orderPlaced ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-4"
                  >
                    <Check className="w-10 h-10 text-success-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground">Order Placed!</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    Generating your payment slip...
                  </p>
                </div>
              ) : cart.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="p-4 space-y-3 max-h-[40vh] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 rounded-lg bg-card hover:bg-muted transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 rounded-lg bg-card hover:bg-muted transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-border safe-area-bottom">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="text-xl font-bold text-foreground">₹{totalAmount}</span>
                    </div>
                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full h-12 gradient-primary text-base font-semibold"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ₹{totalAmount}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      {totalItems > 0 && !showCart && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setShowCart(true)}
          className="fixed bottom-20 left-4 right-4 bg-secondary text-secondary-foreground rounded-xl p-4 flex items-center justify-between z-40"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">{totalItems} items</span>
          </div>
          <span className="font-bold">₹{totalAmount}</span>
        </motion.button>
      )}
    </div>
  );
};

export default CanteenPage;
